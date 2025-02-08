const express = require('express');
const path = require('path');
const compression = require('compression');
const Redis = require('ioredis');
const { Worker } = require('worker_threads');
const WebSocket = require('ws');
const os = require('os');

// Configuração do Redis
const redis = new Redis({
    host: process.env.NODE_ENV === 'production' ? 'redis' : 'localhost',
    port: 6379
});

// Configuração do Express
const app = express();
const port = 3002;

// Middleware de compressão
app.use(compression());

// Servir arquivos estáticos com cache
app.use(express.static(path.join(__dirname), {
    maxAge: '1y',
    etag: true
}));

// Pool de Workers
const numCPUs = os.cpus().length;
const workers = new Map();

for (let i = 0; i < numCPUs; i++) {
    const worker = new Worker('./worker.js');
    workers.set(worker.threadId, worker);

    worker.on('message', (result) => {
        // Processar resultado do worker
        if (result.type === 'marketData') {
            broadcastMarketData(result.data);
        }
    });

    worker.on('error', (error) => {
        console.error(`Worker ${worker.threadId} error:`, error);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker ${worker.threadId} stopped with exit code ${code}`);
            workers.delete(worker.threadId);
            
            // Recriar worker
            const newWorker = new Worker('./worker.js');
            workers.set(newWorker.threadId, newWorker);
        }
    });
}

// Configuração do WebSocket
const wss = new WebSocket.Server({ port: 3003 });

wss.on('connection', (ws) => {
    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            
            // Verificar cache do Redis
            const cachedData = await redis.get(`market:${data.symbol}`);
            if (cachedData) {
                ws.send(cachedData);
                return;
            }

            // Distribuir trabalho entre os workers
            const worker = getNextWorker();
            worker.postMessage(data);
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });
});

// Heartbeat para verificar conexões ativas
const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping(() => {});
    });
}, 30000);

wss.on('close', () => {
    clearInterval(interval);
});

// Broadcast de dados para todos os clientes
function broadcastMarketData(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Round-robin para distribuição de trabalho
let currentWorkerIndex = 0;
function getNextWorker() {
    const workerIds = Array.from(workers.keys());
    const worker = workers.get(workerIds[currentWorkerIndex]);
    currentWorkerIndex = (currentWorkerIndex + 1) % workerIds.length;
    return worker;
}

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/radar', (req, res) => {
    res.sendFile(path.join(__dirname, 'radar.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
    console.log('Pressione Ctrl+C para parar o servidor');
}); 
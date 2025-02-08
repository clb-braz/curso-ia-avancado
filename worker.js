const { parentPort } = require('worker_threads');
const Redis = require('ioredis');

// Conexão com Redis
const redis = new Redis({
    host: process.env.NODE_ENV === 'production' ? 'redis' : 'localhost',
    port: 6379
});

// Receber mensagens do thread principal
parentPort.on('message', async (data) => {
    try {
        // Processar dados do mercado
        const processedData = await processMarketData(data);
        
        // Armazenar no Redis com TTL de 1 minuto
        await redis.setex(`market:${data.symbol}`, 60, JSON.stringify(processedData));
        
        // Enviar resultado de volta
        parentPort.postMessage({
            type: 'marketData',
            data: processedData
        });
    } catch (error) {
        console.error('Worker error:', error);
        parentPort.postMessage({
            type: 'error',
            error: error.message
        });
    }
});

// Função para processar dados do mercado
async function processMarketData(data) {
    // Simular processamento pesado
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
        symbol: data.symbol,
        price: calculatePrice(data),
        volume: calculateVolume(data),
        indicators: calculateIndicators(data),
        timestamp: Date.now()
    };
}

// Funções auxiliares de cálculo
function calculatePrice(data) {
    // Implementar cálculos de preço
    return {
        current: data.price || 0,
        change24h: data.change24h || 0,
        high24h: data.high24h || 0,
        low24h: data.low24h || 0
    };
}

function calculateVolume(data) {
    // Implementar cálculos de volume
    return {
        amount24h: data.volume24h || 0,
        change24h: data.volumeChange24h || 0
    };
}

function calculateIndicators(data) {
    // Implementar cálculos de indicadores técnicos
    return {
        rsi: calculateRSI(data),
        macd: calculateMACD(data),
        bollinger: calculateBollinger(data)
    };
}

function calculateRSI(data, period = 14) {
    // Implementar cálculo do RSI
    return 50; // Valor exemplo
}

function calculateMACD(data) {
    // Implementar cálculo do MACD
    return {
        line: 0,
        signal: 0,
        histogram: 0
    };
}

function calculateBollinger(data, period = 20) {
    // Implementar cálculo das Bandas de Bollinger
    return {
        upper: 0,
        middle: 0,
        lower: 0
    };
} 
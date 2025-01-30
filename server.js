const http = require('http');
const fs = require('fs');
const path = require('path');

// Cache para arquivos estáticos
const fileCache = new Map();

const server = http.createServer((req, res) => {
    // Normaliza o caminho da URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Define os tipos MIME
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf'
    };

    // Pega a extensão do arquivo
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Verifica se o arquivo está em cache
    if (fileCache.has(filePath)) {
        res.writeHead(200, { 
            'Content-Type': contentType,
            'X-Cache': 'HIT'
        });
        res.end(fileCache.get(filePath));
        return;
    }

    // Lê o arquivo
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Página não encontrada
                fs.readFile('./404.html', function(error, content) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                // Erro do servidor
                res.writeHead(500);
                res.end('Erro do servidor: ' + error.code);
            }
        } else {
            // Armazena em cache se for um arquivo estático
            if (extname !== '.html') {
                fileCache.set(filePath, content);
            }
            
            res.writeHead(200, { 
                'Content-Type': contentType,
                'X-Cache': 'MISS'
            });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, 'localhost', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
    console.log('Pressione Ctrl+C para parar o servidor');
}); 
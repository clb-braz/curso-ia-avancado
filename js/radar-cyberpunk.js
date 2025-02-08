// Configuração do WebSocket
const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

// Cache para armazenar dados dos tokens
const tokenCache = {
    ai: new Map(),
    rwa: new Map(),
    defi: new Map(),
    gems: new Map()
};

// Mapeamento de tokens por categoria
const tokenCategories = {
    ai: ['AGIX', 'FET', 'OCEAN', 'NMR', 'RNDR'].map(symbol => `${symbol}USDT`),
    rwa: ['GOLD', 'SLVR', 'REAL', 'EURE', 'GBPT'].map(symbol => `${symbol}USDT`),
    defi: ['UNI', 'AAVE', 'MKR', 'COMP', 'SNX'].map(symbol => `${symbol}USDT`),
    gems: ['INJ', 'MATIC', 'LINK', 'DOT', 'AVAX'].map(symbol => `${symbol}USDT`)
};

// Função para formatar números
const formatNumber = (num, decimals = 2) => {
    if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
    return num.toFixed(decimals);
};

// Função para atualizar um card de setor
const updateSectorCard = (sector, data) => {
    const cardElement = document.getElementById(`${sector}Card`);
    if (!cardElement) return;

    const tokenListElement = cardElement.querySelector('.token-list');
    if (!tokenListElement) return;

    // Remover estado de loading
    tokenListElement.classList.remove('loading');

    // Ordenar tokens por variação de preço
    const sortedTokens = Array.from(data.values())
        .sort((a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent));

    // Gerar HTML para cada token
    const tokenHTML = sortedTokens.map(token => `
        <div class="token-item">
            <img src="assets/crypto-icons/${token.symbol.replace('USDT', '').toLowerCase()}.png" 
                 alt="${token.symbol}" 
                 class="token-icon"
                 onerror="this.src='assets/crypto-icons/generic.png'"
                 style="width: 24px; height: 24px;">
            <div class="token-info">
                <span class="token-name">${token.symbol.replace('USDT', '')}</span>
                <span class="token-price">$${formatNumber(parseFloat(token.lastPrice))}</span>
            </div>
            <span class="token-change ${parseFloat(token.priceChangePercent) >= 0 ? 'positive' : 'negative'}">
                ${token.priceChangePercent >= 0 ? '▲' : '▼'} ${Math.abs(token.priceChangePercent).toFixed(2)}%
            </span>
        </div>
    `).join('');

    tokenListElement.innerHTML = tokenHTML;
};

// Função para processar dados do WebSocket
const processWebSocketData = (data) => {
    data.forEach(ticker => {
        const symbol = ticker.s;
        
        // Verificar em qual categoria o token se encaixa
        Object.entries(tokenCategories).forEach(([category, tokens]) => {
            if (tokens.includes(symbol)) {
                tokenCache[category].set(symbol, {
                    symbol,
                    lastPrice: ticker.c,
                    priceChangePercent: parseFloat(ticker.P),
                    volume: ticker.v,
                    quoteVolume: ticker.q
                });

                // Atualizar o card da categoria
                updateSectorCard(category, tokenCache[category]);
            }
        });
    });
};

// Terminal de Comandos
class HackerTerminal {
    constructor() {
        this.commandHistory = [];
        this.currentCommand = '';
        this.terminalInput = document.querySelector('.command-input input');
        this.commandHistoryDiv = document.querySelector('.command-history');
        
        if (this.terminalInput) {
            this.terminalInput.removeAttribute('disabled');
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.terminalInput.addEventListener('keydown', (e) => this.handleCommand(e));
        
        // Foco automático no terminal quando clicar na janela
        document.querySelector('.terminal-window')?.addEventListener('click', () => {
            this.terminalInput.focus();
        });
    }

    handleCommand(e) {
        if (e.key === 'Enter') {
            const command = this.terminalInput.value.trim();
            if (command) {
                this.processCommand(command);
                this.terminalInput.value = '';
            }
        }
    }

    processCommand(cmd) {
        let response = '';
        
        switch(cmd.toLowerCase()) {
            case '/help':
                response = `Comandos disponíveis:
/btc - Métricas Bitcoin
/ai - Tokens IA
/rwa - Real World Assets
/whales - Whale Tracking
/hype - Viral Tokens
/clear - Limpar terminal`;
                break;
            case '/btc':
            case '/ai':
            case '/rwa':
            case '/whales':
            case '/hype':
                response = `🔒 Acesso negado: Faça upgrade para VIP
Análises avançadas disponíveis apenas para assinantes.`;
                break;
            case '/clear':
                this.commandHistoryDiv.innerHTML = '';
                return;
            default:
                response = `Comando não reconhecido. Digite /help para ver a lista de comandos.`;
        }

        this.addToHistory(cmd, response);
    }

    addToHistory(command, response) {
        const cmdElement = document.createElement('p');
        cmdElement.className = 'command';
        cmdElement.textContent = `> ${command}`;

        const respElement = document.createElement('p');
        respElement.className = 'response';
        respElement.textContent = response;

        this.commandHistoryDiv.appendChild(cmdElement);
        this.commandHistoryDiv.appendChild(respElement);
        this.commandHistoryDiv.scrollTop = this.commandHistoryDiv.scrollHeight;
    }
}

// Botão de Upgrade
class UpgradeButton {
    constructor() {
        this.button = document.querySelector('.upgrade-button');
        if (this.button) {
            this.button.addEventListener('click', () => this.handleUpgrade());
        }
    }

    handleUpgrade() {
        alert('🚀 Em breve: Portal de Assinatura Premium!\n\nAcesso a:\n✅ Análises em Tempo Real\n✅ Sinais Exclusivos\n✅ Terminal Hacker\n✅ Alertas Personalizados');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Terminal
    const terminal = new HackerTerminal();
    
    // Inicializar Botão de Upgrade
    const upgrade = new UpgradeButton();
    
    // Inicializar cards com estado de loading
    Object.keys(tokenCategories).forEach(sector => {
        const cardElement = document.getElementById(`${sector}Card`);
        if (cardElement) {
            const tokenListElement = cardElement.querySelector('.token-list');
            if (tokenListElement) {
                tokenListElement.classList.add('loading');
            }
        }
    });

    // Conectar WebSocket
    ws.onopen = () => {
        console.log('WebSocket conectado');
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            processWebSocketData(data);
        } catch (error) {
            console.error('Erro ao processar dados:', error);
        }
    };

    ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket desconectado');
        // Tentar reconectar após 5 segundos
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    };

    // Simulação de loading dos dados
    setTimeout(() => {
        document.querySelectorAll('.loading').forEach(element => {
            element.classList.remove('loading');
        });
    }, 2000);
});

// Efeitos de hover nos cards
document.querySelectorAll('.opportunity-card, .signal-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 5px 15px rgba(153, 51, 255, 0.3)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    });
});

// Animação de digitação para textos
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efeito de digitação nos textos relevantes
document.querySelectorAll('.hacker-text:not(.glitch)').forEach((element, index) => {
    setTimeout(() => {
        typeWriter(element, element.textContent);
    }, index * 1000);
}); 
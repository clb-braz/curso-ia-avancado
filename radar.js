// Configuração do TradingView Widget
function initTradingViewWidget() {
    new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": "BINANCE:BTCUSDT",
        "interval": "D",
        "timezone": "America/Sao_Paulo",
        "theme": "dark",
        "style": "1",
        "locale": "br",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": "tradingview-widget-container"
    });
}

// Fear & Greed Index
function initFearGreedGauge() {
    const ctx = document.getElementById('fearGreedGauge').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop(0, "#FF0000");
    gradient.addColorStop(0.5, "#FFFF00");
    gradient.addColorStop(1, "#00FF00");

    new Chart(ctx, {
        type: 'gauge',
        data: {
            datasets: [{
                value: 50,
                data: [20, 40, 60, 80, 100],
                backgroundColor: gradient,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Fear & Greed Index'
            },
            layout: {
                padding: 20
            }
        }
    });
}

// Simulação de dados de mercado
function updateMarketData() {
    const gainers = document.querySelector('.gainers');
    const losers = document.querySelector('.losers');

    // Dados simulados de mercado
    const topGainers = [
        { symbol: 'BTC', price: '43,250.00', change: '+5.2%' },
        { symbol: 'ETH', price: '2,890.00', change: '+4.8%' },
        { symbol: 'SOL', price: '98.50', change: '+12.3%' }
    ];

    const topLosers = [
        { symbol: 'DOGE', price: '0.082', change: '-3.5%' },
        { symbol: 'ADA', price: '0.45', change: '-2.8%' },
        { symbol: 'XRP', price: '0.58', change: '-1.9%' }
    ];

    gainers.innerHTML = topGainers.map(token => `
        <div class="token-info">
            <span class="token-symbol">${token.symbol}</span>
            <span class="token-price">$${token.price}</span>
            <span class="token-change positive">${token.change}</span>
        </div>
    `).join('');

    losers.innerHTML = topLosers.map(token => `
        <div class="token-info">
            <span class="token-symbol">${token.symbol}</span>
            <span class="token-price">$${token.price}</span>
            <span class="token-change negative">${token.change}</span>
        </div>
    `).join('');
}

// Simulação de notícias
function updateNews() {
    const newsTicker = document.querySelector('.news-ticker');
    const news = [
        'Bitcoin ultrapassa $43.000 com otimismo do mercado',
        'SEC aprova novos ETFs de criptomoedas',
        'Ethereum completa atualização importante na rede',
        'Nova parceria entre exchange e banco tradicional',
        'DeFi atinge novo recorde de valor total bloqueado'
    ];

    newsTicker.innerHTML = news.map(item => `
        <div class="news-item">
            <i class="fas fa-newspaper"></i>
            <span>${item}</span>
        </div>
    `).join('');
}

// Simulação de sinais de trading
function updateTradingSignals() {
    const signalsContainer = document.querySelector('.signals-container');
    const signals = [
        { pair: 'BTC/USD', signal: 'COMPRA', target: '45,000', stop: '41,500' },
        { pair: 'ETH/USD', signal: 'COMPRA', target: '3,000', stop: '2,800' },
        { pair: 'SOL/USD', signal: 'VENDA', target: '95', stop: '102' }
    ];

    signalsContainer.innerHTML = signals.map(signal => `
        <div class="signal-item ${signal.signal.toLowerCase()}">
            <div class="signal-header">
                <span class="pair">${signal.pair}</span>
                <span class="signal-type">${signal.signal}</span>
            </div>
            <div class="signal-details">
                <div>Alvo: $${signal.target}</div>
                <div>Stop: $${signal.stop}</div>
            </div>
        </div>
    `).join('');
}

// Simulação de pools de staking
function updateStakingPools() {
    const poolsContainer = document.querySelector('.pools-container');
    const pools = [
        { token: 'ETH', apy: '5.8%', min: '0.1 ETH' },
        { token: 'SOL', apy: '7.2%', min: '10 SOL' },
        { token: 'DOT', apy: '12%', min: '100 DOT' }
    ];

    poolsContainer.innerHTML = pools.map(pool => `
        <div class="pool-item">
            <div class="pool-header">
                <span class="pool-token">${pool.token}</span>
                <span class="pool-apy">${pool.apy} APY</span>
            </div>
            <div class="pool-details">
                <div>Mínimo: ${pool.min}</div>
                <button class="stake-button">Fazer Stake</button>
            </div>
        </div>
    `).join('');
}

// Simulação de airdrops
function updateAirdrops() {
    const airdropsContainer = document.querySelector('.airdrops-container');
    const airdrops = [
        { project: 'NewDeFi', value: '$500', deadline: '7 dias' },
        { project: 'MetaGame', value: '$200', deadline: '3 dias' },
        { project: 'AI Token', value: '$1000', deadline: '14 dias' }
    ];

    airdropsContainer.innerHTML = airdrops.map(airdrop => `
        <div class="airdrop-item">
            <div class="airdrop-header">
                <span class="project-name">${airdrop.project}</span>
                <span class="airdrop-value">${airdrop.value}</span>
            </div>
            <div class="airdrop-details">
                <div>Prazo: ${airdrop.deadline}</div>
                <button class="participate-button">Participar</button>
            </div>
        </div>
    `).join('');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar widgets e gráficos
    initTradingViewWidget();
    initFearGreedGauge();

    // Atualizar dados iniciais
    updateMarketData();
    updateNews();
    updateTradingSignals();
    updateStakingPools();
    updateAirdrops();

    // Atualizar dados periodicamente
    setInterval(updateMarketData, 30000); // 30 segundos
    setInterval(updateNews, 60000); // 1 minuto
    setInterval(updateTradingSignals, 300000); // 5 minutos

    // Event Listeners para interatividade
    document.querySelectorAll('.stake-button').forEach(button => {
        button.addEventListener('click', () => {
            alert('Funcionalidade em desenvolvimento. Em breve!');
        });
    });

    document.querySelectorAll('.participate-button').forEach(button => {
        button.addEventListener('click', () => {
            alert('Funcionalidade em desenvolvimento. Em breve!');
        });
    });

    // VIP Button
    document.querySelector('.vip-button').addEventListener('click', () => {
        alert('Área VIP em desenvolvimento. Em breve você poderá assinar!');
    });
}); 
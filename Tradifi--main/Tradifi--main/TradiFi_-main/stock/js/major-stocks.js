// Major Stocks tracker functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const majorStocksContainer = document.getElementById('majorStocks');
    const refreshBtn = document.getElementById('refreshStocks');
    const lastUpdatedEl = document.getElementById('lastUpdated');
    
    // Major stocks to track
    const majorStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corporation' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
        { symbol: 'TSLA', name: 'Tesla, Inc.' },
        { symbol: 'META', name: 'Meta Platforms, Inc.' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
        { symbol: 'V', name: 'Visa Inc.' },
        { symbol: 'JNJ', name: 'Johnson & Johnson' }
    ];
    
    // Initialize the major stocks section
    loadMajorStocks();
    
    // Refresh button click event
    refreshBtn.addEventListener('click', function() {
        this.classList.add('spinning');
        loadMajorStocks().then(() => {
            setTimeout(() => {
                this.classList.remove('spinning');
            }, 500);
        });
    });
    
    // Load major stocks data
    async function loadMajorStocks() {
        try {
            // For a real application, you would fetch actual data from a stock API
            // For demo purposes, we'll simulate API data
            const stocksData = await getMockStocksData();
            renderStocksCards(stocksData);
            updateLastUpdated();
        } catch (error) {
            console.error('Error loading major stocks:', error);
        }
    }
    
    // Render stock cards
    function renderStocksCards(stocks) {
        majorStocksContainer.innerHTML = '';
        
        stocks.forEach(stock => {
            const isPositive = stock.change >= 0;
            const cardClass = isPositive ? 'up' : 'down';
            const changeClass = isPositive ? 'positive' : 'negative';
            const changeIcon = isPositive ? '▲' : '▼';
            
            const stockCard = document.createElement('div');
            stockCard.className = `stock-card ${cardClass}`;
            stockCard.innerHTML = `
                <div class="stock-symbol">
                    <span class="symbol-name">${stock.symbol}</span>
                    <span class="ticker-badge">NASDAQ</span>
                </div>
                <div class="company-name">${stock.name}</div>
                <div class="stock-price">$${stock.price.toFixed(2)}</div>
                <div class="stock-change">
                    <span class="change-value ${changeClass}">
                        ${changeIcon} ${Math.abs(stock.change).toFixed(2)} (${Math.abs(stock.changePercent).toFixed(2)}%)
                    </span>
                </div>
                <canvas class="stock-sparkline" data-prices="${stock.historicalPrices.join(',')}"></canvas>
                <a href="stock-view.html?symbol=${stock.symbol}" class="view-stock">
                    View Details <i class="fas fa-arrow-right"></i>
                </a>
            `;
            
            majorStocksContainer.appendChild(stockCard);
            
            // Draw sparkline chart
            setTimeout(() => {
                drawSparkline(stockCard.querySelector('.stock-sparkline'), stock.historicalPrices, isPositive);
            }, 100);
        });
    }
    
    // Draw sparkline mini candlestick chart
    function drawSparkline(canvas, prices, isPositive) {
        const ctx = canvas.getContext('2d');
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        
        canvas.width = width;
        canvas.height = height;
        
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const range = maxPrice - minPrice;
        const candleWidth = width / prices.length * 0.8;
        
        // Draw volume background
        prices.forEach((price, i) => {
            const x = i * (width / prices.length);
            const volumeHeight = height * 0.2;
            
            ctx.fillStyle = price >= prices[i-1] ? 
                'rgba(76, 217, 123, 0.1)' : 
                'rgba(255, 99, 132, 0.1)';
            
            ctx.fillRect(
                x,
                height - volumeHeight,
                candleWidth,
                volumeHeight
            );
        });
        
        // Draw candlesticks
        prices.forEach((price, i) => {
            const x = i * (width / prices.length);
            
            const open = i > 0 ? prices[i-1] : price;
            const close = price;
            const high = Math.max(open, close) * (1 + Math.random() * 0.005);
            const low = Math.min(open, close) * (1 - Math.random() * 0.005);
            
            const normHigh = 1 - ((high - minPrice) / range);
            const normLow = 1 - ((low - minPrice) / range);
            const normOpen = 1 - ((open - minPrice) / range);
            const normClose = 1 - ((close - minPrice) / range);
            
            // Determine if this candle is profit or loss
            const isProfit = close >= open;
            
            // Draw candle
            ctx.beginPath();
            ctx.strokeStyle = isProfit ? 'rgba(76, 217, 123, 1)' : 'rgba(255, 99, 132, 1)';
            ctx.fillStyle = isProfit ? 'rgba(76, 217, 123, 0.3)' : 'rgba(255, 99, 132, 0.3)';
            
            // Draw wick
            ctx.moveTo(x + candleWidth/2, normHigh * height * 0.8);
            ctx.lineTo(x + candleWidth/2, normLow * height * 0.8);
            ctx.stroke();
            
            // Draw body
            ctx.fillRect(
                x,
                Math.min(normOpen, normClose) * height * 0.8,
                candleWidth,
                Math.abs(normClose - normOpen) * height * 0.8
            );
        });
    }
    
    // Update last updated time
    function updateLastUpdated() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastUpdatedEl.textContent = `Last updated: ${timeStr}`;
    }
    
    // Mock API data for demonstration
    async function getMockStocksData() {
        return majorStocks.map(stock => {
            const basePrice = getBasePrice(stock.symbol);
            const changePercent = (Math.random() * 6) - 3; // -3% to +3%
            const change = basePrice * (changePercent / 100);
            const price = basePrice + change;
            
            // Generate historical prices for sparkline
            const historicalPrices = [];
            let tempPrice = price;
            for (let i = 0; i < 20; i++) {
                const variance = tempPrice * (Math.random() * 0.02 - 0.01); // Small random changes
                tempPrice = tempPrice - variance; // Going backward in time
                historicalPrices.unshift(tempPrice);
            }
            
            return {
                ...stock,
                price,
                change,
                changePercent,
                volume: Math.floor(Math.random() * 50000000),
                historicalPrices
            };
        });
    }
    
    // Get base price for mock data
    function getBasePrice(symbol) {
        const basePrices = {
            'AAPL': 177.15,
            'MSFT': 409.73,
            'GOOGL': 165.27,
            'AMZN': 183.48,
            'TSLA': 248.42,
            'META': 520.29,
            'NVDA': 820.75,
            'JPM': 198.45,
            'V': 275.82,
            'JNJ': 147.25
        };
        
        return basePrices[symbol] || 100 + Math.random() * 100;
    }
    
    // Set up auto-refresh every 60 seconds
    setInterval(() => {
        loadMajorStocks();
    }, 60000);
});

// Function to format currency
function formatCurrency(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(number);
}

// Function to create a stock box
function createStockBox(stock) {
    const isPositive = stock.change >= 0;
    const box = document.createElement('div');
    box.className = `stock-box ${isPositive ? 'up' : 'down'}`;
    
    box.innerHTML = `
        <div class="stock-header">
            <span class="stock-symbol">${stock.symbol}</span>
            <span class="stock-exchange">${stock.exchange}</span>
        </div>
        <div class="stock-company">${stock.name}</div>
        <div class="stock-price">$${formatNumber(stock.price)}</div>
        <div class="stock-change ${isPositive ? 'up' : 'down'}">
            <i class="fas fa-caret-${isPositive ? 'up' : 'down'}"></i>
            ${formatChange(stock.change, stock.changePercent)}
        </div>
        <canvas class="stock-chart"></canvas>
        <a href="#" class="view-details">
            View Details <i class="fas fa-arrow-right"></i>
        </a>
    `;
    
    // Initialize chart
    const canvas = box.querySelector('.stock-chart');
    createStockChart(canvas, stock);
    
    return box;
}

// Function to format number with commas
function formatNumber(number) {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to format change and percent
function formatChange(change, percent) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
}

// Function to update the stocks display
function updateStocks() {
    const container = document.getElementById('majorStocks');
    if (!container) return;
    
    container.innerHTML = '';
    stocks.forEach(stock => {
        container.appendChild(createStockBox(stock));
    });
}

// Function to simulate real-time updates
function simulateStockUpdates() {
    // Update stock prices
    stocks.forEach(stock => {
        const change = (Math.random() - 0.5) * 0.02;
        stock.price *= (1 + change);
        stock.change = stock.price * change;
        stock.changePercent = change * 100;
    });
    
    // Update UI
    updateStocks();
    
    // Update last updated time
    const now = new Date();
    document.getElementById('lastUpdated').textContent = 
        `Last updated: ${now.toLocaleTimeString()}`;
}

// Initialize the stocks section
document.addEventListener('DOMContentLoaded', () => {
    // Initial update
    updateStocks();
    
    // Add refresh button functionality
    const refreshBtn = document.getElementById('refreshStocks');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.classList.add('rotating');
            simulateStockUpdates();
            setTimeout(() => {
                refreshBtn.classList.remove('rotating');
            }, 1000);
        });
    }
    
    // Auto-refresh every minute
    setInterval(simulateStockUpdates, 60000);
}); 
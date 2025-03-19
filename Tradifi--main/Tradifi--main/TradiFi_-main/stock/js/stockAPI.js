// Stock API integration
const API_KEY = 'demo'; // Replace with your actual API key

// Fetch stock data
async function fetchStockData(symbol) {
    try {
        // In a real application, you would use a proper stock API
        // For demo purposes, we'll simulate API data
        return getMockStockData(symbol);
        
        /* 
        // Real API call example using Alpha Vantage
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();
        
        if (data['Global Quote']) {
            const quote = data['Global Quote'];
            return {
                symbol: quote['01. symbol'],
                price: parseFloat(quote['05. price']),
                change: parseFloat(quote['09. change']),
                changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
                //
    }
} 

// Fetch stock details
async function fetchStockDetails(symbol) {
    try {
        // In a real application, you would fetch from a real API
        // For demo purposes, we'll use mock data
        return getMockStockDetails(symbol);
    } catch (error) {
        console.error('Error fetching stock details:', error);
        throw error;
    }
}

// Fetch historical data for charts
async function fetchHistoricalData(symbol, timeframe) {
    try {
        // For demo purposes, we'll use mock data
        return getMockHistoricalData(symbol, timeframe);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }
}

// Generate mock stock details
function getMockStockDetails(symbol) {
    // Base data for common stocks
    const stocksData = {
        'AAPL': {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            exchange: 'NASDAQ',
            price: 177.15,
            change: 0.58,
            changePercent: 0.33,
            open: 176.57,
            previousClose: 176.21,
            high: 178.09,
            low: 175.82,
            volume: 52387102,
            avgVolume: 55682400,
            marketCap: 2875000000000,
            pe: 29.15,
            eps: 6.08,
            beta: 1.21,
            dividendYield: 0.57,
            targetPrice: 191.23,
            yearHigh: 189.62,
            yearLow: 142.75,
            description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, iPad, Mac, and wearables including Apple Watch and AirPods.',
            sector: 'Technology',
            industry: 'Consumer Electronics',
            employees: 154000,
            country: 'United States',
            website: 'https://www.apple.com'
        },
        'MSFT': {
            symbol: 'MSFT',
            name: 'Microsoft Corporation',
            exchange: 'NASDAQ',
            price: 409.73,
            change: -2.57,
            changePercent: -0.62,
            open: 412.30,
            previousClose: 412.64,
            high: 413.05,
            low: 408.43,
            volume: 18923510,
            avgVolume: 21540300,
            marketCap: 3050000000000,
            pe: 35.21,
            eps: 11.63,
            beta: 0.98,
            dividendYield: 0.72,
            targetPrice: 435.10,
            yearHigh: 422.95,
            yearLow: 309.11,
            description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company offers cloud-based services including Azure, Office 365, and Windows.',
            sector: 'Technology',
            industry: 'Software—Infrastructure',
            employees: 221000,
            country: 'United States',
            website: 'https://www.microsoft.com'
        },
        'GOOGL': {
            symbol: 'GOOGL',
            name: 'Alphabet Inc.',
            exchange: 'NASDAQ',
            price: 165.27,
            change: 1.23,
            changePercent: 0.75,
            open: 164.04,
            previousClose: 164.14,
            high: 166.09,
            low: 163.84,
            volume: 22154367,
            avgVolume: 23456700,
            marketCap: 2066000000000,
            pe: 25.18,
            eps: 6.54,
            beta: 1.05,
            dividendYield: 0.52,
            targetPrice: 180.45,
            yearHigh: 171.22,
            yearLow: 120.21,
            description: 'Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.',
            sector: 'Technology',
            industry: 'Internet Content & Information',
            employees: 182000,
            country: 'United States',
            website: 'https://www.abc.xyz'
        },
        // Add more stocks as needed
    };
    
    // If the requested stock exists in our data, return it
    if (stocksData[symbol]) {
        return Promise.resolve(stocksData[symbol]);
    }
    
    // Otherwise, generate a random stock
    return Promise.resolve({
        symbol: symbol,
        name: `${symbol} Corporation`,
        exchange: 'NASDAQ',
        price: 100 + Math.random() * 200,
        change: (Math.random() * 10) - 5,
        changePercent: (Math.random() * 5) - 2.5,
        open: 100 + Math.random() * 200,
        previousClose: 100 + Math.random() * 200,
        high: 100 + Math.random() * 220,
        low: 80 + Math.random() * 180,
        volume: Math.floor(Math.random() * 50000000),
        avgVolume: Math.floor(Math.random() * 60000000),
        marketCap: Math.floor(Math.random() * 1000000000000),
        pe: 10 + Math.random() * 30,
        eps: 1 + Math.random() * 10,
        beta: 0.8 + Math.random() * 1.2,
        dividendYield: Math.random() * 3,
        targetPrice: 100 + Math.random() * 250,
        yearHigh: 150 + Math.random() * 250,
        yearLow: 50 + Math.random() * 100,
        description: `${symbol} Corporation is a company that operates in various sectors and provides products and services worldwide.`,
        sector: 'Technology',
        industry: 'Software',
        employees: Math.floor(Math.random() * 200000),
        country: 'United States',
        website: `https://www.${symbol.toLowerCase()}.com`
    });
}

// Generate mock historical data for charts
function getMockHistoricalData(symbol, timeframe) {
    // Determine number of data points based on timeframe
    let dataPoints;
    let interval;
    
    switch (timeframe) {
        case '1d':
            dataPoints = 390; // 6.5 hours of market (390 minutes)
            interval = 'minute';
            break;
        case '1w':
            dataPoints = 5 * 6.5 * 60 / 5; // 5 days with 5-minute intervals
            interval = '5minute';
            break;
        case '1m':
            dataPoints = 21; // ~21 trading days in a month
            interval = 'day';
            break;
        case '3m':
            dataPoints = 63; // ~63 trading days in 3 months
            interval = 'day';
            break;
        case '6m':
            dataPoints = 126; // ~126 trading days in 6 months
            interval = 'day';
            break;
        case '1y':
            dataPoints = 252; // ~252 trading days in a year
            interval = 'day';
            break;
        case '5y':
            dataPoints = 60; // 5 years with monthly data
            interval = 'month';
            break;
        default:
            dataPoints = 30;
            interval = 'day';
    }
    
    // Get base price range
    let basePrice;
    if (symbol === 'AAPL') basePrice = 170;
    else if (symbol === 'MSFT') basePrice = 400;
    else if (symbol === 'GOOGL') basePrice = 160;
    else basePrice = 100 + Math.random() * 100;
    
    // Generate random walk data
    const volatility = 0.02; // 2% daily volatility
    let currentPrice = basePrice;
    let currentDate = new Date();
    
    // For 1d, start at market open (9:30 AM ET)
    if (timeframe === '1d') {
        currentDate.setHours(9, 30, 0, 0);
    } 
    // For longer timeframes, go back in time
    else {
        currentDate = new Date(); // Reset to now
        
        if (timeframe === '1w') currentDate.setDate(currentDate.getDate() - 5);
        else if (timeframe === '1m') currentDate.setDate(currentDate.getDate() - 30);
        else if (timeframe === '3m') currentDate.setDate(currentDate.getDate() - 90);
        else if (timeframe === '6m') currentDate.setDate(currentDate.getDate() - 180);
        else if (timeframe === '1y') currentDate.setDate(currentDate.getDate() - 365);
        else if (timeframe === '5y') currentDate.setDate(currentDate.getDate() - 1825);
    }
    
    const prices = [];
    const ohlc = [];
    const volume = [];
    
    for (let i = 0; i < dataPoints; i++) {
        // Calculate time for this data point
        const timestamp = currentDate.getTime() / 1000;
        
        // Generate random price change with slight upward bias
        const change = currentPrice * (volatility * (Math.random() * 2 - 1) + 0.0003);
        currentPrice += change;
        
        if (currentPrice < basePrice * 0.5) currentPrice = basePrice * 0.5; // Prevent going too low
        
        // For line/area charts
        prices.push({
            time: timestamp,
            value: currentPrice
        });
        
        // For candlestick charts
        const open = currentPrice;
        const high = open * (1 + volatility * Math.random());
        const low = open * (1 - volatility * Math.random());
        const close = (open + high + low) / 3; // Random close
        
        ohlc.push({
            time: timestamp,
            open: open,
            high: high,
            low: low,
            close: close
        });
        
        // Generate random volume
        const volumeValue = Math.floor(Math.random() * 1000000) + 500000;
        volume.push({
            time: timestamp,
            value: volumeValue,
            color: close >= open ? 'rgba(76, 217, 123, 0.5)' : 'rgba(255, 99, 132, 0.5)'
        });
        
        // Increment date for next point
        if (interval === 'minute') {
            currentDate.setMinutes(currentDate.getMinutes() + 1);
        } else if (interval === '5minute') {
            currentDate.setMinutes(currentDate.getMinutes() + 5);
        } else if (interval === 'day') {
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (interval === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
    }
    
    return {
        prices: prices,
        ohlc: ohlc,
        volume: volume
    };
}

// Sample market data
const marketIndices = {
    sp500: {
        name: 'S&P 500',
        value: 4927.93,
        change: 0.52
    },
    nasdaq: {
        name: 'NASDAQ',
        value: 15628.95,
        change: 0.24
    },
    dowjones: {
        name: 'Dow Jones',
        value: 38726.33,
        change: 0.38
    }
};

// Sample stock data
const stocks = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'NASDAQ',
        price: 176.75,
        change: -0.40,
        changePercent: -0.23
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        exchange: 'NASDAQ',
        price: 409.10,
        change: -0.63,
        changePercent: -0.15
    },
    {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        exchange: 'NASDAQ',
        price: 162.15,
        change: -3.12,
        changePercent: -1.89
    },
    {
        symbol: 'AMZN',
        name: 'Amazon.com, Inc.',
        exchange: 'NASDAQ',
        price: 182.81,
        change: -0.67,
        changePercent: -0.36
    },
    {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        exchange: 'NASDAQ',
        price: 255.70,
        change: 7.28,
        changePercent: 2.93
    },
    {
        symbol: 'META',
        name: 'Meta Platforms, Inc.',
        exchange: 'NASDAQ',
        price: 507.94,
        change: -12.35,
        changePercent: -2.37
    }
];

// Function to format numbers with commas
function formatNumber(number) {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to format percentage
function formatPercent(number) {
    const sign = number >= 0 ? '+' : '';
    return `${sign}${number.toFixed(2)}%`;
}

// Function to update market indices
function updateMarketIndices() {
    Object.entries(marketIndices).forEach(([id, data]) => {
        const card = document.getElementById(id);
        if (card) {
            const valueElement = card.querySelector('.index-value');
            const changeElement = card.querySelector('.index-change');
            
            if (valueElement) valueElement.textContent = formatNumber(data.value);
            if (changeElement) {
                changeElement.textContent = formatPercent(data.change);
                changeElement.className = `index-change ${data.change >= 0 ? 'up' : 'down'}`;
            }
        }
    });
}

// Function to create stock card
function createStockCard(stock) {
    const card = document.createElement('div');
    card.className = `stock-card ${stock.change >= 0 ? 'up' : 'down'}`;
    
    card.innerHTML = `
        <div class="stock-header">
            <span class="stock-name">${stock.symbol}</span>
            <span class="stock-exchange">${stock.exchange}</span>
        </div>
        <div class="stock-company">${stock.name}</div>
        <div class="stock-price">$${formatNumber(stock.price)}</div>
        <div class="stock-change ${stock.change >= 0 ? 'up' : 'down'}">
            ${formatPercent(stock.changePercent)}
        </div>
        <canvas class="stock-chart"></canvas>
        <a href="#" class="view-details">View Details →</a>
    `;
    
    return card;
}

// Function to update stocks display
function updateStocks() {
    const container = document.getElementById('majorStocks');
    if (!container) return;
    
    container.innerHTML = '';
    stocks.forEach(stock => {
        container.appendChild(createStockCard(stock));
    });
}

// Function to simulate real-time updates
function simulateStockUpdates() {
    // Update market indices
    Object.values(marketIndices).forEach(index => {
        const change = (Math.random() - 0.5) * 0.1;
        index.value *= (1 + change);
        index.change = change * 100;
    });
    
    // Update stock prices
    stocks.forEach(stock => {
        const change = (Math.random() - 0.5) * 0.02;
        stock.price *= (1 + change);
        stock.change = stock.price * change;
        stock.changePercent = change * 100;
    });
    
    // Update UI
    updateMarketIndices();
    updateStocks();
    
    // Update last updated time
    const now = new Date();
    document.getElementById('lastUpdated').textContent = 
        `Last updated: ${now.toLocaleTimeString()}`;
}

// Initialize market data
document.addEventListener('DOMContentLoaded', () => {
    updateMarketIndices();
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
}); 
// Sample stock data
const stockData = [
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

// Function to format price with commas
function formatPrice(price) {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to format change and percent
function formatChange(change, percent) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
}

// Function to create a simple sparkline chart
function createSparkline(trend) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.display = "block";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", trend);
    path.setAttribute("stroke", trend.includes("up") ? "#00b894" : "#ff7675");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");

    svg.appendChild(path);
    return svg;
}

// Function to create stock card
function createStockCard(stock) {
    const card = document.createElement('div');
    card.className = `stock-card ${stock.change >= 0 ? 'up' : 'down'}`;

    // Generate random trend path for demo
    const trendPath = stock.change >= 0 
        ? "M0,20 Q5,18 10,15 T20,13 T30,10 T40,8" 
        : "M0,10 Q5,12 10,15 T20,17 T30,20 T40,22";

    card.innerHTML = `
        <div class="stock-header">
            <span class="stock-name">${stock.symbol}</span>
            <span class="stock-exchange">${stock.exchange}</span>
        </div>
        <div class="stock-company">${stock.name}</div>
        <div class="stock-price">$${formatPrice(stock.price)}</div>
        <div class="stock-change ${stock.change >= 0 ? 'up' : 'down'}">
            ${formatChange(stock.change, stock.changePercent)}
        </div>
        <div class="stock-chart"></div>
        <a href="#" class="view-details">View Details →</a>
    `;

    // Add sparkline chart
    const chartDiv = card.querySelector('.stock-chart');
    chartDiv.appendChild(createSparkline(trendPath));

    return card;
}

// Function to update the time
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    document.getElementById('update-time').textContent = timeStr;
}

// Function to initialize the dashboard
function initializeDashboard() {
    const container = document.getElementById('stockContainer');
    stockData.forEach(stock => {
        container.appendChild(createStockCard(stock));
    });
    updateTime();
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Add click handler for refresh button
document.querySelector('.refresh-btn').addEventListener('click', function() {
    this.style.transform = 'rotate(360deg)';
    updateTime();
    // Here you would typically fetch new data from an API
    setTimeout(() => {
        this.style.transform = 'rotate(0deg)';
    }, 300);
});

// Add hover effect for stock cards
document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.stock-card')) {
        e.target.closest('.stock-card').style.transform = 'translateY(-5px)';
        e.target.closest('.stock-card').style.transition = 'transform 0.3s ease';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.stock-card')) {
        e.target.closest('.stock-card').style.transform = 'translateY(0)';
    }
}); 
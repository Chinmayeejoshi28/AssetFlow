// Main application entry point
document.addEventListener('DOMContentLoaded', function() {
    // Initialize global variables
    let currentStock = null;
    let tradeType = 'buy';
    let timeRange = '1d';
    let stockChart = null;
    
    // DOM Elements
    const stockSearch = document.getElementById('stockSearch');
    const searchBtn = document.getElementById('searchBtn');
    const watchlistItems = document.getElementById('watchlistItems');
    const selectedStockHeader = document.getElementById('selectedStockHeader');
    const stockPrice = document.getElementById('stockPrice');
    const stockStats = document.getElementById('stockStats');
    const timeButtons = document.querySelectorAll('.time-btn');
    const tradeButtons = document.querySelectorAll('.trade-btn');
    const orderTypeSelect = document.getElementById('orderType');
    const limitPriceGroup = document.getElementById('limitPriceGroup');
    const limitPrice = document.getElementById('limitPrice');
    const quantity = document.getElementById('quantity');
    const estimatedCost = document.getElementById('estimatedCost');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    // Initialize the dashboard
    initializeDashboard();
    
    // Search for stocks
    searchBtn.addEventListener('click', searchStock);
    stockSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchStock();
        }
    });
    
    // Time range selection
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            timeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            timeRange = this.dataset.range;
            if (currentStock) {
                updateStockChart(currentStock.symbol, timeRange);
            }
        });
    });
    
    // Trade type selection
    tradeButtons.forEach(button => {
        button.addEventListener('click', function() {
            tradeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            tradeType = this.dataset.type;
            updateOrderSummary();
        });
    });
    
    // Order type change
    orderTypeSelect.addEventListener('change', function() {
        limitPriceGroup.style.display = this.value === 'limit' ? 'block' : 'none';
        updateOrderSummary();
    });
    
    // Update estimated cost when quantity changes
    quantity.addEventListener('input', updateOrderSummary);
    limitPrice.addEventListener('input', updateOrderSummary);
    
    // Place order button
    placeOrderBtn.addEventListener('click', placeOrder);
    
    // Initialize dashboard
    function initializeDashboard() {
        // Load user data from localStorage
        loadUserData();
        
        // Load watchlist
        loadWatchlist();
        
        // Load portfolio
        loadPortfolio();
        
        // Initialize chart
        initializeChart();
    }
    
    // Search for a stock
    function searchStock() {
        const query = stockSearch.value.trim();
        if (!query) return;
        
        // Show loading state
        selectedStockHeader.innerHTML = '<h2>Loading...</h2>';
        
        // Call the stock API
        fetchStockData(query)
            .then(data => {
                if (data) {
                    displayStockData(data);
                } else {
                    selectedStockHeader.innerHTML = '<h2>Stock not found</h2>';
                }
            })
            .catch(error => {
                console.error('Error fetching stock data:', error);
                selectedStockHeader.innerHTML = '<h2>Error loading stock data</h2>';
            });
    }
    
    // Display stock data
    function displayStockData(stock) {
        currentStock = stock;
        
        // Update header
        selectedStockHeader.innerHTML = `
            <h2>${stock.name} (${stock.symbol})</h2>
            <div id="stockPrice" class="${stock.change >= 0 ? 'positive' : 'negative'}">
                $${stock.price.toFixed(2)} 
                <span>${stock.change >= 0 ? '▲' : '▼'} ${Math.abs(stock.change).toFixed(2)} (${Math.abs(stock.changePercent).toFixed(2)}%)</span>
            </div>
        `;
        
        // Update stats
        stockStats.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Open</div>
                <div class="stat-value">$${stock.open.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">High</div>
                <div class="stat-value">$${stock.high.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Low</div>
                <div class="stat-value">$${stock.low.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Volume</div>
                <div class="stat-value">${formatNumber(stock.volume)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Market Cap</div>
                <div class="stat-value">${formatCurrency(stock.marketCap)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">P/E Ratio</div>
                <div class="stat-value">${stock.pe ? stock.pe.toFixed(2) : 'N/A'}</div>
            </div>
        `;
        
        // Update chart
        updateStockChart(stock.symbol, timeRange);
        
        // Enable order button
        placeOrderBtn.disabled = false;
        
        // Update order summary
        updateOrderSummary();
    }
    
    // Update order summary
    function updateOrderSummary() {
        if (!currentStock) return;
        
        const qty = parseInt(quantity.value) || 0;
        let price;
        
        if (orderTypeSelect.value === 'limit') {
            price = parseFloat(limitPrice.value) || currentStock.price;
        } else {
            price = currentStock.price;
        }
        
        const total = qty * price;
        estimatedCost.textContent = `$${total.toFixed(2)}`;
    }
    
    // Place an order
    function placeOrder() {
        if (!currentStock) return;
        if (!isUserLoggedIn()) {
            alert('Please log in to place orders');
            showAuthModal();
            return;
        }
        
        const qty = parseInt(quantity.value) || 0;
        if (qty <= 0) {
            alert('Please enter a valid quantity');
            return;
        }
        
        let price;
        if (orderTypeSelect.value === 'limit') {
            price = parseFloat(limitPrice.value);
            if (!price || price <= 0) {
                alert('Please enter a valid limit price');
                return;
            }
        } else {
            price = currentStock.price;
        }
        
        // For demo purposes, we'll execute the order immediately
        const order = {
            symbol: currentStock.symbol,
            name: currentStock.name,
            quantity: qty,
            price: price,
            type: tradeType,
            orderType: orderTypeSelect.value,
            date: new Date().toISOString(),
            total: qty * price
        };
        
        // Execute the order
        executeOrder(order);
    }
    
    // Utility function to format numbers
    function formatNumber(num) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + 'K';
        } else {
            return num.toString();
        }
    }
    
    // Utility function to format currency
    function formatCurrency(num) {
        if (num >= 1e9) {
            return '$' + (num / 1e9).toFixed(2) + 'B';
        } else if (num >= 1e6) {
            return '$' + (num / 1e6).toFixed(2) + 'M';
        } else {
            return '$' + num.toFixed(2);
        }
    }
}); 
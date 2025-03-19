document.addEventListener('DOMContentLoaded', function() {
    // Get stock symbol from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const symbol = urlParams.get('symbol');
    
    if (!symbol) {
        window.location.href = 'index.html';
        return;
    }
    
    // DOM Elements
    const stockHeaderInfo = document.getElementById('stockHeaderInfo');
    const keyStats = document.getElementById('keyStats');
    const companyInfo = document.getElementById('companyInfo');
    const technicalIndicators = document.getElementById('technicalIndicators');
    const stockNewsContainer = document.getElementById('stockNewsContainer');
    const tradeHistoryBody = document.getElementById('tradeHistoryBody');
    const noTradeHistory = document.getElementById('noTradeHistory');
    const tradeHistoryTable = document.getElementById('tradeHistoryTable');
    
    // Trading form elements
    const tradeTabs = document.querySelectorAll('.trade-tab');
    const tradeQuantity = document.getElementById('tradeQuantity');
    const tradeType = document.getElementById('tradeType');
    const limitPriceGroup = document.getElementById('limitPriceGroup');
    const limitPrice = document.getElementById('limitPrice');
    const tradingCurrentPrice = document.getElementById('tradingCurrentPrice');
    const estimatedCost = document.getElementById('estimatedCost');
    const availableCash = document.getElementById('availableCash');
    const availableShares = document.getElementById('availableShares');
    const availableCashItem = document.getElementById('availableCashItem');
    const availableSharesItem = document.getElementById('availableSharesItem');
    const executeTrade = document.getElementById('executeTrade');
    
    // Chart elements
    const timeButtons = document.querySelectorAll('.time-btn');
    const chartTypeButtons = document.querySelectorAll('.chart-type-btn');
    
    // Modal elements
    const orderModal = document.getElementById('orderModal');
    const orderDetails = document.getElementById('orderDetails');
    const cancelOrder = document.getElementById('cancelOrder');
    const confirmOrder = document.getElementById('confirmOrder');
    const successModal = document.getElementById('successModal');
    const successDetails = document.getElementById('successDetails');
    const viewPortfolio = document.getElementById('viewPortfolio');
    const closeSuccess = document.getElementById('closeSuccess');
    
    // Quick action buttons
    const addToWatchlistBtn = document.getElementById('addToWatchlistBtn');
    const buyStockBtn = document.getElementById('buyStockBtn');
    const sellStockBtn = document.getElementById('sellStockBtn');
    
    // Current stock data
    let currentStock = null;
    let currentTradeAction = 'buy';
    let currentTimeframe = '1d';
    let currentChartType = 'line';
    let chart = null;
    
    // Initialize the page
    loadStockData();
    
    // Event Listeners
    // Time frame buttons
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            timeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentTimeframe = this.dataset.range;
            updateChart();
        });
    });
    
    // Chart type buttons
    chartTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            chartTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentChartType = this.dataset.type;
            updateChart();
        });
    });
    
    // Trade tabs (Buy/Sell)
    tradeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tradeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentTradeAction = this.dataset.action;
            
            // Update trading panel for buy or sell
            updateTradingPanel();
        });
    });
    
    // Order type change
    tradeType.addEventListener('change', function() {
        limitPriceGroup.style.display = this.value === 'limit' ? 'block' : 'none';
        updateTradingSummary();
    });
    
    // Trade quantity change
    tradeQuantity.addEventListener('input', updateTradingSummary);
    limitPrice.addEventListener('input', updateTradingSummary);
    
    // Execute trade button
    executeTrade.addEventListener('click', function() {
        if (!isUserLoggedIn()) {
            alert('Please log in to place an order');
            return;
        }
        
        const quantity = parseInt(tradeQuantity.value);
        if (!quantity || quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }
        
        let price;
        if (tradeType.value === 'limit') {
            price = parseFloat(limitPrice.value);
            if (!price || price <= 0) {
                alert('Please enter a valid limit price');
                return;
            }
        } else {
            price = currentStock.price;
        }
        
        // For sell orders, check if user has enough shares
        if (currentTradeAction === 'sell') {
            const portfolio = getPortfolio();
            const position = portfolio.find(p => p.symbol === currentStock.symbol);
            if (!position || position.quantity < quantity) {
                alert('You do not have enough shares to sell');
                return;
            }
        }
        
        // For buy orders, check if user has enough cash
        if (currentTradeAction === 'buy') {
            const cash = getUserCash();
            const total = price * quantity;
            if (cash < total) {
                alert('You do not have enough cash for this purchase');
                return;
            }
        }
        
        // Show order confirmation modal
        showOrderConfirmation({
            symbol: currentStock.symbol,
            name: currentStock.name,
            action: currentTradeAction,
            quantity: quantity,
            price: price,
            orderType: tradeType.value,
            total: price * quantity
        });
    });
    
    // Cancel order
    cancelOrder.addEventListener('click', function() {
        orderModal.style.display = 'none';
    });
    
    // Confirm order
    confirmOrder.addEventListener('click', function() {
        orderModal.style.display = 'none';
        executeOrder();
    });
    
    // Close success modal
    closeSuccess.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
    
    // View portfolio after successful trade
    viewPortfolio.addEventListener('click', function() {
        window.location.href = 'portfolio.html';
    });
    
    // Add to watchlist
    addToWatchlistBtn.addEventListener('click', function() {
        if (!isUserLoggedIn()) {
            alert('Please log in to add to your watchlist');
            return;
        }
        
        addToWatchlist(currentStock);
        updateWatchlistButton();
    });
    
    // Quick buy button
    buyStockBtn.addEventListener('click', function() {
        setTradeAction('buy');
        document.querySelector('.trading-panel').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Quick sell button
    sellStockBtn.addEventListener('click', function() {
        setTradeAction('sell');
        document.querySelector('.trading-panel').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            orderModal.style.display = 'none';
        }
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Functions
    
    // Load stock data
    async function loadStockData() {
        try {
            // Get stock data from API
            const stock = await fetchStockDetails(symbol);
            currentStock = stock;
            
            // Update page with stock data
            updateStockHeader(stock);
            updateKeyStats(stock);
            loadCompanyInfo(stock);
            loadTechnicalIndicators(stock);
            loadStockNews(stock);
            loadTradeHistory(stock);
            updateTradingPanel();
            updateWatchlistButton();
            
            // Initialize chart
            initializeChart(stock);
            
            // Add to recently viewed
            addToRecentlyViewed(stock);
            
        } catch (error) {
            console.error('Error loading stock data:', error);
            stockHeaderInfo.innerHTML = `
                <div class="error-message">
                    <h2>Error loading stock data</h2>
                    <p>Please try again later or select a different stock.</p>
                </div>
            `;
        }
    }
    
    // Update stock header information
    function updateStockHeader(stock) {
        const priceChangeClass = stock.change >= 0 ? 'positive' : 'negative';
        const priceChangeIcon = stock.change >= 0 ? '▲' : '▼';
        
        stockHeaderInfo.innerHTML = `
            <div class="stock-title">
                <h2 class="stock-name">${stock.name}</h2>
                <span class="stock-symbol">${stock.symbol}</span>
            </div>
            <div class="stock-exchange">${stock.exchange}</div>
            <div class="stock-price-container">
                <div class="stock-current-price">$${stock.price.toFixed(2)}</div>
                <div class="stock-price-change ${priceChangeClass}">
                    ${priceChangeIcon} $${Math.abs(stock.change).toFixed(2)} (${Math.abs(stock.changePercent).toFixed(2)}%)
                </div>
            </div>
        `;
    }
    
    // Update key statistics
    function updateKeyStats(stock) {
        keyStats.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Open</div>
                <div class="stat-value">$${stock.open.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Previous Close</div>
                <div class="stat-value">$${stock.previousClose.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Day's Range</div>
                <div class="stat-value">$${stock.low.toFixed(2)} - $${stock.high.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">52 Week Range</div>
                <div class="stat-value">$${stock.yearLow.toFixed(2)} - $${stock.yearHigh.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Volume</div>
                <div class="stat-value">${formatNumber(stock.volume)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Avg. Volume</div>
                <div class="stat-value">${formatNumber(stock.avgVolume)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Market Cap</div>
                <div class="stat-value">${formatCurrency(stock.marketCap)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">P/E Ratio</div>
                <div class="stat-value">${stock.pe ? stock.pe.toFixed(2) : 'N/A'}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">EPS (TTM)</div>
                <div class="stat-value">$${stock.eps.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Dividend Yield</div>
                <div class="stat-value">${stock.dividendYield ? stock.dividendYield.toFixed(2) + '%' : 'N/A'}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Beta</div>
                <div class="stat-value">${stock.beta.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">1y Target Est</div>
                <div class="stat-value">$${stock.targetPrice.toFixed(2)}</div>
            </div>
        `;
    }
    
    // Load company information
    function loadCompanyInfo(stock) {
        companyInfo.innerHTML = `
            <p class="company-description">${stock.description}</p>
            <div class="company-details">
                <div class="company-detail-item">
                    <span class="detail-label">Industry</span>
                    <span class="detail-value">${stock.industry}</span>
                </div>
                <div class="company-detail-item">
                    <span class="detail-label">Sector</span>
                    <span class="detail-value">${stock.sector}</span>
                </div>
                <div class="company-detail-item">
                    <span class="detail-label">Employees</span>
                    <span class="detail-value">${formatNumber(stock.employees)}</span>
                </div>
                <div class="company-detail-item">
                    <span class="detail-label">Country</span>
                    <span class="detail-value">${stock.country}</span>
                </div>
                <div class="company-detail-item">
                    <span class="detail-label">Website</span>
                    <span class="detail-value">
                        <a href="${stock.website}" target="_blank">${stock.website}</a>
                    </span>
                </div>
                <div class="company-detail-item">
                    <span class="detail-label">
        `;
    }
    
    // Initialize chart
    function initializeChart(stock) {
        const chartContainer = document.getElementById('advancedChart');
        
        // Clear any existing chart
        chartContainer.innerHTML = '';
        
        // Create the chart with lightweight-charts
        const chartOptions = {
            width: chartContainer.clientWidth,
            height: 350,
            layout: {
                background: { color: '#172e4d' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.6)' },
                horzLines: { color: 'rgba(42, 46, 57, 0.6)' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: 'rgba(197, 203, 206, 0.2)',
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
                vertLine: {
                    width: 1,
                    color: 'rgba(197, 203, 206, 0.5)',
                    style: LightweightCharts.LineStyle.Solid,
                },
                horzLine: {
                    width: 1,
                    color: 'rgba(197, 203, 206, 0.5)',
                    style: LightweightCharts.LineStyle.Solid,
                    labelBackgroundColor: '#8a5fff',
                },
            },
            handleScroll: true,
            handleScale: true,
        };
        
        // Create chart instance
        chart = LightweightCharts.createChart(chartContainer, chartOptions);
        
        // Add event listener for window resize
        window.addEventListener('resize', () => {
            if (chart) {
                chart.applyOptions({
                    width: chartContainer.clientWidth,
                    height: 350
                });
            }
        });
        
        // Initialize chart with data
        updateChart();
    }
    
    // Update chart with new data
    async function updateChart() {
        if (!chart || !currentStock) return;
        
        // Show loading state
        const chartContainer = document.getElementById('advancedChart');
        chartContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>
        `;
        
        try {
            // Fetch historical data
            const historicalData = await fetchHistoricalData(currentStock.symbol, currentTimeframe);
            
            // Re-initialize chart
            initializeChart(currentStock);
            
            // Create candlestick series
            const candleSeries = chart.addCandlestickSeries({
                upColor: 'rgba(76, 217, 123, 1)',
                downColor: 'rgba(255, 99, 132, 1)',
                borderUpColor: 'rgba(76, 217, 123, 1)',
                borderDownColor: 'rgba(255, 99, 132, 1)',
                wickUpColor: 'rgba(76, 217, 123, 1)',
                wickDownColor: 'rgba(255, 99, 132, 1)',
            });
            
            candleSeries.setData(historicalData.ohlc);
            
            // Add volume series with colors matching profit/loss
            const volumeSeries = chart.addHistogramSeries({
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '',
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            });
            
            // Color the volume bars based on price movement
            const volumeData = historicalData.volume.map((v, i) => ({
                ...v,
                color: historicalData.ohlc[i].close >= historicalData.ohlc[i].open
                    ? 'rgba(76, 217, 123, 0.3)'
                    : 'rgba(255, 99, 132, 0.3)'
            }));
            
            volumeSeries.setData(volumeData);
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    }
}); 
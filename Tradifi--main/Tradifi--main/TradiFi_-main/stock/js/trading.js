// Trading functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const buyForm = document.getElementById('buyForm');
    const stockSymbolInput = document.getElementById('stockSymbol');
    const quantityInput = document.getElementById('quantity');
    const orderTypeSelect = document.getElementById('orderType');
    const limitPriceGroup = document.getElementById('limitPriceGroup');
    const limitPriceInput = document.getElementById('limitPrice');
    const currentPriceSpan = document.getElementById('currentPrice');
    const totalValueSpan = document.getElementById('totalValue');
    const executeTradeBtn = document.getElementById('executeTrade');
    const formTabs = document.querySelectorAll('.tab-btn');
    
    // Variables to store current stock data
    let currentStock = null;
    let currentPrice = 0;
    
    // Initialize trading form
    initTradingForm();
    
    // Event Listeners
    stockSymbolInput.addEventListener('input', handleStockSymbolInput);
    quantityInput.addEventListener('input', updateTotalValue);
    orderTypeSelect.addEventListener('change', handleOrderTypeChange);
    executeTradeBtn.addEventListener('click', executeTrade);
    
    // Tab switching
    formTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            formTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update form for buy/sell
            const action = tab.dataset.tab;
            updateFormForAction(action);
        });
    });
    
    // Functions
    function initTradingForm() {
        // Set default values
        quantityInput.value = 1;
        orderTypeSelect.value = 'market';
        limitPriceGroup.style.display = 'none';
        
        // Add autocomplete for stock symbols
        setupStockSymbolAutocomplete();
    }
    
    function setupStockSymbolAutocomplete() {
        // Get list of available stocks
        const availableStocks = stocks.map(stock => ({
            symbol: stock.symbol,
            name: stock.name
        }));
        
        // Add datalist for autocomplete
        const datalist = document.createElement('datalist');
        datalist.id = 'stockSymbols';
        
        availableStocks.forEach(stock => {
            const option = document.createElement('option');
            option.value = stock.symbol;
            option.textContent = `${stock.symbol} - ${stock.name}`;
            datalist.appendChild(option);
        });
        
        document.body.appendChild(datalist);
        stockSymbolInput.setAttribute('list', 'stockSymbols');
    }
    
    async function handleStockSymbolInput(e) {
        const symbol = e.target.value.toUpperCase();
        
        if (symbol.length >= 1) {
            // Find stock in our data
            currentStock = stocks.find(s => s.symbol === symbol);
            
            if (currentStock) {
                currentPrice = currentStock.price;
                currentPriceSpan.textContent = formatCurrency(currentPrice);
                updateTotalValue();
                
                // Enable trading button
                executeTradeBtn.disabled = false;
            } else {
                currentPrice = 0;
                currentPriceSpan.textContent = '$0.00';
                totalValueSpan.textContent = '$0.00';
                
                // Disable trading button
                executeTradeBtn.disabled = true;
            }
        }
    }
    
    function handleOrderTypeChange(e) {
        const orderType = e.target.value;
        limitPriceGroup.style.display = orderType === 'limit' ? 'block' : 'none';
        
        if (orderType === 'limit') {
            limitPriceInput.value = currentPrice.toFixed(2);
        }
    }
    
    function updateTotalValue() {
        const quantity = parseInt(quantityInput.value) || 0;
        const total = quantity * currentPrice;
        totalValueSpan.textContent = formatCurrency(total);
    }
    
    function updateFormForAction(action) {
        const isBuy = action === 'buy';
        executeTradeBtn.textContent = isBuy ? 'Buy Stock' : 'Sell Stock';
        executeTradeBtn.className = `trade-btn ${isBuy ? 'buy' : 'sell'}`;
    }
    
    async function executeTrade() {
        if (!currentStock) return;
        
        const quantity = parseInt(quantityInput.value);
        const orderType = orderTypeSelect.value;
        const action = document.querySelector('.tab-btn.active').dataset.tab;
        const limitPrice = limitPriceInput.value ? parseFloat(limitPriceInput.value) : null;
        
        // Validate trade
        if (!validateTrade(quantity, action)) return;
        
        // Create order object
        const order = {
            symbol: currentStock.symbol,
            quantity: quantity,
            price: currentPrice,
            type: orderType,
            action: action,
            limitPrice: limitPrice,
            timestamp: new Date(),
            status: 'pending'
        };
        
        try {
            // Execute trade
            const result = await processTrade(order);
            
            if (result.success) {
                // Update portfolio
                updatePortfolio(order);
                
                // Add to recent orders
                addToRecentOrders(order);
                
                // Show success message
                showNotification('Trade executed successfully!', 'success');
                
                // Reset form
                resetForm();
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            showNotification('Failed to execute trade. Please try again.', 'error');
        }
    }
    
    function validateTrade(quantity, action) {
        if (quantity <= 0) {
            showNotification('Please enter a valid quantity.', 'error');
            return false;
        }
        
        const totalValue = quantity * currentPrice;
        const availableCash = parseFloat(document.querySelector('.stat-value').textContent.replace(/[^0-9.-]+/g, ''));
        
        if (action === 'buy' && totalValue > availableCash) {
            showNotification('Insufficient funds for this trade.', 'error');
            return false;
        }
        
        return true;
    }
    
    async function processTrade(order) {
        // Simulate API call to process trade
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Trade executed successfully'
                });
            }, 1000);
        });
    }
    
    function updatePortfolio(order) {
        const portfolioValueEl = document.getElementById('portfolioValue');
        const availableCashEl = document.querySelector('.stat-value');
        
        const totalValue = order.quantity * order.price;
        const currentCash = parseFloat(availableCashEl.textContent.replace(/[^0-9.-]+/g, ''));
        
        if (order.action === 'buy') {
            availableCashEl.textContent = formatCurrency(currentCash - totalValue);
        } else {
            availableCashEl.textContent = formatCurrency(currentCash + totalValue);
        }
    }
    
    function addToRecentOrders(order) {
        const ordersList = document.querySelector('.orders-list');
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        orderItem.innerHTML = `
            <div class="order-details">
                <span class="order-symbol">${order.symbol}</span>
                <span class="order-type">${order.action.toUpperCase()} ${order.quantity} @ ${formatCurrency(order.price)}</span>
            </div>
            <span class="order-value">${formatCurrency(order.quantity * order.price)}</span>
        `;
        
        ordersList.insertBefore(orderItem, ordersList.firstChild);
    }
    
    function resetForm() {
        stockSymbolInput.value = '';
        quantityInput.value = 1;
        orderTypeSelect.value = 'market';
        limitPriceGroup.style.display = 'none';
        currentPriceSpan.textContent = '$0.00';
        totalValueSpan.textContent = '$0.00';
    }
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    function formatCurrency(number) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(number);
    }
}); 
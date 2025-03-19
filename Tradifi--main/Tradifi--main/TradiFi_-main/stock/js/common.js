// Common functions for all pages

// Get URL parameters (for passing data between pages)
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
    
    return params;
}

// Navigate to stock details page
function viewStockDetails(symbol) {
    window.location.href = `stock-details.html?symbol=${encodeURIComponent(symbol)}`;
}

// Navigate to trading page with preselected stock
function goToTrading(symbol, action = 'buy') {
    window.location.href = `trading.html?symbol=${encodeURIComponent(symbol)}&action=${encodeURIComponent(action)}`;
}

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Show login modal
function showAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}

// Format money amount
function formatMoney(amount) {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Format large numbers
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

// Format percentage
function formatPercent(percent) {
    return percent.toFixed(2) + '%';
}

// Add to recently viewed stocks
function addToRecentlyViewed(stock) {
    let recentStocks = JSON.parse(localStorage.getItem('recentStocks') || '[]');
    
    // Remove if already exists
    recentStocks = recentStocks.filter(s => s.symbol !== stock.symbol);
    
    // Add to beginning of array
    recentStocks.unshift(stock);
    
    // Limit to 5 recent stocks
    recentStocks = recentStocks.slice(0, 5);
    
    localStorage.setItem('recentStocks', JSON.stringify(recentStocks));
} 
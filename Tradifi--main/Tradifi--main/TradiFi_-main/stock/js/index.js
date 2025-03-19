// Function to initialize all components
function initializeApp() {
    // Update market indices
    updateMarketIndices();
    
    // Update major stocks
    updateMajorStocks();
    
    // Start auto-refresh
    setInterval(() => {
        simulateStockUpdates();
    }, 60000); // Update every minute
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initializeApp);

// Add some animations for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Animate market summary cards on load
    const cards = document.querySelectorAll('.index-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Add smooth scrolling for stock cards container
    const stocksScroller = document.querySelector('.stocks-scroller');
    if (stocksScroller) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        stocksScroller.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - stocksScroller.offsetLeft;
            scrollLeft = stocksScroller.scrollLeft;
        });
        
        stocksScroller.addEventListener('mouseleave', () => {
            isDown = false;
        });
        
        stocksScroller.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        stocksScroller.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - stocksScroller.offsetLeft;
            const walk = (x - startX) * 2;
            stocksScroller.scrollLeft = scrollLeft - walk;
        });
    }
}); 
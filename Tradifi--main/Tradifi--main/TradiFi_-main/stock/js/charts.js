// Function to generate historical data for candlesticks
function generateHistoricalData(days = 30) {
    const data = [];
    let price = 100;
    
    for (let i = days; i > 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Generate OHLC data
        const open = price;
        const high = price * (1 + Math.random() * 0.02);
        const low = price * (1 - Math.random() * 0.02);
        const close = price * (1 + (Math.random() - 0.5) * 0.02);
        
        // Update price for next iteration
        price = close;
        
        data.push({
            x: date,
            o: open,
            h: high,
            l: low,
            c: close,
            volume: Math.random() * 1000000 + 500000
        });
    }
    
    return data;
}

// Function to create a candlestick chart for a stock
function createStockChart(canvas, stock) {
    const ctx = canvas.getContext('2d');
    const data = generateHistoricalData();
    
    return new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: stock.symbol,
                data: data,
                color: {
                    up: 'rgba(76, 217, 123, 1)', // Bright green for profit
                    down: 'rgba(255, 99, 132, 1)', // Bright red for loss
                },
                borderColor: {
                    up: 'rgba(76, 217, 123, 1)',
                    down: 'rgba(255, 99, 132, 1)',
                },
                wickColor: {
                    up: 'rgba(76, 217, 123, 1)',
                    down: 'rgba(255, 99, 132, 1)',
                },
                backgroundColor: {
                    up: 'rgba(76, 217, 123, 0.3)',
                    down: 'rgba(255, 99, 132, 0.3)',
                }
            }, {
                type: 'bar',
                label: 'Volume',
                data: data.map(d => ({
                    x: d.x,
                    y: d.volume,
                    color: d.c >= d.o ? 'rgba(76, 217, 123, 0.3)' : 'rgba(255, 99, 132, 0.3)'
                })),
                yAxisID: 'volume',
                backgroundColor: ctx => ctx.raw.color
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        filter: item => item.text !== 'Volume'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const point = context.raw;
                            if (point.o !== undefined) {
                                return [
                                    `Open: $${point.o.toFixed(2)}`,
                                    `High: $${point.h.toFixed(2)}`,
                                    `Low: $${point.l.toFixed(2)}`,
                                    `Close: $${point.c.toFixed(2)}`,
                                    `Profit/Loss: ${((point.c - point.o) / point.o * 100).toFixed(2)}%`
                                ];
                            }
                            return `Volume: ${point.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    grid: {
                        display: true,
                        drawBorder: true,
                    }
                },
                y: {
                    position: 'right',
                    grid: {
                        display: true,
                    }
                },
                volume: {
                    position: 'left',
                    grid: {
                        display: false
                    },
                    display: true,
                    stacked: true
                }
            }
        }
    });
}

// Function to initialize charts for all stock cards
function initializeCharts() {
    const stockCards = document.querySelectorAll('.stock-card');
    stockCards.forEach(card => {
        const canvas = card.querySelector('canvas');
        if (canvas) {
            const stockSymbol = card.querySelector('.stock-name').textContent;
            const stock = stocks.find(s => s.symbol === stockSymbol);
            if (stock) {
                createStockChart(canvas, stock);
            }
        }
    });
}

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the stock cards to be created
    setTimeout(initializeCharts, 100);
}); 
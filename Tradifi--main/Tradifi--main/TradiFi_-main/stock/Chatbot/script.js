// Store API key in a separate configuration
const config = {
    apiKey: 'Add_Your_Google_Gemini_API'
};

const API_URL = 'Add_Your_Gemini_URL';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Handle enter key
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendButton.addEventListener('click', sendMessage);

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    appendMessage(message, 'user-message');
    userInput.value = '';
    userInput.style.height = 'auto';

    // Show typing indicator
    const typingIndicator = appendMessage('Thinking...', 'bot-message');
    const loadingAnimation = addLoadingAnimation(typingIndicator.querySelector('.message-content'));

    try {
        const response = await fetch(`${API_URL}?key=${config.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        const data = await response.json();
        console.log('API Response:', data);

        // Clear loading animation
        clearInterval(loadingAnimation);
        typingIndicator.remove();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const botResponse = data.candidates[0].content.parts[0].text.trim();
            appendMessage(botResponse, 'bot-message');
        } else if (data.error) {
            console.error('API Error:', data.error);
            appendMessage(`Error: ${data.error.message || 'Unknown error occurred'}`, 'bot-message error');
        } else {
            appendMessage('I apologize, but I encountered an error. Please try again.', 'bot-message error');
        }
    } catch (error) {
        console.error('Network Error:', error);
        clearInterval(loadingAnimation);
        typingIndicator.remove();
        appendMessage('Network error occurred. Please check your connection and try again.', 'bot-message error');
    }
}

function appendMessage(content, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

function addLoadingAnimation(element) {
    element.textContent = 'Thinking';
    let dots = 0;
    
    return setInterval(() => {
        dots = (dots + 1) % 4;
        element.textContent = 'Thinking' + '.'.repeat(dots);
    }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    const chatWidget = document.querySelector('.chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const minimizeButton = document.querySelector('.minimize-button');
    const themeToggle = document.querySelector('.theme-toggle');

    // Toggle chat window
    function toggleChat() {
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            chatWindow.style.opacity = '1';
            chatWindow.style.visibility = 'visible';
            userInput.focus();
            // Hide notification dot when opened
            const notificationDot = chatToggle.querySelector('.notification-dot');
            if (notificationDot) {
                notificationDot.style.display = 'none';
            }
        } else {
            chatWindow.style.opacity = '0';
            chatWindow.style.visibility = 'hidden';
        }
    }

    // Event listeners
    chatToggle.addEventListener('click', toggleChat);
    minimizeButton.addEventListener('click', toggleChat);

    // Theme toggle
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
        }
    });

    // Close chat window when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideWidget = chatWidget.contains(event.target) || chatWindow.contains(event.target);
        if (!isClickInsideWidget && chatWidget.classList.contains('active')) {
            toggleChat();
        }
    });

    // Show notification dot periodically
    function showNotification() {
        if (!chatWidget.classList.contains('active')) {
            const notificationDot = chatToggle.querySelector('.notification-dot');
            if (notificationDot) {
                notificationDot.style.display = 'block';
            }
        }
    }

    // Show initial notification after 30 seconds
    setTimeout(showNotification, 30000);
}); 
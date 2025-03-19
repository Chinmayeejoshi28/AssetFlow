document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const minimizeButton = document.querySelector('.minimize-button');
    const themeToggle = document.querySelector('.theme-toggle');

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            userInput.focus();
        }
    });

    // Minimize chat window
    minimizeButton.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Handle theme toggle
    let isDarkMode = false;
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-theme');
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Handle message sending
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            userInput.value = '';
            userInput.style.height = 'auto';
            
            // Simulate bot typing
            showTypingIndicator();
            
            // Simulate bot response after a delay
            setTimeout(() => {
                getBotResponse(message);
            }, 1000);
        }
    }

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key (Shift+Enter for new line)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-avatar">
                    <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
                </div>
                <div class="message-content">${text}</div>
            </div>
            <div class="message-time">${time}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing';
        typingDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Get bot response
    function getBotResponse(userMessage) {
        removeTypingIndicator();
        
        // Simple response logic - can be expanded with more sophisticated AI/API integration
        let botResponse = '';
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            botResponse = "Hello! How can I help you with your investments today?";
        } else if (lowerMessage.includes('stock') || lowerMessage.includes('stocks')) {
            botResponse = "I can help you analyze stocks, track market trends, and provide investment recommendations. What specific information are you looking for?";
        } else if (lowerMessage.includes('market')) {
            botResponse = "I can provide real-time market updates, trends analysis, and insights about various market sectors. What would you like to know?";
        } else if (lowerMessage.includes('portfolio')) {
            botResponse = "I can help you analyze your portfolio, suggest diversification strategies, and track your investments. Would you like to review your portfolio?";
        } else {
            botResponse = "I'm here to help with any investment-related questions. Could you please be more specific about what you'd like to know?";
        }
        
        addMessage(botResponse, 'bot');
    }
}); 
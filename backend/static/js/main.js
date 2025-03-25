document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.querySelector('.messages-container');
    const newChatBtn = document.querySelector('.new-chat-btn');
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarBtn = document.querySelector('.toggle-sidebar');

    // Create spotlight element
    let spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    document.body.appendChild(spotlight);

    document.addEventListener('mousemove', (e) => {
        // Update spotlight position immediately without lag
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    });

    // Toggle sidebar
    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
    });

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    });

    // Handle form submission
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        
        if (message) {
            // Add user message
            addMessage(message, 'user');
            
            // Clear input
            userInput.value = '';
            userInput.style.height = 'auto';
            
            // Simulate AI response (replace with actual API call)
            simulateResponse();
        }
    });

    // New chat button
    newChatBtn.addEventListener('click', () => {
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <h3>Welcome to HOMY</h3>
                <p>Your intelligent assistant ready to help.</p>
            </div>
        `;
    });

    function addMessage(text, sender) {
        // Remove welcome message if present
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function simulateResponse() {
        // Add typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typingDiv);
        typingDiv.scrollIntoView({ behavior: 'smooth' });

        // Simulate AI thinking time
        setTimeout(() => {
            typingDiv.remove();
            addMessage('This is a simulated response. Replace this with actual AI responses from your backend.', 'ai');
        }, 1500);
    }

    // Add styles for messages and typing indicator
    const style = document.createElement('style');
    style.textContent = `
        .message {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-radius: 0.5rem;
            max-width: 80%;
        }

        .user-message {
            margin-left: auto;
            background: var(--primary-color);
            color: white;
        }

        .ai-message {
            margin-right: auto;
            background: var(--sidebar-bg);
        }

        .typing-indicator {
            margin-bottom: 1.5rem;
            padding: 1rem;
            display: flex;
            gap: 0.5rem;
        }

        .typing-indicator span {
            width: 0.5rem;
            height: 0.5rem;
            background: var(--border-color);
            border-radius: 50%;
            animation: typing 1s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-0.5rem); }
        }
    `;
    document.head.appendChild(style);
}); 
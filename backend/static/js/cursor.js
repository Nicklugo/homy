// Cursor AI-like Interface for HOMY
document.addEventListener('DOMContentLoaded', function() {
    // Mode switching functionality
    initModeSwitching();
    
    // Initialize context tools
    initContextTools();
    
    // Initialize message handling
    initMessageHandling();
    
    // Set up references system
    initReferences();
    
    // Initialize capability buttons
    initCapabilityButtons();

    // Initialize modal handlers
    initModalHandlers();

    // Initialize mode toggles
    const modeToggles = document.querySelectorAll('.mode-selector .mode-btn');
    const interactionModes = document.querySelectorAll('.interaction-modes .mode-btn');
    
    // Set initial active states
    modeToggles[0].classList.add('active');
    interactionModes[0].classList.add('active');
    
    // Handle mode toggle clicks
    modeToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            modeToggles.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update UI based on selected mode
            const isAgentMode = this.textContent.trim() === 'Agent Mode';
            document.querySelector('.interaction-modes').style.display = isAgentMode ? 'flex' : 'none';
            document.querySelector('.context-tools').style.display = isAgentMode ? 'flex' : 'none';
        });
    });
    
    // Handle interaction mode clicks
    interactionModes.forEach(mode => {
        mode.addEventListener('click', function() {
            interactionModes.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            // Update input placeholder based on selected mode
            const input = document.querySelector('.chat-input');
            const modeText = this.textContent.trim();
            switch(modeText) {
                case 'Questions':
                    input.placeholder = 'Ask a question about your home...';
                    break;
                case 'Management':
                    input.placeholder = 'Enter a management command...';
                    break;
                case 'Planning':
                    input.placeholder = 'Describe your planning needs...';
                    break;
            }
        });
    });
    
    // Handle context tool clicks
    const contextTools = document.querySelectorAll('.context-btn');
    contextTools.forEach(tool => {
        tool.addEventListener('click', function() {
            const toolName = this.querySelector('.context-text').textContent.trim();
            const input = document.querySelector('.chat-input');
            
            // Update input with context tool command
            input.value = `/${toolName.toLowerCase().replace(' ', '_')} `;
            input.focus();
        });
    });
});

// Initialize modal handlers
function initModalHandlers() {
    // Close buttons for modals
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            // Find the closest modal container
            const modal = this.closest('.modal-container');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-container')) {
            event.target.style.display = 'none';
        }
    });

    // Handle form submissions
    const webSearchForm = document.getElementById('web-search-form');
    if (webSearchForm) {
        webSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('web-search-input');
            if (searchInput && searchInput.value.trim()) {
                performWebSearch(searchInput.value.trim());
                closeModalById('web-search-modal');
            }
        });
    }

    const homeSettingsForm = document.getElementById('home-settings-form');
    if (homeSettingsForm) {
        homeSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle home settings save
            saveHomeSettings(this);
            closeModalById('home-settings-modal');
            addAIResponse("Your home settings have been updated. I'll use these preferences when providing recommendations and assistance.");
        });
    }
}

// Mode Switching
function initModeSwitching() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    const instructionContents = document.querySelectorAll('.instruction-content');
    
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update instruction content
            const mode = button.getAttribute('data-mode');
            instructionContents.forEach(content => {
                if (content.getAttribute('data-mode') === mode) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
            
            // Update chat container class for mode-specific styling
            const chatContainer = document.querySelector('.chat-container');
            chatContainer.className = 'chat-container';
            chatContainer.classList.add(`mode-${mode}`);
            
            // Store user preference
            localStorage.setItem('homy_preferred_mode', mode);
        });
    });
    
    // Set default mode from localStorage or default to 'chat'
    const savedMode = localStorage.getItem('homy_preferred_mode') || 'chat';
    const defaultModeButton = document.querySelector(`.mode-btn[data-mode="${savedMode}"]`);
    if (defaultModeButton) {
        defaultModeButton.click();
    } else {
        // Fallback to first button
        modeButtons[0]?.click();
    }
}

// Context Tools
function initContextTools() {
    // Add Context Button
    const addContextBtn = document.getElementById('addContextBtn');
    if (addContextBtn) {
        addContextBtn.addEventListener('click', () => {
            showContextModal();
        });
    }
    
    // Web Search Button
    const webSearchBtn = document.getElementById('searchWebBtn');
    if (webSearchBtn) {
        webSearchBtn.addEventListener('click', () => {
            showWebSearchModal();
        });
    }
    
    // Home Settings Button
    const homeSettingsBtn = document.getElementById('adjustHomeBtn');
    if (homeSettingsBtn) {
        homeSettingsBtn.addEventListener('click', () => {
            showHomeSettingsModal();
        });
    }
}

// Context Modal
function showContextModal() {
    showModalById('context-modal');
    
    // Set up context option clicks if not already done
    const contextOptions = document.querySelectorAll('#context-modal .context-option');
    contextOptions.forEach(option => {
        // Remove any existing click handlers first to prevent duplicates
        const clone = option.cloneNode(true);
        option.parentNode.replaceChild(clone, option);
        
        clone.addEventListener('click', () => {
            const contextType = clone.getAttribute('data-context-type');
            handleContextOptionSelected(contextType);
            closeModalById('context-modal');
        });
    });
}

function handleContextOptionSelected(contextType) {
    switch(contextType) {
        case 'inventory':
            showContextEntryForm('Inventory Status', 'List the items in your inventory including quantities and expiry dates...');
            break;
        case 'consumption':
            showContextEntryForm('Consumption Patterns', 'Describe your consumption patterns, including frequency and preferences...');
            break;
        case 'budget':
            showContextEntryForm('Budget Information', 'Enter your budget information, including limits for different categories...');
            break;
        case 'dietary':
            showContextEntryForm('Dietary Preferences', 'List any dietary preferences, restrictions, or allergies...');
            break;
        case 'orders':
            showContextEntryForm('Recent Orders', 'Enter details about your recent orders...');
            break;
        case 'meal-planning':
            showContextEntryForm('Meal Planning', 'Share your meal planning goals and constraints...');
            break;
        case 'file':
            showReferenceModal();
            break;
        case 'custom':
            showContextEntryForm('Custom Context', 'Enter any other relevant information...');
            break;
        default:
            showContextEntryForm('Custom Context', 'Enter any context information you would like to add...');
    }
}

function showContextEntryForm(title, placeholder) {
    const titleEl = document.getElementById('context-entry-title');
    const textarea = document.getElementById('context-entry-textarea');
    
    if (titleEl) titleEl.textContent = title;
    if (textarea) textarea.placeholder = placeholder;
    
    showModalById('context-entry-modal');
}

function submitContextEntry() {
    const textarea = document.getElementById('context-entry-textarea');
    const titleEl = document.getElementById('context-entry-title');
    
    if (textarea && textarea.value.trim() && titleEl) {
        addContextToChat(titleEl.textContent, textarea.value.trim());
        closeModalById('context-entry-modal');
        textarea.value = '';
    }
}

function addContextToChat(title, content) {
    // Create chat message that shows the context was added
    const messagesContainer = document.querySelector('.chat-messages');
    if (!messagesContainer) return;
    
    // Create context message element
    const contextMessage = document.createElement('div');
    contextMessage.className = 'message context-message';
    
    // Format current time
    const time = getCurrentTime();
    
    // Add content to message
    contextMessage.innerHTML = `
        <div class="message-header">
            <span class="message-sender">System</span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-content">
            <div class="context-card">
                <div class="context-card-header">
                    <i class="fas fa-info-circle"></i>
                    <span>${title}</span>
                </div>
                <div class="context-card-content">
                    ${content}
                </div>
            </div>
            <div class="context-added-status">
                <i class="fas fa-check-circle"></i> Context added successfully
            </div>
        </div>
    `;
    
    // Add to messages container
    messagesContainer.appendChild(contextMessage);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add AI response
    setTimeout(() => {
        addAIResponse(`I've added the ${title.toLowerCase()} to our conversation context. I'll use this information when responding to your questions.`);
    }, 500);
}

// Web Search Modal
function showWebSearchModal() {
    showModalById('web-search-modal');
    
    // Focus on search input
    setTimeout(() => {
        const searchInput = document.getElementById('web-search-input');
        if (searchInput) searchInput.focus();
    }, 100);
}

function performWebSearch(query) {
    // Add search query as user message
    sendMessage(`Search for: ${query}`);
    
    // Simulate web search results
    setTimeout(() => {
        const searchResults = [
            {
                title: "How to organize your pantry efficiently - Home Organization Guide",
                snippet: "Learn the best methods for organizing your pantry with these expert tips. Categorize items, use clear containers, and implement a first-in-first-out system...",
                url: "https://homeorganization.example.com/pantry-tips"
            },
            {
                title: "10 Meal Planning Apps That Make Dinner Easy - FoodTech Reviews",
                snippet: "These top meal planning apps help you create shopping lists, track inventory, and suggest recipes based on what you have on hand...",
                url: "https://foodtech.example.com/meal-planning-apps"
            },
            {
                title: "Smart Home Devices That Help Manage Groceries - Tech Review",
                snippet: "From refrigerators with inventory tracking to smart trash cans that can scan barcodes as you throw items away, these devices are changing how we manage food at home...",
                url: "https://techreview.example.com/smart-home-grocery"
            }
        ];
        
        // Create AI response with search results
        const aiResponse = addAIResponse("Here are the search results for your query:");
        
        // Add search results to message
        const messageContent = aiResponse.querySelector('.message-content');
        if (messageContent) {
            const resultsElement = document.createElement('div');
            resultsElement.className = 'search-results';
            
            searchResults.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.className = 'search-result';
                resultElement.innerHTML = `
                    <div class="search-result-title">
                        <a href="${result.url}" target="_blank">${result.title}</a>
                    </div>
                    <div class="search-result-snippet">${result.snippet}</div>
                    <div class="search-result-url">${result.url}</div>
                `;
                resultsElement.appendChild(resultElement);
            });
            
            messageContent.appendChild(resultsElement);
            
            // Add follow-up question
            const followUpElement = document.createElement('div');
            followUpElement.className = 'follow-up-question';
            followUpElement.innerHTML = 'Would you like me to summarize any of these results for you?';
            messageContent.appendChild(followUpElement);
        }
    }, 1500);
}

// Home Settings Modal
function showHomeSettingsModal() {
    showModalById('home-settings-modal');
    
    // Load current settings if available
    loadHomeSettings();
}

function loadHomeSettings() {
    // This is a placeholder function
    // In a real application, this would load settings from localStorage or fetch from a server
    console.log("Home settings loaded");
}

function saveHomeSettings(form) {
    // This is a placeholder function
    // In a real application, this would save settings to localStorage or send to a server
    console.log("Home settings saved");
}

// References System
function initReferences() {
    // Initialize reference modal
    const referenceModal = document.getElementById('reference-modal');
    if (referenceModal) {
        const closeBtn = referenceModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                referenceModal.style.display = 'none';
            });
        }
    }
}

function showReferenceModal() {
    showModalById('reference-modal');
    
    // Set up reference item clicks if not already done
    const referenceItems = document.querySelectorAll('#reference-modal .reference-item');
    referenceItems.forEach(item => {
        // Remove any existing click handlers first to prevent duplicates
        const clone = item.cloneNode(true);
        item.parentNode.replaceChild(clone, item);
        
        clone.addEventListener('click', () => {
            const refId = clone.getAttribute('data-ref-id');
            const refName = clone.querySelector('.reference-item-name').textContent;
            addReferenceToChat(refId, refName);
            closeModalById('reference-modal');
        });
    });
    
    // Focus on search input
    setTimeout(() => {
        const searchInput = document.getElementById('reference-search');
        if (searchInput) searchInput.focus();
    }, 100);
}

function filterReferenceResults(query) {
    // Placeholder for filtering references
    console.log('Filtering references by:', query);
}

function addReferenceToChat(refId, refName) {
    // Create a message showing that a reference was added
    const messagesContainer = document.querySelector('.chat-messages');
    if (!messagesContainer) return;
    
    // Create reference message element
    const referenceMessage = document.createElement('div');
    referenceMessage.className = 'message reference-message';
    
    // Format current time
    const time = getCurrentTime();
    
    // Add content to message
    referenceMessage.innerHTML = `
        <div class="message-header">
            <span class="message-sender">System</span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-content">
            <div class="reference-card">
                <div class="reference-card-header">
                    <i class="fas fa-file-alt"></i>
                    <span>${refName}</span>
                </div>
                <div class="reference-card-content">
                    Reference ID: ${refId}
                </div>
            </div>
            <div class="reference-added-status">
                <i class="fas fa-check-circle"></i> Reference added to conversation
            </div>
        </div>
    `;
    
    // Add to messages container
    messagesContainer.appendChild(referenceMessage);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add AI response
    setTimeout(() => {
        addAIResponse(`I've added the reference "${refName}" to our conversation. I'll consider the information in this document when assisting you.`);
    }, 500);
}

// Message Handling
function initMessageHandling() {
    const chatForm = document.getElementById('chat-form');
    const textArea = document.getElementById('user-input');
    
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (textArea && textArea.value.trim()) {
                sendMessage(textArea.value.trim());
                textArea.value = '';
                // Reset height after sending
                textArea.style.height = 'auto';
            }
        });
    }
    
    // Auto-resize textarea
    if (textArea) {
        // Initialize height
        textArea.style.height = 'auto';
        
        textArea.addEventListener('input', function() {
            // Reset height temporarily to get the correct scrollHeight
            this.style.height = 'auto';
            
            // Set new height
            const newHeight = Math.min(this.scrollHeight, 150);
            this.style.height = newHeight + 'px';
        });
        
        // Handle Enter key to submit (Shift+Enter for new line)
        textArea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
        
        // Focus textarea on page load
        setTimeout(() => {
            textArea.focus();
        }, 100);
    }
}

function sendMessage(message) {
    // Add user message to chat
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    
    userMessage.innerHTML = `
        <div class="message-header">
            <div class="message-user">You</div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    // Add to chat container
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        chatMessages.appendChild(userMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Process any references attached
    const referenceContainer = document.querySelector('.reference-pill-container');
    const references = referenceContainer ? Array.from(referenceContainer.children).map(pill => {
        return pill.querySelector('.reference-pill-text').textContent;
    }) : [];
    
    // Clear references after sending
    if (referenceContainer) {
        referenceContainer.innerHTML = '';
    }
    
    // Get current mode
    const activeMode = document.querySelector('.mode-btn.active')?.getAttribute('data-mode') || 'chat';
    
    // Process message based on mode
    switch(activeMode) {
        case 'chat':
            handleChatMessage(message, references);
            break;
        case 'compose':
            handleComposeMessage(message, references);
            break;
        case 'terminal':
            handleTerminalMessage(message, references);
            break;
        default:
            handleChatMessage(message, references);
    }
}

function handleChatMessage(message, references) {
    // Show thinking message
    const thinkingMessage = addAIResponse('Thinking...', true);
    thinkingMessage.querySelector('.message-content').innerHTML += `
        <div class="status-badge status-thinking">Thinking</div>
    `;
    
    // Simulate AI processing time
    setTimeout(() => {
        // Remove thinking message
        thinkingMessage.remove();
        
        // Generate response based on user input
        let responseText = '';
        
        if (message.toLowerCase().includes('inventory') || message.toLowerCase().includes('stock')) {
            responseText = "I can help you manage your inventory. Would you like me to check your current pantry status, suggest restocking items, or help you organize your household supplies?";
        } else if (message.toLowerCase().includes('meal') || message.toLowerCase().includes('recipe')) {
            responseText = "I'd be happy to help with meal planning. Based on your current inventory, I can suggest recipes that use what you have on hand, or create a shopping list for specific meals.";
        } else if (message.toLowerCase().includes('budget') || message.toLowerCase().includes('spending')) {
            responseText = "Let's look at your household budget. I can show you spending patterns on household goods, identify opportunities for savings, or help plan upcoming purchases.";
        } else if (message.toLowerCase().includes('order') || message.toLowerCase().includes('delivery')) {
            responseText = "I'll help you manage your orders. I can track existing orders, suggest items to reorder based on your consumption patterns, or help you schedule regular deliveries.";
        } else {
            responseText = "I'm your household operations manager, HOMY. I can help you track inventory, plan meals, manage your budget, and organize your household supplies. What would you like assistance with today?";
        }
        
        // Include reference acknowledgment if needed
        if (references.length > 0) {
            responseText += `\n\nI've noted your reference to ${references.join(', ')} and will incorporate this information in my assistance.`;
        }
        
        // Add the response
        addAIResponse(responseText);
    }, 1500);
}

function handleComposeMessage(message, references) {
    // Show thinking message
    const thinkingMessage = addAIResponse('Composing...', true);
    thinkingMessage.querySelector('.message-content').innerHTML += `
        <div class="status-badge status-thinking">Composing</div>
    `;
    
    // Simulate AI processing time
    setTimeout(() => {
        // Remove thinking message
        thinkingMessage.remove();
        
        // Add AI response with proposal
        const aiResponse = addAIResponse("I've composed a draft based on your request.");
        aiResponse.classList.add('with-proposal');
        
        // Add proposal badge
        const badge = document.createElement('div');
        badge.className = 'proposal-badge';
        badge.textContent = 'Proposal';
        aiResponse.appendChild(badge);
        
        // Add proposal preview
        const messageContent = aiResponse.querySelector('.message-content');
        if (messageContent) {
            // Generate proposal based on user input
            let proposalContent = '';
            
            if (message.toLowerCase().includes('shopping list')) {
                proposalContent = "Weekly Shopping List:\n\n1. Fresh produce (apples, spinach, carrots)\n2. Dairy (milk, yogurt, cheese)\n3. Pantry staples (rice, pasta, oats)\n4. Cleaning supplies (dish soap, laundry detergent)\n5. Personal care items (shampoo, toothpaste)";
            } else if (message.toLowerCase().includes('meal plan')) {
                proposalContent = "Weekly Meal Plan:\n\nMonday: Vegetable stir-fry with rice\nTuesday: Pasta with tomato sauce and salad\nWednesday: Grilled chicken with roasted vegetables\nThursday: Bean and vegetable soup\nFriday: Homemade pizza night\nSaturday: Leftover buffet\nSunday: Slow cooker stew";
            } else if (message.toLowerCase().includes('inventory')) {
                proposalContent = "Inventory Report - Low Stock Items:\n\n1. Paper towels (1 roll remaining)\n2. Laundry detergent (25% remaining)\n3. Coffee beans (30% remaining)\n4. Rice (20% remaining)\n5. Dish soap (15% remaining)";
            } else {
                proposalContent = "Household Task Schedule:\n\nMonday: Clean kitchen, restock pantry\nTuesday: Laundry, check cleaning supplies\nWednesday: Meal prep, organize refrigerator\nThursday: Clean bathrooms, check personal care items\nFriday: Quick tidy, prepare shopping list\nSaturday: Main shopping, weekly inventory\nSunday: Meal planning for upcoming week";
            }
            
            messageContent.innerHTML += `
                <div class="proposal-preview">
                    <div class="proposal-preview-header">Proposal Draft</div>
                    <div class="proposal-preview-content">${proposalContent}</div>
                </div>
                <div class="proposal-actions-inline">
                    <button class="proposal-btn reject-btn">Reject</button>
                    <button class="proposal-btn modify-btn">Modify</button>
                    <button class="proposal-btn accept-btn">Accept</button>
                </div>
            `;
            
            // Add event listeners for buttons
            const rejectBtn = messageContent.querySelector('.reject-btn');
            const modifyBtn = messageContent.querySelector('.modify-btn');
            const acceptBtn = messageContent.querySelector('.accept-btn');
            
            if (rejectBtn) {
                rejectBtn.addEventListener('click', () => {
                    addAIResponse("I understand this proposal doesn't meet your needs. Would you like me to create a new draft with different information or formatting?");
                });
            }
            
            if (modifyBtn) {
                modifyBtn.addEventListener('click', () => {
                    showProposalModificationModal(proposalContent);
                });
            }
            
            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    addAIResponse("Great! I've saved this to your documents. You can access it anytime from the Documents section of the app.");
                });
            }
        }
    }, 2000);
}

function showProposalModificationModal(content) {
    const textarea = document.getElementById('proposal-textarea');
    if (textarea) textarea.value = content;
    
    showModalById('proposal-modification-modal');
}

function saveProposalModification() {
    const textarea = document.getElementById('proposal-textarea');
    if (textarea && textarea.value.trim()) {
        closeModalById('proposal-modification-modal');
        addAIResponse("I've updated the proposal with your modifications and saved it to your documents.");
    }
}

// Helper Functions
function addAIResponse(message, isTemporary = false) {
    const aiMessage = document.createElement('div');
    aiMessage.className = 'message ai-message';
    
    aiMessage.innerHTML = `
        <div class="message-header">
            <div class="message-user">HOMY</div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    // Add to chat container
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        chatMessages.appendChild(aiMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    return aiMessage;
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Helper functions for modal handling
function showModalById(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModalById(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function closeContextModal() {
    closeModalById('context-modal');
}

function closeContextEntryModal() {
    closeModalById('context-entry-modal');
}

function closeWebSearchModal() {
    closeModalById('web-search-modal');
}

function closeHomeSettingsModal() {
    closeModalById('home-settings-modal');
}

function closeReferenceModal() {
    closeModalById('reference-modal');
}

function closeProposalModal() {
    closeModalById('proposal-modification-modal');
}

// Initialize capability buttons
function initCapabilityButtons() {
    const inventoryBtn = document.getElementById('inventory-capability');
    const webSearchBtn = document.getElementById('search-capability');
    const consumptionBtn = document.getElementById('consumption-capability');
    const homeSettingsBtn = document.getElementById('settings-capability');
    const mealPlanBtn = document.getElementById('meal-capability');
    const budgetBtn = document.getElementById('budget-capability');
    const ordersBtn = document.getElementById('orders-capability');
    const referenceBtn = document.getElementById('reference-capability');
    
    if (inventoryBtn) {
        inventoryBtn.addEventListener('click', function() {
            showContextModal();
            hideWelcomeMessage();
        });
    }
    
    if (webSearchBtn) {
        webSearchBtn.addEventListener('click', function() {
            showWebSearchModal();
            hideWelcomeMessage();
        });
    }
    
    if (consumptionBtn) {
        consumptionBtn.addEventListener('click', function() {
            const contextTitle = "Consumption Patterns";
            showContextEntryForm(contextTitle, "Enter details about your consumption patterns...");
            hideWelcomeMessage();
        });
    }
    
    if (homeSettingsBtn) {
        homeSettingsBtn.addEventListener('click', function() {
            showHomeSettingsModal();
            hideWelcomeMessage();
        });
    }
    
    if (mealPlanBtn) {
        mealPlanBtn.addEventListener('click', function() {
            sendChatbotMessage("I'd like help with meal planning based on my inventory, preferences, and schedule.");
            hideWelcomeMessage();
        });
    }
    
    if (budgetBtn) {
        budgetBtn.addEventListener('click', function() {
            sendChatbotMessage("I need help with budget management for household expenses.");
            hideWelcomeMessage();
        });
    }
    
    if (ordersBtn) {
        ordersBtn.addEventListener('click', function() {
            sendChatbotMessage("Show me my recent orders and help me track deliveries.");
            hideWelcomeMessage();
        });
    }
    
    if (referenceBtn) {
        referenceBtn.addEventListener('click', function() {
            showReferenceModal();
            hideWelcomeMessage();
        });
    }
}

// Helper function to hide welcome message
function hideWelcomeMessage() {
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        // Fade out animation
        welcomeMsg.style.opacity = '0';
        welcomeMsg.style.transition = 'opacity 0.3s ease';
        
        // After animation completes, hide and create chat container
        setTimeout(() => {
            welcomeMsg.style.display = 'none';
            
            // Ensure the chat-messages container exists
            const messagesContainer = document.querySelector('.messages-container');
            if (messagesContainer && !messagesContainer.querySelector('.chat-messages')) {
                const chatMessages = document.createElement('div');
                chatMessages.className = 'chat-messages';
                messagesContainer.appendChild(chatMessages);
                
                // Scroll to bottom to ensure we see the newest content
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            
            // Focus the input field
            const userInput = document.getElementById('user-input');
            if (userInput) {
                userInput.focus();
            }
        }, 300);
    }
}

// Helper function to send a message as if from the chatbot
function sendChatbotMessage(message) {
    // Add user message first
    sendMessage(message);
    
    // Then add AI response
    setTimeout(() => {
        addAIResponse("I'll help you with that. Let me gather the necessary information...");
    }, 500);
} 
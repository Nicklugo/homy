document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard components
    initQuickActions();
    initTaskCheckboxes();
    initStatCards();
    
    // Initialize receipt scanning functionality
    initReceiptScanning();
    
    // Initialize takeout tracking
    initTakeoutTracking();
    
    // Simulate real-time updates for demo purposes
    simulateInventoryUpdates();
});

// Initialize quick action buttons
function initQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const actionType = button.querySelector('span:last-child').textContent;
            
            // Skip if this is the take-out button (handled separately)
            if (actionType === 'Take-Out') {
                return;
            }
            
            // Handle scan receipt button
            if (actionType === 'Scan Receipt') {
                handleScanReceipt();
                return;
            }
            
            // Show feedback that the action was triggered
            const originalText = button.innerHTML;
            button.innerHTML = `<span class="action-icon">✓</span><span>Loading...</span>`;
            
            // Simulate action processing
            setTimeout(() => {
                button.innerHTML = originalText;
                
                // Show notification
                showNotification(`${actionType} module loaded successfully!`);
                
                // Handle specific actions
                if (actionType === 'Inventory') {
                    showInventoryView();
                } else if (actionType === 'Meal Plan') {
                    showMealPlanningView();
                }
            }, 1000);
        });
    });
}

// Handle scan receipt button click
function handleScanReceipt() {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'environment'; // Use camera on mobile devices
    
    // Trigger file selection
    fileInput.click();
    
    // Handle file selection
    fileInput.addEventListener('change', (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            
            // Show loading notification
            showNotification('Processing receipt...');
            
            // Simulate receipt processing
            setTimeout(() => {
                processReceipt(file);
            }, 2000);
        }
    });
}

// Initialize receipt scanning functionality
function initReceiptScanning() {
    // This function is now simplified since we're handling the scan receipt button in initQuickActions
    // We keep it for backward compatibility
}

// Process receipt image (simulated)
function processReceipt(file) {
    // In a real app, this would use OCR to extract items from the receipt
    // For demo purposes, we'll simulate the extraction
    
    // Simulated receipt items
    const receiptItems = [
        { name: 'Milk', price: 3.99, category: 'Pantry', expiryDays: 7 },
        { name: 'Bread', price: 2.49, category: 'Pantry', expiryDays: 5 },
        { name: 'Eggs', price: 4.99, category: 'Pantry', expiryDays: 14 },
        { name: 'Paper Towels', price: 8.99, category: 'Household', expiryDays: null },
        { name: 'Dish Soap', price: 3.49, category: 'Household', expiryDays: null }
    ];
    
    // Display the unfiltered items
    displayUnfilteredItems(receiptItems);
    
    // Update pantry and household supplies percentages
    updateInventoryPercentages(receiptItems);
    
    // Show success notification
    showNotification('Receipt processed successfully! Please categorize the items.');
}

// Display unfiltered items from receipt
function displayUnfilteredItems(items) {
    const unfilteredContainer = document.querySelector('.unfiltered-items');
    
    // Clear empty state message
    unfilteredContainer.innerHTML = '';
    
    // Create item elements
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'unfiltered-item';
        
        // Calculate expiry date if applicable
        let expiryInfo = '';
        if (item.expiryDays) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + item.expiryDays);
            const formattedDate = expiryDate.toLocaleDateString();
            expiryInfo = `<span class="expiry-date">Expires: ${formattedDate}</span>`;
        }
        
        itemElement.innerHTML = `
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-price">$${item.price.toFixed(2)}</span>
                ${expiryInfo}
            </div>
            <div class="item-actions">
                <button class="category-btn" data-category="Pantry">Pantry</button>
                <button class="category-btn" data-category="Household">Household</button>
            </div>
        `;
        
        unfilteredContainer.appendChild(itemElement);
    });
    
    // Add event listeners to category buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            const itemElement = e.target.closest('.unfiltered-item');
            const itemName = itemElement.querySelector('.item-name').textContent;
            
            // Add to appropriate category
            addItemToCategory(itemName, category);
            
            // Remove from unfiltered list
            itemElement.style.opacity = '0';
            setTimeout(() => {
                itemElement.remove();
                
                // Check if all items are categorized
                if (document.querySelectorAll('.unfiltered-item').length === 0) {
                    unfilteredContainer.innerHTML = '<p class="empty-state">All items categorized!</p>';
                }
            }, 300);
        });
    });
}

// Add item to appropriate category
function addItemToCategory(itemName, category) {
    // Update the appropriate stat card
    const statCard = category === 'Pantry' 
        ? document.querySelector('.stat-card:nth-child(2) .stat-info p')
        : document.querySelector('.stat-card:nth-child(3) .stat-info p');
    
    // Get current percentage
    const currentPercentage = parseInt(statCard.textContent);
    
    // Increase by a random amount between 5-15%
    const increase = Math.floor(Math.random() * 10) + 5;
    const newPercentage = Math.min(100, currentPercentage + increase);
    
    // Update the display
    statCard.textContent = `${newPercentage}% stocked`;
    
    // Show notification
    showNotification(`${itemName} added to ${category}`);
}

// Update inventory percentages based on scanned items
function updateInventoryPercentages(items) {
    // Count items by category
    const pantryItems = items.filter(item => item.category === 'Pantry').length;
    const householdItems = items.filter(item => item.category === 'Household').length;
    
    // Update stat cards (in a real app, this would be based on actual inventory)
    if (pantryItems > 0) {
        const pantryCard = document.querySelector('.stat-card:nth-child(2) .stat-info p');
        pantryCard.textContent = `${Math.min(100, pantryItems * 10)}% stocked`;
    }
    
    if (householdItems > 0) {
        const householdCard = document.querySelector('.stat-card:nth-child(3) .stat-info p');
        householdCard.textContent = `${Math.min(100, householdItems * 10)}% stocked`;
    }
}

// Initialize takeout tracking
function initTakeoutTracking() {
    // Find the Take-Out button (second button in the grid)
    const takeoutButton = document.querySelector('.actions-grid .action-btn:nth-child(2)');
    
    if (takeoutButton) {
        takeoutButton.addEventListener('click', () => {
            showTakeoutForm();
        });
    }
}

// Show takeout tracking form
function showTakeoutForm() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Track Takeout Meal</h2>
            <form id="takeout-form">
                <div class="form-group">
                    <label for="restaurant">Restaurant</label>
                    <input type="text" id="restaurant" placeholder="Restaurant name">
                </div>
                <div class="form-group">
                    <label for="meal">Meal Description</label>
                    <input type="text" id="meal" placeholder="What did you order?">
                </div>
                <div class="form-group">
                    <label for="cost">Total Cost</label>
                    <input type="number" id="cost" placeholder="0.00" step="0.01">
                </div>
                <div class="form-group checkbox">
                    <input type="checkbox" id="leftovers">
                    <label for="leftovers">I have leftovers</label>
                </div>
                <div class="form-group leftovers-group" style="display: none;">
                    <label for="leftover-portions">Number of Leftover Portions</label>
                    <input type="number" id="leftover-portions" value="1" min="1">
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Save Takeout</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle leftovers checkbox
    const leftoversCheckbox = document.getElementById('leftovers');
    const leftoversGroup = document.querySelector('.leftovers-group');
    
    leftoversCheckbox.addEventListener('change', () => {
        leftoversGroup.style.display = leftoversCheckbox.checked ? 'block' : 'none';
    });
    
    // Handle cancel button
    const cancelButton = modal.querySelector('.cancel-btn');
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Handle form submission
    const form = document.getElementById('takeout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const restaurant = document.getElementById('restaurant').value;
        const meal = document.getElementById('meal').value;
        const cost = document.getElementById('cost').value;
        const hasLeftovers = document.getElementById('leftovers').checked;
        const leftoverPortions = hasLeftovers ? document.getElementById('leftover-portions').value : 0;
        
        // Process takeout data
        processTakeoutData(restaurant, meal, cost, hasLeftovers, leftoverPortions);
        
        // Close modal
        document.body.removeChild(modal);
    });
}

// Process takeout data
function processTakeoutData(restaurant, meal, cost, hasLeftovers, leftoverPortions) {
    // If there are leftovers, add to tracking
    if (hasLeftovers) {
        // Add a reminder to consume leftovers
        const tasksList = document.querySelector('.tasks-list');
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        
        const taskId = 'leftover-' + Date.now();
        taskItem.innerHTML = `
            <input type="checkbox" id="${taskId}">
            <label for="${taskId}">Consume leftovers from ${restaurant}</label>
            <span class="task-date">Within 3 days</span>
        `;
        
        tasksList.prepend(taskItem);
        
        // Add event listener to the new checkbox
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            const taskLabel = checkbox.nextElementSibling;
            
            if (checkbox.checked) {
                taskLabel.style.textDecoration = 'line-through';
                taskLabel.style.opacity = '0.6';
                
                // Simulate task completion
                setTimeout(() => {
                    taskItem.style.opacity = '0';
                    setTimeout(() => {
                        taskItem.remove();
                        showNotification('Leftovers consumed!');
                    }, 300);
                }, 1000);
            }
        });
    }
    
    // Update budget
    const budgetCard = document.querySelector('.stat-card:nth-child(4) .stat-info p');
    const currentBudget = parseFloat(budgetCard.textContent.replace('$', '').replace(' remaining', ''));
    const newBudget = Math.max(0, currentBudget - parseFloat(cost)).toFixed(2);
    budgetCard.textContent = `$${newBudget} remaining`;
    
    // Show notification
    showNotification('Takeout meal tracked successfully!');
}

// Show inventory view
function showInventoryView() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content inventory-modal">
            <div class="inventory-header">
                <h2>Household Inventory</h2>
                <button class="add-item-btn" id="add-manual-item">
                    <span class="add-icon">+</span>
                    <span>Add Item</span>
                </button>
            </div>
            <div class="inventory-tabs">
                <button class="tab-btn active" data-tab="pantry">Pantry Items</button>
                <button class="tab-btn" data-tab="household">Household Supplies</button>
                <button class="tab-btn" data-tab="unfiltered">Unfiltered Items</button>
            </div>
            <div class="inventory-content">
                <div class="tab-content active" id="pantry-content">
                    <div class="inventory-list" id="pantry-list">
                        <div class="empty-inventory">
                            <p>No pantry items yet. Scan a receipt or add items manually.</p>
                        </div>
                    </div>
                </div>
                <div class="tab-content" id="household-content">
                    <div class="inventory-list" id="household-list">
                        <div class="empty-inventory">
                            <p>No household supplies yet. Scan a receipt or add items manually.</p>
                        </div>
                    </div>
                </div>
                <div class="tab-content" id="unfiltered-content">
                    <div class="inventory-list" id="unfiltered-list">
                        <div class="empty-inventory">
                            <p>No unfiltered items. Scan a receipt to add items.</p>
                        </div>
                    </div>
                </div>
            </div>
            <button class="close-modal">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load inventory data
    loadInventoryData();
    
    // Handle tab switching
    const tabButtons = modal.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            modal.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.dataset.tab + '-content';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Handle add item button
    const addItemBtn = document.getElementById('add-manual-item');
    addItemBtn.addEventListener('click', () => {
        showAddItemForm();
    });
    
    // Handle close button
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Load inventory data from localStorage
function loadInventoryData() {
    // Get inventory data from localStorage
    const inventory = JSON.parse(localStorage.getItem('inventory')) || {
        pantry: [],
        household: [],
        unfiltered: []
    };
    
    // Display pantry items
    const pantryList = document.getElementById('pantry-list');
    if (inventory.pantry.length > 0) {
        pantryList.innerHTML = '';
        inventory.pantry.forEach((item, index) => {
            const itemElement = createInventoryItemElement(item, 'pantry', index);
            pantryList.appendChild(itemElement);
        });
    }
    
    // Display household items
    const householdList = document.getElementById('household-list');
    if (inventory.household.length > 0) {
        householdList.innerHTML = '';
        inventory.household.forEach((item, index) => {
            const itemElement = createInventoryItemElement(item, 'household', index);
            householdList.appendChild(itemElement);
        });
    }
    
    // Display unfiltered items
    const unfilteredList = document.getElementById('unfiltered-list');
    if (inventory.unfiltered.length > 0) {
        unfilteredList.innerHTML = '';
        inventory.unfiltered.forEach((item, index) => {
            const itemElement = createUnfilteredItemElement(item, index);
            unfilteredList.appendChild(itemElement);
        });
    }
    
    // Update inventory stats
    updateInventoryStats(inventory);
}

// Create inventory item element
function createInventoryItemElement(item, category, index) {
    const itemElement = document.createElement('div');
    itemElement.className = 'inventory-item';
    
    // Calculate expiry date if applicable
    let expiryInfo = '';
    if (item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        let expiryClass = 'normal';
        if (daysUntilExpiry <= 3) {
            expiryClass = 'urgent';
        } else if (daysUntilExpiry <= 7) {
            expiryClass = 'warning';
        }
        
        expiryInfo = `<span class="expiry-date ${expiryClass}">Expires in ${daysUntilExpiry} days</span>`;
    }
    
    itemElement.innerHTML = `
        <div class="item-details">
            <span class="item-name">${item.name}</span>
            <span class="item-price">$${item.price.toFixed(2)}</span>
            ${expiryInfo}
        </div>
        <div class="item-actions">
            <button class="delete-item-btn" data-category="${category}" data-index="${index}">
                <span class="delete-icon">🗑️</span>
            </button>
        </div>
    `;
    
    // Add event listener to delete button
    itemElement.querySelector('.delete-item-btn').addEventListener('click', (e) => {
        const category = e.target.closest('.delete-item-btn').dataset.category;
        const index = parseInt(e.target.closest('.delete-item-btn').dataset.index);
        deleteInventoryItem(category, index);
    });
    
    return itemElement;
}

// Create unfiltered item element
function createUnfilteredItemElement(item, index) {
    const itemElement = document.createElement('div');
    itemElement.className = 'inventory-item unfiltered-item';
    
    // Calculate expiry date if applicable
    let expiryInfo = '';
    if (item.expiryDays) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + item.expiryDays);
        const formattedDate = expiryDate.toLocaleDateString();
        expiryInfo = `<span class="expiry-date">Expires: ${formattedDate}</span>`;
    }
    
    itemElement.innerHTML = `
        <div class="item-details">
            <span class="item-name">${item.name}</span>
            <span class="item-price">$${item.price.toFixed(2)}</span>
            ${expiryInfo}
        </div>
        <div class="item-actions">
            <button class="category-btn" data-category="pantry" data-index="${index}">Pantry</button>
            <button class="category-btn" data-category="household" data-index="${index}">Household</button>
        </div>
    `;
    
    // Add event listeners to category buttons
    itemElement.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            const index = parseInt(e.target.dataset.index);
            categorizeInventoryItem(index, category);
        });
    });
    
    return itemElement;
}

// Delete inventory item
function deleteInventoryItem(category, index) {
    // Get inventory data from localStorage
    const inventory = JSON.parse(localStorage.getItem('inventory')) || {
        pantry: [],
        household: [],
        unfiltered: []
    };
    
    // Remove item from inventory
    inventory[category].splice(index, 1);
    
    // Save updated inventory to localStorage
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    // Reload inventory data
    loadInventoryData();
}

// Categorize inventory item
function categorizeInventoryItem(index, category) {
    // Get inventory data from localStorage
    const inventory = JSON.parse(localStorage.getItem('inventory')) || {
        pantry: [],
        household: [],
        unfiltered: []
    };
    
    // Get item from unfiltered list
    const item = inventory.unfiltered[index];
    
    // Add item to appropriate category
    inventory[category].push(item);
    
    // Remove item from unfiltered list
    inventory.unfiltered.splice(index, 1);
    
    // Save updated inventory to localStorage
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    // Reload inventory data
    loadInventoryData();
    
    // Update stats
    updateInventoryStats(inventory);
}

// Update inventory stats
function updateInventoryStats(inventory) {
    // Update pantry status
    const pantryCard = document.querySelector('.stat-card:nth-child(2) .stat-info p');
    const pantryPercentage = inventory.pantry.length > 0 ? Math.min(100, inventory.pantry.length * 10) : 0;
    pantryCard.textContent = `${pantryPercentage}% stocked`;
    
    // Update household supplies status
    const householdCard = document.querySelector('.stat-card:nth-child(3) .stat-info p');
    const householdPercentage = inventory.household.length > 0 ? Math.min(100, inventory.household.length * 10) : 0;
    householdCard.textContent = `${householdPercentage}% stocked`;
}

// Show add item form
function showAddItemForm() {
    // Create form modal
    const formModal = document.createElement('div');
    formModal.className = 'add-item-modal';
    
    formModal.innerHTML = `
        <div class="add-item-content">
            <h3>Add New Item</h3>
            <form id="add-item-form">
                <div class="form-group">
                    <label for="item-name">Item Name</label>
                    <input type="text" id="item-name" placeholder="e.g., Milk, Paper Towels" required>
                </div>
                <div class="form-group">
                    <label for="item-price">Price</label>
                    <input type="number" id="item-price" placeholder="0.00" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <label for="item-category">Category</label>
                    <select id="item-category" required>
                        <option value="">Select a category</option>
                        <option value="pantry">Pantry</option>
                        <option value="household">Household</option>
                        <option value="unfiltered">Unfiltered</option>
                    </select>
                </div>
                <div class="form-group expiry-group">
                    <label for="has-expiry">Has Expiration Date</label>
                    <input type="checkbox" id="has-expiry">
                </div>
                <div class="form-group expiry-date-group" style="display: none;">
                    <label for="expiry-date">Expiration Date</label>
                    <input type="date" id="expiry-date">
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-add-btn">Cancel</button>
                    <button type="submit" class="save-add-btn">Add Item</button>
                </div>
            </form>
        </div>
    `;
    
    // Append to the inventory modal
    document.querySelector('.inventory-modal').appendChild(formModal);
    
    // Handle expiry checkbox
    const hasExpiryCheckbox = document.getElementById('has-expiry');
    const expiryDateGroup = document.querySelector('.expiry-date-group');
    
    hasExpiryCheckbox.addEventListener('change', () => {
        expiryDateGroup.style.display = hasExpiryCheckbox.checked ? 'block' : 'none';
    });
    
    // Set default expiry date to 7 days from now
    const expiryDateInput = document.getElementById('expiry-date');
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    expiryDateInput.valueAsDate = defaultDate;
    
    // Handle form submission
    const addItemForm = document.getElementById('add-item-form');
    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('item-name').value;
        const price = parseFloat(document.getElementById('item-price').value);
        const category = document.getElementById('item-category').value;
        const hasExpiry = document.getElementById('has-expiry').checked;
        const expiryDate = hasExpiry ? document.getElementById('expiry-date').value : null;
        
        // Create new item
        const newItem = {
            name,
            price,
            expiryDate
        };
        
        // Add item to inventory
        addItemToInventory(newItem, category);
        
        // Close form modal
        document.querySelector('.add-item-modal').remove();
    });
    
    // Handle cancel button
    const cancelButton = document.querySelector('.cancel-add-btn');
    cancelButton.addEventListener('click', () => {
        document.querySelector('.add-item-modal').remove();
    });
}

// Add item to inventory
function addItemToInventory(item, category) {
    // Get inventory data from localStorage
    const inventory = JSON.parse(localStorage.getItem('inventory')) || {
        pantry: [],
        household: [],
        unfiltered: []
    };
    
    // Add item to appropriate category
    inventory[category].push(item);
    
    // Save updated inventory to localStorage
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    // Reload inventory data
    loadInventoryData();
}

// Show meal planning view
function showMealPlanningView() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content meal-plan-modal">
            <div class="meal-plan-header">
                <h2>Meal Planning</h2>
                <button class="preferences-btn" id="diet-preferences-btn">
                    <span class="pref-icon">⚙️</span>
                    <span>Preferences</span>
                </button>
            </div>
            <div class="meal-plan-options">
                <button class="meal-option" id="expiring-items">
                    <span class="option-icon">⏱️</span>
                    <span class="option-text">Create meal from expiring items</span>
                </button>
                <button class="meal-option" id="available-items">
                    <span class="option-icon">🍽️</span>
                    <span class="option-text">Create meal from available items</span>
                </button>
                <button class="meal-option" id="weekly-plan">
                    <span class="option-icon">📅</span>
                    <span class="option-text">Create weekly meal plan</span>
                </button>
            </div>
            <div class="meal-plan-result" style="display: none;">
                <h3>Suggested Meal</h3>
                <div class="meal-details"></div>
            </div>
            <button class="close-modal">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle meal option buttons
    const expiringItemsBtn = document.getElementById('expiring-items');
    const availableItemsBtn = document.getElementById('available-items');
    const weeklyPlanBtn = document.getElementById('weekly-plan');
    const preferencesBtn = document.getElementById('diet-preferences-btn');
    
    expiringItemsBtn.addEventListener('click', () => {
        showMealSuggestion('expiring');
    });
    
    availableItemsBtn.addEventListener('click', () => {
        showMealSuggestion('available');
    });
    
    weeklyPlanBtn.addEventListener('click', () => {
        showMealSuggestion('weekly');
    });
    
    preferencesBtn.addEventListener('click', () => {
        showDietPreferencesForm();
    });
    
    // Handle close button
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Show meal suggestion based on option
function showMealSuggestion(type) {
    const resultSection = document.querySelector('.meal-plan-result');
    const mealDetails = document.querySelector('.meal-details');
    
    // Show loading state
    resultSection.style.display = 'block';
    mealDetails.innerHTML = '<p>Generating meal suggestions...</p>';
    
    // Simulate API call to get meal suggestions
    setTimeout(() => {
        let mealHTML = '';
        
        if (type === 'expiring') {
            mealHTML = `
                <h4>Quick Pasta with Expiring Ingredients</h4>
                <p><strong>Using items expiring soon:</strong> Tomatoes, Spinach, Cheese</p>
                <p><strong>Additional ingredients needed:</strong> Pasta, Olive Oil, Garlic</p>
                <p>This simple pasta dish uses your expiring ingredients and can be prepared in under 30 minutes.</p>
                <button class="save-meal-btn">Save to Meal Plan</button>
            `;
        } else if (type === 'available') {
            mealHTML = `
                <h4>Pantry Staple Stir Fry</h4>
                <p><strong>Using available items:</strong> Rice, Frozen Vegetables, Soy Sauce</p>
                <p><strong>Additional ingredients needed:</strong> None</p>
                <p>A quick and easy stir fry using items you already have in your pantry.</p>
                <button class="save-meal-btn">Save to Meal Plan</button>
            `;
        } else if (type === 'weekly') {
            mealHTML = `
                <h4>Weekly Meal Plan Generated</h4>
                <p>Monday: Pasta with Tomato Sauce</p>
                <p>Tuesday: Rice and Bean Bowl</p>
                <p>Wednesday: Vegetable Stir Fry</p>
                <p>Thursday: Leftover Remix</p>
                <p>Friday: Homemade Pizza Night</p>
                <p>Weekend: Flexible Options</p>
                <button class="save-meal-btn">Save Weekly Plan</button>
            `;
        }
        
        mealDetails.innerHTML = mealHTML;
        
        // Handle save button
        const saveButton = mealDetails.querySelector('.save-meal-btn');
        saveButton.addEventListener('click', () => {
            showNotification('Meal plan saved successfully!');
        });
    }, 1500);
}

// Show diet preferences form
function showDietPreferencesForm() {
    // Create preferences modal
    const preferencesModal = document.createElement('div');
    preferencesModal.className = 'preferences-modal';
    
    // Get saved preferences from localStorage
    const savedPreferences = JSON.parse(localStorage.getItem('dietPreferences')) || {
        allergies: [],
        dietType: '',
        avoidIngredients: []
    };
    
    // Create allergies string
    const allergiesStr = savedPreferences.allergies.join(', ');
    const avoidIngredientsStr = savedPreferences.avoidIngredients.join(', ');
    
    preferencesModal.innerHTML = `
        <div class="preferences-content">
            <h3>Dietary Preferences</h3>
            <form id="diet-preferences-form">
                <div class="form-group">
                    <label for="allergies">Allergies (comma separated)</label>
                    <input type="text" id="allergies" placeholder="e.g., peanuts, shellfish, dairy" value="${allergiesStr}">
                </div>
                <div class="form-group">
                    <label for="diet-type">Diet Type</label>
                    <select id="diet-type">
                        <option value="" ${savedPreferences.dietType === '' ? 'selected' : ''}>No specific diet</option>
                        <option value="vegetarian" ${savedPreferences.dietType === 'vegetarian' ? 'selected' : ''}>Vegetarian</option>
                        <option value="vegan" ${savedPreferences.dietType === 'vegan' ? 'selected' : ''}>Vegan</option>
                        <option value="gluten-free" ${savedPreferences.dietType === 'gluten-free' ? 'selected' : ''}>Gluten-Free</option>
                        <option value="keto" ${savedPreferences.dietType === 'keto' ? 'selected' : ''}>Keto</option>
                        <option value="paleo" ${savedPreferences.dietType === 'paleo' ? 'selected' : ''}>Paleo</option>
                        <option value="ray-peat" ${savedPreferences.dietType === 'ray-peat' ? 'selected' : ''}>Ray Peat</option>
                        <option value="low-carb" ${savedPreferences.dietType === 'low-carb' ? 'selected' : ''}>Low Carb</option>
                        <option value="mediterranean" ${savedPreferences.dietType === 'mediterranean' ? 'selected' : ''}>Mediterranean</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="avoid-ingredients">Ingredients to Avoid (comma separated)</label>
                    <input type="text" id="avoid-ingredients" placeholder="e.g., onions, cilantro, mushrooms" value="${avoidIngredientsStr}">
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-pref-btn">Cancel</button>
                    <button type="submit" class="save-pref-btn">Save Preferences</button>
                </div>
            </form>
        </div>
    `;
    
    // Append to the meal plan modal
    document.querySelector('.meal-plan-modal').appendChild(preferencesModal);
    
    // Handle form submission
    const preferencesForm = document.getElementById('diet-preferences-form');
    preferencesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const allergies = document.getElementById('allergies').value
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
            
        const dietType = document.getElementById('diet-type').value;
        
        const avoidIngredients = document.getElementById('avoid-ingredients').value
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
        
        // Save to localStorage
        const preferences = {
            allergies,
            dietType,
            avoidIngredients
        };
        
        localStorage.setItem('dietPreferences', JSON.stringify(preferences));
        
        // Close preferences modal
        document.querySelector('.preferences-modal').remove();
        
        // Show confirmation
        showNotification('Dietary preferences saved successfully!');
    });
    
    // Handle cancel button
    const cancelButton = document.querySelector('.cancel-pref-btn');
    cancelButton.addEventListener('click', () => {
        document.querySelector('.preferences-modal').remove();
    });
}

// Initialize task checkboxes
function initTaskCheckboxes() {
    const taskCheckboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const taskLabel = checkbox.nextElementSibling;
            const taskItem = checkbox.closest('.task-item');
            
            if (checkbox.checked) {
                taskLabel.style.textDecoration = 'line-through';
                taskLabel.style.opacity = '0.6';
                
                // Simulate task completion
                setTimeout(() => {
                    taskItem.style.opacity = '0';
                    setTimeout(() => {
                        taskItem.remove();
                        showNotification('Task completed!');
                    }, 300);
                }, 1000);
            }
        });
    });
}

// Show a notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Simulate inventory updates for demo purposes
function simulateInventoryUpdates() {
    // Update pantry status randomly every 30 seconds
    setInterval(() => {
        const pantryCard = document.querySelector('.stat-card:nth-child(2) .stat-info p');
        const currentPercentage = parseInt(pantryCard.textContent);
        
        // Only update if inventory has been started (not at 0%)
        if (currentPercentage > 0) {
            const newPercentage = Math.max(60, Math.min(95, currentPercentage + (Math.random() > 0.5 ? 1 : -1)));
            pantryCard.textContent = `${newPercentage}% stocked`;
            
            // Add notification if percentage changes significantly
            if (Math.abs(newPercentage - currentPercentage) > 5) {
                if (newPercentage < 70) {
                    showNotification('Pantry stock below 70% - Consider restocking');
                }
            }
        }
    }, 30000);
}

// Receipt Input View
function showReceiptInputView() {
    document.getElementById('modalContainer').style.display = 'flex';
    document.getElementById('receiptInputView').style.display = 'block';
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('purchaseDate').value = today;
    document.getElementById('orderDate').value = today;
    
    // Set up tab switching
    const tabButtons = document.querySelectorAll('.receipt-tabs .tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            document.getElementById(`${button.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Set up add item button
    document.getElementById('addItemBtn').addEventListener('click', addReceiptItem);
    
    // Set up remove item buttons
    setupRemoveItemButtons();
    
    // Set up form submission
    document.getElementById('manualReceiptForm').addEventListener('submit', handleManualReceiptSubmit);
    document.getElementById('takeoutForm').addEventListener('submit', handleTakeoutSubmit);
}

function addReceiptItem() {
    const receiptItems = document.getElementById('receiptItems');
    const newItem = document.createElement('div');
    newItem.className = 'receipt-item';
    newItem.innerHTML = `
        <input type="text" placeholder="Item name" class="item-name" required>
        <input type="number" placeholder="Price" class="item-price" step="0.01" required>
        <select class="item-category">
            <option value="pantry">Pantry</option>
            <option value="household">Household</option>
            <option value="other">Other</option>
        </select>
        <button type="button" class="remove-item">×</button>
    `;
    receiptItems.appendChild(newItem);
    
    // Set up the new remove button
    setupRemoveItemButtons();
}

function setupRemoveItemButtons() {
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            // Only remove if there's more than one item
            const items = document.querySelectorAll('.receipt-item');
            if (items.length > 1) {
                this.parentElement.remove();
            } else {
                // Clear the inputs instead of removing the only item
                const inputs = this.parentElement.querySelectorAll('input');
                inputs.forEach(input => input.value = '');
            }
        });
    });
}

function handleManualReceiptSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const storeName = document.getElementById('storeName').value;
    const purchaseDate = document.getElementById('purchaseDate').value;
    const totalAmount = document.getElementById('totalAmount').value;
    
    // Get all items
    const items = [];
    document.querySelectorAll('.receipt-item').forEach(itemElement => {
        const name = itemElement.querySelector('.item-name').value;
        const price = itemElement.querySelector('.item-price').value;
        const category = itemElement.querySelector('.item-category').value;
        
        if (name && price) {
            items.push({
                name,
                price: parseFloat(price),
                category,
                purchaseDate
            });
        }
    });
    
    // Create receipt object
    const receipt = {
        id: Date.now(),
        storeName,
        purchaseDate,
        totalAmount: parseFloat(totalAmount),
        items,
        type: 'grocery'
    };
    
    // Save receipt to localStorage
    saveReceipt(receipt);
    
    // Add items to inventory
    addItemsToInventory(items);
    
    // Update activity feed
    addActivity(`Added receipt from ${storeName}`);
    
    // Close modal
    closeModalView();
    
    // Show notification
    showNotification('Receipt added successfully!');
}

function handleTakeoutSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const restaurantName = document.getElementById('restaurantName').value;
    const orderDate = document.getElementById('orderDate').value;
    const orderAmount = document.getElementById('orderAmount').value;
    const mealType = document.getElementById('mealType').value;
    const notes = document.getElementById('orderNotes').value;
    
    // Create takeout order object
    const takeoutOrder = {
        id: Date.now(),
        restaurantName,
        orderDate,
        totalAmount: parseFloat(orderAmount),
        mealType,
        notes,
        type: 'takeout'
    };
    
    // Save takeout order to localStorage
    saveReceipt(takeoutOrder);
    
    // Update activity feed
    addActivity(`Added takeout order from ${restaurantName}`);
    
    // Close modal
    closeModalView();
    
    // Show notification
    showNotification('Takeout order added successfully!');
}

function saveReceipt(receipt) {
    // Get existing receipts from localStorage
    let receipts = JSON.parse(localStorage.getItem('receipts')) || [];
    
    // Add new receipt
    receipts.push(receipt);
    
    // Save back to localStorage
    localStorage.setItem('receipts', JSON.stringify(receipts));
    
    // Update consumption data
    updateConsumptionData(receipt);
}

function addItemsToInventory(items) {
    // Get existing inventory from localStorage
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    // Add new items
    items.forEach(item => {
        inventory.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: item.name,
            price: item.price,
            category: item.category,
            purchaseDate: item.purchaseDate,
            // Set expiry date for pantry items (random between 1-6 months)
            expiryDate: item.category === 'pantry' ? 
                new Date(new Date().setMonth(new Date().getMonth() + Math.floor(Math.random() * 6) + 1)).toISOString().split('T')[0] : null
        });
    });
    
    // Save back to localStorage
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    // Update inventory stats
    updateInventoryStats();
}

function updateConsumptionData(receipt) {
    // Get existing consumption data from localStorage
    let consumptionData = JSON.parse(localStorage.getItem('consumptionData')) || {
        weekly: [],
        monthly: [],
        categories: {}
    };
    
    // Get current week and month
    const currentWeek = getWeekNumber(new Date());
    const currentMonth = new Date().getMonth();
    
    // Update weekly data
    let weekEntry = consumptionData.weekly.find(entry => entry.week === currentWeek);
    if (!weekEntry) {
        weekEntry = { week: currentWeek, total: 0, receipts: 0 };
        consumptionData.weekly.push(weekEntry);
    }
    weekEntry.total += receipt.totalAmount;
    weekEntry.receipts += 1;
    
    // Update monthly data
    let monthEntry = consumptionData.monthly.find(entry => entry.month === currentMonth);
    if (!monthEntry) {
        monthEntry = { month: currentMonth, total: 0, receipts: 0 };
        consumptionData.monthly.push(monthEntry);
    }
    monthEntry.total += receipt.totalAmount;
    monthEntry.receipts += 1;
    
    // Update category data if it's a grocery receipt with items
    if (receipt.type === 'grocery' && receipt.items) {
        receipt.items.forEach(item => {
            if (!consumptionData.categories[item.category]) {
                consumptionData.categories[item.category] = 0;
            }
            consumptionData.categories[item.category] += item.price;
        });
    } else if (receipt.type === 'takeout') {
        // Update takeout category
        if (!consumptionData.categories.takeout) {
            consumptionData.categories.takeout = 0;
        }
        consumptionData.categories.takeout += receipt.totalAmount;
    }
    
    // Save back to localStorage
    localStorage.setItem('consumptionData', JSON.stringify(consumptionData));
}

function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function closeModalView() {
    document.getElementById('modalContainer').style.display = 'none';
    document.querySelectorAll('.modal-view').forEach(view => {
        view.style.display = 'none';
    });
}

// Add activity to the activity feed
function addActivity(message) {
    const activityList = document.querySelector('.activity-list');
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <div class="activity-time">${timeString}</div>
        <div class="activity-content">
            <div class="activity-message">${message}</div>
        </div>
    `;
    
    activityList.prepend(activityItem);
    
    // Limit to 10 activities
    const activities = activityList.querySelectorAll('.activity-item');
    if (activities.length > 10) {
        activities[activities.length - 1].remove();
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize inventory stats
    updateInventoryStats();
    
    // Add some initial activities
    setTimeout(() => {
        addActivity('Welcome to HOMY - Your household operations manager');
        addActivity('Your inventory is ready to be managed');
    }, 1000);
});

function updateInventoryStats() {
    // Get inventory from localStorage
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    // Calculate stats
    const pantryItems = inventory.filter(item => item.category === 'pantry').length;
    const householdItems = inventory.filter(item => item.category === 'household').length;
    const otherItems = inventory.filter(item => item.category === 'other').length;
    const totalItems = inventory.length;
    
    // Calculate pantry status percentage
    const pantryPercentage = Math.min(Math.round((pantryItems / Math.max(20, pantryItems * 1.2)) * 100), 100);
    
    // Calculate expiring soon items
    const today = new Date();
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);
    
    const expiringSoon = inventory.filter(item => {
        if (!item.expiryDate) return false;
        const expiryDate = new Date(item.expiryDate);
        return expiryDate > today && expiryDate <= twoWeeksLater;
    }).length;
    
    // Calculate total value
    const totalValue = inventory.reduce((sum, item) => sum + item.price, 0).toFixed(2);
    
    // Update stats in the dashboard
    const statsElements = document.querySelectorAll('.stat-value');
    if (statsElements.length >= 4) {
        // Update shopping status
        statsElements[0].textContent = `${totalItems} items`;
        
        // Update pantry status
        statsElements[1].textContent = `${pantryPercentage}%`;
        
        // Update household supplies
        statsElements[2].textContent = `${householdItems} items`;
        
        // Update monthly budget
        statsElements[3].textContent = `$${totalValue}`;
    }
    
    // Update shopping reminders
    updateShoppingReminders(expiringSoon);
}

function updateShoppingReminders(expiringSoon) {
    const remindersList = document.querySelector('.tasks-list');
    if (!remindersList) return;
    
    // Clear existing reminders
    remindersList.innerHTML = '';
    
    // Add expiring soon reminder if needed
    if (expiringSoon > 0) {
        const expiryReminder = document.createElement('div');
        expiryReminder.className = 'task-item';
        expiryReminder.innerHTML = `
            <div class="task-checkbox"></div>
            <div class="task-content">
                <div class="task-name">${expiringSoon} items expiring soon</div>
                <div class="task-due">Check inventory</div>
            </div>
        `;
        remindersList.appendChild(expiryReminder);
    }
    
    // Add some default reminders
    const defaultReminders = [
        { name: 'Weekly grocery shopping', due: 'Every Sunday' },
        { name: 'Check pantry inventory', due: 'Every Monday' },
        { name: 'Review household supplies', due: 'Next Wednesday' }
    ];
    
    defaultReminders.forEach(reminder => {
        const reminderElement = document.createElement('div');
        reminderElement.className = 'task-item';
        reminderElement.innerHTML = `
            <div class="task-checkbox"></div>
            <div class="task-content">
                <div class="task-name">${reminder.name}</div>
                <div class="task-due">${reminder.due}</div>
            </div>
        `;
        remindersList.appendChild(reminderElement);
    });
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            this.classList.toggle('checked');
            const taskItem = this.closest('.task-item');
            taskItem.classList.toggle('completed');
            
            // Remove after a delay if checked
            if (this.classList.contains('checked')) {
                setTimeout(() => {
                    taskItem.style.opacity = '0';
                    setTimeout(() => {
                        taskItem.remove();
                    }, 300);
                }, 1000);
            }
        });
    });
}

// Show Monthly Orders view
function showMonthlyOrders() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    // Generate mock data for orders
    const currentOrders = generateMockOrders();
    
    // Create order items HTML
    let orderItemsHTML = '';
    if (currentOrders.length > 0) {
        currentOrders.forEach(order => {
            orderItemsHTML += `
                <div class="order-item">
                    <div class="order-item-header">
                        <div class="order-name">${order.name}</div>
                        <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
                    </div>
                    <div class="order-details">
                        <div class="order-info">
                            <div class="order-date">Delivery: ${order.deliveryDate}</div>
                            <div class="order-total">$${order.total.toFixed(2)}</div>
                        </div>
                        <div class="order-actions">
                            <button class="view-order-btn" data-id="${order.id}">View Details</button>
                            ${order.status === 'Pending' ? 
                                `<button class="edit-order-btn" data-id="${order.id}">Edit</button>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        orderItemsHTML = `
            <div class="empty-orders">
                <p>No orders scheduled for this month.</p>
                <p>Scan receipts to build your order history and get suggestions.</p>
                <button class="create-order-btn">Create New Order</button>
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div class="modal-content monthly-orders-modal">
            <div class="modal-header">
                <h2>This Month's Orders</h2>
                <button class="close-modal">×</button>
            </div>
            <div class="orders-flow">
                <div class="orders-flow-steps">
                    <div class="flow-step active">
                        <div class="step-number">1</div>
                        <div class="step-label">Scan Receipt</div>
                    </div>
                    <div class="flow-connector"></div>
                    <div class="flow-step active">
                        <div class="step-number">2</div>
                        <div class="step-label">HOMY Sorts Data</div>
                    </div>
                    <div class="flow-connector"></div>
                    <div class="flow-step">
                        <div class="step-number">3</div>
                        <div class="step-label">Review & Adjust</div>
                    </div>
                    <div class="flow-connector"></div>
                    <div class="flow-step">
                        <div class="step-number">4</div>
                        <div class="step-label">Place Order</div>
                    </div>
                </div>
                <p class="flow-description">Scan receipts to build your shopping patterns. HOMY will analyze your purchases and suggest monthly orders.</p>
            </div>
            <div class="orders-tabs">
                <button class="tab-btn active" data-tab="current">Current Orders</button>
                <button class="tab-btn" data-tab="suggested">Suggested Orders</button>
                <button class="tab-btn" data-tab="history">Order History</button>
            </div>
            <div class="tab-content active" id="current-tab">
                <div class="orders-list">
                    ${orderItemsHTML}
                </div>
            </div>
            <div class="tab-content" id="suggested-tab">
                <div class="suggested-orders">
                    <div class="suggested-order">
                        <h3>Monthly Essentials</h3>
                        <p>Based on your shopping patterns, we suggest the following monthly order:</p>
                        <ul class="suggested-items">
                            <li>
                                <span class="item-name">Paper Towels (2 rolls)</span>
                                <span class="item-price">$5.99</span>
                            </li>
                            <li>
                                <span class="item-name">Laundry Detergent</span>
                                <span class="item-price">$12.99</span>
                            </li>
                            <li>
                                <span class="item-name">Dishwasher Soap</span>
                                <span class="item-price">$8.49</span>
                            </li>
                            <li>
                                <span class="item-name">Coffee Beans</span>
                                <span class="item-price">$14.99</span>
                            </li>
                        </ul>
                        <div class="suggested-total">
                            <span>Total:</span>
                            <span>$42.46</span>
                        </div>
                        <div class="suggested-actions">
                            <button class="customize-order-btn">Customize</button>
                            <button class="add-to-orders-btn">Add to Orders</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-content" id="history-tab">
                <div class="order-history-placeholder">
                    <p>Your completed orders will appear here.</p>
                    <p>Keep using HOMY to track your purchases and order history.</p>
                </div>
            </div>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(modal);
    
    // Handle tab switching
    const tabButtons = modal.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            modal.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.dataset.tab + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Handle view details buttons
    const viewButtons = modal.querySelectorAll('.view-order-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const orderId = button.dataset.id;
            viewOrderDetails(orderId);
        });
    });
    
    // Handle edit buttons
    const editButtons = modal.querySelectorAll('.edit-order-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const orderId = button.dataset.id;
            editOrder(orderId);
        });
    });
    
    // Handle create order button
    const createOrderBtn = modal.querySelector('.create-order-btn');
    if (createOrderBtn) {
        createOrderBtn.addEventListener('click', () => {
            modal.remove();
            showCreateOrderForm();
        });
    }
    
    // Handle close button
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Handle customize and add to orders buttons
    const customizeBtn = modal.querySelector('.customize-order-btn');
    if (customizeBtn) {
        customizeBtn.addEventListener('click', () => {
            showCustomizeOrderForm();
        });
    }
    
    const addToOrdersBtn = modal.querySelector('.add-to-orders-btn');
    if (addToOrdersBtn) {
        addToOrdersBtn.addEventListener('click', () => {
            showNotification('Order added to your monthly orders!');
            
            // Update the current orders tab to show the new order
            const currentOrdersTab = document.getElementById('current-tab');
            const ordersList = currentOrdersTab.querySelector('.orders-list');
            
            const newOrderElement = document.createElement('div');
            newOrderElement.className = 'order-item';
            newOrderElement.innerHTML = `
                <div class="order-item-header">
                    <div class="order-name">Monthly Essentials</div>
                    <div class="order-status pending">Pending</div>
                </div>
                <div class="order-details">
                    <div class="order-info">
                        <div class="order-date">Delivery: ${getNextDeliveryDate()}</div>
                        <div class="order-total">$42.46</div>
                    </div>
                    <div class="order-actions">
                        <button class="view-order-btn" data-id="new-order">View Details</button>
                        <button class="edit-order-btn" data-id="new-order">Edit</button>
                    </div>
                </div>
            `;
            
            // If there was an empty state message, remove it
            const emptyState = ordersList.querySelector('.empty-orders');
            if (emptyState) {
                ordersList.innerHTML = '';
            }
            
            ordersList.prepend(newOrderElement);
            
            // Switch to current orders tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            modal.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            const currentTabBtn = modal.querySelector('[data-tab="current"]');
            currentTabBtn.classList.add('active');
            document.getElementById('current-tab').classList.add('active');
        });
    }
}

// View order details
function viewOrderDetails(orderId) {
    // Find the order in mock data
    const order = generateMockOrders().find(o => o.id === orderId) || {
        id: 'new-order',
        name: 'Monthly Essentials',
        status: 'Pending',
        deliveryDate: getNextDeliveryDate(),
        total: 42.46,
        items: [
            { name: 'Paper Towels (2 rolls)', price: 5.99 },
            { name: 'Laundry Detergent', price: 12.99 },
            { name: 'Dishwasher Soap', price: 8.49 },
            { name: 'Coffee Beans', price: 14.99 }
        ]
    };
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    // Generate items HTML
    let itemsHTML = '';
    order.items.forEach(item => {
        itemsHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
            </tr>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content order-details-modal">
            <div class="modal-header">
                <h2>Order Details</h2>
                <button class="close-modal">×</button>
            </div>
            <div class="order-info-header">
                <div>
                    <h3>${order.name}</h3>
                    <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
                </div>
                <div class="order-delivery">
                    <div class="delivery-date">Delivery Date: ${order.deliveryDate}</div>
                    <div class="order-id">Order ID: ${order.id}</div>
                </div>
            </div>
            <div class="order-items">
                <h3>Order Items</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>Total</td>
                            <td>$${order.total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="order-actions-footer">
                ${order.status === 'Pending' ? `
                    <button class="cancel-order-btn">Cancel Order</button>
                    <button class="edit-order-btn" data-id="${order.id}">Edit Order</button>
                ` : ''}
                <button class="close-details-btn">Close</button>
            </div>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(modal);
    
    // Handle close buttons
    const closeButtons = modal.querySelectorAll('.close-modal, .close-details-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
    
    // Handle edit button
    const editButton = modal.querySelector('.edit-order-btn');
    if (editButton) {
        editButton.addEventListener('click', () => {
            document.body.removeChild(modal);
            editOrder(order.id);
        });
    }
    
    // Handle cancel button
    const cancelButton = modal.querySelector('.cancel-order-btn');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel this order?')) {
                document.body.removeChild(modal);
                showNotification('Order has been cancelled');
            }
        });
    }
}

// Edit order
function editOrder(orderId) {
    // Find the order in mock data
    const order = generateMockOrders().find(o => o.id === orderId) || {
        id: 'new-order',
        name: 'Monthly Essentials',
        status: 'Pending',
        deliveryDate: getNextDeliveryDate(),
        total: 42.46,
        items: [
            { name: 'Paper Towels (2 rolls)', price: 5.99 },
            { name: 'Laundry Detergent', price: 12.99 },
            { name: 'Dishwasher Soap', price: 8.49 },
            { name: 'Coffee Beans', price: 14.99 }
        ]
    };
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    // Generate items HTML
    let itemsHTML = '';
    order.items.forEach((item, index) => {
        itemsHTML += `
            <div class="edit-order-item">
                <input type="text" class="item-name-input" value="${item.name}" placeholder="Item name">
                <input type="number" class="item-price-input" value="${item.price.toFixed(2)}" step="0.01" placeholder="Price">
                <button class="remove-order-item" data-index="${index}">×</button>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content edit-order-modal">
            <div class="modal-header">
                <h2>Edit Order</h2>
                <button class="close-modal">×</button>
            </div>
            <form id="edit-order-form">
                <div class="form-group">
                    <label for="order-name">Order Name</label>
                    <input type="text" id="order-name" value="${order.name}" required>
                </div>
                <div class="form-group">
                    <label for="delivery-date">Delivery Date</label>
                    <input type="date" id="delivery-date" value="${order.deliveryDate}" required>
                </div>
                <h3>Order Items</h3>
                <div class="edit-order-items">
                    ${itemsHTML}
                </div>
                <button type="button" id="add-order-item" class="secondary-btn">+ Add Item</button>
                <div class="order-total">
                    Total: $<span id="order-total-amount">${order.total.toFixed(2)}</span>
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-edit-btn">Cancel</button>
                    <button type="submit" class="save-order-btn">Save Order</button>
                </div>
            </form>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(modal);
    
    // Handle close and cancel buttons
    const closeButtons = modal.querySelectorAll('.close-modal, .cancel-edit-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
    
    // Handle remove item buttons
    const setupRemoveButtons = () => {
        const removeButtons = modal.querySelectorAll('.remove-order-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Only remove if there's more than one item
                const items = modal.querySelectorAll('.edit-order-item');
                if (items.length > 1) {
                    this.closest('.edit-order-item').remove();
                    updateOrderTotal();
                }
            });
        });
    };
    
    setupRemoveButtons();
    
    // Handle add item button
    const addItemButton = document.getElementById('add-order-item');
    addItemButton.addEventListener('click', () => {
        const orderItems = modal.querySelector('.edit-order-items');
        const itemCount = orderItems.querySelectorAll('.edit-order-item').length;
        
        const newItem = document.createElement('div');
        newItem.className = 'edit-order-item';
        newItem.innerHTML = `
            <input type="text" class="item-name-input" placeholder="Item name">
            <input type="number" class="item-price-input" value="0.00" step="0.01" placeholder="Price">
            <button class="remove-order-item" data-index="${itemCount}">×</button>
        `;
        
        orderItems.appendChild(newItem);
        setupRemoveButtons();
        
        // Add event listener to update total when price changes
        const newPriceInput = newItem.querySelector('.item-price-input');
        newPriceInput.addEventListener('change', updateOrderTotal);
    });
    
    // Update order total when price changes
    const updateOrderTotal = () => {
        const priceInputs = modal.querySelectorAll('.item-price-input');
        let total = 0;
        
        priceInputs.forEach(input => {
            total += parseFloat(input.value) || 0;
        });
        
        document.getElementById('order-total-amount').textContent = total.toFixed(2);
    };
    
    // Add event listeners to existing price inputs
    const priceInputs = modal.querySelectorAll('.item-price-input');
    priceInputs.forEach(input => {
        input.addEventListener('change', updateOrderTotal);
    });
    
    // Handle form submission
    const form = document.getElementById('edit-order-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Gather form data
        const orderName = document.getElementById('order-name').value;
        const deliveryDate = document.getElementById('delivery-date').value;
        
        // Show success notification
        showNotification('Order updated successfully');
        
        // Close modal
        document.body.removeChild(modal);
    });
}

// Show create order form
function showCreateOrderForm() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content create-order-modal">
            <div class="modal-header">
                <h2>Create New Order</h2>
                <button class="close-modal">×</button>
            </div>
            <form id="create-order-form">
                <div class="form-group">
                    <label for="new-order-name">Order Name</label>
                    <input type="text" id="new-order-name" placeholder="e.g. Monthly Essentials" required>
                </div>
                <div class="form-group">
                    <label for="new-delivery-date">Delivery Date</label>
                    <input type="date" id="new-delivery-date" value="${getNextDeliveryDate()}" required>
                </div>
                <h3>Order Items</h3>
                <div class="edit-order-items">
                    <div class="edit-order-item">
                        <input type="text" class="item-name-input" placeholder="Item name">
                        <input type="number" class="item-price-input" value="0.00" step="0.01" placeholder="Price">
                        <button class="remove-order-item" data-index="0">×</button>
                    </div>
                </div>
                <button type="button" id="add-new-order-item" class="secondary-btn">+ Add Item</button>
                <div class="order-total">
                    Total: $<span id="new-order-total-amount">0.00</span>
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-create-btn">Cancel</button>
                    <button type="submit" class="create-order-btn">Create Order</button>
                </div>
            </form>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(modal);
    
    // Handle close and cancel buttons
    const closeButtons = modal.querySelectorAll('.close-modal, .cancel-create-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
    
    // Handle remove item buttons
    const setupRemoveButtons = () => {
        const removeButtons = modal.querySelectorAll('.remove-order-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Only remove if there's more than one item
                const items = modal.querySelectorAll('.edit-order-item');
                if (items.length > 1) {
                    this.closest('.edit-order-item').remove();
                    updateOrderTotal();
                }
            });
        });
    };
    
    setupRemoveButtons();
    
    // Handle add item button
    const addItemButton = document.getElementById('add-new-order-item');
    addItemButton.addEventListener('click', () => {
        const orderItems = modal.querySelector('.edit-order-items');
        const itemCount = orderItems.querySelectorAll('.edit-order-item').length;
        
        const newItem = document.createElement('div');
        newItem.className = 'edit-order-item';
        newItem.innerHTML = `
            <input type="text" class="item-name-input" placeholder="Item name">
            <input type="number" class="item-price-input" value="0.00" step="0.01" placeholder="Price">
            <button class="remove-order-item" data-index="${itemCount}">×</button>
        `;
        
        orderItems.appendChild(newItem);
        setupRemoveButtons();
        
        // Add event listener to update total when price changes
        const newPriceInput = newItem.querySelector('.item-price-input');
        newPriceInput.addEventListener('change', updateOrderTotal);
    });
    
    // Update order total when price changes
    const updateOrderTotal = () => {
        const priceInputs = modal.querySelectorAll('.item-price-input');
        let total = 0;
        
        priceInputs.forEach(input => {
            total += parseFloat(input.value) || 0;
        });
        
        document.getElementById('new-order-total-amount').textContent = total.toFixed(2);
    };
    
    // Add event listeners to existing price inputs
    const priceInputs = modal.querySelectorAll('.item-price-input');
    priceInputs.forEach(input => {
        input.addEventListener('change', updateOrderTotal);
    });
    
    // Handle form submission
    const form = document.getElementById('create-order-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success notification
        showNotification('New order created successfully');
        
        // Close modal
        document.body.removeChild(modal);
        
        // Reopen monthly orders view to show the new order
        setTimeout(() => {
            showMonthlyOrders();
        }, 500);
    });
}

// Show customize order form
function showCustomizeOrderForm() {
    // This is similar to editOrder but with the suggested items
    editOrder('new-order');
}

// Generate mock orders for demo
function generateMockOrders() {
    // Check if there are any orders already created in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // If there are already orders, return those
    if (existingOrders.length > 0) {
        return existingOrders;
    }
    
    // Otherwise return empty array (user hasn't created orders yet)
    return [];
}

// Get next delivery date (2 weeks from now)
function getNextDeliveryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

// Update quick actions to handle the user flow
document.addEventListener('DOMContentLoaded', () => {
    // Update the button event listeners to align with the user flow
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        const actionText = button.querySelector('span:last-child').textContent;
        
        if (actionText === 'Scan Receipt') {
            button.addEventListener('click', () => {
                showReceiptInputView();
            });
        } else if (actionText === 'Inventory') {
            button.addEventListener('click', () => {
                showInventoryView();
            });
        } else if (actionText === 'Shopping List') {
            button.addEventListener('click', () => {
                showMonthlyOrders();
            });
        }
    });
    
    // Initialize the page
    updateInventoryStats();
    
    // Add initial activities
    setTimeout(() => {
        addActivity('Welcome to HOMY - Your household operations manager');
        addActivity('Ready to manage your household inventory');
    }, 1000);
}); 
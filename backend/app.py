from flask import Flask, render_template, request, jsonify
import os
import json
from datetime import datetime, timedelta

app = Flask(__name__)

# Simulated database (in a real app, this would be a proper database)
inventory = {
    'pantry': [],
    'household': []
}

takeout_history = []
shopping_list = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat')
def chat():
    # HOMY chat interface
    return render_template('index.html')

@app.route('/home')
def home():
    # My Home dashboard for household goods management
    return render_template('home.html')

@app.route('/marketplace')
def marketplace():
    # Marketplace for household goods and necessities
    return "Marketplace for household goods coming soon"

@app.route('/orders')
def orders():
    # Order tracking and history for household supplies
    return "Order tracking for household supplies coming soon"

@app.route('/api/scan-receipt', methods=['POST'])
def scan_receipt():
    """API endpoint for processing receipt images"""
    # In a real app, this would use OCR to extract items from the receipt
    # For demo purposes, we'll simulate the extraction
    
    # Check if an image was uploaded
    if 'receipt' not in request.files:
        return jsonify({'error': 'No receipt image provided'}), 400
    
    file = request.files['receipt']
    if file.filename == '':
        return jsonify({'error': 'No receipt image selected'}), 400
    
    # In a real app, process the image here
    # For demo, return simulated items
    items = [
        {'name': 'Milk', 'price': 3.99, 'category': 'Pantry', 'expiryDays': 7},
        {'name': 'Bread', 'price': 2.49, 'category': 'Pantry', 'expiryDays': 5},
        {'name': 'Eggs', 'price': 4.99, 'category': 'Pantry', 'expiryDays': 14},
        {'name': 'Paper Towels', 'price': 8.99, 'category': 'Household', 'expiryDays': None},
        {'name': 'Dish Soap', 'price': 3.49, 'category': 'Household', 'expiryDays': None}
    ]
    
    return jsonify({'items': items})

@app.route('/api/inventory', methods=['GET', 'POST'])
def manage_inventory():
    """API endpoint for inventory management"""
    global inventory
    
    if request.method == 'GET':
        # Return the current inventory
        return jsonify(inventory)
    
    elif request.method == 'POST':
        # Add an item to inventory
        data = request.json
        category = data.get('category')
        item = data.get('item')
        
        if not category or not item or category not in inventory:
            return jsonify({'error': 'Invalid request'}), 400
        
        # Add expiry date if applicable
        if 'expiryDays' in item and item['expiryDays']:
            expiry_date = datetime.now() + timedelta(days=item['expiryDays'])
            item['expiryDate'] = expiry_date.strftime('%Y-%m-%d')
        
        # Add to inventory
        inventory[category].append(item)
        
        return jsonify({'success': True, 'inventory': inventory})

@app.route('/api/inventory/<category>/<int:item_id>', methods=['DELETE'])
def remove_inventory_item(category, item_id):
    """API endpoint to remove an item from inventory"""
    global inventory
    
    if category not in inventory or item_id >= len(inventory[category]):
        return jsonify({'error': 'Item not found'}), 404
    
    # Remove the item
    removed_item = inventory[category].pop(item_id)
    
    return jsonify({'success': True, 'removed': removed_item})

@app.route('/api/takeout', methods=['POST'])
def track_takeout():
    """API endpoint for tracking takeout meals"""
    global takeout_history
    
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Add timestamp
    data['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Add to history
    takeout_history.append(data)
    
    return jsonify({'success': True, 'takeout': data})

@app.route('/api/shopping-list', methods=['GET', 'POST', 'DELETE'])
def manage_shopping_list():
    """API endpoint for shopping list management"""
    global shopping_list
    
    if request.method == 'GET':
        # Return the current shopping list
        return jsonify({'items': shopping_list})
    
    elif request.method == 'POST':
        # Add an item to the shopping list
        data = request.json
        item = data.get('item')
        
        if not item:
            return jsonify({'error': 'No item provided'}), 400
        
        shopping_list.append(item)
        return jsonify({'success': True, 'items': shopping_list})
    
    elif request.method == 'DELETE':
        # Clear the shopping list or remove a specific item
        item_id = request.args.get('id')
        
        if item_id is not None:
            # Remove specific item
            item_id = int(item_id)
            if 0 <= item_id < len(shopping_list):
                removed = shopping_list.pop(item_id)
                return jsonify({'success': True, 'removed': removed, 'items': shopping_list})
            else:
                return jsonify({'error': 'Item not found'}), 404
        else:
            # Clear entire list
            shopping_list.clear()
            return jsonify({'success': True, 'items': shopping_list})

@app.route('/api/meal-suggestions', methods=['GET'])
def get_meal_suggestions():
    """API endpoint for meal suggestions based on inventory"""
    suggestion_type = request.args.get('type', 'available')
    
    # In a real app, this would analyze the inventory and suggest meals
    # For demo purposes, return simulated suggestions
    
    if suggestion_type == 'expiring':
        # Suggest meals based on expiring items
        return jsonify({
            'meal': {
                'name': 'Quick Pasta with Expiring Ingredients',
                'expiring_items': ['Tomatoes', 'Spinach', 'Cheese'],
                'additional_items': ['Pasta', 'Olive Oil', 'Garlic'],
                'description': 'This simple pasta dish uses your expiring ingredients and can be prepared in under 30 minutes.'
            }
        })
    
    elif suggestion_type == 'available':
        # Suggest meals based on available items
        return jsonify({
            'meal': {
                'name': 'Pantry Staple Stir Fry',
                'available_items': ['Rice', 'Frozen Vegetables', 'Soy Sauce'],
                'additional_items': [],
                'description': 'A quick and easy stir fry using items you already have in your pantry.'
            }
        })
    
    elif suggestion_type == 'weekly':
        # Suggest a weekly meal plan
        return jsonify({
            'plan': [
                {'day': 'Monday', 'meal': 'Pasta with Tomato Sauce'},
                {'day': 'Tuesday', 'meal': 'Rice and Bean Bowl'},
                {'day': 'Wednesday', 'meal': 'Vegetable Stir Fry'},
                {'day': 'Thursday', 'meal': 'Leftover Remix'},
                {'day': 'Friday', 'meal': 'Homemade Pizza Night'},
                {'day': 'Weekend', 'meal': 'Flexible Options'}
            ]
        })
    
    else:
        return jsonify({'error': 'Invalid suggestion type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001) 
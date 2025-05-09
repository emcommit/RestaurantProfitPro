import json
import re

# Define file paths
MENU_FILE_PATH = '/Users/m/Programming/LOCAL/RestaurantProfitPro/server/menus.json'
REPORT_FILE_PATH = '/Users/m/Programming/LOCAL/RestaurantProfitPro/server/resale_price_updates.json'

# Define categories for beverages (priced per bottle)
BEVERAGE_CATEGORIES = ['Beverages', 'Soft Drinks', 'Beers & Ciders', 'White Wines', 'Red Wines', 'Rose Wines', 'Sparkling Wines', 'Cocktails', 'Hot Drinks', 'Liqueur Coffees']

# Maximum reasonable prices for resale items
MAX_PRICE_PER_ITEM = 5.00  # For beverages (per bottle)
MAX_PRICE_PER_KG_L = 50.00  # For bulk items (per kg/L)

# Load the menu data
with open(MENU_FILE_PATH, 'r') as f:
    menus = json.load(f)

# Log updates and issues
update_report = {
    "updated_items": [],
    "unmatched_items": [],
    "anomalous_prices": []
}

for menu_name, menu_data in menus.items():
    ingredients = menu_data.get('initialIngredients', {})
    items = menu_data.get('items', [])

    for item in items:
        if item.get('hasRecipe', False):
            # Skip recipe items
            continue

        # This is a resale item (hasRecipe: false)
        resale_item_name = item.get('name', '')
        category = item.get('category', '')

        # Find matching ingredient using exact match (case-insensitive)
        matched_ingredient = None
        normalized_item_name = resale_item_name.lower()
        for ing_name in ingredients:
            if normalized_item_name == ing_name.lower():
                matched_ingredient = ing_name
                break

        if matched_ingredient:
            ingredient_data = ingredients[matched_ingredient]
            cost = ingredient_data['cost']
            unit = ingredient_data['unit']

            # Adjust price based on unit and category
            adjusted_price = cost
            if category in BEVERAGE_CATEGORIES:
                # For beverages, assume cost is per bottle or per ml
                if unit == 'unit':
                    adjusted_price = cost  # Cost is per bottle
                elif unit == 'ml':
                    # Parse bottle size from name (e.g., "275ml")
                    volume_ml = 275  # Default volume
                    if 'ml' in resale_item_name.lower():
                        try:
                            volume_ml = float(''.join(filter(str.isdigit, resale_item_name.split('ml')[0].split()[-1])))
                        except (IndexError, ValueError):
                            pass  # Use default if parsing fails
                    adjusted_price = cost * volume_ml
                else:
                    # Unexpected unit for beverage, skip
                    update_report['anomalous_prices'].append({
                        'item': resale_item_name,
                        'ingredient': matched_ingredient,
                        'reason': f'Unexpected unit {unit} for beverage item'
                    })
                    continue
            elif unit in ['g', 'ml']:
                adjusted_price = cost * 1000  # Convert to per kg/L
            elif unit in ['kg', 'L']:
                adjusted_price = cost  # Already per kg/L

            # Validate the adjusted price
            max_price = MAX_PRICE_PER_ITEM if category in BEVERAGE_CATEGORIES else MAX_PRICE_PER_KG_L
            if adjusted_price > max_price:
                update_report['anomalous_prices'].append({
                    'item': resale_item_name,
                    'ingredient': matched_ingredient,
                    'adjusted_price': adjusted_price,
                    'max_allowed': max_price,
                    'reason': 'Price exceeds maximum allowed'
                })
                continue

            # Update buyingPrice
            old_price = item['buyingPrice']
            item['buyingPrice'] = adjusted_price
            update_report['updated_items'].append({
                'item': resale_item_name,
                'ingredient': matched_ingredient,
                'old_price': old_price,
                'new_price': adjusted_price
            })
        else:
            update_report['unmatched_items'].append(resale_item_name)

# Save updated menus
with open(MENU_FILE_PATH, 'w') as f:
    json.dump(menus, f, indent=2)

# Save update report
with open(REPORT_FILE_PATH, 'w') as f:
    json.dump(update_report, f, indent=2)

print("Resale item prices updated. Check 'resale_price_updates.json' in the server directory for details.")
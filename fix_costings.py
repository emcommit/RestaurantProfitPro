import json

# Define file paths
MENU_FILE_PATH = '/Users/m/Programming/LOCAL/RestaurantProfitPro/server/menus.json'
REPORT_FILE_PATH = '/Users/m/Programming/LOCAL/RestaurantProfitPro/server/skipped_ingredients.json'

# Load the menu data
with open(MENU_FILE_PATH, 'r') as f:
    menus = json.load(f)

# Define valid cost ranges per unit (more flexible for premium items)
COST_RANGES = {
    'g': (0.001, 0.05),   # Up to £50/kg for proteins like lamb
    'ml': (0.001, 0.01),  # Up to £10/L for liquids
    'unit': (0.50, 10.00) # Up to £10 per item
}

# Log skipped ingredients
skipped_ingredients = []

for menu_name, menu_data in menus.items():
    ingredients = menu_data.get('initialIngredients', {})
    # Collect ingredients to delete after iteration
    ingredients_to_delete = []

    for ing_name, ing_data in ingredients.items():
        unit = ing_data.get('unit', 'unit')
        cost = ing_data.get('cost', 0)

        # Convert bulk units to base units
        if unit == 'kg':
            unit = 'g'
            cost = cost / 1000
            ing_data['unit'] = unit
            ing_data['cost'] = cost
        elif unit == 'L':
            unit = 'ml'
            cost = cost / 1000
            ing_data['unit'] = unit
            ing_data['cost'] = cost

        # Validate cost after conversion
        min_cost, max_cost = COST_RANGES.get(unit, (0, float('inf')))
        if not (min_cost <= cost <= max_cost):
            skipped_ingredients.append({
                'ingredient': ing_name,
                'menu': menu_name,
                'reason': f'Cost {cost} out of range ({min_cost}, {max_cost}) for unit {unit}'
            })
            ingredients_to_delete.append(ing_name)
            continue

        # Ensure category exists
        if 'category' not in ing_data:
            ing_data['category'] = 'Uncategorized'

    # Remove ingredients after iteration
    for ing_name in ingredients_to_delete:
        del ingredients[ing_name]

# Save updated menus
with open(MENU_FILE_PATH, 'w') as f:
    json.dump(menus, f, indent=2)

# Save skipped ingredients report
with open(REPORT_FILE_PATH, 'w') as f:
    json.dump(skipped_ingredients, f, indent=2)

print("Ingredients updated. Check 'skipped_ingredients.json' in the server directory for any issues.")
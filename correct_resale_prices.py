import json
import logging
import re
from fuzzywuzzy import fuzz

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Categories for unit and cost handling
SOLID_CATEGORIES = ['Proteins', 'Vegetables', 'Fruits', 'Grains', 'Nuts and Seeds', 'Baking Supplies', 'Sweeteners']
LIQUID_CATEGORIES = ['Beverages', 'Soft Drinks', 'Beers & Ciders', 'White Wines', 'Red Wines', 'Rose Wines', 'Sparkling Wines', 'Cocktails', 'Hot Drinks', 'Liqueur Coffees', 'Oils and Vinegars']
PER_UNIT_CATEGORIES = ['Beverages', 'Soft Drinks', 'Beers & Ciders', 'White Wines', 'Red Wines', 'Rose Wines', 'Sparkling Wines', 'Cocktails', 'Hot Drinks', 'Liqueur Coffees']

# Reasonable cost ranges per unit based on category
COST_RANGES = {
    'g': (0.001, 0.01),    # e.g., £1–£10 per kg for solids
    'ml': (0.001, 0.005),   # e.g., £1–£5 per L for liquids
    'unit': (0.50, 5.00)    # e.g., £0.50–£5 per item (e.g., bottle, egg)
}

# Maximum reasonable prices for resale items
MAX_PRICE_PER_ITEM = 10  # For beverages (per bottle)
MAX_PRICE_PER_KG_L = 50  # For bulk items (per kg/L)

def load_menu_data(file_path):
    """Load menu data from JSON file."""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        logging.error(f"Error loading menu data: {e}")
        return None

def save_menu_data(file_path, data):
    """Save menu data to JSON file."""
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        logging.info("Menu data saved successfully.")
    except Exception as e:
        logging.error(f"Error saving menu data: {e}")

def save_report(file_path, report):
    """Save error report to JSON file."""
    try:
        with open(file_path, 'w') as f:
            json.dump(report, f, indent=2)
        logging.info("Error report saved successfully.")
    except Exception as e:
        logging.error(f"Error saving report: {e}")

def determine_unit_and_cost_range(category):
    """Determine the expected unit and cost range based on category."""
    if category in SOLID_CATEGORIES:
        return 'g', COST_RANGES['g']
    elif category in LIQUID_CATEGORIES:
        return 'ml', COST_RANGES['ml']
    else:
        return 'unit', COST_RANGES['unit']

def correct_ingredient_data(ingredient_name, ingredient_data):
    """Validate and correct the ingredient data (cost, unit, category)."""
    # Ensure all required fields exist
    if 'cost' not in ingredient_data or 'unit' not in ingredient_data:
        logging.warning(f"Ingredient '{ingredient_name}' missing cost or unit. Skipping.")
        return None
    if 'category' not in ingredient_data:
        ingredient_data['category'] = 'Uncategorized'
        logging.info(f"Set category for '{ingredient_name}' to 'Uncategorized'")

    cost = ingredient_data['cost']
    unit = ingredient_data['unit']
    category = ingredient_data['category']

    # Determine expected unit and cost range based on category
    expected_unit, (min_cost, max_cost) = determine_unit_and_cost_range(category)

    # Correct unit if mismatched
    if unit not in ['g', 'ml', 'unit']:
        logging.info(f"Corrected unit for '{ingredient_name}' from '{unit}' to '{expected_unit}' based on category '{category}'")
        ingredient_data['unit'] = expected_unit
        unit = expected_unit

    # Correct cost if out of range
    if cost < min_cost or cost > max_cost:
        # Try dividing by 1000, 100, etc., to correct decimal place errors
        corrected_cost = cost
        divisors = [1000, 100, 10]
        for divisor in divisors:
            corrected_cost = cost / divisor
            if min_cost <= corrected_cost <= max_cost:
                logging.info(f"Corrected cost for '{ingredient_name}' from {cost} to {corrected_cost} per {unit}")
                ingredient_data['cost'] = corrected_cost
                break
        else:
            logging.warning(f"Cost for '{ingredient_name}' ({cost} per {unit}) out of range [{min_cost}, {max_cost}] even after correction. Skipping.")
            return None

    return ingredient_data

def match_ingredient_to_resale_item(resale_item_name, ingredients, category):
    """
    Match a resale item name to an ingredient name with strict matching for beverages.
    Returns the matched ingredient name or None if no match is found.
    """
    threshold = 95 if category in PER_UNIT_CATEGORIES else 85
    best_match = None
    best_score = 0

    for ingredient_name in ingredients:
        # Exact or near-exact match for beverages
        if category in PER_UNIT_CATEGORIES:
            score = fuzz.ratio(resale_item_name.lower(), ingredient_name.lower())
        else:
            score = fuzz.partial_ratio(resale_item_name.lower(), ingredient_name.lower())

        if score > best_score and score >= threshold:
            best_score = score
            best_match = ingredient_name

    if best_match:
        logging.info(f"Matched resale item '{resale_item_name}' to ingredient '{best_match}' with score {best_score}")
    else:
        logging.warning(f"No match found for resale item '{resale_item_name}' (category: {category})")
    return best_match

def update_resale_item_prices(menu_data):
    """
    Update buyingPrice of resale items (hasRecipe: false) based on ingredient prices.
    Corrects errors in ingredient data and generates an error report.
    Returns the updated menu data and error report.
    """
    error_report = {
        "mismatched_items": [],
        "skipped_ingredients": [],
        "corrected_costs": [],
        "uncorrectable_items": []
    }

    for menu_name, menu in menu_data.items():
        ingredients = menu.get('initialIngredients', {})
        items = menu.get('items', [])

        # Correct ingredient data
        corrected_ingredients = {}
        for ingredient_name, ingredient_data in ingredients.items():
            corrected_data = correct_ingredient_data(ingredient_name, ingredient_data.copy())
            if corrected_data:
                corrected_ingredients[ingredient_name] = corrected_data
                if corrected_data['cost'] != ingredient_data['cost']:
                    error_report['corrected_costs'].append({
                        "ingredient": ingredient_name,
                        "original_cost": ingredient_data['cost'],
                        "corrected_cost": corrected_data['cost'],
                        "unit": corrected_data['unit']
                    })
            else:
                error_report['skipped_ingredients'].append(ingredient_name)

        menu_data[menu_name]['initialIngredients'] = corrected_ingredients
        ingredients = corrected_ingredients

        updated_items = []
        for item in items:
            if item.get('hasRecipe', False):
                # Skip recipe items
                updated_items.append(item)
                continue

            # This is a resale item (hasRecipe: false)
            resale_item_name = item.get('name', '')
            category = item.get('category', '')
            matched_ingredient = match_ingredient_to_resale_item(resale_item_name, ingredients.keys(), category)

            if matched_ingredient:
                ingredient_data = ingredients[matched_ingredient]
                cost = ingredient_data['cost']  # Cost per base unit (g, ml, unit)
                unit = ingredient_data['unit']
                logging.info(f"Ingredient '{matched_ingredient}' for '{resale_item_name}' (category: {category}): cost={cost} per {unit}")

                # Adjust price based on unit and category
                adjusted_price = cost
                if category in PER_UNIT_CATEGORIES:
                    # For beverages, assume cost is per ml and calculate per bottle
                    volume_ml = 275  # Default volume for drinks
                    if 'ml' in resale_item_name.lower():
                        try:
                            volume_ml = float(''.join(filter(str.isdigit, resale_item_name.split('ml')[0].split()[-1])))
                        except (IndexError, ValueError):
                            logging.warning(f"Could not parse volume for '{resale_item_name}', using default {volume_ml}ml")
                    if unit == 'ml':
                        adjusted_price = cost * volume_ml  # Cost per ml * total ml
                        logging.info(f"Calculated cost for '{resale_item_name}' as {cost} * {volume_ml}ml = {adjusted_price}")
                    else:
                        # If unit is not ml, assume cost is per bottle (unit)
                        adjusted_price = cost
                        logging.info(f"Assumed cost for '{resale_item_name}' as {cost} per bottle (unit)")
                elif unit in ['g', 'ml']:
                    adjusted_price = cost * 1000  # Convert cost per g/ml to cost per kg/L
                    logging.info(f"Converted cost from {cost} per {unit} to {adjusted_price} per {'kg' if unit == 'g' else 'L'}")

                # Check for anomalies: cap the price at a reasonable maximum
                max_price = MAX_PRICE_PER_ITEM if category in PER_UNIT_CATEGORIES else MAX_PRICE_PER_KG_L
                if adjusted_price > max_price:
                    logging.warning(f"Skipping update for '{resale_item_name}': Adjusted price £{adjusted_price:.5f} exceeds maximum reasonable price £{max_price}.")
                    error_report['uncorrectable_items'].append({
                        "item": resale_item_name,
                        "adjusted_price": adjusted_price,
                        "max_allowed": max_price
                    })
                    updated_items.append(item)
                    continue

                # Update buyingPrice
                item['buyingPrice'] = adjusted_price
                logging.info(f"Updated '{resale_item_name}' buyingPrice to £{adjusted_price:.5f}")
            else:
                error_report['mismatched_items'].append(resale_item_name)
                logging.warning(f"Could not update price for '{resale_item_name}': No matching ingredient found.")

            updated_items.append(item)

        # Update the menu with the modified items
        menu_data[menu_name]['items'] = updated_items

    return menu_data, error_report

def main():
    file_path = '/Users/m/Programming/LOCAL/RestaurantProfitPro/server/menus.json'
    report_path = '/Users/m/Programming/LOCAL/RestaurantProfitPro/server/price_correction_report.json'
    
    # Load menu data
    menu_data = load_menu_data(file_path)
    if not menu_data:
        return

    # Update resale item prices and generate error report
    updated_menu_data, error_report = update_resale_item_prices(menu_data)

    # Save updated menu data
    save_menu_data(file_path, updated_menu_data)

    # Save error report
    save_report(report_path, error_report)

if __name__ == "__main__":
    main()
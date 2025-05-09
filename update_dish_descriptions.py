
import json
import os
import re

# Paths
dish_descriptions_path = "/Users/m/Programming/LOCAL/RestaurantProfitPro/client/src/data/DishDescriptions.ts"
menus_json_path = "/Users/m/Programming/LOCAL/RestaurantProfitPro/server/menus.json"
output_menus_json_path = "/Users/m/Programming/LOCAL/RestaurantProfitPro/server/menus.json"

# Normalize string for matching
def normalize_name(name: str) -> str:
    # Convert to lowercase, strip whitespace, remove parenthetical suffixes
    original = name
    name = name.lower().strip()
    name = re.sub(r'\s*$$ [^)]* $$', '', name)  # Remove (V), (N), etc.
    name = name.strip('"')  # Remove stray quotes
    print(f"Normalized: '{original}' -> '{name}'")
    return name

# Check if DishDescriptions.ts exists
if not os.path.exists(dish_descriptions_path):
    raise FileNotFoundError(f"DishDescriptions.ts not found at {dish_descriptions_path}")

# Read DishDescriptions.ts
with open(dish_descriptions_path, 'r') as file:
    content = file.read()

# Log the first and last few lines for debugging
print("First 200 characters of DishDescriptions.ts:")
print(content[:200])
print("\nLast 200 characters of DishDescriptions.ts:")
print(content[-200:])

# Parse dishDescriptions array
dish_descriptions = []
current_dish = {}
parsing_array = False
parsing_object = False
current_key = None
current_value = ""
skip_lines = False

lines = content.splitlines()
for i, line in enumerate(lines):
    line = line.strip()
    if not line:
        continue
    if line.startswith('//'):
        continue
    if 'export interface DishDescription {' in line:
        skip_lines = True
        continue
    if skip_lines and line == '}':
        skip_lines = False
        continue
    if skip_lines:
        print(f"Ignoring interface line {i+1}: {line}")
        continue
    if 'export const dishDescriptions: DishDescription[] = [' in line:
        parsing_array = True
        continue
    if parsing_array and line.startswith(']'):
        if current_dish.get('name') and current_dish.get('description'):
            dish_descriptions.append(current_dish)
        parsing_array = False
        continue
    if parsing_array and line.startswith('{'):
        parsing_object = True
        current_dish = {}
        continue
    if parsing_object and line.startswith('name:'):
        current_key = 'name'
        current_value = line.split(':', 1)[1].strip().strip('"').strip(',')
        current_dish['name'] = current_value
    elif parsing_object and line.startswith('description:'):
        current_key = 'description'
        current_value = line.split(':', 1)[1].strip().strip('"').strip(',')
        current_dish['description'] = current_value
    elif parsing_object and line.startswith('},'):
        if current_dish.get('name') and current_dish.get('description'):
            dish_descriptions.append(current_dish)
        parsing_object = False
        current_dish = {}
    elif 'export function getDishDescription' in line:
        break  # Stop parsing at function definition
    else:
        print(f"Warning: Unhandled line {i+1}: {line}")

# Ensure the last dish is added
if current_dish.get('name') and current_dish.get('description'):
    dish_descriptions.append(current_dish)

print(f"Parsed {len(dish_descriptions)} dish descriptions")
print("Parsed dish names:")
for dish in dish_descriptions:
    print(f"- {dish['name']}")

# Check if menus.json exists
if not os.path.exists(menus_json_path):
    raise FileNotFoundError(f"menus.json not found at {menus_json_path}")

# Read menus.json
with open(menus_json_path, 'r') as file:
    menus = json.load(file)

# Update descriptions for items in izMenu and bellFood
unmatched_items = []
matched_items = []
for menu_key in ['izMenu', 'bellFood']:
    for item in menus[menu_key]['items']:
        description = None
        item_name_normalized = normalize_name(item['name'])
        potential_matches = []
        for dish in dish_descriptions:
            dish_name_normalized = normalize_name(dish['name'])
            potential_matches.append(dish['name'])
            print(f"Comparing: '{item_name_normalized}' (from {item['name']}) with '{dish_name_normalized}' (from {dish['name']})")
            if dish_name_normalized == item_name_normalized:
                description = dish['description']
                print(f"Match found: '{item['name']}' in {menu_key} -> '{dish['name']}'")
                matched_items.append((item['name'], menu_key, dish['name']))
                break
        if description:
            item['description'] = description
            print(f"Added description for {item['name']} in {menu_key}")
        else:
            unmatched_items.append((item['name'], menu_key, potential_matches))

# Write updated menus.json
with open(output_menus_json_path, 'w') as file:
    json.dump(menus, file, indent=2)

print("Updated menus.json with dish descriptions")
print(f"\nMatched items ({len(matched_items)}):")
for item_name, menu_key, dish_name in matched_items:
    print(f"- {item_name} in {menu_key} matched with {dish_name}")
if unmatched_items:
    print(f"\nUnmatched items (no description found, showing up to 10 of {len(unmatched_items)}):")
    for item_name, menu_key, matches in unmatched_items[:10]:
        print(f"- {item_name} in {menu_key}")
        print(f"  Potential matches (showing up to 5): {', '.join(matches[:5])}")
    if len(unmatched_items) > 10:
        print(f"... and {len(unmatched_items) - 10} more unmatched items")
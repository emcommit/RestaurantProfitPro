import json
import uuid

def fix_menus():
    with open('server/menus.json', 'r') as f:
        data = json.load(f)
    
    recipe_categories = {'Food', 'Cocktails', 'Liquor Coffees', 'Desserts'}
    
    for menu_key in ['izMenu', 'bellFood']:
        if menu_key not in data:
            data[menu_key] = {"items": [], "initialIngredients": {}, "costMultiplier": 1.1, "categories": []}
        items = []
        for item in data[menu_key]['items']:
            # Normalize category name
            category = item.get('category', '').strip().replace('&', 'and').lower()
            is_recipe = any(cat.lower() in category for cat in recipe_categories)
            is_resale = (
                'wine' in category or
                'soft drink' in category or
                'beer' in category or
                'cider' in category or
                (category == 'drinks' and not any(c.lower() in category for c in ['Cocktails', 'Liquor Coffees']))
            )
            
            if is_recipe:
                item['hasRecipe'] = True
                item['ingredients'] = item.get('ingredients', {})
                if 'buyingPrice' in item:
                    del item['buyingPrice']
            elif is_resale:
                item['hasRecipe'] = False
                item['buyingPrice'] = item.get('buyingPrice', item['sellingPrice'] * 0.7)
                if 'ingredients' in item:
                    del item['ingredients']
            else:
                # Default to recipe for unknown categories
                item['hasRecipe'] = True
                item['ingredients'] = item.get('ingredients', {})
                if 'buyingPrice' in item:
                    del item['buyingPrice']
            
            # Ensure required fields
            if item['sellingPrice'] <= 0:
                item['sellingPrice'] = 1.0
            if 'id' not in item:
                item['id'] = str(uuid.uuid4())
            
            items.append(item)
        
        data[menu_key]['items'] = items
        data[menu_key]['categories'] = list(set(item['category'] for item in items if item['category']))
    
    with open('server/menus.json', 'w') as f:
        json.dump(data, f, indent=2)

fix_menus()
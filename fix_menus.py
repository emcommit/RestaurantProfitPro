import json

def fix_menus():
    with open('server/menus.json', 'r') as f:
        data = json.load(f)
    
    for menu_key in ['izMenu', 'bellFood']:
        if menu_key not in data:
            data[menu_key] = {"items": [], "initialIngredients": {}, "costMultiplier": 1.1, "categories": []}
        for item in data[menu_key]['items']:
            if 'hasRecipe' not in item:
                item['hasRecipe'] = True
            if not item.get('hasRecipe', True) and 'buyingPrice' not in item:
                item['buyingPrice'] = item['sellingPrice'] * 0.7
    
    with open('server/menus.json', 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == '__main__':
    fix_menus()
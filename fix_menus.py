import json
import uuid

def fix_menus():
  with open('server/menus.json', 'r') as f:
    data = json.load(f)
  
  for menu_key in ['izMenu', 'bellFood']:
    if menu_key not in data:
      data[menu_key] = {"items": [], "initialIngredients": {}, "costMultiplier": 1.1, "categories": []}
    items = []
    for item in data[menu_key]['items']:
      if 'hasRecipe' not in item:
        item['hasRecipe'] = True
      if not item.get('hasRecipe', True) and 'buyingPrice' not in item:
        item['buyingPrice'] = item['sellingPrice'] * 0.7
      if item['sellingPrice'] <= 0:
        item['sellingPrice'] = 1.0
      item['id'] = str(uuid.uuid4()) # Add unique ID
      items.append(item)
    data[menu_key]['items'] = items
  
  with open('server/menus.json', 'w') as f:
    json.dump(data, f, indent=2)

fix_menus()
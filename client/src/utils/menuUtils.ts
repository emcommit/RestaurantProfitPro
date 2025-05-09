
import { Ingredient } from '../types/menu';

export const ingredientGroups = [
  'Proteins', 'Vegetables', 'Fruits', 'Dairy', 'Grains', 'Legumes', 'Nuts and Seeds',
  'Herbs and Spices', 'Oils and Vinegars', 'Sweeteners', 'Beverages', 'Condiments',
  'Baking Supplies', 'Canned Goods', 'Frozen Foods', 'Miscellaneous'
];

export const categorizeIngredient = (name: string): string => {
  const lowerName = name.toLowerCase().trim();
  const categories: { [key: string]: string[] } = {
    'Proteins': [
      'lamb', 'beef', 'chicken', 'pork', 'turkey', 'duck', 'goose', 'venison', 'bison', 'rabbit',
      'salmon', 'tuna', 'cod', 'haddock', 'trout', 'mackerel', 'sardine', 'anchovy', 'fish',
      'shrimp', 'prawn', 'lobster', 'crab', 'scallop', 'mussel', 'clam', 'oyster', 'squid', 'octopus',
      'tofu', 'tempeh', 'seitan', 'egg', 'eggs', 'bacon', 'sausage', 'ham', 'prosciutto', 'salami', 'pepperoni',
      'kalamari', 'beefFillet', 'beefRibs', 'lambLiver', 'kingPrawns', 'mincedBeef', 'groundLamb', 'lambChops',
      'lambShank', 'beefSirloin', 'beefMince', 'oxCheek', 'greenlandPrawns', 'kingScallops', 'italianSausage',
      'calabrianSausage', 'ndujaSausage', 'sanDanieleHam', 'chickenLiverPate', 'pepperoni'
    ],
    'Vegetables': [
      'lettuce', 'spinach', 'kale', 'arugula', 'cabbage', 'bok choy', 'collard', 'chard',
      'broccoli', 'cauliflower', 'brussels sprout', 'asparagus', 'artichoke', 'celery',
      'carrot', 'potato', 'sweet potato', 'yam', 'beet', 'radish', 'turnip', 'parsnip',
      'onion', 'garlic', 'shallot', 'leek', 'scallion', 'chive', 'green onion',
      'tomato', 'pepper', 'bell pepper', 'chili', 'jalapeno', 'cucumber', 'zucchini', 'squash', 'pumpkin', 'eggplant',
      'mushroom', 'truffle', 'okra', 'green bean', 'snap pea', 'snow pea', 'corn', 'pea', 'aubergine', 'courgette',
      'courgettes', 'springOnions', 'sunDriedTomatoes', 'beetroot', 'rocket', 'mashedPotatoes', 'rosemaryPotatoes',
      'tripleCookedChips', 'frenchFries', 'cherryTomatoes', 'redOnions', 'greenPeppers', 'redPeppers',
      'tenderStemBroccoli', 'padronPeppers', 'mixedVegetables', 'buttonMushrooms', 'porciniMushrooms'
    ],
    'Fruits': [
      'apple', 'banana', 'orange', 'lemon', 'lime', 'grapefruit', 'mandarin', 'tangerine',
      'strawberry', 'blueberry', 'raspberry', 'blackberry', 'cranberry', 'cherry', 'grape',
      'pineapple', 'mango', 'papaya', 'kiwi', 'peach', 'nectarine', 'plum', 'apricot', 'pear',
      'watermelon', 'melon', 'cantaloupe', 'honeydew', 'fig', 'date', 'pomegranate', 'avocado',
      'apples', 'kiwiPuree', 'pineappleJuice', 'lemonJuice', 'limeJuice', 'orangeJuice', 'cranberryJuice', 'appleJuice'
    ],
    'Dairy': [
      'milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream', 'cottage cheese', 'ricotta',
      'mozzarella', 'cheddar', 'parmesan', 'gouda', 'brie', 'camembert', 'feta', 'goat cheese',
      'ice cream', 'whipped cream', 'half and half', 'buttermilk', 'halloumi', 'roquefortCheese',
      'manchegoCheese', 'vanillaIceCream', 'milkFroth', 'steamedMilk', 'goatCheese', 'granaPadano'
    ],
    'Grains': [
      'rice', 'brown rice', 'white rice', 'wild rice', 'wheat', 'oats', 'barley', 'quinoa',
      'cornmeal', 'polenta', 'bulgur', 'couscous', 'millet', 'rye', 'spelt', 'farro',
      'bread', 'pasta', 'noodle', 'tortilla', 'pita', 'bagel', 'cracker', 'flour', 'whole wheat flour',
      'all-purpose flour', 'bread flour', 'cake flour', 'tortillaWraps', 'arborioRice', 'orzo', 'sourdough', 'pitta',
      'filo'
    ],
    'Legumes': [
      'bean', 'black bean', 'kidney bean', 'pinto bean', 'navy bean', 'lima bean', 'fava bean',
      'lentil', 'pea', 'chickpea', 'soybean', 'edamame', 'split pea', 'mung bean', 'adzuki bean'
    ],
    'Nuts and Seeds': [
      'almond', 'walnut', 'pecan', 'cashew', 'peanut', 'hazelnut', 'macadamia', 'pistachio', 'brazil nut',
      'chia', 'flax', 'sesame', 'pumpkin seed', 'sunflower seed', 'pine nut', 'hemp seed'
    ],
    'Herbs and Spices': [
      'basil', 'oregano', 'thyme', 'rosemary', 'parsley', 'cilantro', 'dill', 'mint', 'sage', 'tarragon',
      'chive', 'bay leaf', 'chervil', 'marjoram', 'cumin', 'paprika', 'coriander', 'turmeric', 'ginger',
      'cinnamon', 'nutmeg', 'clove', 'allspice', 'cardamom', 'saffron', 'curry', 'chili powder',
      'salt', 'pepper', 'black pepper', 'white pepper', 'cayenne', 'mustard seed', 'fennel seed',
      'sumac', 'basilFresh', 'cinnamonSugar', 'ginger', 'peppercorn', 'greenPeppercorn', 'italianHerbs'
    ],
    'Oils and Vinegars': [
      'olive oil', 'canola oil', 'vegetable oil', 'coconut oil', 'peanut oil', 'sesame oil', 'sunflower oil',
      'grape seed oil', 'avocado oil', 'truffle oil', 'balsamic vinegar', 'apple cider vinegar',
      'white vinegar', 'red wine vinegar', 'rice vinegar', 'malt vinegar', 'sherry vinegar', 'oliveOil', 'truffleOil',
      'basilOil'
    ],
    'Sweeteners': [
      'sugar', 'brown sugar', 'white sugar', 'cane sugar', 'honey', 'maple syrup', 'agave nectar',
      'molasses', 'stevia', 'corn syrup', 'date syrup', 'rice syrup', 'artificial sweetener', 'sugarSyrup'
    ],
    'Beverages': [
      'water', 'juice', 'orange juice', 'apple juice', 'grape juice', 'soda', 'cola', 'lemonade',
      'beer', 'wine', 'red wine', 'white wine', 'liquor', 'vodka', 'gin', 'rum', 'whiskey', 'tequila',
      'coffee', 'tea', 'green tea', 'black tea', 'herbal tea', 'milkshake', 'smoothie', 'redWine', 'whiteWine',
      'soda', 'vodka', 'gin', 'hendricksGin', 'coffeeBeans', 'americanoCoffee', 'turkishCoffee', 'teaBag',
      'hotChocolatePowder', 'irishWhiskey', 'espressoCoffee', 'stillWater', 'sparklingWater', 'coke', 'dietCoke',
      'cokeZero', 'cocaCola', 'hotWater', 'appleJuice', 'marsalaWine', 'espressoLungo'
    ],
    'Condiments': [
      'ketchup', 'mustard', 'mayonnaise', 'soy sauce', 'hot sauce', 'barbecue sauce', 'worcestershire sauce',
      'relish', 'pickle', 'salsa', 'chutney', 'horseradish', 'fish sauce', 'oyster sauce', 'hoisin sauce',
      'jam', 'jelly', 'honey mustard', 'aioli', 'tahini', 'sriracha', 'tzatziki', 'izgaraMayonnaise', 'redPepperDip',
      'mayonnaise', 'englishMustard', 'frenchMustard', 'bbqSauce', 'ezme'
    ],
    'Baking Supplies': [
      'flour', 'all-purpose flour', 'whole wheat flour', 'bread flour', 'cake flour', 'baking powder',
      'baking soda', 'yeast', 'vanilla extract', 'cocoa powder', 'chocolate', 'chocolate chip',
      'cornstarch', 'gelatin', 'shortening', 'powdered sugar', 'brown sugar', 'salt', 'gelatine', 'cocoa', 'vanilla'
    ],
    'Canned Goods': [
      'tomato', 'canned tomato', 'tomato sauce', 'tomato paste', 'bean', 'canned bean', 'corn',
      'tuna', 'salmon', 'sardine', 'chicken', 'soup', 'broth', 'stock', 'pineapple', 'peach',
      'olive', 'pickle', 'mushroom', 'artichoke heart', 'olives', 'kalamataOlives', 'blackOlives'
    ],
    'Frozen Foods': [
      'frozen vegetable', 'frozen pea', 'frozen corn', 'frozen broccoli', 'frozen spinach',
      'frozen fruit', 'frozen berry', 'frozen strawberry', 'frozen blueberry', 'ice cream',
      'frozen meat', 'frozen chicken', 'frozen fish', 'frozen pizza', 'frozen dinner', 'frozen dumpling'
    ],
    'Miscellaneous': [
      'bottling', 'distribution', 'oakBarrel', 'driedFruits', 'churros', 'meringue', 'spicyTomatoSauce',
      'chimichurri', 'guacamole', 'truffleMayonnaise', 'chorizo', 'chorizoPicante', 'sucuk', 'groundMince',
      'sherry', 'bechamelSauce', 'vanillaVodka', 'chambord', 'raki', 'bacardi', 'archers', 'coconutMilk',
      'malibu', 'cucumberVodka', 'elderflowerLiqueur', 'lavenderSyrup', 'passoa', 'passionfruitSyrup',
      'passionfruitPuree', 'cointreau', 'kahlua', 'chivasRegal', 'disaronno', 'strawberrySyrup',
      'angosturaBitters', 'tequilaSilver', 'tabasco', 'jackDaniels', 'martiniRosso', 'campari', 'cachaca',
      'havanaWhite', 'havanaDark', 'kraken', 'grenadine', 'wrayAndNephew', 'aperol', 'prosecco',
      'proseccoBrut', 'proseccoRose', 'cava', 'efes', 'efesPint', 'poretti', 'porettiPint', 'estrellaDamm',
      'estrellaDammPint', 'kronenbourg', 'kronenbourgPint', 'guinness', 'guinnessPint', 'mythos', 'madri',
      'corona', 'kopparberg', 'inches', 'sanMiguel', 'corona0', 'kopparberg0', 'cavaRose', 'cremantDeLoire',
      'moet', 'moetRose', 'veuve', 'bollinger', 'laurentPerrier', 'riojaRose', 'egeoRose', 'pierrevertRose',
      'heritageRose', 'spicedRum', 'eggWhite', 'amaretto', 'bourbon', 'peppercorns', 'crouton',
      'vegetableStock', 'lemonZest', 'mascarpone', 'pancetta', 'bolognese', 'marieRoseSauce', 'orange',
      'breadcrumbs', 'balsamicGlaze', 'saffron', 'anchovies', 'artichoke', 'capers', 'feverTree', 'appletiser',
      'j20', 'fruitShoot', 'lemonButter', 'tiaMaria', 'brandySpirit', 'madeira', 'mortadella', 'demiGlace'
    ]
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }
  return 'Miscellaneous';
};

export const calculateRecipeCost = (
  ingredients: Record<string, number>,
  ingredientList: Ingredient[],
  costMultiplier: number
): number => {
  let totalCost = 0;
  Object.entries(ingredients).forEach(([name, quantity]) => {
    const ingredient = ingredientList.find(ing => ing.name === name);
    if (ingredient) {
      let costPerUnit = ingredient.cost;
      // Convert cost to smaller denomination (g for kg, ml for L)
      if (ingredient.unit === 'kg') {
        costPerUnit = ingredient.cost / 1000; // e.g., £7.80/kg to £0.0078/g
      } else if (ingredient.unit === 'L') {
        costPerUnit = ingredient.cost / 1000; // e.g., £2.40/L to £0.0024/ml
      }
      totalCost += costPerUnit * quantity;
    }
  });
  return totalCost * costMultiplier;
};

import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const menusFilePath = path.join(__dirname, '../menus.json');

app.use(cors());
app.use(express.json());

// GET /api/menus - Fetch all menus
app.get('/api/menus', async (req, res) => {
  try {
    console.log('Handling GET /api/menus');
    const data = await fs.readFile(menusFilePath, 'utf-8');
    const menus = JSON.parse(data);
    res.json({ success: true, data: menus });
  } catch (error) {
    console.error('Error in GET /api/menus:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch menus' });
  }
});

// POST /api/ingredients - Add a new ingredient
app.post('/api/ingredients', async (req, res) => {
  try {
    const { name, cost, unit, category } = req.body;
    if (!name || typeof cost !== 'number' || !unit || !category) {
      res.status(400).json({ success: false, message: 'Invalid ingredient data' });
      return;
    }

    const data = await fs.readFile(menusFilePath, 'utf-8');
    const menus = JSON.parse(data);

    ['izMenu', 'bellFood'].forEach(menuKey => {
      if (!menus[menuKey].initialIngredients[name]) {
        menus[menuKey].initialIngredients[name] = { cost, unit, category };
      }
    });

    await fs.writeFile(menusFilePath, JSON.stringify(menus, null, 2));
    res.status(201).json({ success: true, message: 'Ingredient added successfully' });
  } catch (error) {
    console.error('Error in POST /api/ingredients:', error);
    res.status(500).json({ success: false, message: 'Failed to add ingredient' });
  }
});

// POST /api/menus/:menu/dishes - Add a new dish to the specified menu
app.post('/api/menus/:menu/dishes', async (req, res) => {
  try {
    const { menu } = req.params;
    const { id, name, category, sellingPrice, hasRecipe, buyingPrice, ingredients } = req.body;
    if (!id || !name || !category || typeof sellingPrice !== 'number' || typeof hasRecipe !== 'boolean') {
      res.status(400).json({ success: false, message: 'Invalid dish data' });
      return;
    }
    if (hasRecipe && (!ingredients || typeof ingredients !== 'object')) {
      res.status(400).json({ success: false, message: 'Ingredients required for recipe item' });
      return;
    }
    if (!hasRecipe && (typeof buyingPrice !== 'number' || buyingPrice <= 0)) {
      res.status(400).json({ success: false, message: 'Valid buying price required for resale item' });
      return;
    }

    const data = await fs.readFile(menusFilePath, 'utf-8');
    const menus = JSON.parse(data);

    if (!menus[menu]) {
      res.status(400).json({ success: false, message: 'Invalid menu specified' });
      return;
    }

    menus[menu].items.push({
      id,
      name,
      category,
      sellingPrice,
      hasRecipe,
      buyingPrice: hasRecipe ? undefined : buyingPrice,
      ingredients: hasRecipe ? ingredients : {}
    });

    await fs.writeFile(menusFilePath, JSON.stringify(menus, null, 2));
    res.status(201).json({ success: true, message: 'Dish added successfully' });
  } catch (error) {
    console.error('Error in POST /api/menus/:menu/dishes:', error);
    res.status(500).json({ success: false, message: 'Failed to add dish' });
  }
});

// PUT /api/menus/:menu/dishes/:id - Update a dish
app.put('/api/menus/:menu/dishes/:id', async (req, res) => {
  try {
    const { menu, id } = req.params;
    const { name, category, sellingPrice, hasRecipe, buyingPrice, ingredients } = req.body;

    if (!name || !category || typeof sellingPrice !== 'number' || typeof hasRecipe !== 'boolean') {
      res.status(400).json({ success: false, message: 'Invalid dish data' });
      return;
    }
    if (hasRecipe && (!ingredients || typeof ingredients !== 'object')) {
      res.status(400).json({ success: false, message: 'Ingredients required for recipe item' });
      return;
    }
    if (!hasRecipe && (typeof buyingPrice !== 'number' || buyingPrice <= 0)) {
      res.status(400).json({ success: false, message: 'Valid buying price required for resale item' });
      return;
    }

    const data = await fs.readFile(menusFilePath, 'utf-8');
    const menus = JSON.parse(data);

    if (!menus[menu]) {
      res.status(400).json({ success: false, message: 'Invalid menu specified' });
      return;
    }

    const dishIndex = menus[menu].items.findIndex((item: any) => item.id === id);
    if (dishIndex === -1) {
      res.status(404).json({ success: false, message: 'Dish not found' });
      return;
    }

    menus[menu].items[dishIndex] = {
      id,
      name,
      category,
      sellingPrice,
      hasRecipe,
      buyingPrice: hasRecipe ? undefined : buyingPrice,
      ingredients: hasRecipe ? ingredients : {}
    };

    await fs.writeFile(menusFilePath, JSON.stringify(menus, null, 2));
    res.json({ success: true, message: 'Dish updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/menus/:menu/dishes/:id:', error);
    res.status(500).json({ success: false, message: 'Failed to update dish' });
  }
});

// DELETE /api/menus/:menu/dishes/:id - Delete a dish
app.delete('/api/menus/:menu/dishes/:id', async (req, res) => {
  try {
    const { menu, id } = req.params;

    const data = await fs.readFile(menusFilePath, 'utf-8');
    const menus = JSON.parse(data);

    if (!menus[menu]) {
      res.status(400).json({ success: false, message: 'Invalid menu specified' });
      return;
    }

    const dishIndex = menus[menu].items.findIndex((item: any) => item.id === id);
    if (dishIndex === -1) {
      res.status(404).json({ success: false, message: 'Dish not found' });
      return;
    }

    menus[menu].items.splice(dishIndex, 1);

    await fs.writeFile(menusFilePath, JSON.stringify(menus, null, 2));
    res.json({ success: true, message: 'Dish deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/menus/:menu/dishes/:id:', error);
    res.status(500).json({ success: false, message: 'Failed to delete dish' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
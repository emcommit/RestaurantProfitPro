
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: '*' });

interface MenuItem {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  hasRecipe?: boolean;
  buyingPrice?: number;
  ingredients?: Record<string, number>;
}

interface Ingredient {
  cost: number;
  unit: string;
}

interface Menu {
  items: MenuItem[];
  initialIngredients: Record<string, Ingredient>;
  costMultiplier: number;
  categories: string[];
}

interface Menus {
  izMenu: Menu;
  bellFood: Menu;
  [key: string]: Menu;
}

const menusFile = join(__dirname, '../menus.json');
async function loadMenus(): Promise<Menus> {
  try {
    const data = await readFile(menusFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading menus:', error);
    return { izMenu: { items: [], initialIngredients: {}, costMultiplier: 1.1, categories: [] }, bellFood: { items: [], initialIngredients: {}, costMultiplier: 1.1, categories: [] } };
  }
}

async function saveMenus(menus: Menus) {
  await writeFile(menusFile, JSON.stringify(menus, null, 2));
}

function validateItem(item: Partial<MenuItem>): { valid: boolean; error?: string } {
  if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
    return { valid: false, error: 'Name is required and must be a non-empty string' };
  }
  if (!item.category || typeof item.category !== 'string' || item.category.trim() === '') {
    return { valid: false, error: 'Category is required and must be a non-empty string' };
  }
  if (typeof item.sellingPrice !== 'number' || item.sellingPrice <= 0) {
    return { valid: false, error: 'Selling price must be a positive number' };
  }
  if (item.hasRecipe === false && (typeof item.buyingPrice !== 'number' || item.buyingPrice <= 0)) {
    return { valid: false, error: 'Buying price must be a positive number for resale items' };
  }
  return { valid: true };
}

function validateIngredient(ingredient: Partial<Ingredient & { name: string }>): { valid: boolean; error?: string } {
  if (!ingredient.name || typeof ingredient.name !== 'string' || ingredient.name.trim() === '') {
    return { valid: false, error: 'Name is required and must be a non-empty string' };
  }
  if (typeof ingredient.cost !== 'number' || ingredient.cost <= 0) {
    return { valid: false, error: 'Cost must be a positive number' };
  }
  if (!ingredient.unit || typeof ingredient.unit !== 'string' || ingredient.unit.trim() === '') {
    return { valid: false, error: 'Unit is required and must be a non-empty string' };
  }
  return { valid: true };
}

// GET /menus
fastify.get('/menus', async (request, reply) => {
  const menus = await loadMenus();
  return { success: true, data: menus };
});

// POST /menus/:menu/dishes
fastify.post('/menus/:menu/dishes', async (request, reply) => {
  const { menu } = request.params as { menu: string };
  const newItem = request.body as MenuItem;

  const validation = validateItem(newItem);
  if (!validation.valid) {
    reply.status(400);
    return { success: false, error: validation.error };
  }

  const menus = await loadMenus();
  if (!menus[menu]) {
    reply.status(404);
    return { success: false, error: 'Menu not found' };
  }

  menus[menu].items.push(newItem);
  await saveMenus(menus);
  return { success: true };
});

// PUT /menus/:menu/dishes/:id
fastify.put('/menus/:menu/dishes/:id', async (request, reply) => {
  const { menu, id } = request.params as { menu: string; id: string };
  const updatedItem = request.body as MenuItem;

  const validation = validateItem(updatedItem);
  if (!validation.valid) {
    reply.status(400);
    return { success: false, error: validation.error };
  }

  const menus = await loadMenus();
  if (!menus[menu]) {
    reply.status(404);
    return { success: false, error: 'Menu not found' };
  }

  const itemIndex = menus[menu].items.findIndex((item: MenuItem) => item.id === id);
  if (itemIndex === -1) {
    reply.status(404);
    return { success: false, error: 'Item not found' };
  }

  menus[menu].items[itemIndex] = { ...updatedItem, id };
  await saveMenus(menus);
  return { success: true };
});

// DELETE /menus/:menu/dishes/:id
fastify.delete('/menus/:menu/dishes/:id', async (request, reply) => {
  const { menu, id } = request.params as { menu: string; id: string };

  const menus = await loadMenus();
  if (!menus[menu]) {
    reply.status(404);
    return { success: false, error: 'Menu not found' };
  }

  const itemIndex = menus[menu].items.findIndex((item: MenuItem) => item.id === id);
  if (itemIndex === -1) {
    reply.status(404);
    return { success: false, error: 'Item not found' };
  }

  menus[menu].items.splice(itemIndex, 1);
  await saveMenus(menus);
  return { success: true };
});

// POST /ingredients
fastify.post('/api/ingredients', async (request, reply) => {
  const ingredient = request.body as Ingredient & { name: string };

  const validation = validateIngredient(ingredient);
  if (!validation.valid) {
    reply.status(400);
    return { success: false, error: validation.error };
  }

  const menus = await loadMenus();
  menus.izMenu.initialIngredients[ingredient.name] = {
    cost: ingredient.cost,
    unit: ingredient.unit
  };
  await saveMenus(menus);
  return { success: true };
});

// PUT /ingredients/:name
fastify.put('/api/ingredients/:name', async (request, reply) => {
  const { name } = request.params as { name: string };
  const updatedIngredient = request.body as Ingredient & { name: string };

  const validation = validateIngredient(updatedIngredient);
  if (!validation.valid) {
    reply.status(400);
    return { success: false, error: validation.error };
  }

  const menus = await loadMenus();
  if (!menus.izMenu.initialIngredients[name]) {
    reply.status(404);
    return { success: false, error: 'Ingredient not found' };
  }

  menus.izMenu.initialIngredients[name] = {
    cost: updatedIngredient.cost,
    unit: updatedIngredient.unit
  };
  await saveMenus(menus);
  return { success: true };
});

// DELETE /ingredients/:name
fastify.delete('/api/ingredients/:name', async (request, reply) => {
  const { name } = request.params as { name: string };

  const menus = await loadMenus();
  if (!menus.izMenu.initialIngredients[name]) {
    reply.status(404);
    return { success: false, error: 'Ingredient not found' };
  }

  delete menus.izMenu.initialIngredients[name];
  await saveMenus(menus);
  return { success: true };
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server running on ${address}`);
});
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { z } from 'zod';
import path from 'path';

// Define the database schema
interface MenuItem {
  name: string;
  category: string;
  sellingPrice: number;
  hasRecipe?: boolean;
  buyingPrice?: number;
  ingredients?: Record<string, number>;
}

interface Menu {
  items: MenuItem[];
  initialIngredients: Record<string, { cost: number; unit: string }>;
  costMultiplier: number;
  categories: string[];
}

interface Database {
  izMenu: Menu;
  bellFood: Menu;
  [key: string]: Menu; // Allow additional menus
}

const app = Fastify();
app.register(cors, { origin: ['http://localhost:5173'] });

// Initialize LowDB
const file = path.join(__dirname, '../menus.json');
const adapter = new JSONFile<Database>(file);
const db = new Low<Database>(adapter, {
  izMenu: { items: [], initialIngredients: {}, costMultiplier: 1.1, categories: [] },
  bellFood: { items: [], initialIngredients: {}, costMultiplier: 1.1, categories: [] }
});

// Zod schema for runtime validation
const ItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  sellingPrice: z.number().positive(),
  hasRecipe: z.boolean().optional(),
  buyingPrice: z.number().positive().optional(),
  ingredients: z.record(z.number()).optional()
});

// Fastify JSON Schema for route validation
const ItemJsonSchema = {
  type: 'object',
  required: ['name', 'category', 'sellingPrice'],
  properties: {
    name: { type: 'string', minLength: 1 },
    category: { type: 'string', minLength: 1 },
    sellingPrice: { type: 'number', minimum: 0.01 },
    hasRecipe: { type: 'boolean' },
    buyingPrice: { type: 'number', minimum: 0.01 },
    ingredients: { type: 'object', additionalProperties: { type: 'number' } }
  }
};

// Routes
app.get('/menus', async (_, reply) => {
  await db.read();
  return { success: true, data: db.data };
});

app.post('/menus/:menuKey/dishes', {
  schema: {
    body: ItemJsonSchema,
    params: {
      type: 'object',
      required: ['menuKey'],
      properties: {
        menuKey: { type: 'string', enum: ['izMenu', 'bellFood'] }
      }
    }
  }
}, async (request, reply) => {
  const { menuKey } = request.params as { menuKey: 'izMenu' | 'bellFood' };
  const newItem = ItemSchema.parse(request.body); // Runtime validation with Zod
  await db.read();
  if (!db.data[menuKey]) {
    db.data[menuKey] = { items: [], initialIngredients: {}, costMultiplier: 1.1, categories: [] };
  }
  db.data[menuKey].items.push(newItem);
  if (!db.data[menuKey].categories.includes(newItem.category)) {
    db.data[menuKey].categories.push(newItem.category);
  }
  await db.write();
  return db.data[menuKey];
});

// Start server
app.listen({ port: 3000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server running on port 3000');
});
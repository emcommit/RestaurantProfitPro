import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

// Define the shape of the database
interface MenuItem {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  ingredients: Record<string, number>;
  hasRecipe: boolean;
  description: string;
  buyingPrice?: number;
}

interface MenuData {
  initialIngredients: Record<string, { cost: number; unit: string; category: string }>;
  items: MenuItem[];
  costMultiplier: number;
  categories: string[];
}

interface Database {
  izMenu: MenuData;
}

const app = express();

// Set up lowdb
const file = path.join(process.cwd(), 'menus.json');
console.log('Database file path:', file);
const adapter = new JSONFile<Database>(file);
const db = new Low<Database>(adapter, { izMenu: { initialIngredients: {}, items: [], costMultiplier: 1, categories: [] } });

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('/api/menus', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204);
});

app.use(express.json());

app.get('/api/menus', async (req, res) => {
  await db.read();
  console.log('Database contents:', db.data);
  const menus = db.data.izMenu.items || [];
  res.json({ success: true, data: menus });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
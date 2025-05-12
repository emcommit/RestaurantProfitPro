import express from 'express';
import cors from 'cors';
import path from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  ingredients?: Record<string, number>;
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
  bellFood?: MenuData;
}

const app = express();

const file = path.join(process.cwd(), 'menus.json');
console.log('Database file path:', file);

const adapter = new JSONFile<Database>(file);
const db = new Low<Database>(adapter, {
  izMenu: { initialIngredients: {}, items: [], costMultiplier: 1, categories: [] }
});

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
  res.json({ success: true, data: db.data });
});

app.post('/api/menus', async (req, res) => {
  try {
    const updatedData = req.body as Database;
    console.log('Received updated data:', updatedData);
    db.data = updatedData;
    await db.write();
    console.log('Updated database contents:', db.data);
    res.json({ success: true, message: 'Menus updated successfully' });
  } catch (error) {
    console.error('Error updating menus:', error);
    res.status(500).json({ success: false, message: 'Failed to update menus' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
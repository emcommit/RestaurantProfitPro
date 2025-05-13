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

// CORS middleware (allow only your Netlify frontend)
const allowedOrigin = 'https://willowy-begonia-4a2a9f.netlify.app';

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}) );

// Ensure preflight OPTIONS requests work
app.options('*', cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

// API route
app.get('/api/menus', async (req, res) => {
  await db.read();
  res.json({ success: true, data: db.data }); 
});

// Default port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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

// CORS middleware
app.use(cors({
  origin: "*", // For development, consider restricting this in production
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  console.log("Health check endpoint hit");
  res.status(200).send('OK');
});


// API route with enhanced logging and error handling
app.get('/api/menus', async (req, res) => {
  console.log("Attempting to access /api/menus endpoint");
  try {
    console.log("Attempting to read database (db.read())");
    await db.read();
    console.log("Successfully read database. Data:", JSON.stringify(db.data)); // Log the data to see its structure
    console.log("Attempting to send response with db.data");
    res.json({ success: true, data: db.data });
    console.log("Successfully sent response for /api/menus");
  } catch (error) {
    console.error("Error in /api/menus endpoint:", error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message: 'Failed to retrieve menus.', error: errorMessage });
  }
});

// Default port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


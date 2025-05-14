import express from 'express';
import cors from 'cors';
import path from 'path';
// import { Low } from 'lowdb'; // Temporarily commented out for diagnostics
// import { JSONFile } from 'lowdb/node'; // Temporarily commented out for diagnostics

// Interface definitions (can be kept or commented out, not critical for this diagnostic)
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

// const file = path.join(process.cwd(), 'menus.json'); // Temporarily commented out
// console.log('Database file path:', file); // Temporarily commented out

// const adapter = new JSONFile<Database>(file); // Temporarily commented out
// const db = new Low<Database>(adapter, { // Temporarily commented out
//   izMenu: { initialIngredients: {}, items: [], costMultiplier: 1, categories: [] }
// });

// CORS middleware
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  console.log("Health check endpoint hit");
  res.status(200).send('OK');
});


// DIAGNOSTIC VERSION of /api/menus route
app.get('/api/menus', async (req, res) => {
  console.log("DIAGNOSTIC: /api/menus endpoint was hit!");
  try {
    // No database interaction in this diagnostic version
    console.log("DIAGNOSTIC: Attempting to send simple static response.");
    res.json({ success: true, message: "Diagnostic response from /api/menus", data: { test: "ok" } });
    console.log("DIAGNOSTIC: Successfully sent static response for /api/menus");
  } catch (error) {
    console.error("DIAGNOSTIC: Error in simplified /api/menus endpoint:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred in diagnostic route';
    res.status(500).json({ success: false, message: 'Failed in diagnostic /api/menus.', error: errorMessage });
  }
});

// Default port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


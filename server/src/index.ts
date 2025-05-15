import express from 'express';
import cors from 'cors';
import path from 'path'; // Keep for consistency, though not used in ultra-minimal route
import fs from 'fs'; // Keep for consistency, though not used in ultra-minimal route

// Interfaces are not strictly needed for this ultra-minimal test but kept for structural similarity
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

const file = path.join(process.cwd(), 'menus.json'); // Path determined but not used in /api/menus
console.log(`[${new Date().toISOString()}] LOG: Database file path determined as: ${file}`);

// Synchronous check for menus.json existence at startup (can be kept)
try {
  if (fs.existsSync(file)) {
    console.log(`[${new Date().toISOString()}] LOG: menus.json FOUND at startup at ${file}`);
  } else {
    console.warn(`[${new Date().toISOString()}] WARN: menus.json NOT FOUND at startup at ${file}`);
  }
} catch (err) {
  console.error(`[${new Date().toISOString()}] ERROR: Error checking for menus.json at startup:`, err);
}

// CORS middleware (important to keep)
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Health check route (important to keep)
app.get('/', (req, res) => {
  console.log(`[${new Date().toISOString()}] LOG: Health check endpoint / hit`);
  res.status(200).send('OK - Health check passed');
});

// ULTRA-MINIMAL /api/menus route
app.get('/api/menus', async (req, res) => {
  const requestTimestamp = new Date().toISOString();
  // Log entry immediately
  console.log(`[${requestTimestamp}] LOG: --- /api/menus (ULTRA-MINIMAL) endpoint ENTERED ---`);
  
  // Send a simple static response
  res.status(200).json({ success: true, message: "Ultra-minimal /api/menus response OK" });
  
  // Log exit after sending response
  console.log(`[${requestTimestamp}] LOG: --- /api/menus (ULTRA-MINIMAL) endpoint EXITED (response sent) ---`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] LOG: Server running on port ${PORT} (Ultra-minimal /api/menus test version)`);
});


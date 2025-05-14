import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs'; // Import fs for file system checks
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
console.log(`[${new Date().toISOString()}] LOG: Database file path determined as: ${file}`);

// Synchronous check for menus.json existence at startup
try {
  if (fs.existsSync(file)) {
    console.log(`[${new Date().toISOString()}] LOG: menus.json FOUND at startup at ${file}`);
  } else {
    console.warn(`[${new Date().toISOString()}] WARN: menus.json NOT FOUND at startup at ${file}`);
  }
} catch (err) {
  console.error(`[${new Date().toISOString()}] ERROR: Error checking for menus.json at startup:`, err);
}

const adapter = new JSONFile<Database>(file);
const db = new Low<Database>(adapter, {
  izMenu: { initialIngredients: {}, items: [], costMultiplier: 1, categories: [] },
  bellFood: { initialIngredients: {}, items: [], costMultiplier: 1, categories: [] }
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  console.log(`[${new Date().toISOString()}] LOG: Health check endpoint / hit`);
  res.status(200).send('OK');
});

app.get('/api/menus', async (req, res) => {
  const requestTimestamp = new Date().toISOString();
  console.log(`[${requestTimestamp}] LOG: --- /api/menus endpoint ENTERED ---`); // VERY FIRST LOG

  try {
    console.log(`[${requestTimestamp}] LOG: Checking menus.json existence inside /api/menus...`);
    if (fs.existsSync(file)) {
      console.log(`[${requestTimestamp}] LOG: menus.json FOUND inside /api/menus at ${file}`);
    } else {
      console.warn(`[${requestTimestamp}] WARN: menus.json NOT FOUND inside /api/menus at ${file} - This will likely cause db.read() to fail.`);
      // Optionally, you could return an error here if the file must exist
      // return res.status(500).json({ success: false, message: 'Critical error: Database file not found.' });
    }

    console.log(`[${requestTimestamp}] LOG: Attempting to read database (db.read())`);
    await db.read();
    console.log(`[${requestTimestamp}] LOG: Successfully read database. Data keys:`, Object.keys(db.data || {}));
    
    if (!db.data) {
      console.error(`[${requestTimestamp}] CATCH_ERROR: Database data is null or undefined after read.`);
      return res.status(500).json({ success: false, message: 'Failed to retrieve menus: Database data not available.' });
    }
    
    console.log(`[${requestTimestamp}] LOG: Attempting to send response with db.data`);
    res.json({ success: true, data: db.data });
    console.log(`[${requestTimestamp}] LOG: --- Successfully sent response for /api/menus ---`);
  } catch (error) {
    console.error(`[${requestTimestamp}] CATCH_ERROR: Error in /api/menus endpoint:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // Ensure stack trace is logged if available
    if (error instanceof Error && error.stack) {
      console.error(`[${requestTimestamp}] CATCH_ERROR_STACK: ${error.stack}`);
    }
    res.status(500).json({ success: false, message: 'Failed to retrieve menus.', error: errorMessage });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] LOG: Server running on port ${PORT}`);
});


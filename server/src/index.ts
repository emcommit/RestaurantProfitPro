import express from 'express';
import cors from 'cors';

const app = express();

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

app.get('/api/menus', (req, res) => {
  const menus = [
    { id: 1, name: "Burger", price: 10, hasRecipe: false },
    { id: 2, name: "Pizza", price: 12, hasRecipe: true },
    { id: 3, name: "Salad", price: 8, hasRecipe: true },
    { id: 4, name: "Fries", price: 5, hasRecipe: false },
    { id: 5, name: "Soda", price: 3, hasRecipe: false }
  ];
  res.json({ success: true, data: menus });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
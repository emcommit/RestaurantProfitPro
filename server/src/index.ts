import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // Handle preflight requests

app.use(express.json());

app.get('/api/menus', (req, res) => {
  try {
    const menus = [
      { id: 1, name: "Burger", price: 10 },
      { id: 2, name: "Pizza", price: 12 },
    ];
    res.json(menus);
  } catch (error) {
    console.error('Error in /api/menus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
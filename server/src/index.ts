import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/menus', (req, res) => {
  const menus = [
    { id: 1, name: "Burger", price: 10 },
    { id: 2, name: "Pizza", price: 12 },
  ];
  res.json(menus);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import express from 'express';

const app = express();

// Minimal health check route
app.get('/', (req, res) => {
  console.log("Minimal health check endpoint hit!");
  res.status(200).send('OK from minimal server');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});


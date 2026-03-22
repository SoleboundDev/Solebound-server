const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Solebound server is running!' });
});

// Player endpoint
app.get('/player', (req, res) => {
  res.json({
    id: "test_player",
    username: "SoleboundPlayer",
    aglets: 100,
    goldAglets: 10
  });
});

// Sneakers endpoint
app.get('/sneakers', (req, res) => {
  res.json([]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Solebound server running on port ${PORT}`);
});
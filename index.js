const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
});

// Log ALL incoming requests
app.use((req, res, next) => {
  console.log(`\n=== ${req.method} ${req.url}`);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Solebound server is running!' });
});

// Auth endpoint
app.post('/auth/google', async (req, res) => {
  const { idToken } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    res.json({ uid: decoded.uid, email: decoded.email });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Player endpoint
app.get('/player', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    res.json({
      id: decoded.uid,
      username: decoded.email,
      aglets: 100,
      goldAglets: 10
    });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Sneakers endpoint
app.get('/sneakers', (req, res) => {
  res.json([]);
});

// Catch-all - respond 200 to everything so game doesn't hang
app.all('*', (req, res) => {
  res.status(200).json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Solebound server running on port ${PORT}`);
});

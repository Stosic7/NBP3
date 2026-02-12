require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173']
}));
app.use(express.json());

// MongoDB connection
connectDB();

// Routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'TechStock Backend API working!',
    mongodb: process.env.MONGODB_URI ? 'Connected' : 'Check .env',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/devices', require('./routes/devices'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TechStock Server running on port ${PORT}`);
});

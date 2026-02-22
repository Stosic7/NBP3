require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

connectDB();

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is alive on 5001' });
});

app.use('/api/devices', require('./routes/devices'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/advanced-analytics', require('./routes/advancedAnalytics'));
app.use('/api/auth', require('./routes/auth'));

// FORSIRAMO PORT 5001
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`TechStock Server running on port ${PORT}`);
});
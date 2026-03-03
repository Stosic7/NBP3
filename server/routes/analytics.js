const express = require('express');
const Device = require('../models/Device');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/monthly-profit', protect, async (req, res) => {
  try {
    const stats = await Device.aggregate([
      { $match: { status: 'sold' } },
      {
        $group: {
          _id: { $month: "$sellDate" },
          totalProfit: { $sum: { $subtract: ["$sellPrice", "$buyPrice"] } },
          totalRevenue: { $sum: "$sellPrice" },
          devicesSold: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/top-customers', protect, async (req, res) => {
  try {
    const topCustomers = await Device.aggregate([
      { $match: { status: 'sold', "customer.email": { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$customer.email",
          name: { $first: "$customer.name" },
          totalSpent: { $sum: "$sellPrice" },
          devicesBought: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);
    res.json(topCustomers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
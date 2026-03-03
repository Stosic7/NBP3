const express = require('express');
const Device = require('../models/Device');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profit-matrix', protect, async (req, res) => {
  try {
    const matrix = await Device.aggregate([
      { $match: { status: 'sold' } },
      { $addFields: { profit: { $subtract: ["$sellPrice", "$buyPrice"] } } },
      {
        $bucket: {
          groupBy: "$profit",
          boundaries: [0, 50, 150, 300, 1000],
          default: "Premium",
          output: {
            count: { $sum: 1 },
            totalProfit: { $sum: "$profit" },
            devices: { 
              $push: { 
                manufacturer: "$manufacturer", 
                model: "$model", 
                profit: "$profit" 
              } 
            }
          }
        }
      }
    ]);
    res.json(matrix);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/inventory-aging', protect, async (req, res) => {
  try {
    const aging = await Device.aggregate([
      { $match: { status: 'available' } },
      {
        $project: {
          manufacturer: 1,
          model: 1,
          buyPrice: 1,
          receiveDate: 1,
          daysInStock: {
            $dateDiff: { startDate: "$receiveDate", endDate: new Date(), unit: "day" }
          }
        }
      },
      { $sort: { daysInStock: -1 } },
      { $limit: 15 }
    ]);
    res.json(aging);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
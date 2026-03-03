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
    const devices = await Device.find({ status: { $nin: ['sold', 'reserved'] } }).lean();
    
    const aging = devices.map(device => {
      const rDate = device.receiveDate ? new Date(device.receiveDate) : new Date();
      const diffTime = Math.abs(new Date() - rDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
      
      return {
        _id: device._id,
        manufacturer: device.manufacturer,
        model: device.model,
        buyPrice: device.buyPrice,
        receiveDate: device.receiveDate,
        daysInStock: diffDays
      };
    });

    aging.sort((a, b) => b.daysInStock - a.daysInStock);
    
    res.json(aging.slice(0, 15));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
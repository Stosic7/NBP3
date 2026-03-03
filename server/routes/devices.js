const express = require('express');
const Device = require('../models/Device');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const devices = await Device.find().sort({ receiveDate: -1 }).lean();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const deviceData = { ...req.body, user: req.user._id };
    const device = new Device(deviceData);
    const newDevice = await device.save();
    
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 50, devicesCount: 1 }
    });
    
    res.status(201).json(newDevice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found' });
    
    if (device.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Nemate pravo da obrišete ovaj uređaj' });
    }

    await device.deleteOne();
    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    let device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found' });

    if (device.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Nemate pravo da menjate ovaj uređaj' });
    }

    device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(device);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
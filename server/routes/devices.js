const express = require('express');
const Device = require('../models/Device');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const devices = await Device.find().sort({ receiveDate: -1 }).lean();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const device = new Device(req.body);
    const newDevice = await device.save();
    
    if (req.body.userId) {
      await User.findByIdAndUpdate(req.body.userId, {
        $inc: { points: 50, devicesCount: 1 }
      });
    }
    
    res.status(201).json(newDevice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found' });
    await device.deleteOne();
    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!device) return res.status(404).json({ message: 'Device not found' });
    res.json(device);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
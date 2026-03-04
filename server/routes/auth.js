const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'techstock_tajna_sifra_123', { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Korisnik sa ovim emailom već postoji' });
    
    const userAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
    const user = await User.create({ name, email, password, avatar: userAvatar });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        points: user.points,
        level: user.level,
        devicesCount: user.devicesCount,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Nevažeći podaci' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        points: user.points,
        level: user.level,
        devicesCount: user.devicesCount,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Pogrešan email ili lozinka' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      points: user.points,
      level: user.level,
      devicesCount: user.devicesCount,
      token: req.headers.authorization.split(' ')[1]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.avatar) {
        user.avatar = req.body.avatar;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        points: updatedUser.points,
        level: updatedUser.level,
        devicesCount: updatedUser.devicesCount,
        token: req.headers.authorization.split(' ')[1] 
      });
    } else {
      res.status(404).json({ message: 'Korisnik nije pronađen' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
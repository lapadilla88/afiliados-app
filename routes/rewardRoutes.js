const express = require('express');
const { protect } = require('../controllers/authController');
const Reward = require('../models/Reward');
const router = express.Router();

// Obtener recompensas
router.get('/', async (req, res) => {
  const rewards = await Reward.find();
  res.json(rewards);
});

// Canjear recompensa
router.post('/redeem/:id', protect, async (req, res) => {
  const reward = await Reward.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (user.points >= reward.pointsRequired) {
    user.points -= reward.pointsRequired;
    await user.save();
    res.json({ message: 'Recompensa canjeada con éxito' });
  } else {
    res.status(400).json({ error: 'No tienes suficientes puntos' });
  }
});

module.exports = router;

const express = require('express');
const { register, login, protect } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/dashboard', protect, (req, res) => {
  res.send('Acceso al dashboard');
});

module.exports = router;

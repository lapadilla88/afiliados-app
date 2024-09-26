const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Función para generar JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registro de usuario
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const affiliateID = Math.random().toString(36).substr(2, 9); // Generar ID único

  try {
    const newUser = await User.create({ name, email, password, affiliateID });
    const token = generateToken(newUser);
    res.status(201).json({ token, affiliateID: newUser.affiliateID });
  } catch (error) {
    res.status(400).json({ error: 'El registro falló' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = generateToken(user);
    res.json({ token, affiliateID: user.affiliateID });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Middleware para proteger rutas
exports.protect = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

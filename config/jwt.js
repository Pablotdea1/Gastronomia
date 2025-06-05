const jwt = require('jsonwebtoken');

// Clave secreta para JWT - Usando una clave segura y compleja
const JWT_SECRET = 'gastronomia_jwt_2024_$ecret_k3y_pl@smic5';
const JWT_EXPIRES_IN = '24h';

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  
  generateToken(userId) {
    return jwt.sign(
      { id: userId }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
};
const { verifyToken } = require('../config/jwt');
const pool = require('../config/database');

exports.isAuthenticated = async (req, res, next) => {
  try {
    // Obtener el token de las cookies o del header
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.redirect('/auth/login');
    }

    // Verificar el token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.clearCookie('jwt');
      return res.redirect('/auth/login');
    }

    // Verificar sesión activa
    const [sesion] = await pool.query(
      'SELECT * FROM sesiones WHERE token = ? AND activa = true AND fecha_expiracion > NOW()',
      [token]
    );

    if (!sesion.length) {
      res.clearCookie('jwt');
      return res.redirect('/auth/login');
    }

    // Obtener datos del usuario
    const [usuario] = await pool.query(
      'SELECT id, nombre, email, rol FROM usuarios WHERE id = ? AND activo = true',
      [decoded.id]
    );

    if (!usuario.length) {
      res.clearCookie('jwt');
      return res.redirect('/auth/login');
    }

    // Agregar usuario a la request
    req.user = usuario[0];
    res.locals.user = usuario[0]; // Para acceder al usuario en las vistas
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).redirect('/auth/login');
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).render('error', {
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
};

exports.isGuest = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    return res.redirect('/');
  }
  next();
};
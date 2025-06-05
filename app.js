const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const restauranteRoutes = require('./routes/restauranteRoutes');
const tipoCocinaRoutes = require('./routes/tipoCocinaRoutes');
const ubicacionRoutes = require('./routes/ubicacionRoutes');

const app = express();

// Configuración de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de sesión - DEBE IR ANTES DE FLASH
app.use(session({
  secret: 'gastronomia_session_2024_$ecret_k3y_pl@smic5',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Configurar flash - DESPUÉS DE SESSION
app.use(flash());

// Middleware global para variables locales
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Usar rutas
app.use('/auth', authRoutes);
app.use('/restaurantes', restauranteRoutes);
app.use('/tipos-cocina', tipoCocinaRoutes);
app.use('/ubicaciones', ubicacionRoutes);

// Rutas principales
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Sistema de Reseñas de Restaurantes'
  });
});

// Manejo de 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Página no encontrada',
    message: 'La página que buscas no existe'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Error',
    message: 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
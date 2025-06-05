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
const resenaRoutes = require('./routes/resenaRoutes');
const menuRoutes = require('./routes/menuRoutes');
const tipoCocinaRoutes = require('./routes/tipoCocinaRoutes');
const ubicacionRoutes = require('./routes/ubicacionRoutes');

const app = express();

// Configuración de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Configuración de sesión
app.use(session({
  secret: 'gastronomia_session_2024_$ecret_k3y_pl@smic5',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Variables globales
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.messages = req.flash();
  next();
});

// Rutas principales
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Sistema de Reseñas de Restaurantes'
  });
});

// Rutas de la aplicación
app.use('/auth', authRoutes);           // <- Agregada esta línea
app.use('/restaurantes', restauranteRoutes);
app.use('/resenas', resenaRoutes);
app.use('/menus', menuRoutes);
app.use('/tipos-cocina', tipoCocinaRoutes);
app.use('/ubicaciones', ubicacionRoutes);

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
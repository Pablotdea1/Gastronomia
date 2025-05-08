const express = require('express');
const restauranteRoutes = require('./routes/restauranteRoutes');
const resenaRoutes = require('./routes/resenaRoutes'); 
const menuRoutes = require('./routes/menuRoutes');
const tipoCocinaRoutes = require('./routes/tipoCocinaRoutes');
const ubicacionRoutes = require('./routes/ubicacionRoutes');

const app = express();
app.use(express.json());

app.use('/api/restaurantes', restauranteRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/tipos-cocina', tipoCocinaRoutes);
app.use('/api/ubicaciones', ubicacionRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
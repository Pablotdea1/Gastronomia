const { validationResult } = require('express-validator');
const Ubicacion = require('../models/ubicacion');

// Crear nueva ubicación (con coordenadas)
exports.crearUbicacion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { ciudad, direccion, lat, lng } = req.body;

    // Validar coordenadas
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: 'Latitud o longitud inválidas' });
    }

    // Formato correcto: POINT(lng lat)
    const nuevaUbicacion = await Ubicacion.create({
      ciudad,
      direccion,
      coordenadas: `${lng} ${lat}` // Longitud primero
    });

    res.status(201).json({ success: true, data: nuevaUbicacion });

  } catch (error) {
    console.error('Error en crearUbicacion:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar ubicación',
      error: error.message // Detalle del error para depuración
    });
  }
};

// Obtener ubicaciones dentro de un radio (en kilómetros)
exports.getCercanos = async (req, res) => {
  try {
    const { lat, lng, radio } = req.query;
    const ubicaciones = await Ubicacion.getDentroRadio(parseFloat(lat), parseFloat(lng), parseFloat(radio));
    res.json({ success: true, data: ubicaciones });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en búsqueda geográfica' });
  }
};
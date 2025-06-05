const { validationResult } = require('express-validator');
const Ubicacion = require('../models/ubicacion');

// Obtener todas las ubicaciones
exports.index = async (req, res, next) => {
  try {
    const ubicaciones = await Ubicacion.getAll();
    res.render('ubicacion/index', {
      title: 'Ubicaciones',
      ubicaciones
    });
  } catch (error) {
    next(error);
  }
};

// Mostrar formulario para nueva ubicación
exports.new = async (req, res, next) => {
  try {
    res.render('ubicacion/form', {
      title: 'Nueva Ubicación',
      ubicacion: {},
      isEditing: false,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

// Crear nueva ubicación (con coordenadas)
exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', 'Por favor corrija los errores en el formulario');
      return res.render('ubicacion/form', {
        title: 'Nueva Ubicación',
        ubicacion: req.body,
        errors: errors.array()
      });
    }

    const ubicacionData = {
      ciudad: req.body.ciudad,
      direccion: req.body.direccion,
      lat: req.body.lat || 0,  // Asegurarse de que estos campos existan en el formulario
      lng: req.body.lng || 0
    };

    await Ubicacion.create(ubicacionData);
    req.flash('success', 'Ubicación creada exitosamente');
    res.redirect('/ubicaciones');
  } catch (error) {
    console.error('Error al crear ubicación:', error);
    req.flash('error', 'Error al crear la ubicación');
    res.render('ubicacion/form', {
      title: 'Nueva Ubicación',
      ubicacion: req.body,
      errors: [{ msg: 'Error al crear la ubicación' }]
    });
  }
};

// Obtener detalles de una ubicación por ID
exports.show = async (req, res, next) => {
  try {
    const ubicacion = await Ubicacion.getById(req.params.id);
    if (!ubicacion) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Ubicación no encontrada'
      });
    }
    res.render('ubicacion/show', {
      title: `${ubicacion.ciudad} - ${ubicacion.direccion}`,
      ubicacion
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una ubicación por ID
exports.delete = async (req, res, next) => {
  try {
    const success = await Ubicacion.delete(req.params.id);
    if (!success) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Ubicación no encontrada'
      });
    }
    res.redirect('/ubicaciones');
  } catch (error) {
    next(error);
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
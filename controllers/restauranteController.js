const { validationResult } = require('express-validator');
const Restaurante = require('../models/restaurante');
const TipoCocina = require('../models/tipoCocina');
const Ubicacion = require('../models/ubicacion');

// Listar restaurantes
exports.index = async (req, res, next) => {
  try {
    const restaurantes = await Restaurante.getAll();
    res.render('restaurantes/index', {
      title: 'Listado de Restaurantes',
      restaurantes
    });
  } catch (error) {
    next(error);
  }
};

// Mostrar formulario de nuevo restaurante
exports.new = async (req, res, next) => {
  try {
    // Obtener tipos de cocina y ubicaciones al mismo tiempo
    const [tiposCocina, ubicaciones] = await Promise.all([
      TipoCocina.getAll(),
      Ubicacion.getAll()
    ]);

    res.render('restaurantes/form', {
      title: 'Nuevo Restaurante',
      restaurante: {},
      tiposCocina,
      ubicaciones,
      isEditing: false,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

// Crear restaurante
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Si hay errores, volver a cargar el formulario con los datos
      const [tiposCocina, ubicaciones] = await Promise.all([
        TipoCocina.getAll(),
        Ubicacion.getAll()
      ]);

      return res.render('restaurantes/form', {
        title: 'Nuevo Restaurante',
        restaurante: req.body,
        tiposCocina,
        ubicaciones,
        isEditing: false,
        errors: errors.array()
      });
    }

    await Restaurante.create(req.body);
    res.redirect('/restaurantes');
  } catch (error) {
    next(error);
  }
};

// Mostrar restaurante
exports.show = async (req, res, next) => {
  try {
    const restaurante = await Restaurante.getByIdWithDetails(req.params.id);
    
    if (!restaurante) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Restaurante no encontrado'
      });
    }

    // Asegurar que los valores numéricos existan
    restaurante.calificacion_promedio = parseFloat(restaurante.calificacion_promedio) || 0;
    restaurante.precio_promedio = parseFloat(restaurante.precio_promedio) || 0;

    res.render('restaurantes/show', {
      title: restaurante.nombre,
      restaurante
    });
  } catch (error) {
    next(error);
  }
};

// Mostrar formulario de edición
exports.edit = async (req, res, next) => {
  try {
    const [restaurante, tiposCocina, ubicaciones] = await Promise.all([
      Restaurante.getById(req.params.id),
      TipoCocina.getAll(),
      Ubicacion.getAll()
    ]);

    if (!restaurante) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Restaurante no encontrado'
      });
    }

    res.render('restaurantes/form', {
      title: `Editar ${restaurante.nombre}`,
      restaurante,
      tiposCocina,
      ubicaciones,
      isEditing: true,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar restaurante
exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const tiposCocina = await TipoCocina.getAll();
      return res.render('restaurantes/form', {
        title: 'Editar Restaurante',
        restaurante: { ...req.body, id: req.params.id },
        tiposCocina,
        isEditing: true,
        errors: errors.array()
      });
    }

    const success = await Restaurante.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Restaurante no encontrado'
      });
    }
    res.redirect('/restaurantes');
  } catch (error) {
    next(error);
  }
};

// Eliminar restaurante
exports.delete = async (req, res, next) => {
  try {
    const success = await Restaurante.delete(req.params.id);
    if (!success) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Restaurante no encontrado'
      });
    }
    res.redirect('/restaurantes');
  } catch (error) {
    next(error);
  }
};
const TipoCocina = require('../models/tipoCocina');
const { validationResult } = require('express-validator');

exports.index = async (req, res) => {
  try {
    const tiposCocina = await TipoCocina.getAll();
    res.render('tipo_cocina/index', {
      title: 'Tipos de Cocina',
      tiposCocina
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar tipos de cocina'
    });
  }
};

exports.new = async (req, res) => {
  res.render('tipo_cocina/form', {
    title: 'Nuevo Tipo de Cocina',
    tipo_cocina: {},
    errors: []
  });
};

exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('tipo_cocina/form', {
        title: 'Nuevo Tipo de Cocina',
        tipo_cocina: req.body,
        errors: errors.array()
      });
    }

    const tipoExistente = await TipoCocina.getByNombre(req.body.nombre);
    if (tipoExistente) {
      return res.render('tipo_cocina/form', {
        title: 'Nuevo Tipo de Cocina',
        tipo_cocina: req.body,
        errors: [{ msg: 'Este tipo de cocina ya existe' }]
      });
    }

    await TipoCocina.create({ nombre: req.body.nombre });
    res.redirect('/tipos-cocina');
  } catch (error) {
    res.render('tipo_cocina/form', {
      title: 'Nuevo Tipo de Cocina',
      tipo_cocina: req.body,
      errors: [{ msg: 'Error al crear tipo de cocina' }]
    });
  }
};

exports.delete = async (req, res) => {
  try {
    await TipoCocina.delete(req.params.id);
    res.redirect('/tipos-cocina');
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al eliminar tipo de cocina'
    });
  }
};
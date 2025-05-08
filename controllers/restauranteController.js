const { validationResult } = require('express-validator');
const Restaurante = require('../models/restaurante'); 

exports.index = async (req, res) => {
  try {
    const restaurantes = await Restaurante.getAll();
    res.json({ success: true, data: restaurantes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener restaurantes' });
  }
};

// Crear un restaurante
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const nuevoRestaurante = await Restaurante.create(req.body);
    res.status(201).json({ success: true, data: nuevoRestaurante });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear restaurante' });
  }
};

// Obtener detalles de un restaurante
exports.show = async (req, res) => {
  try {
    const restaurante = await Restaurante.getByIdWithDetails(req.params.id);
    if (!restaurante) {
      return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
    }
    res.json({ success: true, data: restaurante });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener detalles' });
  }
};

// Actualizar un restaurante
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const success = await Restaurante.update(id, req.body);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
    }
    res.json({ success: true, message: 'Restaurante actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
};

// Eliminar un restaurante
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Restaurante.delete(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
    }
    res.json({ success: true, message: 'Restaurante eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
};
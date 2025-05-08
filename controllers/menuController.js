const { validationResult } = require('express-validator');
const Menu = require('../models/menu');

exports.agregarPlato = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const nuevoPlato = await Menu.create(req.body);
    res.status(201).json({ success: true, data: nuevoPlato });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al agregar plato' });
  }
};

exports.eliminarPlato = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Menu.delete(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Plato no encontrado' });
    }
    res.json({ success: true, message: 'Plato eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar plato' });
  }
};

exports.getByRestaurante = async (req, res) => {
  try {
    const platos = await Menu.getByRestaurant(req.params.restaurante_id);
    res.json({ success: true, data: platos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener menú' });
  }
};

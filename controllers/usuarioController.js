const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario');

// Autenticación
exports.registro = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const usuarioExistente = await Usuario.getByEmail(req.body.email);
    if (usuarioExistente) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado' });
    }

    const nuevoUsuario = await Usuario.create(req.body);
    res.status(201).json({ success: true, data: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el registro' });
  }
};

// Preferencias
exports.actualizarPreferencias = async (req, res) => {
  try {
    await Usuario.updatePreferences(req.user.id, req.body.tipos_cocina);
    res.json({ success: true, message: 'Preferencias actualizadas' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al guardar preferencias' });
  }
};
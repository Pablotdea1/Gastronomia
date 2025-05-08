const Usuario = require('../models/usuario');

exports.actualizarPreferencias = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { tiposCocina } = req.body; 
    await Usuario.updatePreferences(usuarioId, tiposCocina);
    res.json({ success: true, message: 'Preferencias actualizadas' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al guardar preferencias' });
  }
};

exports.obtenerRecomendaciones = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const recomendaciones = await Usuario.getRecomendaciones(usuarioId);
    res.json({ success: true, data: recomendaciones });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al generar recomendaciones' });
  }
};
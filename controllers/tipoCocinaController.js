const TipoCocina = require('../models/tipoCocina');

exports.obtenerTiposCocina = async (req, res) => {
  try {
    const tipos = await TipoCocina.getAll();
    res.json({ success: true, data: tipos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener tipos de cocina' });
  }
};


exports.crearTipoCocina = async (req, res) => {
  const { nombre } = req.body;

 
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ success: false, message: 'El nombre es obligatorio' });
  }

  try {
   
    const tipoExistente = await TipoCocina.getByNombre(nombre);
    if (tipoExistente) {
      return res.status(400).json({ success: false, message: 'Este tipo ya existe' });
    }

    
    const nuevoTipo = await TipoCocina.create({ nombre });
    res.status(201).json({ success: true, data: { id: nuevoTipo, nombre } });
    
  } catch (error) {
    console.error('Error en create:', error);
    res.status(500).json({ success: false, message: 'Error interno al crear tipo' });
  }
};

exports.deleteTipoCocina = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await TipoCocina.delete(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Tipo no encontrado' });
    }
    res.json({ success: true, message: 'Tipo eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar tipo' });
  }
};


const Resena = require('../models/resena'); 

exports.createResena = async (req, res) => {
  const { calificacion, comentario } = req.body;
  const { restaurante_id } = req.params;

  if (!calificacion || !restaurante_id) {
    return res.status(400).json({
      success: false,
      message: "Campos requeridos: calificacion y restaurante_id",
    });
  }

  try {
    const nuevaResena = await Resena.create({ 
      restaurante_id, 
      calificacion, 
      comentario 
    });
    res.status(201).json({ success: true, data: nuevaResena });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear reseña" });
  }
};

exports.getResenasRestaurante = async (req, res) => {
  try {
    const resenas = await Resena.getByRestaurant(req.params.restaurante_id);
    res.json({ success: true, data: resenas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener reseñas' });
  }
};
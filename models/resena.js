const pool = require('../config/database');

class Resena {
  static async getByRestaurant(restauranteId) {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, u.nombre AS usuario_nombre 
        FROM Reseñas r
        JOIN Usuarios u ON r.usuario_id = u.id
        WHERE restaurante_id = ?
      `, [restauranteId]);
      return rows;
    } catch (error) {
      console.error(`Error al obtener reseñas del restaurante ${restauranteId}:`, error);
      throw error;
    }
  }

  static async getByUserAndRestaurant(usuarioId, restauranteId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM Reseñas WHERE usuario_id = ? AND restaurante_id = ?',
        [usuarioId, restauranteId]
      );
      return rows[0];
    } catch (error) {
      console.error(`Error al verificar reseña existente:`, error);
      throw error;
    }
  }

  static async create(resenaData) {
    try {
      const { restaurante_id, calificacion, comentario } = resenaData;
      const [result] = await pool.query(
        'INSERT INTO reseñas (restaurante_id, calificacion, comentario) VALUES (?, ?, ?)',
        [restaurante_id, calificacion, comentario || null]
      );
      return { id: result.insertId, ...resenaData };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Resena;
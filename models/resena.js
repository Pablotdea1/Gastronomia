const pool = require('../config/database');

class Resena {
  static async create(resenaData) {
    try {
      const { restaurante_id, calificacion, comentario } = resenaData;
      const [result] = await pool.query(
        'INSERT INTO resenas (restaurante_id, calificacion, comentario) VALUES (?, ?, ?)',
        [restaurante_id, calificacion, comentario]
      );

      // Actualizar calificación promedio del restaurante
      await this.actualizarCalificacionPromedio(restaurante_id);
      
      return { id: result.insertId, ...resenaData };
    } catch (error) {
      throw error;
    }
  }

  static async getByRestaurante(restauranteId) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          r.*,
          DATE_FORMAT(r.fecha, '%d/%m/%Y %H:%i') as fecha_formateada,
          COALESCE(u.nombre, 'Anónimo') as autor
        FROM resenas r
        LEFT JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.restaurante_id = ?
        ORDER BY r.fecha DESC
      `, [restauranteId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async actualizarCalificacionPromedio(restauranteId) {
    try {
      await pool.query(`
        UPDATE restaurantes r
        SET calificacion_promedio = (
          SELECT AVG(calificacion)
          FROM resenas
          WHERE restaurante_id = ?
        )
        WHERE r.id = ?
      `, [restauranteId, restauranteId]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Resena;
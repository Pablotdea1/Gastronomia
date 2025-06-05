const pool = require('../config/database');

class Restaurante {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        r.*,
        tc.nombre as tipo_cocina,
        u.ciudad,
        u.direccion
      FROM restaurantes r
      LEFT JOIN tipo_cocina tc ON r.tipo_cocina_id = tc.id
      LEFT JOIN ubicaciones u ON r.ubicacion_id = u.id
    `);
    return rows;
  }

  static async getByIdWithDetails(id) {
    const [rows] = await pool.query(`
      SELECT 
        r.*,
        tc.nombre as tipo_cocina,
        u.ciudad,
        u.direccion,
        ST_X(u.coordenadas) as lng,
        ST_Y(u.coordenadas) as lat,
        COALESCE(AVG(rs.calificacion), 0) as calificacion_promedio,
        COUNT(rs.id) as total_resenas
      FROM restaurantes r
      LEFT JOIN tipo_cocina tc ON r.tipo_cocina_id = tc.id
      LEFT JOIN ubicaciones u ON r.ubicacion_id = u.id
      LEFT JOIN resenas rs ON r.id = rs.restaurante_id
      WHERE r.id = ?
      GROUP BY r.id
    `, [id]);
    return rows[0];
  }

  static async create(restauranteData) {
    const [result] = await pool.query('INSERT INTO restaurantes SET ?', [restauranteData]);
    return result.insertId;
  }

  static async update(id, data) {
    const [result] = await pool.query('UPDATE restaurantes SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM restaurantes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Restaurante;
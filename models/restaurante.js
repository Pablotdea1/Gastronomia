const pool = require('../config/database');

class Restaurante {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM Restaurantes');
    return rows;
  }

  static async create(restauranteData) {
    const [result] = await pool.query('INSERT INTO Restaurantes SET ?', [restauranteData]);
    return result.insertId;
  }

  static async getByIdWithDetails(id) {
    const [rows] = await pool.query(`
      SELECT r.*, tc.nombre AS tipo_cocina 
      FROM Restaurantes r
      JOIN Tipo_Cocina tc ON r.tipo_cocina_id = tc.id
      WHERE r.id = ?
    `, [id]);
    return rows[0];
  }

  static async update(id, data) {
    const [result] = await pool.query('UPDATE Restaurantes SET ? WHERE id = ?', [data, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Restaurantes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Restaurante;
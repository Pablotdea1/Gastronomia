const pool = require('../config/database');

class TipoCocina {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        id,
        nombre
      FROM tipo_cocina
      ORDER BY nombre ASC
    `);
    return rows;
  }

  static async getByNombre(nombre) {
    const [rows] = await pool.query('SELECT * FROM Tipo_Cocina WHERE nombre = ?', [nombre]);
    return rows[0];
  }

  static async create(tipoData) {
    try {
      const [result] = await pool.query('INSERT INTO Tipo_Cocina SET ?', [tipoData]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }


  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Tipo_Cocina WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = TipoCocina;


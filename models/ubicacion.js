const pool = require('../config/database');

class Ubicacion {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        id,
        ciudad,
        direccion,
        ST_X(coordenadas) as lng,
        ST_Y(coordenadas) as lat
      FROM Ubicaciones
      ORDER BY ciudad ASC, direccion ASC
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query(`
      SELECT 
        id,
        ciudad,
        direccion,
        ST_X(coordenadas) as lng,
        ST_Y(coordenadas) as lat
      FROM Ubicaciones
      WHERE id = ?
    `, [id]);
    return rows[0];
  }
}

module.exports = Ubicacion;


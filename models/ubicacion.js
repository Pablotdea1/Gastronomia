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

  // Agregar el método create
  static async create(ubicacionData) {
    try {
      const { ciudad, direccion, lat = 0, lng = 0 } = ubicacionData;
      
      // Validar que las coordenadas sean números válidos
      const latitude = parseFloat(lat) || 0;
      const longitude = parseFloat(lng) || 0;
      
      // Validar rango de coordenadas
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        throw new Error('Coordenadas inválidas');
      }

      const [result] = await pool.query(`
        INSERT INTO Ubicaciones (ciudad, direccion, coordenadas)
        VALUES (?, ?, POINT(?, ?))
      `, [ciudad, direccion, longitude, latitude]);

      return {
        id: result.insertId,
        ciudad,
        direccion,
        lat: latitude,
        lng: longitude
      };
    } catch (error) {
      console.error('Error al crear ubicación:', error);
      throw error;
    }
  }

  // Agregar el método delete
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM Ubicaciones WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar ubicación:', error);
      throw error;
    }
  }

  // Método para buscar ubicaciones cercanas
  static async getDentroRadio(lat, lng, radioKm) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          id, 
          ciudad, 
          direccion,
          ST_X(coordenadas) as lng,
          ST_Y(coordenadas) as lat,
          ST_Distance_Sphere(
            coordenadas,
            POINT(?, ?)
          ) / 1000 as distancia_km
        FROM Ubicaciones
        HAVING distancia_km <= ?
        ORDER BY distancia_km
      `, [lng, lat, radioKm]);
      return rows;
    } catch (error) {
      console.error('Error al buscar ubicaciones cercanas:', error);
      throw error;
    }
  }
}

module.exports = Ubicacion;


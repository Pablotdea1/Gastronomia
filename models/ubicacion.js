const pool = require('../config/database');

class Ubicacion {
  static async create(ubicacionData) {
    try {
      const { ciudad, direccion, coordenadas } = ubicacionData;
      // Formato correcto: POINT(lng lat) y uso de ST_GeomFromText
      const [result] = await pool.query(
        'INSERT INTO Ubicaciones (ciudad, direccion, coordenadas) VALUES (?, ?, ST_GeomFromText(?))',
        [ciudad, direccion, `POINT(${coordenadas})`]
      );
      return { id: result.insertId, ...ubicacionData };
    } catch (error) {
      console.error('Error en modelo Ubicacion.create:', error.message);
      throw error;
    }
  }

  static async getDentroRadio(lat, lng, radioKm) {
    try {
      const [rows] = await pool.query(`
        SELECT *, 
        ST_Distance_Sphere(
          coordenadas, 
          ST_GeomFromText('POINT(${lng} ${lat})')
        ) AS distancia_metros 
        FROM Ubicaciones 
        WHERE ST_Distance_Sphere(
          coordenadas, 
          ST_GeomFromText('POINT(${lng} ${lat})')
        ) <= ? * 1000
        ORDER BY distancia_metros ASC
      `, [radioKm]);
      return rows;
    } catch (error) {
      console.error('Error en modelo Ubicacion.getDentroRadio:', error.message);
      throw error;
    }
  }
}

module.exports = Ubicacion;


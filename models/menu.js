const pool = require('../config/database');

class Menu {
  static async create(menuItem) {
    try {
      const [result] = await pool.query(
        'INSERT INTO Menus (restaurante_id, nombre_plato, descripcion, precio) VALUES (?, ?, ?, ?)',
        [menuItem.restaurante_id, menuItem.nombre_plato, menuItem.descripcion || null, menuItem.precio]
      );
      return { id: result.insertId, ...menuItem };
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Menus WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getByRestaurant(restauranteId) {
    const [rows] = await pool.query('SELECT * FROM Menus WHERE restaurante_id = ?', [restauranteId]);
    return rows;
  }
}

module.exports = Menu;

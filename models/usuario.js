const pool = require('../config/database');

class Usuario {
    static async getAll() {
        try {
            const [rows] = await pool.query('SELECT id, nombre, email, fecha_registro FROM Usuarios');
            return rows;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.query('SELECT id, nombre, email, fecha_registro FROM Usuarios WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error(`Error al obtener usuario con ID ${id}:`, error);
            throw error;
        }
    }

    static async getByEmail(email) {
        try {
            const [rows] = await pool.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            console.error(`Error al buscar usuario por email:`, error);
            throw error;
        }
    }

    static async create(usuario) {
        try {
            const { nombre, email, contraseña_hash } = usuario;
            const [result] = await pool.query(
                'INSERT INTO Usuarios (nombre, email, contraseña_hash) VALUES (?, ?, ?)',
                [nombre, email, contraseña_hash]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    static async updatePreferences(usuarioId, tiposCocina) {
        try {
            await pool.query('DELETE FROM Preferencias_Usuario WHERE usuario_id = ?', [usuarioId]);

            const values = tiposCocina.map(tipoId => [usuarioId, tipoId]);
            await pool.query(
                'INSERT INTO Preferencias_Usuario (usuario_id, tipo_cocina_id) VALUES ?',
                [values]
            );

            return true;
        } catch (error) {
            console.error(`Error al actualizar preferencias del usuario ${usuarioId}:`, error);
            throw error;
        }
    }

    static async getRecomendaciones(usuarioId) {
        try {
            const [rows] = await pool.query(`
        SELECT r.*, tc.nombre AS tipo_cocina 
        FROM Restaurantes r
        JOIN Tipo_Cocina tc ON r.tipo_cocina_id = tc.id
        JOIN Preferencias_Usuario pu ON tc.id = pu.tipo_cocina_id
        WHERE pu.usuario_id = ?
        ORDER BY r.calificacion_promedio DESC
        LIMIT 10
      `, [usuarioId]);
            return rows;
        } catch (error) {
            console.error('Error al generar recomendaciones:', error);
            throw error;
        }
    }
}

module.exports = Usuario;
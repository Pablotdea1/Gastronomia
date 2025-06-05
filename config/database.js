const mysql = require('mysql2/promise');
require('dotenv').config();


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'gastronomia_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Inicializar las tablas si no existen
async function initDb() {
  try {
    const connection = await pool.getConnection();

    // 1. Tabla Usuarios con nuevos campos
    await connection.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INT PRIMARY KEY AUTO_INCREMENT,
          nombre VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          rol ENUM('admin', 'usuario') DEFAULT 'usuario',
          activo BOOLEAN DEFAULT true,
          token_recuperacion VARCHAR(255),
          token_expiracion DATETIME,
          fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
          ultima_sesion DATETIME,
          UNIQUE INDEX email_index (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

    // 2. Tabla de Sesiones (para manejo de JWT)
    await connection.query(`
        CREATE TABLE IF NOT EXISTS sesiones (
          id INT PRIMARY KEY AUTO_INCREMENT,
          usuario_id INT NOT NULL,
          token VARCHAR(255) NOT NULL,
          fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
          fecha_expiracion DATETIME NOT NULL,
          dispositivo VARCHAR(255),
          ip VARCHAR(45),
          activa BOOLEAN DEFAULT true,
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
          INDEX token_index (token)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

    // 3. Tabla Tipo_Cocina
    await connection.query(`
        CREATE TABLE IF NOT EXISTS tipo_cocina (
          id INT PRIMARY KEY AUTO_INCREMENT,
          nombre VARCHAR(50) UNIQUE NOT NULL
        )
      `);

    // 4. Tabla Ubicaciones 
    await connection.query(`
        CREATE TABLE IF NOT EXISTS ubicaciones (
          id INT PRIMARY KEY AUTO_INCREMENT,
          ciudad VARCHAR(50) NOT NULL,
          direccion VARCHAR(255),
          coordenadas POINT NOT NULL
        )
      `);

    // 5. Tabla Restaurantes 
    await connection.query(`
        CREATE TABLE IF NOT EXISTS restaurantes (
          id INT PRIMARY KEY AUTO_INCREMENT,
          nombre VARCHAR(100) NOT NULL,
          tipo_cocina_id INT NOT NULL,
          ubicacion_id INT NOT NULL,
          precio_promedio DECIMAL(10,2) NOT NULL,  -- Hasta $99,999,999.99
          calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
          FOREIGN KEY (tipo_cocina_id) REFERENCES Tipo_Cocina(id),
          FOREIGN KEY (ubicacion_id) REFERENCES Ubicaciones(id)
        )
      `);

    // 6. Tabla Menus 
    await connection.query(`
        CREATE TABLE IF NOT EXISTS menus (
          id INT PRIMARY KEY AUTO_INCREMENT,
          restaurante_id INT NOT NULL,
          nombre_plato VARCHAR(100) NOT NULL,
          descripcion TEXT,
          precio DECIMAL(10,2) NOT NULL,  -- Hasta $99,999,999.99
          FOREIGN KEY (restaurante_id) REFERENCES Restaurantes(id) ON DELETE CASCADE
        )
      `);

    // 7. Tabla Reseñas
    await connection.query(`
       CREATE TABLE IF NOT EXISTS resenas (
       id INT PRIMARY KEY AUTO_INCREMENT,
       restaurante_id INT NOT NULL,
       calificacion TINYINT CHECK (calificacion BETWEEN 1 AND 5),
      comentario TEXT,
      fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
  )
`);

    // 8. Tabla Preferencias_Usuario
    await connection.query(`
        CREATE TABLE IF NOT EXISTS preferencias_usuario (
          usuario_id INT NOT NULL,
          tipo_cocina_id INT NOT NULL,
          PRIMARY KEY (usuario_id, tipo_cocina_id),
          FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
          FOREIGN KEY (tipo_cocina_id) REFERENCES Tipo_Cocina(id)
        )
      `);

    connection.release();
    console.log("Base de datos inicializada correctamente");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
}

const bcrypt = require('bcryptjs');

async function createDefaultAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT IGNORE INTO usuarios (
        nombre, 
        email, 
        password_hash,
        rol
      ) VALUES (
        'Administrador',
        'admin@gastronomia.com',
        ?,
        'admin'
      )
    `, [hashedPassword]);
    console.log('Usuario administrador creado o ya existente');
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
  }
}

// Llamar a la función después de initDb()
initDb().then(() => {
  createDefaultAdmin();
});

module.exports = pool;

const pool = require("./db");

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(150) UNIQUE NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        creado_en TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Tabla 'usuarios' lista.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notas (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        titulo VARCHAR(200) NOT NULL,
        contenido TEXT NOT NULL,
        creado_en TIMESTAMP DEFAULT NOW(),
        actualizado_en TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Tabla 'notas' lista.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "IPtomada" (
        id SERIAL PRIMARY KEY,
        ip VARCHAR(50) NOT NULL,
        user_agent TEXT,
        fecha TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Tabla 'IPtomada' lista.");

  } catch (err) {
    console.error("Error creando tablas:", err);
  }
}

module.exports = initDB;
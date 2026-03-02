const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const initDB = require("./initDB");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://unsafelogin-frontend.onrender.com"
  ],
  credentials: true
}));
app.use(express.json());

// Crear tablas al iniciar
initDB();

// ============ REGISTRO ============
app.post("/api/registro", async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    const existe = await pool.query("SELECT id FROM usuarios WHERE correo = $1", [correo]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ error: "Ese correo ya esta registrado." });
    }

    const result = await pool.query(
      "INSERT INTO usuarios (nombre, correo, contrasena) VALUES ($1, $2, $3) RETURNING id, nombre, correo",
      [nombre, correo, contrasena]
    );

    return res.status(201).json({ mensaje: "Cuenta creada.", usuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error en el servidor." });
  }
});

// ============ LOGIN ============
app.post("/api/login", async (req, res) => {
  const { identificador, contrasena } = req.body;

  if (!identificador || !contrasena) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    const result = await pool.query(
      "SELECT id, nombre, correo FROM usuarios WHERE (nombre = $1 OR correo = $1) AND contrasena = $2",
      [identificador, contrasena]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    return res.json({ mensaje: "Login exitoso.", usuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error en el servidor." });
  }
});

// ============ OBTENER NOTAS DEL USUARIO ============
app.get("/api/notas/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM notas WHERE usuario_id = $1 ORDER BY actualizado_en DESC",
      [usuarioId]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al obtener notas." });
  }
});

// ============ CREAR NOTA ============
app.post("/api/notas", async (req, res) => {
  const { usuario_id, titulo, contenido } = req.body;

  if (!usuario_id || !titulo || !contenido) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notas (usuario_id, titulo, contenido) VALUES ($1, $2, $3) RETURNING *",
      [usuario_id, titulo, contenido]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al crear nota." });
  }
});

// ============ EDITAR NOTA ============
app.put("/api/notas/:id", async (req, res) => {
  const { id } = req.params;
  const { usuario_id, titulo, contenido } = req.body;

  if (!titulo || !contenido) {
    return res.status(400).json({ error: "Titulo y contenido son obligatorios." });
  }

  try {
    const result = await pool.query(
      "UPDATE notas SET titulo = $1, contenido = $2, actualizado_en = NOW() WHERE id = $3 AND usuario_id = $4 RETURNING *",
      [titulo, contenido, id, usuario_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nota no encontrada." });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al editar nota." });
  }
});

// ============ ELIMINAR NOTA ============
app.delete("/api/notas/:id", async (req, res) => {
  const { id } = req.params;
  const { usuario_id } = req.body;

  try {
    const result = await pool.query(
      "DELETE FROM notas WHERE id = $1 AND usuario_id = $2 RETURNING id",
      [id, usuario_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nota no encontrada." });
    }

    return res.json({ mensaje: "Nota eliminada." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al eliminar nota." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});
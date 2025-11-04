const express = require("express");
const router = express.Router();

// arreglo de los mensajes
let mensajes = [];

// Ruta POST para recibir el formulario de contacto
router.post("/", (req, res) => {
  const { nombre, apellidos, email, numero, pregunta } = req.body;

  if (!nombre || !email || !pregunta) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const nuevoMensaje = {
    nombre,
    apellidos,
    email,
    numero,
    pregunta,
  };

  mensajes.push(nuevoMensaje);

  console.log("Mensajes recibidos:");
  console.log(mensajes);

  res.status(200).json({ message: "Mensaje recibido correctamente" });
});

module.exports = router;
// aqui van las rutas de los usuarios

const express = require("express");
const { login, logout, getProfile } = require("../controllers/users.controller");
const { verifyToken } = require("../middleware/usersRequired.middleware");

const router = express.Router();

// Ruta pública: POST /api/login
router.post("/login", login);

// Rutas protegidas (requieren token)
// POST /api/logout - Cerrar sesión
router.post("/logout", verifyToken, logout);

// GET /api/profile - Obtener perfil del usuario autenticado
router.get("/profile", verifyToken, getProfile);

module.exports = router;
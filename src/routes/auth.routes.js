
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { register, login, refresh, logout } = require("../controllers/auth.controller");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { status: "error", message: "Demasiados intentos, esperá 15 minutos" }
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
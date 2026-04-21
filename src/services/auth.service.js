
const pool = require ("../config/db");
const { hashPassword, comparePassword } = require ("../utils/hash");
const AppError = require ("../utils/AppError");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const jwt = require ("jsonwebtoken");

const register = async (nombre, email, password) => {
    const hashed = await hashPassword(password);

    const result = await pool.query(
        "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *",
        [nombre, email, hashed]
    );

    return result.rows[0];
};

const login = async (email, password) => {

    const result = await pool.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
    );

    if(result.rows.length === 0) {
        throw new AppError("Credenciales invalidas", 400);
    }

    const usuario = result.rows[0];

    const valid = await comparePassword(password, usuario.password);

    if (!valid) {
        throw new AppError("Credenciales invalidas", 401);
    }

    const accessToken = generateAccessToken(usuario);
    const refreshToken = generateRefreshToken(usuario);

    await pool.query(
        "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
        [usuario.id, refreshToken]
    )
    return {usuario, accessToken, refreshToken};
};

const refresh = async(refreshToken) => {
    const payload = jwt.verify(refreshToken, process.env. JWT_REFRESH_SECRET);

    const result = await pool.query(
        "SELECT * FROM refresh_tokens WHERE token = $1",
        [refreshToken]
    );

    if (result.rows.length === 0) {
        throw new AppError("Token invalido", 401);
    }

    const accessToken = generateAccessToken(payload);

    return { accessToken };
}

const logout = async (refreshToken) => {

    await pool.query(
        "DELETE FROM refresh_tokens WHERE token = $1 RETURNING *",
        [refreshToken]
    );
};

module.exports = { register, login, refresh, logout };

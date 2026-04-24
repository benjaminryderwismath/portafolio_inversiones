
const pool = require("../config/db");

const getAlertas = async(usuarioId) => {
    const result = await pool.query(
        "SELECT * FROM alertas WHERE usuario_id = $1",
        [usuarioId]
    );
    return result.rows;
};


const createAlerta = async(data, usuarioId) => {
    const { activo_id, tipo, precio_objetivo } = data;
    
    const result = await pool.query(
        "INSERT INTO alertas (usuario_id, activo_id, tipo, precio_objetivo, activa) VALUES ($1, $2, $3, $4, true) RETURNING *",
        [usuarioId, activo_id, tipo, precio_objetivo]
    );
    return result.rows[0];
};


const updateAlerta = async(id, data, usuarioId) => {
    const { tipo, precio_objetivo, activa } = data;
    
    const result = await pool.query(
        "UPDATE alertas SET tipo = $1, precio_objetivo = $2, activa = $3 WHERE id = $4 AND usuario_id = $5 RETURNING *",
        [tipo, precio_objetivo, activa, id, usuarioId]
    );
    return result.rows[0];
};

const deleteAlerta = async(id, usuarioId) => {
    
    const result = await pool.query(
        "DELETE FROM alertas WHERE id = $1 AND usuario_id = $2 RETURNING *",
        [id, usuarioId]
    );
    return result.rows[0];
};

module.exports = { getAlertas, createAlerta, updateAlerta, deleteAlerta };

const pool = require("../config/db");

const getActivos = async () => {
    const result = await pool.query (
        "SELECT * FROM activos",
    );

    return result.rows;
};


const createActivos = async (data) => {
    const {simbolo, nombre, tipo} = data;

        const result = await pool.query(
            `INSERT INTO activos (simbolo, nombre, tipo) VALUES ($1, $2, $3) RETURNING *`,
            [simbolo, nombre, tipo]
        );
        return result.rows[0];
};

module.exports = {
    getActivos,
    createActivos,
};

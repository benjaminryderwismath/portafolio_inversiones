
const pool = require("../config/db");


const getPortafolios = async (usuarioId) => {
    const result = await pool.query(
        "SELECT * FROM portafolios WHERE usuario_id = $1",
        [usuarioId]
    );
    return result.rows;
};

const getPortafolio = async (id, usuarioId) => {
    const result = await pool.query(
        "SELECT * FROM portafolios WHERE id = $1 AND usuario_id = $2",
        [id, usuarioId]
    );
    return result.rows[0];
};

const createPortafolios = async(data, usuarioId) => {
    const client = await pool.connect();
    const {nombre, descripcion} = data;

    try{
        await client.query("BEGIN");

        const portafoliosResult = await client.query(
            `INSERT INTO portafolios (nombre, descripcion, usuario_id) VALUES ($1, $2, $3) RETURNING *`,
            [nombre, descripcion, usuarioId]
        );
        await client.query("COMMIT");
        return portafoliosResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally{
        client.release();
    }
};

const updatePortafolios = async (id, data, usuarioId) => {
    const {nombre, descripcion} = data;

    const result = await pool.query(
        `UPDATE portafolios SET nombre = $1, descripcion =$2 WHERE id = $3 AND usuario_id = $4 RETURNING *`,
        [nombre, descripcion, id, usuarioId]
    );

    return result.rows[0];
};

const deletePortafolios = async(id, usuarioId) => {
    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        const result = await client.query(
            `DELETE FROM portafolios WHERE id = $1 AND usuario_id = $2 RETURNING *`,
            [id, usuarioId]
        );

        await client.query("COMMIT");
        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK"); 
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getPortafolios,
    getPortafolio,
    createPortafolios,
    updatePortafolios,
    deletePortafolios
};
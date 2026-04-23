
const pool = require("../config/db");

const getTransacciones = async(portafolioId) => {

    const result = await pool.query(
        "SELECT * FROM transacciones WHERE portafolio_id = $1",
        [portafolioId]
    ) 
    return result.rows;
};

const createTransaccion = async(data, portafolioId) => {
    const { activo_id, tipo, cantidad, precio_unitario} = data;
    const client = await pool.connect();
    try {

        await client.query("BEGIN");

        const transaccionesResult = await client.query(
        "INSERT INTO transacciones (portafolio_id, activo_id, tipo, cantidad, precio_unitario, fecha) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
        [portafolioId, activo_id, tipo, cantidad, precio_unitario]
        );
        
        const portafolioActivos = await client.query(
            "SELECT * FROM portafolio_activos WHERE portafolio_id = $1 AND activo_id = $2",
            [portafolioId, activo_id]
        );

    if (portafolioActivos.rows.length > 0) {

        const signo = tipo === "compra" ? "+" : "-";
        await client.query(
            `UPDATE portafolio_activos SET cantidad = cantidad ${signo} $1 WHERE portafolio_id = $2 AND activo_id = $3`,
            [cantidad, portafolioId, activo_id]
        );
        } else {
        await client.query(
            "INSERT INTO portafolio_activos (portafolio_id, activo_id, cantidad) VALUES ($1, $2, $3)",
            [portafolioId, activo_id, cantidad]
        );
        }
        await client.query("COMMIT");
        return transaccionesResult.rows[0];
    }   catch (error) {
        await client.query ("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const deleteTransaccion = async(id, portafolioId) => {
    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        const result = await client.query(
            `DELETE FROM transacciones WHERE id = $1 AND portafolio_id = $2 RETURNING *`,
            [id, portafolioId]
        )
        await client.query("COMMIT");
        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK"); 
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { getTransacciones, createTransaccion, deleteTransaccion };
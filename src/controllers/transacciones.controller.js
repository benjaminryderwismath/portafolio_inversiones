
const transaccionesService = require("../services/transacciones.service");

const getTransacciones = async(req, res, next) => {
    try {
        const transacciones = await transaccionesService.getTransacciones(
            req.params.id
        );
    res.json(transacciones);
    } catch (error) {
        next(error)
    }
};

const createTransaccion = async(req, res, next) => {
    try {
        
        const transacciones = await transaccionesService.createTransaccion(
            req.body,
            req.params.id
        )

        res.status(201).json({
            message:"Transaccion creada",
            transacciones
        });
    } catch (error) {
        next (error);
    }
};


module.exports = { getTransacciones, createTransaccion };
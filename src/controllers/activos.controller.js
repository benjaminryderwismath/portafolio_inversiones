


const activosService = require("../services/activos.service");


const getActivo = async(req, res, next) => {
    try {
        const activos = await activosService.getActivos();

        res.json(activos);
    } catch (error) {
        next(error);
    }
};

const createActivos = async(req, res, next) => {
    try {

        const activos = await activosService.createActivos(
            req.body
        );

        res.status(201).json({
            message:"Activo creado",
            activos
        });

    }catch (error) {
        next(error);
    }
};

module.exports = { getActivo, createActivos };
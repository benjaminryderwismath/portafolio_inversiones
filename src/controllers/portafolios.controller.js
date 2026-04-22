
const portafoliosService = require("../services/portafolios.service");
const AppError = require("../utils/AppError");

const getPortafolios = async(req, res, next) => {
    try{

        const userId = req.user.id;

        const filters = {
            tipo: req.query.tipo,
            cantidad: req.query.cantidad,
            precio: req.query.precio,
            fecha: req.query.fecha
        };

        const data = await portafoliosService.getPortafolios(userId);

        res.json(data);
    } catch (error) {
        next(error)
    }
};

const getPortafolio = async(req, res, next) => {
    try {
        const portafolio = await portafoliosService.getPortafolio(
            req.params.id,
            req.user.id
        );

        if (!portafolio) {
            throw new AppError("Portafolio no encontrado", 404);
        }

        res.json(portafolio);
    } catch (error) {
        next(error);
    }
};

const createPortafolios = async(req, res, next) => {
    try {

        const portafolio = await portafoliosService.createPortafolios(
            req.body,
            req.user.id
        );

        res.status(201).json({
            message:"Portafolio creado",
            portafolio
        });

    }catch (error) {
        next(error);
    }
};

const updatePortafolios = async(req, res, next) => {
    try{
        const portafolio = await portafoliosService.updatePortafolios(
            req.params.id,
            req.body,
            req.user.id
        );

        res.json(portafolio);
    } catch (error) {
        next(error);
    }
};

const deletePortafolios = async(req, res, next) => {
    try{
        const portafolio = await portafoliosService.deletePortafolios(
            req.params.id,
            req.user.id
        );

        if (!portafolio) {
            throw new AppError("Portafolio no encontrado", 404)
        }

        res.json({
            message:"Portafolio eliminado"
        })
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getPortafolios,
    getPortafolio,
    createPortafolios,
    updatePortafolios,
    deletePortafolios
};

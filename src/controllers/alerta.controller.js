
const alertaservice = require("../services/alerta.service");
const AppError = require("../utils/AppError");

const getAlertas = async(req, res, next) => {
    try{
        const alertas = await alertaservice.getAlertas(
            req.user.id,
        );
        res.json(alertas)
    } catch (error) {
        next(error);
    }
};

const createAlerta = async(req, res, next) => {
    try {
        const alerta = await alertaservice.createAlerta(
            req.body,
            req.user.id
        );
        res.status(201).json({
            message:"Alerta creada", 
            alerta
        });
    } catch (error) {
        next(error);
    }
};

const updateAlerta = async(req,res, next) => {
    try{
        const alerta = await alertaservice.updateAlerta(
            req.params.id,
            req.body,
            req.user.id
        );
        res.json(alerta);
    } catch (error) {
        next(error);
    }
};

const deleteAlerta = async(req, res, next) => {
    try{
        const alerta = await alertaservice.deleteAlerta(
            req.params.id,
            req.user.id
        );

        if (!alerta) {
            throw new AppError("Alerta no encontrada", 404)
        }
        res.json({
            message:"Alerta eliminada"
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { getAlertas, createAlerta, updateAlerta, deleteAlerta };
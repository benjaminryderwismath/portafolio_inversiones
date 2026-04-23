
const preciosService = require("../services/precios.service");

const getPrecio = async(req, res, next) => {

    try {
        const { simbolo } = req.params;
        const { tipo} = req.query;

        const precio = await preciosService.getPrecio(simbolo, tipo);

        res.json(precio);
    } catch (error) {
        next (error);
    }
};

module.exports = { getPrecio};


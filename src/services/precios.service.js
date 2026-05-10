const axios = require("axios");
const AppError = require("../utils/AppError");

const getPrecioAccion = async(simbolo) => {
    try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${simbolo}&apikey=${process.env.ALPHA_VANTAGE_KEY}`;
        const response = await axios.get(url);
        const data = response.data["Global Quote"];

        if (!data || !data["05. price"]) {
            throw new AppError(`No se encontró precio para el símbolo '${simbolo}'`, 404);
        }

        return {
            simbolo,
            precio: parseFloat(data["05. price"]),
            cambio: data["10. change percent"]
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(`Error al obtener precio de acción: ${error.message}`, 502);
    }
};

const getPrecioCrypto = async (simbolo) => {
    try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${simbolo}&vs_currencies=usd`;
        const response = await axios.get(url);

        if (!response.data[simbolo]?.usd) {
            throw new AppError(`No se encontró precio para la crypto '${simbolo}'`, 404);
        }

        return {
            simbolo,
            precio: response.data[simbolo].usd
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(`Error al obtener precio de crypto: ${error.message}`, 502);
    }
};

const getPrecio = async (simbolo, tipo) => {
    if (tipo === "accion") {
        return await getPrecioAccion(simbolo);
    } else {
        return await getPrecioCrypto(simbolo.toLowerCase());
    }
};

module.exports = { getPrecio };


const axios = require("axios");

const getPrecioAccion= async(simbolo) => {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${simbolo}&apikey=${process.env.ALPHA_VANTAGE_KEY}`;

    const response = await axios.get(url);
    console.log(response.data);
    const data = response.data["Global Quote"];

    return {
        simbolo,
        precio: parseFloat(data["05. price"]),
        cambio: data["10. change percent"]
    };
};

const getPrecioCrypto = async (simbolo) => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${simbolo}&vs_currencies=usd`;

    const response = await axios.get(url);
    console.log(response.data);

    return {
        simbolo,
        precio: response.data[simbolo].usd
    };
};

const getPrecio = async (simbolo, tipo) => {
    console.log("simbolo", simbolo, "tipo", tipo);
    if (tipo === "accion") {
        return await getPrecioAccion(simbolo);
    } else {
        return await getPrecioCrypto(simbolo.toLowerCase());
    }
};

module.exports = { getPrecio };
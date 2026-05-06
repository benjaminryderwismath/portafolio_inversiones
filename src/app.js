
const express = require("express");
const app = express();

app.use(express.json());

// 🔥 Ruta raíz (IMPORTANTE)
app.get("/", (req, res) => {
res.json({
    message: "Investment Portfolio API running 🚀",
    endpoints: {
        auth: "/auth",
        portafolios: "/portafolios",
        activos: "/activos",
        transacciones: "/portafolios/:id/transacciones",
        alertas: "/alertas"
    }
    });
});

app.use("/auth", require("./routes/auth.routes"));
app.use("/portafolios", require("./routes/portafolios.routes"));
app.use("/activos", require("./routes/activos.routes"));
app.use("/portafolios/:id/transacciones", require("./routes/transacciones.routes"));
app.use("/alertas", require("./routes/alertas.routes"));


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        message: err.message || "Error interno en el servidor"
    });
});

module.exports = app;
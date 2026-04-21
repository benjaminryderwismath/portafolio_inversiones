
const express = require("express");
const app = express();

app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        message: err.message || `Error interno en el servidor`
    });
});

module.exports = app;
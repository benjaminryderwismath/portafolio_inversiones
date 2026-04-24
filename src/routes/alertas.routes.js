
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const validateSchema = require("../middlewares/validate");

const {
    getAlertas,
    createAlerta,
    updateAlerta,
    deleteAlerta
} = require("../controllers/alerta.controller");
const { alertaSchema } = require("../validators/alertas.validator");

router.use(verifyToken);

router.get("/", getAlertas);

router.post("/", validateSchema (alertaSchema), createAlerta);

router.put("/:id",updateAlerta);

router.delete("/:id", deleteAlerta);

module.exports = router;
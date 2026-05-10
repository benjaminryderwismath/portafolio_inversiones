
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const validateSchema = require("../middlewares/validate");
const validateId = require("../middlewares/validateId");

const {
    getAlertas,
    createAlerta,
    updateAlerta,
    deleteAlerta
} = require("../controllers/alerta.controller");
const { alertaSchema, updateAlertaSchema } = require("../validators/alertas.validator");

router.use(verifyToken);

router.get("/", getAlertas);

router.post("/", validateSchema (alertaSchema), createAlerta);

router.put("/:id", validateId, validateSchema(updateAlertaSchema), updateAlerta);

router.delete("/:id", validateId, deleteAlerta);

module.exports = router;
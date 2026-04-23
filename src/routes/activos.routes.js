
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const validateSchema = require("../middlewares/validate");
const { getActivo, createActivos } = require("../controllers/activos.controller");
const { activoSchema } = require("../validators/activos.validator");
const { getPrecio } = require("../controllers/precios.controller");

router.get("/", getActivo);
router.get("/:simbolo/precio", getPrecio)
router.post("/", verifyToken, validateSchema(activoSchema), createActivos);

module.exports = router;
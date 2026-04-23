
const express = require("express");
const router = express.Router({ mergeParams: true });

const verifyToken = require("../middlewares/auth.middleware");
const validateSchema = require("../middlewares/validate");
const { getTransacciones, createTransaccion } = require("../controllers/transacciones.controller");
const { transaccionSchema } = require("../validators/transacciones.validator");

router.use(verifyToken);

router.get("/", getTransacciones);
router.post("/", validateSchema(transaccionSchema), createTransaccion);

module.exports = router;
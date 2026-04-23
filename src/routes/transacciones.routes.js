
const express = require("express");
const router = express.Router({ mergeParams: true });

const verifyToken = require("../middlewares/auth.middleware");
const validateSchema = require("../middlewares/validate");
const { getTransacciones, createTransaccion, deleteTransaccion } = require("../controllers/transacciones.controller");
const { transaccionSchema } = require("../validators/transacciones.validator");

router.use(verifyToken);

router.get("/", getTransacciones);
router.post("/", validateSchema(transaccionSchema), createTransaccion);
router.delete("/:txId", deleteTransaccion);

module.exports = router;
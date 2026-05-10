
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const validateSchema = require("../middlewares/validate");
const validateId = require("../middlewares/validateId");

const {
    getPortafolios,
    getPortafolio,
    createPortafolios,
    updatePortafolios,
    deletePortafolios
} = require("../controllers/portafolios.controller");

const { portafolioSchema, updatePortafoliosSchema } = 
require ("../validators/portafolio.validator");

router.use(verifyToken);

router.get("/",getPortafolios);
router.get("/:id", validateId, getPortafolio);

router.post("/", validateSchema(portafolioSchema), createPortafolios);

router.put(
    "/:id",
    validateId,
    validateSchema(updatePortafoliosSchema),
    updatePortafolios
);

router.delete("/:id", validateId, deletePortafolios);

module.exports = router;





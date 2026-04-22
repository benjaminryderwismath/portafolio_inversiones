
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const validateSchema = require("../middlewares/validate");

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
router.get("/:id", getPortafolio);

router.post("/", validateSchema (portafolioSchema), createPortafolios);

router.put(
    "/:id",
validateSchema(updatePortafoliosSchema),
updatePortafolios
);

router.delete("/:id", deletePortafolios);

module.exports = router;





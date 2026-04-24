
const { z } = require("zod");

const alertaSchema = z.object({
    activo_id: z.number().int().positive("El activo es obligatorio"),
    tipo: z.enum(["precio_sube", "precio_baja"]),
    precio_objetivo: z.number().positive(),
}).strict();

module.exports = { alertaSchema };

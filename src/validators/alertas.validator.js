
const { z } = require("zod");

const alertaSchema = z.object({
    activo_id: z.number().int().positive("El activo es obligatorio"),
    tipo: z.enum(["precio_sube", "precio_baja"]),
    precio_objetivo: z.number().positive(),
}).strict();

const updateAlertaSchema = z.object({
    tipo: z.enum(["precio_sube", "precio_baja"]).optional(),
    precio_objetivo: z.number().positive().optional(),
}).strict().refine(data => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar"
});

module.exports = { alertaSchema, updateAlertaSchema };

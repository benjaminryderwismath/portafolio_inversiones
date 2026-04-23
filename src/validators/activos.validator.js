
const { z } = require("zod");

const activoSchema = z.object({
    simbolo: z.string().min(1, "El simbolo es obligatorio"),
    nombre: z.string().min(1, "El nombre es obligatorio"),
    tipo: z.enum(["accion", "cripto"], {message: "El tipo debe ser de accion o cripto"}),
}).strict();

module.exports = { activoSchema };



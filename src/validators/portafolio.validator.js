
const { z } = require("zod");

const portafolioSchema = z.object ({
    nombre: z.string().min(1,"El tipo es obligatorio"),
    descripcion: z.string().optional()
}).strict();

const updatePortafoliosSchema = z.object({
    nombre: z.string().min(1).optional(),
    descripcion: z.string().optional()
}).strict().refine(
(data) => Object.keys(data).length > 0,
{ message:"Debe enviar al menos un campo para actualizar" }
);

module.exports = { portafolioSchema , updatePortafoliosSchema };
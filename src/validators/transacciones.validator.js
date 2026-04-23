
const { z } = require("zod");

const transaccionSchema = z.object ({
    activo_id: z.number().positive("El tipo de activo es obligatorio"),
    tipo: z.enum(["compra", "venta"]),
    cantidad: z.number().positive(),
    precio_unitario: z.number().positive()
}).strict();

module.exports = { transaccionSchema};


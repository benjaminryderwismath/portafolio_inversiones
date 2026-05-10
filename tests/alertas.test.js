process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";

const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/config/db");
const jwt = require("jsonwebtoken");

jest.mock("../src/config/db", () => ({ query: jest.fn() }));

const token = jwt.sign({ id: 1, email: "benji@inv.com" }, "test_secret", { expiresIn: "1h" });
const auth = () => ({ Authorization: `Bearer ${token}` });

describe("GET /alertas", () => {
    beforeEach(() => jest.clearAllMocks());

    test("retorna alertas del usuario", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, activo_id: 1, tipo: "precio_sube", precio_objetivo: 200 }]
        });

        const res = await request(app).get("/alertas").set(auth());
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("falla sin token", async () => {
        const res = await request(app).get("/alertas");
        expect(res.status).toBe(401);
    });
});

describe("POST /alertas", () => {
    beforeEach(() => jest.clearAllMocks());

    test("crea alerta con datos válidos", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, activo_id: 1, tipo: "precio_sube", precio_objetivo: 200 }]
        });

        const res = await request(app).post("/alertas").set(auth()).send({
            activo_id: 1,
            tipo: "precio_sube",
            precio_objetivo: 200
        });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Alerta creada");
    });

    test("falla con tipo inválido", async () => {
        const res = await request(app).post("/alertas").set(auth()).send({
            activo_id: 1,
            tipo: "tipo_invalido",
            precio_objetivo: 200
        });
        expect(res.status).toBe(400);
    });

    test("falla con campos extra (strict mode)", async () => {
        const res = await request(app).post("/alertas").set(auth()).send({
            activo_id: 1,
            tipo: "precio_sube",
            precio_objetivo: 200,
            campo_raro: "hack"
        });
        expect(res.status).toBe(400);
    });

    test("falla con body vacío", async () => {
        const res = await request(app).post("/alertas").set(auth()).send({});
        expect(res.status).toBe(400);
    });
});

describe("PUT /alertas/:id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("actualiza alerta correctamente", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, precio_objetivo: 250 }]
        });

        const res = await request(app).put("/alertas/1").set(auth()).send({
            precio_objetivo: 250
        });
        expect(res.status).toBe(200);
    });

    test("falla con body vacío", async () => {
        const res = await request(app).put("/alertas/1").set(auth()).send({});
        expect(res.status).toBe(400);
    });

    test("falla con ID inválido", async () => {
        const res = await request(app).put("/alertas/abc").set(auth()).send({
            precio_objetivo: 250
        });
        expect(res.status).toBe(400);
    });
});

describe("DELETE /alertas/:id", () => {
    beforeEach(() => jest.clearAllMocks());

    test("elimina alerta existente", async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

        const res = await request(app).delete("/alertas/1").set(auth());
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Alerta eliminada");
    });

    test("retorna 404 si no existe", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).delete("/alertas/999").set(auth());
        expect(res.status).toBe(404);
    });

    test("falla con ID inválido", async () => {
        const res = await request(app).delete("/alertas/abc").set(auth());
        expect(res.status).toBe(400);
    });
});

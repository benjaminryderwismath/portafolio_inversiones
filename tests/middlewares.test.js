process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";

const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/config/db");
const jwt = require("jsonwebtoken");

jest.mock("../src/config/db", () => ({ query: jest.fn() }));

const token = jwt.sign({ id: 1, email: "benji@inv.com" }, "test_secret", { expiresIn: "1h" });
const auth = { Authorization: `Bearer ${token}` };

describe("Middleware: verifyToken", () => {
    beforeEach(() => jest.clearAllMocks());

    test("rechaza petición sin token", async () => {
        const res = await request(app).get("/portafolios");
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Token requerido");
    });

    test("rechaza token inválido", async () => {
        const res = await request(app)
            .get("/portafolios")
            .set("Authorization", "Bearer token_inventado");
        expect(res.status).toBe(401);
    });

    test("acepta token válido", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get("/portafolios").set(auth);
        expect(res.status).toBe(200);
    });
});

describe("Middleware: validateId", () => {
    beforeEach(() => jest.clearAllMocks());

    test("rechaza ID string", async () => {
        const res = await request(app).get("/portafolios/abc").set(auth);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("ID inválido");
    });

    test("rechaza ID negativo", async () => {
        const res = await request(app).get("/portafolios/-1").set(auth);
        expect(res.status).toBe(400);
    });

    test("rechaza ID cero", async () => {
        const res = await request(app).get("/portafolios/0").set(auth);
        expect(res.status).toBe(400);
    });

    test("acepta ID válido", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, nombre: "Mi portafolio", usuario_id: 1 }]
        });

        const res = await request(app).get("/portafolios/1").set(auth);
        expect(res.status).toBe(200);
    });
});

describe("Middleware: validateSchema (Zod)", () => {
    beforeEach(() => jest.clearAllMocks());

    test("retorna 400 cuando el body es inválido", async () => {
        const res = await request(app)
            .post("/alertas")
            .set(auth)
            .send({ tipo: "tipo_invalido" });

        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(typeof res.body.message).toBe("string");
    });

    test("pasa la validación con body correcto", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, activo_id: 1, tipo: "precio_sube", precio_objetivo: 200 }]
        });

        const res = await request(app)
            .post("/alertas")
            .set(auth)
            .send({ activo_id: 1, tipo: "precio_sube", precio_objetivo: 200 });

        expect(res.status).toBe(201);
    });
});

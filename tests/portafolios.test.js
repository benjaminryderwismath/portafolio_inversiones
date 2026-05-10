process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";

const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/config/db");
const jwt = require("jsonwebtoken");

const mockClient = {
    query: jest.fn(),
    release: jest.fn()
};

jest.mock("../src/config/db", () => ({
    query: jest.fn(),
    connect: jest.fn()
}));

const token = jwt.sign({ id: 1, email: "benji@inv.com" }, "test_secret", { expiresIn: "1h" });
const auth = () => ({ Authorization: `Bearer ${token}` });

beforeEach(() => {
    jest.clearAllMocks();
    pool.connect.mockResolvedValue(mockClient);
    mockClient.query.mockResolvedValue({ rows: [] });
});

describe("GET /portafolios", () => {
    test("retorna lista de portafolios del usuario", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, nombre: "Mi portafolio tech", usuario_id: 1 }]
        });

        const res = await request(app).get("/portafolios").set(auth());
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("falla sin token", async () => {
        const res = await request(app).get("/portafolios");
        expect(res.status).toBe(401);
    });
});

describe("GET /portafolios/:id", () => {
    test("retorna un portafolio por ID", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, nombre: "Mi portafolio tech", usuario_id: 1 }]
        });

        const res = await request(app).get("/portafolios/1").set(auth());
        expect(res.status).toBe(200);
        expect(res.body.nombre).toBe("Mi portafolio tech");
    });

    test("retorna 404 si no existe", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get("/portafolios/999").set(auth());
        expect(res.status).toBe(404);
    });

    test("retorna 400 con ID inválido", async () => {
        const res = await request(app).get("/portafolios/abc").set(auth());
        expect(res.status).toBe(400);
    });
});

describe("POST /portafolios", () => {
    test("crea un portafolio con datos válidos", async () => {
        mockClient.query
            .mockResolvedValueOnce({ rows: [] })  // BEGIN
            .mockResolvedValueOnce({ rows: [{ id: 2, nombre: "Crypto portfolio", usuario_id: 1 }] })  // INSERT
            .mockResolvedValueOnce({ rows: [] }); // COMMIT

        const res = await request(app).post("/portafolios").set(auth()).send({
            nombre: "Crypto portfolio"
        });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Portafolio creado");
    });

    test("falla con campos extra (strict mode)", async () => {
        const res = await request(app).post("/portafolios").set(auth()).send({
            nombre: "Test",
            campo_raro: "hack"
        });
        expect(res.status).toBe(400);
    });

    test("falla con body vacío", async () => {
        const res = await request(app).post("/portafolios").set(auth()).send({});
        expect(res.status).toBe(400);
    });
});

describe("DELETE /portafolios/:id", () => {
    test("elimina un portafolio existente", async () => {
        mockClient.query
            .mockResolvedValueOnce({ rows: [] })  // BEGIN
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })  // DELETE
            .mockResolvedValueOnce({ rows: [] }); // COMMIT

        const res = await request(app).delete("/portafolios/1").set(auth());
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Portafolio eliminado");
    });

    test("retorna 404 si no existe", async () => {
        mockClient.query
            .mockResolvedValueOnce({ rows: [] })  // BEGIN
            .mockResolvedValueOnce({ rows: [] })  // DELETE — no rows
            .mockResolvedValueOnce({ rows: [] }); // COMMIT

        const res = await request(app).delete("/portafolios/999").set(auth());
        expect(res.status).toBe(404);
    });

    test("falla con ID inválido", async () => {
        const res = await request(app).delete("/portafolios/abc").set(auth());
        expect(res.status).toBe(400);
    });
});

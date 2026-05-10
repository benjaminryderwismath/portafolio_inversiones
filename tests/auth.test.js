process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";

const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/config/db");
const bcrypt = require("bcryptjs");

jest.mock("../src/config/db", () => ({ query: jest.fn() }));

describe("POST /auth/register", () => {
    beforeEach(() => jest.clearAllMocks());

    test("crea un usuario con datos válidos", async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, email: "benji@inv.com" }]
        });

        const res = await request(app).post("/auth/register").send({
            nombre: "Benji",
            email: "benji@inv.com",
            password: "123456"
        });

        expect(res.status).toBe(201);
        expect(res.body.user.email).toBe("benji@inv.com");
    });

    test("falla si faltan campos", async () => {
        const res = await request(app).post("/auth/register").send({
            email: "benji@inv.com"
        });
        expect(res.status).toBe(400);
    });
});

describe("POST /auth/login", () => {
    beforeEach(() => jest.clearAllMocks());

    test("retorna tokens con credenciales válidas", async () => {
        const hashed = await bcrypt.hash("123456", 10);
        pool.query
            .mockResolvedValueOnce({ rows: [{ id: 1, email: "benji@inv.com", password: hashed }] })
            .mockResolvedValueOnce({ rows: [] });

        const res = await request(app).post("/auth/login").send({
            email: "benji@inv.com",
            password: "123456"
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
    });

    test("falla con password incorrecto", async () => {
        const hashed = await bcrypt.hash("correcta", 10);
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, email: "benji@inv.com", password: hashed }]
        });

        const res = await request(app).post("/auth/login").send({
            email: "benji@inv.com",
            password: "incorrecta"
        });

        expect(res.status).toBe(401);
    });

    test("falla si el usuario no existe — mismo status que password incorrecto", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).post("/auth/login").send({
            email: "noexiste@inv.com",
            password: "123456"
        });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Credenciales invalidas");
    });
});

describe("POST /auth/logout", () => {
    beforeEach(() => jest.clearAllMocks());

    test("cierra sesión correctamente", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).post("/auth/logout").send({
            refreshToken: "token-falso"
        });

        expect(res.status).toBe(200);
    });

    test("falla si no se envía refreshToken", async () => {
        const res = await request(app).post("/auth/logout").send({});
        expect(res.status).toBe(400);
    });
});

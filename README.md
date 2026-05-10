
# Investment Portfolio API

REST API para gestionar portafolios de inversión con activos financieros reales. Permite registrar compras y ventas de acciones y criptomonedas, consultar precios en tiempo real y configurar alertas de precio automáticas.

**Base URL:** `https://administracion-gimnasio-7f7r.onrender.com`

---

## Tecnologías

- **Node.js** + **Express 5**
- **PostgreSQL** con `pg` (Pool)
- **JWT** — access token (15min) + refresh token (7d) con rotación
- **Zod** — validación de schemas con `.strict()`
- **bcryptjs** — hashing de passwords
- **Alpha Vantage API** — precios en tiempo real de acciones
- **CoinGecko API** — precios en tiempo real de criptomonedas
- **Jest** + **Supertest** — tests unitarios e integración

---

## Estructura del proyecto

```
src/
├── config/         # Conexión a PostgreSQL
├── controllers/    # Lógica de request/response
├── middlewares/    # Auth, validateId, validación de schemas
├── routes/         # Definición de endpoints
├── services/       # Lógica de negocio y queries
├── validators/     # Schemas Zod
└── utils/          # AppError, JWT helpers, bcrypt helpers
```

---

## Instalación local

```bash
git clone https://github.com/tu-usuario/portafolio-inversiones.git
cd portafolio-inversiones
npm install
```

Copiá el archivo de variables de entorno:

```bash
cp .env.example .env
```

Completá los valores en `.env` y levantá el servidor:

```bash
npm run dev
```

---

## Variables de entorno

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
NODE_ENV=development
PORT=3000
ALPHA_VANTAGE_KEY=
```

---

## Autenticación

Todos los endpoints excepto `/auth/register`, `/auth/login` y `/auth/refresh` requieren un **Bearer token** en el header:

```
Authorization: Bearer <accessToken>
```

El access token expira en 15 minutos. Usá `/auth/refresh` para obtener uno nuevo sin volver a loguearte. Cada refresh rota el token — el anterior queda inválido.

---

## Endpoints

### Auth

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registrar usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/refresh` | Renovar access token | No |
| POST | `/auth/logout` | Cerrar sesión | No |

> `/auth/login` y `/auth/register` tienen rate limiting: máximo 10 intentos cada 15 minutos por IP.

**POST /auth/register**
```json
{
  "nombre": "Benji",
  "email": "benji@inversiones.com",
  "password": "tu_password"
}
```

**POST /auth/login**
```json
{
  "email": "benji@inversiones.com",
  "password": "tu_password"
}
```
Respuesta:
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

---

### Activos

Los activos son globales — no pertenecen a ningún usuario en particular.

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/activos` | Listar todos los activos | No |
| GET | `/activos/:simbolo/precio` | Precio en tiempo real | No |
| POST | `/activos` | Registrar un activo | Sí |

**GET /activos/AAPL/precio** — Respuesta:
```json
{
  "simbolo": "AAPL",
  "precio": 189.45,
  "cambio": "0.35%"
}
```

**POST /activos**
```json
{
  "nombre": "Apple Inc.",
  "simbolo": "AAPL",
  "tipo": "accion"
}
```
> `tipo` acepta: `accion`, `crypto`.

---

### Portafolios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/portafolios` | Listar portafolios del usuario |
| GET | `/portafolios/:id` | Obtener un portafolio |
| POST | `/portafolios` | Crear portafolio |
| PUT | `/portafolios/:id` | Actualizar portafolio |
| DELETE | `/portafolios/:id` | Eliminar portafolio |

**POST /portafolios**
```json
{
  "nombre": "Mi portafolio tech"
}
```

---

### Transacciones

Las transacciones viven dentro de un portafolio. Registrar una transacción actualiza automáticamente la cantidad del activo en `portafolio_activos`. Eliminarla revierte el efecto.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/portafolios/:id/transacciones` | Listar transacciones del portafolio |
| POST | `/portafolios/:id/transacciones` | Registrar transacción |
| DELETE | `/portafolios/:id/transacciones/:txId` | Eliminar transacción |

**POST /portafolios/1/transacciones**
```json
{
  "activo_id": 1,
  "tipo": "compra",
  "cantidad": 10,
  "precio_unitario": 189.45
}
```
> `tipo` acepta: `compra`, `venta`.

---

### Alertas

Las alertas notifican cuando un activo supera o cae por debajo de un precio objetivo.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/alertas` | Listar alertas del usuario |
| POST | `/alertas` | Crear alerta |
| PUT | `/alertas/:id` | Actualizar alerta |
| DELETE | `/alertas/:id` | Eliminar alerta |

**POST /alertas**
```json
{
  "activo_id": 1,
  "tipo": "precio_sube",
  "precio_objetivo": 200.00
}
```
> `tipo` acepta: `precio_sube`, `precio_baja`.

---

## Funcionalidades destacadas

- **Precios en tiempo real** — consulta Alpha Vantage para acciones y CoinGecko para criptomonedas. Si la API externa falla, retorna un error 502 con mensaje descriptivo en vez de explotar.
- **Transacciones atómicas** — toda operación que toca varias tablas usa `BEGIN/COMMIT/ROLLBACK`. Eliminar una transacción revierte su efecto en `portafolio_activos` dentro de la misma transacción DB.
- **Ownership por usuario** — cada query filtra por `usuario_id`. Un usuario no puede ver ni modificar datos de otro.
- **Refresh token rotation** — cada vez que se renueva el access token, el refresh token también se reemplaza.
- **Rate limiting** — `/login` y `/register` limitan a 10 intentos por IP cada 15 minutos.

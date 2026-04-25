
API de Portafolio de Inversiones

API REST para gestión de portafolios de inversión, con integración de precios en tiempo real de acciones y criptomonedas.

🔗 Deploy: https://portafolio-inversiones.onrender.com

––––––

## Descripción

Esta API permite a los usuarios:

* Gestionar múltiples portafolios de inversión
* Registrar compras y ventas de activos
* Consultar precios en tiempo real
* Definir alertas de precio objetivo

El sistema está diseñado con una arquitectura escalable y separada por responsabilidades, facilitando mantenimiento y evolución.

––––––

## Stack

* Node.js + Express
* PostgreSQL
* JWT (access + refresh tokens)
* Zod para validación de datos
* Alpha Vantage API (acciones)
* CoinGecko API (criptomonedas)

––––––

## Arquitectura

La API sigue una arquitectura en capas:

* Controllers → manejan request/response
* Services → contienen la lógica de negocio
* Validators → validación de datos
* Middlewares → autenticación y validación

Esto permite:

* Separación clara de responsabilidades
* Mayor mantenibilidad
* Facilidad para testing
* Escalabilidad del sistema

––––––

## Autenticación

Se implementa autenticación basada en JWT:

* Access Token → corta duración
* Refresh Token → larga duración

Flujo:

1. Usuario se registra o inicia sesión
2. Se generan access y refresh tokens
3. El access token se usa para acceder a endpoints protegidos
4. El refresh token permite renovar el access token
5. El logout invalida el refresh token

––––––

## Seguridad

* Autenticación con JWT
* Validación de inputs con Zod
* Manejo centralizado de errores
* Separación de lógica de negocio y validación

––––––

## Manejo de errores

Se implementa un sistema centralizado mediante una clase personalizada (AppError):

* Respuestas consistentes
* Mejor control de errores
* Código más limpio y mantenible

––––––

## Características

* Autenticación completa con refresh tokens y logout real
* Gestión de múltiples portafolios por usuario
* Registro de transacciones (compra/venta)
* Actualización automática de posiciones
* Integración con APIs externas de precios
* Sistema de alertas por precio objetivo
* Validación de datos en todos los endpoints

––––––

## Endpoints

### Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/register | Registro |
| POST | /auth/login | Login |
| POST | /auth/refresh | Renovar token |
| POST | /auth/logout | Logout |

### Portafolios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /portafolios | Listar portafolios |
| POST | /portafolios | Crear portafolio |
| GET | /portafolios/:id | Ver portafolio |
| PUT | /portafolios/:id | Editar portafolio |
| DELETE | /portafolios/:id | Eliminar portafolio |

### Activos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /activos | Catálogo de activos |
| POST | /activos | Agregar activo |
| GET | /activos/:simbolo/precio?tipo=accion | Precio en tiempo real |

### Transacciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /portafolios/:id/transacciones | Historial |
| POST | /portafolios/:id/transacciones | Registrar compra/venta |
| DELETE | /portafolios/:id/transacciones/:txId | Eliminar |

### Alertas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /alertas | Listar alertas |
| POST | /alertas | Crear alerta |
| PUT | /alertas/:id | Editar alerta |
| DELETE | /alertas/:id | Eliminar alerta |


––––––

## Variables de entorno

Creá un archivo `.env` con estas variables:

```
DATABASE_URL=postgresql://localhost/portafolio_inversiones
JWT_SECRET=tu_secret
JWT_REFRESH_SECRET=tu_refresh_secret
NODE_ENV=development
PORT=3000
ALPHA_VANTAGE_KEY=tu_key
```

⸻

## Instalación local

```bash
git clone https://github.com/benjaminryderwismath/portafolio_inversiones.git
cd portafolio_inversiones
npm install
npm run dev
```
––––––

## Estructura del proyecto

```
src/
  config/       → configuración DB
  controllers/  → requests/responses
  middlewares/  → auth y validación
  routes/       → endpoints
  services/     → lógica de negocio
  utils/        → helpers
  validators/   → schemas
```

















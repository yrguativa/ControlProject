# ControlProject

Sistema de votacion electronica para asambleas de propiedad horizontal en Colombia (Ley 675).

## Arquitectura

```
ESP32 controls (MicroPython) → RPi gateways → MQTT → NestJS API (GraphQL) → MongoDB → React dashboard
```

## Estructura del monorepo

```
controlProject/
  apps/
    web/          Dashboard React (Vite + TypeScript)
    landing/      Landing page (Astro)
    api/          Backend API (NestJS + GraphQL + MongoDB)
  firmware/
    voting-control/  Firmware IoT (MicroPython para ESP32)
  docs/           Documentacion del proyecto
```

## Requisitos

- Node.js >= 18
- pnpm >= 9
- MongoDB (local o Atlas)
- Python 3 + esptool (para flashear controles)

## Instalacion

```bash
pnpm install
```

### Variables de entorno

Cada proyecto tiene su `.env.template`. Copialo como `.env` y completa los valores:

```bash
cp apps/api/.env.template apps/api/.env
cp apps/web/.env.template apps/web/.env
```

| Proyecto | Archivo | Variables |
|----------|---------|-----------|
| API | `apps/api/.env` | `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` |
| Frontend | `apps/web/.env` | `VITE_API_URL` |
| Firmware | `firmware/voting-control/.env` | `WIFI_SSID`, `WIFI_PASS`, `SERVER_HOST`, `SERVER_PORT`, pines GPIO |

## Desarrollo

```bash
# API + Frontend en paralelo (abre navegador automaticamente)
pnpm dev

# Solo el dashboard React (puerto 5173)
pnpm dev:web

# Solo la landing page Astro (puerto 4321)
pnpm dev:landing

# Solo la API NestJS + GraphQL (puerto 3000, playground en /graphql)
pnpm dev:api
```

## Build

```bash
pnpm build:web
pnpm build:landing
pnpm build:api
```

## Backend API

### Modulos

| Modulo | Endpoints | Descripcion |
|--------|-----------|-------------|
| Auth | `login`, `register`, `googleAuth`, `refreshToken` | JWT + Google OAuth |
| Users | `users`, `me`, `updateUserRole` | Gestion de usuarios con roles |
| Events | `events`, `event`, `createEvent`, `activateEvent`, `endEvent` | Asambleas y votaciones |
| Devices | `devices`, `registerDevice`, `assignDevice` | Controles de votacion RF |
| Voting | `castVote`, `eventResults`, `votes` | Registro y conteo de votos |

### Roles

- `ADMIN` — Acceso total (gestionar usuarios, eventos, dispositivos)
- `OPERATOR` — Gestionar eventos y dispositivos
- `VIEWER` — Solo lectura de resultados

## Frontend React

### Stack

- **State**: Zustand con persistencia en localStorage
- **Data fetching**: TanStack Query + GraphQL
- **Routing**: React Router v7 con ProtectedRoute por roles
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Forms**: React Hook Form + Zod

### Paginas

- `/login` — Inicio de sesion (email/password + Google)
- `/register` — Registro de usuario
- `/` — Dashboard con estadisticas
- `/events` — Gestion de asambleas
- `/voting/:eventId` — Votacion en tiempo real
- `/devices` — Controles registrados
- `/users` — Gestion de usuarios (solo ADMIN)

## Firmware IoT

Ver `firmware/voting-control/README.md` para instrucciones de flashear los controles ESP32.

## Documentacion

- `docs/PLAN.md` — Plan de negocio, costos, estructura legal
- `docs/CONTROLES.md` — Diseno hardware de controles
- `docs/TECNOLOGIA.md` — Arquitectura del sistema, protocolo RF
- `apps/landing/MANUALMARCA.md` — Manual de marca: colores, tipografia, espaciado

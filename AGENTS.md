# AGENTS.md

## Project status

Monorepo for an electronic voting system for Colombian residential assemblies (`asambleas de propiedad horizontal`, Ley 675). Contains both JS/TS and MicroPython projects.

## Architecture

```
ESP32 controls (MicroPython) → RPi gateways → MQTT → NestJS API (GraphQL) → MongoDB → React dashboard
```

## Monorepo structure

| Directory | Stack | Purpose |
|-----------|-------|---------|
| `apps/web` | React + Vite + TypeScript | Dashboard for real-time voting results |
| `apps/landing` | Astro | Marketing landing page |
| `apps/api` | NestJS + GraphQL + MongoDB | Backend API, auth, vote ingestion, device management |
| `firmware/voting-control` | MicroPython (ESP32) | Firmware for physical voting controls |
| `docs/` | Markdown | Business plan, hardware design, system architecture |

## Commands

```bash
pnpm install               # install all JS/TS workspace deps
pnpm dev                   # API + Frontend in parallel (opens browser automatically)
pnpm dev:web               # React dashboard (port 5173)
pnpm dev:landing           # Astro landing (port 4321)
pnpm dev:api               # NestJS API (port 3000, GraphQL playground at /graphql)
pnpm build:web             # build React dashboard
pnpm build:landing         # build Astro landing
pnpm build:api             # build NestJS API
pnpm lint                  # lint all JS/TS workspaces
pnpm test                  # test all JS/TS workspaces
```

## Backend (NestJS + MongoDB)

- Mongoose schemas in `*/schemas/*.schema.ts` (User, Event, Device, Vote)
- GraphQL resolvers in `*/*.resolver.ts` — code-first schema generation
- Auth: JWT (15min access + 7d refresh) + Google OAuth 2.0
- Roles: `ADMIN`, `OPERATOR`, `VIEWER` — enforced via `@Roles()` decorator + `RolesGuard`
- Environment vars: `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## Frontend (React)

- State: Zustand with localStorage persistence (`stores/auth.store.ts`, `stores/app.store.ts`)
- Data: TanStack Query + GraphQL via `hooks/use-api.ts`
- Auth: Login, Register, Google OAuth — stored in Zustand with refresh interceptor
- Routing: React Router v7 with role-based `ProtectedRoute` wrapper
- Styling: Tailwind CSS v4 with brand colors as CSS variables
- Animations: Framer Motion for page transitions and micro-interactions
- Forms: React Hook Form + Zod validation

## IoT / Firmware

MicroPython firmware lives in `firmware/voting-control/`. Flashear con `esptool` + `ampy`. See `firmware/voting-control/README.md`.

Hardware: ESP32 (or ESP32-C3), 3 buttons (SI/NO/ABSTENCION), LED, battery. Deep sleep for power efficiency.

## Key files

- `docs/PLAN.md` — Business plan, pricing (COP/USD), legal structure
- `docs/CONTROLES.md` — Hardware design, button wiring, battery management
- `docs/TECNOLOGIA.md` — Distributed architecture, RF protocol, prototyping stages
- `apps/landing/MANUALMARCA.md` — Brand manual: color palette, typography, spacing, animation tokens

## Environment variables

Each project has a `.env.template` — copy to `.env` and fill in values:

| Project | File | Key vars |
|---------|------|----------|
| API | `apps/api/.env` | `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Frontend | `apps/web/.env` | `VITE_API_URL` |
| Firmware | `firmware/voting-control/.env` | `WIFI_SSID`, `WIFI_PASS`, `SERVER_HOST`, `SERVER_PORT`, GPIO pins |

## Conventions

- Documentation language: Spanish
- Docs contain cost figures in COP and USD — verify currency when referencing prices
- JS/TS projects use pnpm workspaces (not npm/yarn)
- NestJS API uses code-first GraphQL (auto-schema from decorators)
- Frontend uses `@/` path alias for `src/`
- Firmware config in `firmware/voting-control/config.py` (WiFi creds, server IP, GPIO pins)

## Landing page (Astro)

- Components in `apps/landing/src/components/` (Nav, Hero, HowItWorks, Features, CTA)
- Global CSS with variables in `apps/landing/src/styles/global.css`
- Animations: CSS keyframes + IntersectionObserver `.reveal` classes
- Fonts: Outfit (display) + DM Sans (body) via Google Fonts
- SEO: Open Graph, Twitter Card, JSON-LD structured data in Layout.astro
- SVG illustrations inline (hardware device in Hero)

## Frontend (React)

- Pages: LoginPage, RegisterPage, DashboardPage, EventsPage, DevicesPage, UsersPage, VotingPage
- Stores: `auth.store.ts` (auth + roles + localStorage), `app.store.ts` (sidebar + active event)
- Hooks: `use-api.ts` — all TanStack Query mutations/queries for GraphQL
- Protected routes: `ProtectedRoute` component checks auth + roles
- Dashboard layout: Collapsible sidebar with role-filtered navigation

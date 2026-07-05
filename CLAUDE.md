# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MottaGo is a waste food reduction management system for restaurant businesses. It covers structured recording, classification, monitoring, treatment tracking, pickup management, reporting, and analytics.

**Active stakeholder roles:** Manajer, Pegawai Utility.
*(Role Pelayan dan Vendor telah dihapus dari sistem — DL-05, DL-13)*

**Official documentation language:** Bahasa Indonesia. All deliverables, reports, planning documents, and specifications must be written in formal Indonesian. Source code, IDs, field names, API names, and industry-standard technical terms may remain in English.

## Repository Structure

```
frontend/          — React + TypeScript SPA (active development)
supabase/          — 11 migration files (0001–0011); migrations applied to Supabase cloud
backend/           — Not used (Supabase PostgREST handles all API — DL-12)
database/          — Not used (schema lives in supabase/migrations/)
docs/              — Project deliverables organized by phase (phase0–phase6)
```

The PRD (`docs/PRD/MottaGo_PRD_v1.0.pdf`) is the single source of truth for all requirements. Never invent features outside the PRD.

## Frontend Commands

All commands run from `frontend/`:

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Type-check then production build
npm run lint      # ESLint with zero warnings tolerance
npm run format    # Prettier format src/**/*.{ts,tsx,css}
npm run preview   # Preview production build locally
```

**CRITICAL — TypeScript check:** `tsconfig.json` is solution-style (`"files": []`, only `references`). Plain `npx tsc --noEmit` does NOT type-check anything and always returns exit 0 (false positive). Always use:
```bash
npx tsc -b --noEmit   # ← correct: uses build mode, checks all referenced tsconfigs
```
Discovered in Sprint B2 (Batch 2B) — a `BadgeColor` type error (`'error'` instead of `'danger'`) passed `tsc --noEmit` silently but was caught by `tsc -b --noEmit`.

## Frontend Architecture

**Stack:** React 18, TypeScript 5, Vite 6, React Router v6, TailwindCSS v3, Lucide React, Recharts.

**Folder structure under `frontend/src/`:**

| Path | Purpose |
|---|---|
| `router/index.tsx` | `createBrowserRouter` — single router instance |
| `router/routes.ts` | `ROUTES` const — all path strings; import from here, never hardcode paths |
| `router/RoleGuard.tsx` | Role-based access guard — reads `profile.role` from AuthContext |
| `pages/LoginPage.tsx` | Login page — username-based auth (DL-11) |
| `pages/manajer/` | Route-level page components for Manajer role |
| `layouts/` | DashboardLayout, SimpleLayout, AuthLayout, FormLayout |
| `components/atoms/` | Primitive UI components (COMP-01–09) |
| `components/molecules/` | Composite UI components (COMP-10–17) |
| `components/organisms/` | AppHeader (COMP-19), SideNav (COMP-21), AuthCard |
| `constants/` | `capacity.ts` — CAPACITY_THRESHOLDS (SSOT untuk threshold DL-04) |
| `hooks/` | useAuth, useCapacity, usePickup, useVendor, useWaste |
| `services/` | authService, capacityService, wasteService, pickupService, vendorService |
| `store/` | AuthContext.tsx — global auth state + profile |
| `lib/` | supabase.ts — Supabase JS client |
| `types/` | Shared TypeScript types |
| `design-system/` | CSS foundations: `tokens.css`, `globals.css`, `typography.css` |

**Design system:** Colors and spacing are defined as CSS custom properties in `tokens.css` and mapped to Tailwind aliases in `tailwind.config.ts`. Always use the Tailwind aliases (e.g., `bg-brand-primary`, `text-text-secondary`) — never hardcode hex values.

**Capacity thresholds (DL-04):** Normal < 60%, Warning 60–89%, Critical ≥ 90% — defined in `constants/capacity.ts` as `CAPACITY_THRESHOLDS` and reflected in `--color-capacity-*` tokens.

**Authentication (DL-11):** Login uses username-based flow. Frontend transforms `username` → `username@mottago.internal` before calling `supabase.auth.signInWithPassword`. Never use real email addresses.

**Routing pattern:** Routes are flat entries in `router/index.tsx`. Role-based access enforced via `RoleGuard` component. All route paths are constants in `router/routes.ts`.

**Linting:** ESLint is configured with zero-warning tolerance (`--max-warnings 0`). Prettier is enforced as an ESLint error. Format before committing.

## Key Approved Decisions (Decision Log)

- **DL-01** — Store capacity uses `max_capacity` configured by the Manajer.
- **DL-02** — Unit is determined automatically by `waste_type`; quantity is entered manually by Utility staff.
- **DL-03** *(revised 2 Juli 2026)* — One active pickup per store **per waste_category** (not just per store). Enforced via partial UNIQUE index on `(store_id, waste_category) WHERE status IN ('waiting','in-transit')`.
- **DL-04** — Notifications use a `NOTIFICATION` table with 30-second polling. No WebSocket in MVP.
- **DL-05** *(revised 2 Juli 2026)* — Vendor is Master Data only. No login, no auth account. Role `'vendor'` removed from system.
- **DL-06** *(revised 2 Juli 2026)* — Vendor assignment is via `store_vendor_assignments` table (per store per waste_category). Column `stores.default_vendor_id` has been removed.
- **DL-08** — Phase 3B v1.0 is the source of truth for screen inventory, screen numbering, route definitions, layout type assignments, and module structure. Phase 3A v1.1 governs information architecture, user flows, navigation patterns, and role mapping.
- **DL-11** *(new)* — Username-based authentication. Frontend transforms `username` → `username@mottago.internal` for Supabase Auth.
- **DL-12** *(new)* — Supabase is the sole backend platform. No custom API server. PostgREST handles all REST API automatically from schema.
- **DL-13** *(new)* — Active roles: `manajer` and `utility` only. Roles `pelayan` and `vendor` have been removed.

If new work conflicts with an approved decision, stop and explain the conflict before proceeding.

## Development Phase

Currently in **Phase 4 – Sprint A complete**. Batch A1–A5 and EA-01–EA-02 are done. All changes are local; **git push is pending** before next milestone (C2 — Real Data Integration).

## Project Governance Rules

- The PRD is the single source of truth. Do not modify approved requirements without explicit approval.
- Any change to approved architecture, workflow, entity model, navigation structure, or component structure requires explicit re-approval.
- Separate MVP features from future enhancements. Do not introduce AI, ML, IoT, or external integrations unless required by the PRD.
- Update `docs/CURRENT_FOCUS.md` at the end of each work session.
- Update `docs/DECISION_LOG.md` whenever a new architectural decision is made.
- All approved deliverables must be stored in the repository under the correct `docs/phase*/` folder.

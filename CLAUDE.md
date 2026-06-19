# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MottaGo is a waste food reduction management system for restaurant businesses. It covers structured recording, classification, monitoring, treatment tracking, pickup management, reporting, and analytics.

**Stakeholder roles:** Manajer, Pelayan (Waiter), Pegawai Utility, Vendor Pengangkut Sampah.

**Official documentation language:** Bahasa Indonesia. All deliverables, reports, planning documents, and specifications must be written in formal Indonesian. Source code, IDs, field names, API names, and industry-standard technical terms may remain in English.

## Repository Structure

```
frontend/   — React + TypeScript SPA (active development)
backend/    — API & business logic (not yet implemented)
database/   — ERD, SQL schema, migrations (not yet implemented)
docs/       — Project deliverables organized by phase (phase0–phase6)
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

## Frontend Architecture

**Stack:** React 18, TypeScript 5, Vite 6, React Router v6, TailwindCSS v3, Lucide React.

**Folder structure under `frontend/src/`:**

| Path | Purpose |
|---|---|
| `router/index.tsx` | `createBrowserRouter` — single router instance |
| `router/routes.ts` | `ROUTES` const — all path strings; import from here, never hardcode paths |
| `pages/` | Route-level page components, mirroring role-based route hierarchy (`manajer/`, etc.) |
| `layouts/` | Layout wrappers (DashboardLayout, SimpleLayout, AuthLayout — Sprint 1) |
| `components/atoms/` | Primitive UI components (COMP-01–09) |
| `components/molecules/` | Composite UI components (COMP-10–17) |
| `components/organisms/` | AppHeader (COMP-19), BottomNav (COMP-20), SideNav (COMP-21) |
| `modules/` | Feature modules: `capacity/`, `waste-in/`, `waste-records/`, `pickup/`, `notifications/`, `reports/`, `settings/` |
| `hooks/` | Shared hooks (e.g., `useCapacity`, `usePagination`) |
| `services/` | API calls |
| `store/` | Global state |
| `types/` | Shared TypeScript types |
| `design-system/` | CSS foundations: `tokens.css`, `globals.css`, `typography.css` |

**Design system:** Colors and spacing are defined as CSS custom properties in `tokens.css` and mapped to Tailwind aliases in `tailwind.config.ts`. Always use the Tailwind aliases (e.g., `bg-brand-primary`, `text-text-secondary`) — never hardcode hex values.

**Capacity thresholds (DL-04):** Normal < 60%, Warning 60–89%, Critical ≥ 90% — reflected in `--color-capacity-*` tokens.

**Routing pattern:** Routes are flat entries in `router/index.tsx`. Role-based access will be enforced via a `RoleGuard` component (Sprint 1). All route paths are constants in `router/routes.ts`.

**Linting:** ESLint is configured with zero-warning tolerance (`--max-warnings 0`). Prettier is enforced as an ESLint error. Format before committing.

## Key Approved Decisions (Decision Log)

- **DL-01** — Store capacity uses `max_capacity` configured by the Manajer.
- **DL-02** — Unit is determined automatically by `waste_type`; quantity is entered manually by Utility staff.
- **DL-03** — Only one active pickup per store.
- **DL-04** — Notifications use a `NOTIFICATION` table with 30-second polling.
- **DL-06** — Each store has a `default_vendor_id`.
- **DL-08** — Phase 3B v1.0 is the source of truth for screen inventory, screen numbering, route definitions, layout type assignments, and module structure. Phase 3A v1.1 governs information architecture, user flows, navigation patterns, and role mapping.

If new work conflicts with an approved decision, stop and explain the conflict before proceeding.

## Development Phase

Currently in **Phase 4 – Sprint 1** (Shared Layout & Components). Sprint 0 foundation is complete. Sprint 1 targets: AppHeader, SideNav, BottomNav, layout wrappers, atom/molecule components (COMP-01–17), `useCapacity` and `usePagination` hooks, and RoleGuard skeleton.

## Project Governance Rules

- The PRD is the single source of truth. Do not modify approved requirements without explicit approval.
- Any change to approved architecture, workflow, entity model, navigation structure, or component structure requires explicit re-approval.
- Separate MVP features from future enhancements. Do not introduce AI, ML, IoT, or external integrations unless required by the PRD.
- Update `docs/CURRENT_FOCUS.md` at the end of each work session.
- All approved deliverables must be stored in the repository under the correct `docs/phase*/` folder.

# MottaGo — Project Status

**Terakhir diperbarui:** 30 Juni 2026
**Diperbarui oleh:** Claude Code (Sonnet 4.6)

---

## Current Phase

**Phase 4 — Build** (aktif)

---

## Current Milestone

**C1 — Authentication Integration** (belum dimulai)

Milestone ini adalah titik awal sesi berikutnya di device baru.

---

## Completed Milestones

| Milestone | Deskripsi | Status |
|---|---|---|
| Phase 0 | Understand — PRD & project brief | ✅ Selesai |
| Phase 1 | Discover — Requirements, User Flow, BPMN, MoSCoW | ✅ Selesai |
| Phase 2 | Specify — Design System (color, typography, component rules) | ✅ Selesai |
| Phase 3 | Design — Figma Prototype (SCR-M-01, M-02, M-04) | ✅ Selesai |
| Sprint 0 | Frontend Foundation — React/TS/Vite setup, folder structure, design tokens, 4 route placeholder | ✅ Selesai |
| Sprint 1 | Shared Layout & Components — AppHeader, SideNav, layouts, atoms, molecules, hooks, RoleGuard | ✅ Selesai |
| Sprint 2 | Page Implementation — DashboardPage, KapasitasPage, RequestPickupPage (mock data) | ✅ Selesai |
| B1 | Database Schema Design (pure analysis, no SQL) | ✅ Selesai |
| B1.5 | Schema Review & Finalization | ✅ Selesai |
| B2.1 | Migration skeleton (0001–0006) | ✅ Selesai |
| B2.2 | CREATE TABLE — semua 8 tabel | ✅ Selesai |
| B2.3 | Foreign Keys, CHECK, UNIQUE, Partial UNIQUE | ✅ Selesai |
| B2.4 | Performance Indexes (13 indexes) | ✅ Selesai |
| B2.5 | Trigger Functions & Triggers (4 functions, 6 triggers) | ✅ Selesai |
| B2.6 | Seed Data (26 rows across 8 tables) | ✅ Selesai |
| B2.7 | Migration Verification & Database Lock | ✅ **PASS — Database LOCKED** |
| B2.8 | Service Compatibility Fix (5 incompatibilities resolved) | ✅ Selesai |

---

## Backend Status

**Database Foundation: LOCKED ✅**

Tidak ada perubahan migration yang diizinkan tanpa approval eksplisit.

| File | Deskripsi | Status |
|---|---|---|
| `supabase/migrations/0001_extensions.sql` | Extension declarations (uuid-ossp, pg_trgm) | ✅ LOCKED |
| `supabase/migrations/0002_tables.sql` | 8 tables + pickup_seq | ✅ LOCKED |
| `supabase/migrations/0003_constraints.sql` | 12 FK, 14 CHECK, 2 UNIQUE | ✅ LOCKED |
| `supabase/migrations/0004_indexes.sql` | 13 performance indexes | ✅ LOCKED |
| `supabase/migrations/0005_triggers.sql` | 4 functions, 6 triggers | ✅ LOCKED |
| `supabase/migrations/0006_seed.sql` | Dev seed data (26 rows, idempotent) | ✅ LOCKED |

**Tabel database:** vendors, stores, profiles, pickups, waste_items, capacity_snapshots, notifications, capacity_alerts

**Supabase client:** `frontend/src/lib/supabase.ts`
Saat ini menggunakan **placeholder credentials**. Credentials nyata harus dikonfigurasi via `frontend/.env` sebelum C1.

---

## Frontend Status

| Lapisan | Status | Catatan |
|---|---|---|
| Design System | ✅ Selesai | `tokens.css`, `globals.css`, `typography.css`, `tailwind.config.ts` |
| Atoms (COMP-01–09) | ✅ Selesai | Button, TextInput, SelectInput, DateInput, Badge, Icon, Divider, ProgressBar, LoadingSpinner |
| Molecules (COMP-10–17) | ✅ Selesai | FormField, NotificationBadge, AlertBanner, CapacityCard, DashboardHeader, KpiCard, PickupSummaryCard, QuickActionsCard, StatusPickupCard, StatusThresholdCard, CapacityGaugePanel, CapacitySummaryStats, CapacityAlertHistoryCard, CapacityTrendCard, CategoryBreakdownCard, WasteTrendCard |
| Organisms | ✅ Selesai | AppHeader (COMP-19), SideNav (COMP-21) |
| Layouts | ✅ Selesai | AuthLayout (LT-01), SimpleLayout (LT-02), DashboardLayout (LT-03), FormLayout (LT-04) |
| Pages | ✅ Selesai (mock) | DashboardPage, KapasitasPage, RequestPickupPage — semua menggunakan mock data |
| Router | ✅ Selesai | Routes, ROUTES const, RoleGuard skeleton |
| Services | ✅ Selesai + Sinkron | authService, capacityService, wasteService, pickupService, vendorService |
| Hooks | ✅ Skeleton | useAuth, useCapacity, usePickup, useVendor, useWaste |
| Auth | ⏳ Skeleton | AuthContext, lib/supabase.ts (placeholder) |
| Auth Flow | ❌ Belum | Login page, register, real auth wiring — milestone C1 |

---

## Database Status

| Objek | Jumlah | Status |
|---|---|---|
| Tables | 8 | ✅ |
| Sequences | 1 (pickup_seq) | ✅ |
| Foreign Keys | 12 | ✅ |
| CHECK Constraints | 14 | ✅ |
| UNIQUE Constraints | 2 (1 standard + 1 partial) | ✅ |
| Performance Indexes | 13 | ✅ |
| Functions | 4 | ✅ |
| Triggers | 6 | ✅ |
| Seed Rows | 26 | ✅ |

**Deployment prerequisite:** Aktifkan `pg_trgm` via Supabase Dashboard > Database > Extensions sebelum menjalankan migrations (diperlukan oleh `idx_vendors_name_trgm` di 0004).

---

## Current Branch

`main`

---

## Latest Commit

```
47df9e2 feat: complete backend foundation with Supabase migration
```

---

## Architecture Summary

```
MottaGo
├── Frontend  : React 18 + TypeScript 5 + Vite 6 + TailwindCSS v3
│               React Router v6 + Supabase JS Client
├── Backend   : Supabase (PostgreSQL 15, Auth, Realtime)
│               No custom API server — Supabase PostgREST auto-API
└── Database  : PostgreSQL via Supabase
                8 tables, migrations 0001–0006 (LOCKED)
```

**Pattern komunikasi data:**
- Supabase JS Client → PostgREST (auto REST dari schema)
- Polling 30 detik untuk notifikasi dan kapasitas (DL-04)
- Tidak ada WebSocket/Realtime di MVP

---

## Folder Structure Summary

```
D:\Project\MottaGo\
├── frontend/                 # React SPA (aktif dikembangkan)
│   ├── src/
│   │   ├── components/       # atoms/ molecules/ organisms/
│   │   ├── design-system/    # tokens.css globals.css typography.css
│   │   ├── hooks/            # useAuth useCapacity usePickup useVendor useWaste
│   │   ├── layouts/          # AuthLayout DashboardLayout FormLayout SimpleLayout
│   │   ├── lib/              # supabase.ts (Supabase client)
│   │   ├── mock/             # Mock data (sementara, diganti real data di C1)
│   │   ├── pages/manajer/    # DashboardPage KapasitasPage RequestPickupPage
│   │   ├── router/           # index.tsx routes.ts navigation/ RoleGuard.tsx
│   │   ├── services/         # authService capacityService wasteService pickupService vendorService
│   │   ├── store/            # AuthContext.tsx
│   │   └── types/            # common pickup user vendor waste
│   ├── .env.example          # Template env vars
│   └── tailwind.config.ts
├── supabase/
│   └── migrations/           # 0001–0006 SQL files (LOCKED)
├── docs/                     # Project documentation
│   ├── CLAUDE_INSTRUCTIONS.md
│   ├── CURRENT_FOCUS.md
│   ├── DECISION_LOG.md
│   ├── TECHNICAL_DEBT.md
│   ├── PROJECT_STATUS.md     # ← file ini
│   ├── HANDOFF_2026-06-30.md
│   └── CLAUDE_SESSION_START.md
└── artifacts/                # Screenshots dan review artifacts
```

---

## Current Tech Stack

| Kategori | Teknologi | Versi |
|---|---|---|
| Runtime | Node.js | LTS |
| Framework | React | 18 |
| Language | TypeScript | 5 |
| Build Tool | Vite | 6 |
| Routing | React Router | v6 |
| Styling | TailwindCSS | v3 |
| Icons | Lucide React | v0.447+ |
| Backend/DB | Supabase | latest JS client |
| Database | PostgreSQL | 15 (via Supabase) |
| Linting | ESLint v8 + Prettier v3 | 0 warning tolerance |

---

## Next Milestone

**C1 — Authentication Integration** (Phase 6)

Scope:
1. Buat project Supabase, dapatkan credentials nyata
2. Isi `frontend/.env` dengan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
3. Jalankan migrations 0001–0006 di Supabase
4. Jalankan seed data 0006
5. Implementasi login page (email + password)
6. Wire AuthContext dengan Supabase Auth
7. Implementasi RoleGuard penuh (baca role dari profiles table)
8. Ganti mock data pages dengan real Supabase queries
9. Implementasi logout
10. Pastikan build clean + lint 0 warning

---

## Technical Debt

| ID | Komponen | Deskripsi | Target |
|---|---|---|---|
| TD-01 | TextInput | `leftIcon`/`rightIcon` bertipe `string`, bukan union `LucideIconName` | Sprint 2 |
| TD-02 | TextInput | State `readOnly` menggunakan `#F7F8FA` tanpa token eksplisit; perlu visual validation | Visual Validation Phase |
| TD-03 | Badge | Warning variant menggunakan arbitrary `text-[#92400E]`; perlu token `--color-warning-text` | Sprint 2 |

Detail lengkap: `docs/TECHNICAL_DEBT.md`

---

## Known Issues

| ID | File | Deskripsi | Severity |
|---|---|---|---|
| WARN-01 | `0005_triggers.sql` | `fn_handle_new_user` akan gagal jika `raw_user_meta_data` tidak menyertakan `store_id` untuk non-vendor role. Semua user creation harus menyertakan metadata lengkap. | Medium |
| WARN-02 | `0001_extensions.sql` | `pg_trgm` harus diaktifkan manual di Supabase Dashboard sebelum migration 0004 dijalankan | Medium |

---

## Important Decisions

Seluruh keputusan arsitektur tersimpan di `docs/DECISION_LOG.md` (DL-01 s/d DL-10).

Ringkasan kritis:
- **DL-01**: `stores.max_capacity` dikonfigurasi oleh Manajer (nullable)
- **DL-02**: `waste_items.unit` di-GENERATE otomatis dari `waste_type` (liquid→liter, else→kg)
- **DL-03**: Hanya 1 pickup aktif per store (`uix_pickups_one_active_per_store`)
- **DL-04**: Notifikasi via tabel NOTIFICATION + polling 30 detik (bukan WebSocket)
- **DL-06**: Setiap store memiliki `default_vendor_id`
- **DL-08**: Phase 3B v1.0 = source of truth screen inventory & frontend architecture
- **DL-09**: Responsive — Mobile <768px, Tablet 768–1023px, Desktop ≥1024px; Mobile-First CSS
- **DL-10**: SCR-M-01 & SCR-M-02 → DashboardLayout; SCR-M-04 → FormLayout

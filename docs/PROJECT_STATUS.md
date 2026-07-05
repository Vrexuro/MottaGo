# MottaGo — Project Status

**Terakhir diperbarui:** 3 Juli 2026
**Diperbarui oleh:** Independent Auditor MottaGo

---

## Current Phase

**Phase 4 — Build** (aktif)

---

## Current Milestone

**C2 — Real Data Integration**

Git push selesai (3 Juli 2026) — 2 commit: `cf0390d` (Sprint A, 50 files) + `3a1af1c` (Docs Audit, 15 files). Repository sudah sinkron dengan GitHub.

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
| B2.7 | Migration Verification & Database Lock | ✅ **PASS** |
| B2.8 | Service Compatibility Fix (5 incompatibilities resolved) | ✅ Selesai |
| Batch A1 | DB Migration amendments (0007–0011), route cleanup, vendor architecture | ✅ Selesai |
| Batch A2 | Route architecture + UserRole cleanup (hapus vendor/pelayan) | ✅ Selesai |
| Batch A3 | AuthCard organism component | ✅ Selesai |
| Batch A4 | LoginPage refactor (username-based auth, AuthCard integration) | ✅ Selesai |
| Batch A5 | Dashboard SCR-M-01 token cleanup, navigation wiring, DashboardHeader refactor | ✅ Selesai |
| EA-01 | Environment Activation — Supabase credentials, 11 migrations applied | ✅ Selesai |
| EA-02 | Development Test Accounts — manager_demo + utility_demo via Admin API | ✅ Selesai |

---

## Backend Status

### Supabase Migrations

| File | Deskripsi | Git Status | Supabase |
|---|---|---|---|
| `0001_extensions.sql` | pg_uuid, pg_trgm (amended) | ✅ Committed (modified locally) | ✅ Applied |
| `0002_tables.sql` | 8 tables + pickup_seq | ✅ Committed | ✅ Applied |
| `0003_constraints.sql` | 12 FK, 14 CHECK, 2 UNIQUE | ✅ Committed | ✅ Applied |
| `0004_indexes.sql` | 13 performance indexes (amended) | ✅ Committed (modified locally) | ✅ Applied |
| `0005_triggers.sql` | 4 functions, 6 triggers | ✅ Committed | ✅ Applied |
| `0006_seed.sql` | Dev seed data (amended) | ✅ Committed (modified locally) | ✅ Applied |
| `0007_rls.sql` | RLS policies, helper functions | ✅ Committed (cf0390d) | ✅ Applied |
| `0008_vendor_identity.sql` | Vendor identity patch (interim) | ✅ Committed (cf0390d) | ✅ Applied |
| `0009_remove_vendor_role.sql` | Hapus role vendor & pelayan | ✅ Committed (cf0390d) | ✅ Applied |
| `0010_vendor_whatsapp_and_pickup_amendments.sql` | WhatsApp, store_vendor_assignments, DL-03/DL-06 revision | ✅ Committed (cf0390d) | ✅ Applied |
| `0011_username_auth.sql` | Username auth, profiles.username UNIQUE | ✅ Committed (cf0390d) | ✅ Applied |

**Tabel database aktif:** vendors, stores, profiles, pickups, waste_items, capacity_snapshots, notifications, capacity_alerts, store_vendor_assignments

**Supabase credentials:** Dikonfigurasi di `frontend/.env` (EA-01 selesai).

---

## Frontend Status

| Lapisan | Status | Catatan |
|---|---|---|
| Design System | ✅ Selesai | `tokens.css`, `globals.css`, `typography.css`, `tailwind.config.ts` |
| Atoms (COMP-01–09) | ✅ Selesai | Button, TextInput, SelectInput, DateInput, Badge, Icon, Divider, ProgressBar, LoadingSpinner |
| Molecules (COMP-10–17) | ✅ Selesai | FormField, NotificationBadge, AlertBanner, CapacityCard, DashboardHeader, KpiCard, PickupSummaryCard, QuickActionsCard, StatusPickupCard, CapacityGaugePanel, CapacitySummaryStats, CapacityTrendCard, WasteTrendCard |
| Organisms | ✅ Selesai | AppHeader (COMP-19), SideNav (COMP-21), **AuthCard** (COMP-22, baru) |
| Layouts | ✅ Selesai | AuthLayout (LT-01), SimpleLayout (LT-02), DashboardLayout (LT-03), FormLayout (LT-04) |
| Pages (Manajer) | ✅ Selesai (mock) | DashboardPage, KapasitasPage, RequestPickupPage, + placeholder: KelolaPenggunaPage, LaporanPage, VendorManagementPage |
| LoginPage | ✅ Selesai | Username-based auth, AuthCard integration, error handling (Batch A4) |
| Router | ✅ Selesai | Routes, ROUTES const, RoleGuard aktif (bukan skeleton) |
| Services | ✅ Selesai | authService, capacityService, wasteService, pickupService, vendorService |
| Hooks | ✅ Skeleton | useAuth, useCapacity, usePickup, useVendor, useWaste |
| AuthContext | ✅ Updated | Profile fetching dari tabel profiles, role-aware |
| Constants | ✅ Selesai | `constants/capacity.ts` — CAPACITY_THRESHOLDS sebagai SSOT |
| Mock Data → Real | ❌ Pending | DashboardPage, KapasitasPage, RequestPickupPage masih mock — milestone C2 |

---

## Database Status

| Objek | Jumlah | Status |
|---|---|---|
| Tables | 9 | ✅ (8 core + store_vendor_assignments) |
| Sequences | 1 (pickup_seq) | ✅ |
| Foreign Keys | 12+ | ✅ |
| CHECK Constraints | 14+ | ✅ |
| UNIQUE Constraints | 3 (1 standard + 1 partial per-store-category + uq_profiles_username) | ✅ |
| Performance Indexes | 13+ | ✅ |
| Functions | 4 | ✅ |
| Triggers | 6 | ✅ |
| Seed Rows | 26 | ✅ |
| Auth Users (dev) | 2 | ✅ manager_demo + utility_demo |
| RLS Policies | Aktif di semua tabel | ✅ |

---

## Current Branch

`main`

---

## Latest Commit (GitHub)

```
3a1af1c docs: documentation audit — sync all docs to Sprint A state
cf0390d feat: Sprint A — RLS migrations, username auth, and frontend implementation
```

**Repository status:** ✅ Sinkron dengan GitHub. Push selesai 3 Juli 2026 (fast-forward, tidak ada divergensi).

---

## Architecture Summary

```
MottaGo
├── Frontend  : React 18 + TypeScript 5 + Vite 6 + TailwindCSS v3
│               React Router v6 + Supabase JS Client
│               Auth: username → synthetic email @mottago.internal (DL-11)
├── Backend   : Supabase (PostgreSQL 15, Auth, PostgREST auto-API, RLS)
│               No custom API server (DL-12)
└── Database  : PostgreSQL via Supabase
                9 tables, migrations 0001–0011
                RLS aktif, get_my_store_id() + get_my_role() helpers
```

**Role aktif:** `manajer`, `utility` (role `vendor` dan `pelayan` dihapus — DL-13, DL-05)

**Pattern komunikasi data:**
- Supabase JS Client → PostgREST (auto REST dari schema)
- Polling 30 detik untuk notifikasi dan kapasitas (DL-04)
- Tidak ada WebSocket/Realtime di MVP

---

## Folder Structure Summary

```
D:\Project\MottaGo\
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── atoms/        # Button, TextInput, SelectInput, DateInput, Badge, Icon, Divider, ProgressBar, LoadingSpinner
│   │   │   ├── molecules/    # FormField, NotificationBadge, CapacityCard, DashboardHeader, KpiCard, dll
│   │   │   └── organisms/    # AppHeader, SideNav, AuthCard
│   │   ├── constants/        # capacity.ts (CAPACITY_THRESHOLDS)
│   │   ├── design-system/    # tokens.css globals.css typography.css
│   │   ├── hooks/            # useAuth useCapacity usePickup useVendor useWaste
│   │   ├── layouts/          # AuthLayout DashboardLayout FormLayout SimpleLayout
│   │   ├── lib/              # supabase.ts (Supabase client)
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── NotFoundPage.tsx
│   │   │   └── manajer/      # DashboardPage KapasitasPage RequestPickupPage + placeholders
│   │   ├── router/           # index.tsx routes.ts RoleGuard.tsx
│   │   ├── services/         # authService capacityService wasteService pickupService vendorService
│   │   ├── store/            # AuthContext.tsx
│   │   └── types/            # common pickup user vendor waste
│   └── tailwind.config.ts
├── supabase/
│   └── migrations/           # 0001–0011 SQL files
│                             # 0001–0011: semua committed ke GitHub (cf0390d)
├── docs/
│   ├── CLAUDE_INSTRUCTIONS.md
│   ├── CURRENT_FOCUS.md
│   ├── DECISION_LOG.md       # DL-01–DL-13 (updated 3 Juli 2026)
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
| Charts | Recharts | v3.9+ |
| Backend/DB | Supabase | latest JS client |
| Database | PostgreSQL | 15 (via Supabase) |
| Linting | ESLint v8 + Prettier v3 | 0 warning tolerance |

---

## Next Milestone

**C2 — Real Data Integration**

Scope:
1. Ganti mock data di DashboardPage dengan Supabase queries nyata
2. Ganti mock data di KapasitasPage dengan Supabase queries nyata
3. Ganti mock data di RequestPickupPage dengan Supabase queries nyata
4. Wire notifikasi polling ke tabel `notifications` (DL-04)
5. Implementasi role Utility (halaman & workflow)
6. Tambah missing routes (TD-05): `MANAJER_RIWAYAT_PICKUP`, `MANAJER_PENGATURAN`
7. Pastikan build clean + lint 0 warning

---

## Technical Debt

| ID | Komponen | Deskripsi | Status | Target |
|---|---|---|---|---|
| TD-01 | TextInput / Button | `leftIcon`/`rightIcon` bertipe `string`, bukan `LucideIconName` | Open | C2 |
| TD-02 | TextInput | State `readOnly` menggunakan `#F7F8FA` tanpa token eksplisit | Open | Visual Validation |
| TD-03 | Badge | Warning variant `text-[#92400E]` tanpa token | **Resolved** | ✅ Sprint A |

Detail lengkap: `docs/TECHNICAL_DEBT.md`

---

## Known Issues

| ID | File | Deskripsi | Severity |
|---|---|---|---|
| WARN-01 | `0005_triggers.sql` | `fn_handle_new_user` akan gagal jika `raw_user_meta_data` tidak menyertakan `role`. Desain ini **disengaja** (fail-fast pattern — DL-12). Semua pembuatan akun wajib menyertakan metadata lengkap. | Medium (by design) |
| WARN-02 | `0001_extensions.sql` | `pg_trgm` harus diaktifkan manual di Supabase Dashboard sebelum migration 0004 dijalankan | ✅ Resolved (EA-01) |
| WARN-03 | Git | Migration 0007–0011, LoginPage, AuthCard, dan banyak frontend files belum di-commit ke GitHub | ✅ Resolved — push selesai 3 Juli 2026 (cf0390d + 3a1af1c) |

---

## Important Decisions

Seluruh keputusan arsitektur tersimpan di `docs/DECISION_LOG.md` (DL-01 s/d DL-13).

Ringkasan kritis:
- **DL-01**: `stores.max_capacity` dikonfigurasi oleh Manajer
- **DL-02**: `waste_items.unit` di-GENERATE otomatis dari `waste_type`
- **DL-03** *(revised)*: Satu pickup aktif per store **per waste_category**
- **DL-04**: Notifikasi via tabel NOTIFICATION + polling 30 detik
- **DL-05** *(revised)*: Vendor = Master Data murni, tidak dapat login
- **DL-06** *(revised)*: Vendor assignment via `store_vendor_assignments`, bukan `default_vendor_id`
- **DL-08**: Phase 3B v1.0 = source of truth screen inventory & frontend architecture
- **DL-09**: Responsive — Mobile <768px, Tablet 768–1023px, Desktop ≥1024px; Mobile-First CSS
- **DL-10**: SCR-M-01 & SCR-M-02 → DashboardLayout; SCR-M-04 → FormLayout
- **DL-11**: Username-based auth — synthetic email `username@mottago.internal`
- **DL-12**: Supabase sebagai satu-satunya backend platform (no custom server)
- **DL-13**: Role aktif hanya `manajer` dan `utility`

# MottaGo – Current Focus

## Project Overview

MottaGo adalah sistem manajemen pengurangan sampah sisa makanan untuk bisnis restoran.

## Current Phase

Phase 4 – Build (Sprint A selesai, menunggu git push)

## Current Focus

**Status:** Sprint A selesai ✅ | EA-01 ✅ | EA-02 ✅ | Git Push ⚠️ PENDING
**Next Milestone:** C2 — Real Data Integration (setelah git push)
**Terakhir diperbarui:** 3 Juli 2026

---

### Status Saat Ini

#### ⚠️ Git Push — BELUM DILAKUKAN

Migration 0007–0011, LoginPage, AuthCard, dan seluruh perubahan Sprint A (Batch A1–A5) ada di disk lokal tapi belum di-push ke GitHub. Ini adalah **prioritas utama** sebelum sesi berikutnya.

**Prompt siap:** `Prompt_GitPush_ClaudeCode.md` (folder: MottaGo - Independent Audit & Architecture)

File yang perlu di-push:
- `supabase/migrations/0007_rls.sql` hingga `0011_username_auth.sql`
- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/components/organisms/AuthCard/index.tsx`
- `frontend/src/constants/capacity.ts`
- `frontend/src/pages/NotFoundPage.tsx`
- `frontend/src/pages/manajer/KelolaPenggunaPage.tsx`, `LaporanPage.tsx`, `VendorManagementPage.tsx`
- Semua file modified (services, AuthContext, RoleGuard, router, atoms, molecules, organisms)

---

### EA-02 — Development Test Accounts ✅ SELESAI (3 Juli 2026)

Akun development siap digunakan:

| Username | Role | Password | UUID |
|---|---|---|---|
| `manager_demo` | manajer | `123456` | `b3ac18ce-a5fd-4b86-bdaa-bcdea54e44a7` |
| `utility_demo` | utility | `123456` | `c982f6fe-498f-4c4c-96eb-8ce01d78db83` |

Profil auto-created via trigger `fn_handle_new_user`, store_id=1, email_confirmed=true.

---

### EA-01 — Environment Activation ✅ SELESAI

- Supabase project aktif
- `frontend/.env` dikonfigurasi dengan credentials nyata
- 11/11 migration applied di Supabase (11 REMOTE confirmed)
- RLS aktif di semua tabel

---

### Batch A5 — Dashboard SCR-M-01 ✅ SELESAI (3 Juli 2026)

Token violations fixed (T-01 s/d T-10), navigation wiring (N-01–N-04), AppHeader enhancements (H-01, H-02), DashboardHeader refactor (D-02, D-03), DashboardPage wired ke `useAuth()`.

Outstanding: S-04 — routes `MANAJER_RIWAYAT_PICKUP` dan `MANAJER_PENGATURAN` belum ada.

Lint: ✅ 0 warnings. TypeScript: ✅ 0 errors. Build: ✅ success.

---

### Batch A4 — LoginPage Refactor ✅ SELESAI

LoginPage.tsx direfactor: AuthCard integration, username-based auth (`username@mottago.internal`), error handling dengan AlertCircle.

---

### Batch A3 — AuthCard Organism ✅ SELESAI

AuthCard/index.tsx: organism dua-bagian (Brand Header gelap + Form Body putih). Responsive, token-compliant, tanpa hex hardcode.

---

### Batch A2 — Route Architecture ✅ SELESAI

UserRole dikurangi: `'utility' | 'manajer'` saja. Role `vendor` dan `pelayan` dihapus dari types, router, AppHeader, SideNav.

---

### Batch A1 — Database Migration ✅ SELESAI

Migration 0007–0011 dibuat dan applied ke Supabase:
- `0007`: RLS policies + helper functions
- `0008`: Vendor identity patch (interim)
- `0009`: Hapus role vendor & pelayan (DL-05 revision)
- `0010`: WhatsApp, store_vendor_assignments, DL-03 & DL-06 revision
- `0011`: Username auth (DL-11)

---

## Completed

### Phase 1
- PRD, User Flow, BPMN, MoSCoW ✅

### Phase 2
- Design System, Color Palette, Typography, Component Rules ✅

### Phase 3
- Figma Prototype: SCR-M-01 Dashboard, SCR-M-02 Monitoring Kapasitas, SCR-M-04 Request Pickup ✅

### Phase 4 – Sprint 0
- React 18 + TypeScript 5 + Vite 6 + React Router v6 + TailwindCSS v3
- ESLint + Prettier (0 warning tolerance)
- Design System Foundation (tokens.css, globals.css, typography.css)
- 4 Route Placeholder ✅

### Phase 4 – Sprint 1
- AppHeader (COMP-19), SideNav (COMP-21)
- Layouts: AuthLayout, SimpleLayout, DashboardLayout, FormLayout
- Atoms: COMP-01–09
- Molecules: COMP-10–17
- RoleGuard (aktif)
- Hooks: useAuth, useCapacity, usePickup, useVendor, useWaste ✅

### Phase 4 – Sprint 2
- DashboardPage, KapasitasPage, RequestPickupPage (mock data) ✅

---

## Repository

**GitHub:** https://github.com/Vrexuro/MottaGo.git
**Branch aktif:** `main`
**Latest commit (GitHub):** `287b1e3` — docs: add project handoff
**Status local:** ⚠️ Jauh di depan GitHub — push segera

## Team

| Anggota | NIM | Kontribusi |
|---|---|---|
| Rifqi Dzakwan Nasution | 24523061 | Backend Lead, DB migrations, auth, frontend services |
| Nur Azizah Basyirah Syamsuddin | 24523238 | Frontend — Monitoring Kapasitas (feature/monitoring-kapasitas) |
| Aufa Dhia Arkan | 24523156 | Frontend — Shared Foundation (aufa/sprint1), CLAUDE.md |

## Rules

- GitHub adalah source of truth
- Semua perubahan harus di-push ke repository
- CURRENT_FOCUS.md harus diupdate setiap selesai sesi kerja
- DECISION_LOG.md harus diupdate setiap ada keputusan baru
- Figma adalah source of truth untuk UI

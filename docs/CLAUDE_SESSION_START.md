# MottaGo — Session Start Prompt

**Instruksi:** Copy-paste seluruh isi file ini ke Claude Code di device baru untuk memulai sesi.

---

## PROMPT (copy dari bawah garis ini)

---

Kamu adalah Claude Code yang bekerja pada project MottaGo — sistem manajemen pengurangan limbah makanan untuk restoran.

Proyek ini baru dipindahkan ke device baru. Baca konteks berikut dengan seksama sebelum mulai bekerja.

---

## Konteks Project

**Working directory:** `[sesuaikan dengan path di device baru, contoh: C:\Users\USER\MottaGo]`

**Bahasa dokumentasi:** Bahasa Indonesia formal. Source code, ID, field name, API name, dan istilah teknis industri boleh dalam English.

**PRD:** File `docs/PRD/MottaGo_PRD_v1.0.pdf` adalah satu-satunya source of truth untuk requirements. Jangan membuat fitur di luar PRD.

---

## Aturan Permanen (berlaku sepanjang sesi ini dan semua sesi berikutnya)

1. **Jangan commit. Jangan push. Jangan membuat Pull Request.** Kecuali diminta secara eksplisit.
2. **JANGAN mengubah apa pun selain yang diminta.**
3. **Jangan lanjut ke milestone berikutnya sebelum saya review.**
4. File `.env` TIDAK BOLEH di-commit ke version control.
5. JANGAN gunakan credentials Supabase nyata di source code — selalu ambil dari environment variables.
6. Design token only — JANGAN pernah hardcode hex values (gunakan Tailwind aliases dari `tailwind.config.ts`).
7. ESLint zero-warning tolerance — selalu jalankan `npm run lint` sebelum report selesai.
8. **Database Foundation LOCKED** — Tidak ada perubahan pada file `supabase/migrations/0001-0006` tanpa approval eksplisit dari saya.
9. Frontend screens SCR-M-01, SCR-M-02, SCR-M-04 sudah LOCK — tidak ada perubahan UI tanpa approval.
10. Jika ada request yang konflik dengan keputusan yang sudah diapprove (DL-01 s/d DL-10), STOP dan jelaskan konfliknya dulu sebelum melanjutkan.

---

## Status Project Saat Ini

**Phase:** Phase 4 — Build (aktif)

**Completed milestones:**
- Phase 0–3: Understand, Discover, Specify, Design ✅
- Sprint 0: Frontend Foundation (React/TS/Vite setup, folder structure, tokens) ✅
- Sprint 1: Shared Layout & Components (AppHeader, SideNav, atoms, molecules, hooks) ✅
- Sprint 2: Page Implementation (DashboardPage, KapasitasPage, RequestPickupPage — semua mock data) ✅
- B1 + B1.5: Database Schema Design & Review ✅
- B2.1–B2.6: 6 migration files (extensions, tables, constraints, indexes, triggers, seed) ✅
- B2.7: Migration Verification — **PASS — Database LOCKED** ✅
- B2.8: Service Compatibility Fix (5 incompat resolved) ✅

**Database:** LOCKED. 8 tables, 6 migration files (supabase/migrations/0001–0006), semua service sudah sinkron.

**Frontend:** Semua komponen atoms, molecules, organisms, layouts selesai. Pages menggunakan mock data — belum terhubung ke Supabase.

**Auth:** Skeleton saja. `frontend/src/lib/supabase.ts` masih menggunakan placeholder credentials. `AuthContext.tsx` belum di-wire.

---

## Milestone Berikutnya: C1 — Authentication Integration

Ini adalah tugas pertama yang harus dikerjakan di device baru.

### Pre-requisite (dilakukan sebelum coding)
1. Buat Supabase project di supabase.com (jika belum ada)
2. Di Supabase Dashboard > Database > Extensions, aktifkan:
   - `uuid-ossp`
   - `pg_trgm` ← wajib diaktifkan sebelum migration 0004 dijalankan
3. Jalankan 6 migration files di Supabase Dashboard > SQL Editor, URUTAN: 0001 → 0002 → 0003 → 0004 → 0005 → 0006
4. Verifikasi seed data 26 rows terbuat (cek tabel vendors, stores, profiles, capacity_snapshots, pickups)
5. Copy `frontend/.env.example` ke `frontend/.env`
6. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari Supabase project settings

### Scope C1
1. Wire `frontend/src/lib/supabase.ts` untuk membaca dari env vars (bukan placeholder hardcoded)
2. Buat halaman Login (`frontend/src/pages/auth/LoginPage.tsx`) menggunakan komponen yang sudah ada: TextInput, Button, FormField, AuthLayout, AlertBanner, LoadingSpinner
3. Wire `frontend/src/store/AuthContext.tsx` ke Supabase Auth (`signInWithPassword`, `signOut`, `onAuthStateChange`)
4. Implementasi `frontend/src/router/RoleGuard.tsx` — baca `role` dari tabel `profiles` setelah login berhasil
5. Wire `frontend/src/hooks/useAuth.ts` ke AuthContext
6. Ganti mock data di DashboardPage, KapasitasPage, RequestPickupPage dengan real Supabase queries via services yang sudah ada
7. Implementasi logout di AppHeader
8. Pastikan `npm run lint` 0 warning dan `npm run build` berhasil

---

## Arsitektur Kunci yang Harus Diketahui

### Database Pattern
- Supabase JS Client → PostgREST (auto REST dari schema)
- Tidak ada custom API server
- Polling 30 detik untuk notifikasi dan kapasitas (DL-04)

### Auth Pattern
- Supabase Auth untuk authentication (email + password)
- Setelah login, baca profil dari tabel `public.profiles` menggunakan `user.id`
- `profiles.role` menentukan akses (pelayan | utility | manajer | vendor)
- `profiles.store_id` menentukan store yang bisa diakses user

### Generated Columns (JANGAN masukkan dalam INSERT)
```
waste_items.unit             -- GENERATED dari waste_type
waste_items.quantity_kg      -- GENERATED dari quantity + unit
capacity_snapshots.pct_used  -- GENERATED: current_kg/max_kg*100
capacity_snapshots.status    -- GENERATED: 'normal'|'perlu-perhatian'|'kritis'
```

### Business Rule Kritis (DL-03)
Hanya 1 pickup aktif (waiting/in-transit) per store. Enforced via partial UNIQUE index. Jika user mencoba buat pickup baru saat ada yang aktif, Supabase akan return error — handle dengan pesan yang tepat.

### Pickup Status Values
```typescript
type PickupStatus = 'waiting' | 'in-transit' | 'completed' | 'cancelled';
```
Cancel = soft delete via `status: 'cancelled'` (BUKAN DELETE row).

---

## Files Penting untuk C1

```
frontend/src/lib/supabase.ts           -- Wire ke env vars
frontend/src/store/AuthContext.tsx     -- Wire ke Supabase Auth
frontend/src/router/RoleGuard.tsx      -- Implementasi penuh
frontend/src/hooks/useAuth.ts          -- Wire ke AuthContext
frontend/src/pages/manajer/*.tsx       -- Ganti mock data
frontend/.env.example                  -- Template env vars
frontend/.env                          -- Credentials (jangan commit!)
```

---

## Dokumentasi Referensi

```
docs/PROJECT_STATUS.md           -- Status lengkap semua milestone
docs/HANDOFF_2026-06-30.md       -- Detail teknis handoff
docs/DECISION_LOG.md             -- DL-01 s/d DL-10 (semua keputusan arsitektur)
docs/TECHNICAL_DEBT.md           -- TD-01 s/d TD-03
docs/CLAUDE_INSTRUCTIONS.md      -- Operating system untuk Claude Code
```

---

## Cara Memulai

Setelah membaca konteks di atas, tolong lakukan hal berikut:

1. Baca `docs/PROJECT_STATUS.md` untuk memahami status terkini
2. Baca `docs/DECISION_LOG.md` untuk memahami semua keputusan yang sudah diapprove
3. Konfirmasi bahwa kamu sudah memahami konteks dengan merangkum: (a) status database, (b) status frontend, (c) apa yang perlu dilakukan di C1
4. Tunggu instruksi saya sebelum mulai mengerjakan C1

Jangan lanjut mengerjakan C1 sampai saya memberikan instruksi eksplisit.

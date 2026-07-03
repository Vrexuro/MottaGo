# MottaGo — Session Start Prompt

**Instruksi:** Copy-paste seluruh isi file ini ke Claude Code di awal sesi baru.
**Terakhir diperbarui:** 3 Juli 2026

---

## PROMPT (copy dari bawah garis ini)

---

Kamu adalah Claude Code yang bekerja pada project MottaGo — sistem manajemen pengurangan limbah makanan untuk restoran.

Baca konteks berikut dengan seksama sebelum mulai bekerja.

---

## Konteks Project

**Working directory:** `[sesuaikan dengan path di device kamu]`

**Bahasa dokumentasi:** Bahasa Indonesia formal. Source code, ID, field name, API name, dan istilah teknis industri boleh dalam English.

**PRD:** File `docs/PRD/MottaGo_PRD_v1.0.pdf` adalah satu-satunya source of truth untuk requirements. Jangan membuat fitur di luar PRD.

---

## Aturan Permanen (berlaku sepanjang semua sesi)

1. **Jangan commit. Jangan push. Jangan membuat Pull Request.** Kecuali diminta secara eksplisit.
2. **JANGAN mengubah apa pun selain yang diminta.**
3. **Jangan lanjut ke milestone berikutnya sebelum saya review.**
4. File `.env` TIDAK BOLEH di-commit ke version control.
5. JANGAN gunakan credentials Supabase nyata di source code — selalu ambil dari environment variables.
6. Design token only — JANGAN pernah hardcode hex values (gunakan Tailwind aliases dari `tailwind.config.ts`).
7. ESLint zero-warning tolerance — selalu jalankan `npm run lint` sebelum report selesai.
8. Jika ada request yang konflik dengan keputusan yang sudah diapprove (DL-01 s/d DL-13), STOP dan jelaskan konfliknya dulu sebelum melanjutkan.

---

## Status Project Saat Ini

**Phase:** Phase 4 — Build (aktif)

**Completed milestones:**
- Phase 0–3: Understand, Discover, Specify, Design ✅
- Sprint 0: Frontend Foundation ✅
- Sprint 1: Shared Layout & Components (AppHeader, SideNav, atoms, molecules, hooks) ✅
- Sprint 2: Page Implementation (DashboardPage, KapasitasPage, RequestPickupPage — mock data) ✅
- B1–B2.8: Database schema design + 6 migration files + verifikasi + service fix ✅
- Batch A1: DB amendments (migration 0007–0011), route cleanup, vendor architecture ✅
- Batch A2: Route architecture + UserRole cleanup (hapus vendor/pelayan) ✅
- Batch A3: AuthCard organism component ✅
- Batch A4: LoginPage refactor (username-based auth) ✅
- Batch A5: Dashboard SCR-M-01 token cleanup + navigation wiring ✅
- EA-01: Environment Activation — Supabase credentials + 11/11 migration applied ✅
- EA-02: Development Test Accounts (manager_demo + utility_demo) ✅

**⚠️ GIT PUSH PENDING:** Semua perubahan Sprint A (Batch A1–A5) ada di lokal tapi belum di-push ke GitHub. Gunakan `Prompt_GitPush_ClaudeCode.md` (di folder audit independen) untuk eksekusi push sebelum mulai C2.

---

## Status Database

**11 migration files** di `supabase/migrations/` — semua sudah applied ke Supabase cloud (11/11 REMOTE).

| Range | Status Git | Status Supabase |
|---|---|---|
| 0001–0006 | ✅ Committed | ✅ Applied |
| 0007–0011 | ⚠️ Local only | ✅ Applied |

**9 tabel aktif:** vendors, stores, profiles, pickups, waste_items, capacity_snapshots, notifications, capacity_alerts, store_vendor_assignments

**Generated Columns (JANGAN masukkan dalam INSERT):**
```
waste_items.unit             -- GENERATED dari waste_type
waste_items.quantity_kg      -- GENERATED dari quantity + unit
capacity_snapshots.pct_used  -- GENERATED: current_kg/max_kg*100
capacity_snapshots.status    -- GENERATED: 'normal'|'perlu-perhatian'|'kritis'
```

---

## Status Frontend

**Auth:** ✅ LoginPage (`frontend/src/pages/LoginPage.tsx`) sudah ada dengan username-based flow.
`AuthContext.tsx` sudah di-wire. `frontend/.env` sudah dikonfigurasi dengan credentials nyata (EA-01).

**Dev accounts siap digunakan:**
- `manager_demo` / `123456` → role `manajer`, store_id 1
- `utility_demo` / `123456` → role `utility`, store_id 1

**Pages:** DashboardPage, KapasitasPage, RequestPickupPage masih menggunakan **mock data** — ini yang akan diganti di C2.

---

## Milestone Berikutnya: C2 — Real Data Integration

### Pre-requisite
1. Pastikan git push sudah dilakukan (lihat `Prompt_GitPush_ClaudeCode.md`)
2. Dev server berjalan: `cd frontend && npm run dev`
3. Login dengan `manager_demo` / `123456` berhasil

### Scope C2
1. Ganti mock data DashboardPage dengan Supabase queries via `capacityService`, `pickupService`
2. Ganti mock data KapasitasPage dengan Supabase queries via `capacityService`
3. Ganti mock data RequestPickupPage dengan Supabase queries via `pickupService`, `vendorService`
4. Wire notifikasi polling (30 detik) ke tabel `notifications` (DL-04)
5. Implementasi halaman Utility (role utility — halaman & workflow dasar)
6. Tambahkan routes yang hilang: `MANAJER_RIWAYAT_PICKUP`, `MANAJER_PENGATURAN` (TD-05)
7. Pastikan `npm run lint` 0 warning dan `npm run build` berhasil

---

## Arsitektur Kunci yang Harus Diketahui

### Auth Pattern (DL-11)
- Login menggunakan **username**, bukan email
- Frontend transform: `username` → `username@mottago.internal` sebelum `signInWithPassword`
- Role dibaca dari `profiles.role` setelah login
- **Role aktif:** `manajer`, `utility` saja (pelayan dan vendor sudah dihapus — DL-05, DL-13)

### Database Pattern (DL-12)
- Supabase JS Client → PostgREST (auto REST dari schema)
- Tidak ada custom API server
- RLS aktif di semua tabel — helper functions: `get_my_store_id()`, `get_my_role()`

### Business Rules Kritis
- **DL-03** *(revised)*: Satu pickup aktif per store **per waste_category** — bukan hanya per store
- **DL-04**: Notifikasi via polling 30 detik — bukan WebSocket
- **DL-06** *(revised)*: Vendor assignment via `store_vendor_assignments` — bukan `default_vendor_id`
- Cancel pickup = soft delete `status: 'cancelled'` — BUKAN DELETE row

### Pickup Status Values
```typescript
type PickupStatus = 'waiting' | 'in-transit' | 'completed' | 'cancelled';
```

---

## Files Penting untuk C2

```
frontend/src/services/capacityService.ts   -- Query kapasitas
frontend/src/services/pickupService.ts     -- Query pickup
frontend/src/services/vendorService.ts     -- Query vendor
frontend/src/services/wasteService.ts      -- Query waste items
frontend/src/store/AuthContext.tsx         -- Auth state + profile
frontend/src/router/routes.ts              -- Tambah routes yang hilang
frontend/src/pages/manajer/DashboardPage.tsx
frontend/src/pages/manajer/KapasitasPage.tsx
frontend/src/pages/manajer/RequestPickupPage.tsx
```

---

## Dokumentasi Referensi

```
docs/PROJECT_STATUS.md      -- Status lengkap semua milestone (updated 3 Juli 2026)
docs/CURRENT_FOCUS.md       -- Focus saat ini + EA-02 credentials (updated 3 Juli 2026)
docs/DECISION_LOG.md        -- DL-01 s/d DL-13 (updated 3 Juli 2026)
docs/TECHNICAL_DEBT.md      -- TD-01 s/d TD-05 (updated 3 Juli 2026)
docs/CLAUDE_INSTRUCTIONS.md -- Operating system untuk Claude Code
CLAUDE.md                   -- Quick reference untuk Claude Code
```

---

## Cara Memulai

Setelah membaca konteks di atas:

1. Baca `docs/PROJECT_STATUS.md` untuk memahami status terkini
2. Baca `docs/DECISION_LOG.md` untuk memahami semua keputusan yang sudah diapprove (DL-01–DL-13)
3. Konfirmasi pemahamanmu dengan merangkum: (a) status git push, (b) status auth/frontend, (c) scope C2
4. Tunggu instruksi saya sebelum mulai mengerjakan C2

Jangan mulai C2 sampai saya memberikan instruksi eksplisit.

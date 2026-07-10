# CURRENT FOCUS

**Updated:** 2026-07-10
**Sprint:** Sprint E — Production Polish
**Status:** SELESAI ✅

---

## Riwayat Sprint (ringkasan)

| Sprint | Scope | Status |
|---|---|---|
| Sprint A | Migrations 0007–0011, RLS, username auth, LoginPage, AuthCard | ✅ Selesai |
| Sprint B (B0–B4) | Layout stabilization, navigation wiring, component fixes | ✅ Selesai |
| Sprint C | Real Data Integration — semua pages dihubungkan ke Supabase | ✅ Selesai |
| Sprint D Batch 1 | Pickup status lifecycle (confirm/complete/cancel + Aksi column) | ✅ Selesai |
| Sprint D Batch 2 | Tambah Pengguna — Edge Function create-user + UI Manajer | ✅ Selesai |
| Sprint E | Production polish — username fix, PengaturanPage, cleanup | ✅ Selesai |

---

## Sprint E — Scope

### Batch 1 (Quick Wins) — Prioritas Tinggi

| Task | File | Deskripsi |
|---|---|---|
| H-01 | `AuthContext.tsx`, `ProfilPage.tsx` | Tambah `username` ke fetchProfile + fix tampilan ProfilPage |
| M-01 | `ProfilPage.tsx` | Ganti MOCK_LAST_LOGIN dengan `session.user.last_sign_in_at` |
| M-02 | `wasteService.ts`, `pickupService.ts`, `capacityService.ts` | Hapus 10 stale TODO comments di error handlers |
| M-03 | `wasteService.ts` | Hapus dead function `getWasteDailySummary` (tidak pernah dipanggil) |
| L-01 | `PengaturanPage.tsx`, `ProfilPage.tsx` | Hapus teks "Sprint C" basi |

### Batch 2 (Implementasi) — Prioritas Sedang

| Task | File | Deskripsi |
|---|---|---|
| H-02 | `PengaturanPage.tsx` | Implementasi form edit max_capacity + info store |

### Setelah Batch 2 — NEXT STEP

- **Git push Sprint B–E ke GitHub** (dikerjakan manual oleh Project Leader)
- Demo walkthrough semua role (manajer_demo + utility_demo)

## Catatan Desain — Perilaku KapasitasPage setelah update max_capacity

Setelah `max_capacity` di tabel `stores` diubah via PengaturanPage, `KapasitasPage`
masih menampilkan nilai lama dari `capacity_snapshots.max_kg` hingga snapshot baru
dibuat. Ini adalah **design behavior yang disengaja** — snapshot menyimpan nilai
historis `max_kg` pada saat snapshot dibuat. Bukan bug.

---

## Constraint Aktif

- **GIT:** DILARANG `git add`, `git commit`, `git push`, `git merge`, `git reset` — dikontrol Project Leader
- **Backend:** Tidak ada migration baru untuk Sprint E (semua changes adalah frontend-only)
- **Scope:** Hanya perbaikan yang tercatat di FINAL_PRODUCTION_READINESS_REVIEW.md

---

## State Terakhir yang Diverifikasi (10 Juli 2026)

- `npm run build` → SUCCESS
- `npx tsc -b --noEmit` → 0 errors
- `npm run lint` → 0 problems
- Dev server aktif, semua route accessible
- Edge Function `create-user` → ACTIVE di Supabase project `nwivhbnuisrigiowvuri`
- Migrations aktif: 0001–0013

## Commits di GitHub (branch main)

```
f4742b2  chore: RC v1.0 — pre-Sprint D baseline         (10 Juli 2026)
3a1af1c  docs: documentation audit — sync all docs to Sprint A state
cf0390d  feat: Sprint A — RLS migrations, username auth, and frontend implementation
```

Sprint B–D belum di-push ke GitHub. Push berikutnya harus mencakup semua perubahan Sprint B s/d E.

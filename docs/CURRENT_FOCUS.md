# CURRENT FOCUS

**Updated:** 2026-07-04
**Sprint:** B0 — Stabilisasi Aplikasi
**Status:** SELESAI ✅

---

## Sprint B0 — SELESAI

Sprint B0 telah berhasil diselesaikan. Semua 12 task telah diimplementasikan dan di-verify melalui TypeScript build (`tsc -b && vite build` PASS).

### Yang Sudah Selesai (B0-01 s/d B0-12)

| Task | Deskripsi | Status |
|------|-----------|--------|
| B0-01 | AuthContext: tambah `logout()` | ✅ |
| B0-02 | DashboardPage: wire logout + userName real + notif + date click | ✅ |
| B0-03 | KapasitasPage: wire logout + userName real + notif | ✅ |
| B0-04 | RequestPickupPage: wire logout + userName real + notif | ✅ |
| B0-05 | AppHeader: hapus Search Bar | ✅ |
| B0-06 | NotifikasiPage: buat halaman placeholder + route + wire bell | ✅ |
| B0-07 | RiwayatPickupPage: buat halaman placeholder + route | ✅ |
| B0-08 | SideNav Manajer: expand dari 3 ke 7 item navigasi | ✅ |
| B0-09 | StatusPickupCard: wire `onLihatSemua` prop | ✅ |
| B0-10 | PickupSummaryCard: wire `onLihatSemua` prop + TODO per-row | ✅ |
| B0-11 | DashboardHeader: tambah `onDateClick` prop (conditional button) | ✅ |
| B0-12 | KelolaPenggunaPage, VendorManagementPage, LaporanPage: upgrade ke DashboardLayout | ✅ |

### Temuan Kritis Sesi Ini

🔴 **NTFS Mount Write Truncation Bug** — File yang ditulis via Edit/Write tool di-truncate di disk. Python writes ke NTFS mount diperlukan untuk memastikan commit ke disk. Semua 17 file B0 telah di-rewrite via Python dan diverifikasi.

🟠 **Pre-existing Prettier Violations** — 1030 errors single-quote vs double-quote di seluruh codebase. Bukan dari B0. Perlu `npm run format` di sesi berikutnya.

---

## Sprint B1 — NEXT (Real Data Integration)

Sprint B1 akan menghubungkan semua widget ke Supabase:
- Dashboard KPI cards → Supabase queries
- Kapasitas → real-time capacity data
- Pickup → real pickup records
- Notifikasi → NOTIFICATION table polling (DL-04)
- Riwayat Pickup → paginated pickup history

**Pre-requisite sebelum B1:**
1. Jalankan `npm run format` untuk fix Prettier violations
2. Verify login + logout flow manual di browser
3. Confirm semua 7 nav items muncul di SideNav

---

## Constraint Aktif

- GIT: DILARANG commit/push — dikontrol Project Leader
- Backend: DILARANG sentuh supabase/migrations/
- Mock data: semua widget masih pakai data hardcoded

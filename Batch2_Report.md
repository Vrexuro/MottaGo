========================================
SPRINT C BATCH 2 — LAPORAN AKHIR
Tanggal: 10 Juli 2026
========================================

## REPOSITORY AUDIT (dari Phase 0)

```
CURRENT SERVICES (sebelum Batch 2)
reportService.ts       : TIDAK ADA
notificationService.ts : TIDAK ADA
userService.ts          : TIDAK ADA

CURRENT HOOKS (sebelum Batch 2)
useReport.ts       : TIDAK ADA
useNotification.ts : TIDAK ADA

MOCK CONSUMERS CONFIRMED (sebelum Batch 2)
mock/report.ts        → LaporanPage.tsx, WasteTrendCard/index.tsx (hidden dependency, tidak
                         disebutkan di daftar consumer awal — ditemukan saat audit)
mock/notification.ts  → AppHeader/index.tsx
mock/user.ts          → KelolaPenggunaPage.tsx

GAP TAMBAHAN DITEMUKAN SELAMA IMPLEMENTASI (di luar M6–M9 asli)
- CategoryBreakdownCard (component) hardcode `MAX_CAPACITY_KG = 400` internal — ditemukan saat
  smoke test Phase 5 (KapasitasPage menampilkan "3% dari 400 kg" alih-alih "10% dari 100 kg"
  yang benar sesuai `stores.max_capacity`). Diperbaiki (lihat FILES MODIFIED).
- RLS policy `profiles_select_own` (migration 0007) membatasi `KelolaPenggunaPage` hanya bisa
  melihat baris profile miliknya sendiri — limitasi arsitektur DB, bukan bug frontend
  (lihat Known Issues KI-07).

BUILD STATE BASELINE (Phase 0)
tsc -b --noEmit : 0 errors
lint            : 0 problems
build           : sukses
```

---

## FILES MODIFIED

### Phase 1 — M6: Reports
- `src/services/reportService.ts` (BARU) — `ReportKpi`, `ChartPoint`, `getKpi(storeId, days)`
  (total sampah, pickup completed, efisiensi% dari `stores.max_capacity`), `getChartData(storeId, days)`
  dengan bucketing day/week/month
- `src/hooks/useReport.ts` (BARU) — `useReport(storeId, days)` → `{kpi, chartData, loading, error, refresh}`
- `src/pages/manajer/LaporanPage.tsx` — hapus import `mock/report`, wire ke `useReport`, storeId guard,
  loading/error/empty state, `PERIOD_DAYS` map menggantikan lookup mock
- `src/components/molecules/WasteTrendCard/index.tsx` — hapus import `mock/report` + `MOCK` record
  internal, tambah prop `trend?: DataPoint[]`, tambah empty-state
- `src/pages/manajer/DashboardPage.tsx` — tambah state `wasteTrend` + `useEffect` fetch
  `reportService.getChartData(storeId, 7)`, diteruskan sebagai `trend` ke `WasteTrendCard`

### Phase 2 — M7: Notifications
- `src/services/notificationService.ts` (BARU) — `Notification` interface (`type`, `severity`,
  `isRead`, `createdAt`), `getNotifications()`, `markAsRead()`, `getUnreadCount()`
- `src/hooks/useNotification.ts` (BARU) — `useNotification(storeId)` dengan polling 30 detik (DL-04),
  optimistic `markAsRead`, `unreadCount` computed
- `src/components/organisms/AppHeader/index.tsx` — hapus import `mock/notification` +
  `MOCK_NOTIFICATION_COUNT`, tambah prop `notificationCount?: number`
- `src/layouts/DashboardLayout/index.tsx` — tambah `useAuth()` + `useNotification()` internal,
  diteruskan sebagai `notificationCount` ke `AppHeader`
- `src/pages/manajer/NotifikasiPage.tsx` — full rewrite dari placeholder: list notifikasi real,
  click-to-mark-as-read, loading/empty state

### Phase 3 — M8: User Management
- `src/services/userService.ts` (BARU) — `ProfileUser` interface, `getUsersByStore(storeId)`
- `src/pages/manajer/KelolaPenggunaPage.tsx` — hapus import `mock/user`, wire ke `userService`,
  `isSelf` berbasis UUID (`user?.id === profileUser.id`, menggantikan string compare nama yang rapuh),
  kolom "Last Login" diganti "Bergabung" (tidak ada kolom itu di schema), toggle aktif/nonaktif
  bersifat ephemeral (local state) karena `profiles.is_active` tidak ada di schema — lihat KI-07

### Phase 4 — GAP-09: CapacityTrendCard
- `src/components/molecules/CapacityTrendCard/index.tsx` — hapus `SEED_PCT`/`buildData()`/`MOCK`
  internal + `MAX_KG` hardcoded, tambah prop `trend?`, `maxKg?`, `onRangeChange?`, `loading?`,
  tambah loading/empty state

### Phase 5 — GAP-10: CapacityAlertHistoryCard
- `src/components/molecules/CapacityAlertHistoryCard/index.tsx` — hapus `MOCK_ROWS` internal,
  tambah prop `alerts?`, `loading?`, header count dinamis (`{rows.length} terakhir`, sebelumnya
  hardcoded "6 terakhir"), tambah loading/empty state
- `src/pages/manajer/KapasitasPage.tsx` — destructure `alertHistory, trend, fetchTrend` dari
  `useCapacity`, tambah `useEffect` memanggil `fetchTrend(7)` saat mount (trend tidak pernah
  terisi otomatis oleh `fetchAll()`), wire `CapacityTrendCard`/`CapacityAlertHistoryCard` ke data real
- **Bonus fix (ditemukan saat smoke test, bukan scope asli)**: `src/components/molecules/CategoryBreakdownCard/index.tsx`
  — hapus `const MAX_CAPACITY_KG = 400` hardcoded, tambah prop `maxKg?: number` (default 400 untuk
  backward safety), `capacityPct` dan teks footer kini pakai `maxKg` asli dari `stores.max_capacity`.
  `KapasitasPage.tsx` diupdate meneruskan `maxKg={maxKg}`.

### Phase 6 — M9: Mock Cleanup
- Dihapus permanen (0 consumer tersisa, dikonfirmasi via grep sebelum dan sesudah):
  `src/mock/managerStore.ts`, `src/mock/utilityStore.ts`, `src/mock/utility.ts`, `src/mock/vendor.ts`,
  `src/mock/pickup.ts`, `src/mock/pickup/requestPickup.ts`, `src/mock/report.ts`,
  `src/mock/notification.ts`, `src/mock/user.ts`, `src/mock/README.md` (dokumentasi mock layer,
  sudah tidak relevan karena seluruh file yang didokumentasikan dihapus)
- Folder `src/mock/` (termasuk subfolder `pickup/`) dihapus sepenuhnya — kosong setelah cleanup

---

## SERVICES CREATED
```
reportService       : getKpi ✅, getChartData ✅
notificationService : getNotifications ✅, markAsRead ✅, getUnreadCount ✅
userService          : getUsersByStore ✅
```

## HOOKS CREATED
```
useReport       : LaporanPage, DashboardPage (via reportService langsung untuk trend 7 hari)
useNotification : DashboardLayout (polling 30 detik, badge AppHeader)
```

## MOCK REMAINING (setelah Batch 2)
```
src/mock/ : folder dihapus sepenuhnya — 0 file tersisa
```

## BUILD STATUS
```
tsc -b --noEmit  : 0 errors
npm run lint     : 0 problems (--max-warnings 0)
npm run build    : sukses (3.22s)
```

## SMOKE TEST RESULT
```
Dashboard (manajer)   : ✅ PASS — KPI real, waste trend chart real (7 hari), console bersih
Laporan               : ✅ PASS — total sampah 41.7 kg (match exact DB sum), toggle periode
                         re-fetch benar (rataHarian 1.4→6 kg/hari saat 30d→7d), console bersih
Notifikasi            : ✅ PASS — 4 notifikasi real dari DB, badge bell menampilkan unread count
                         real, klik notifikasi → markAsRead persist ke DB (is_read/read_at
                         terkonfirmasi via query langsung), console bersih
Kelola Pengguna       : ✅ PASS — "Total 1 pengguna" (Manager Demo, sesuai batasan RLS — lihat
                         KI-07), tombol Aksi tersembunyi untuk diri sendiri (UUID check),
                         console bersih
Kapasitas             : ✅ PASS — tren kapasitas real (kurva 92%→10% sesuai capacity_snapshots
                         asli, bukan pola seed tetap), riwayat alert real (2 baris: 70% Perlu
                         Perhatian, 92% Kritis), CategoryBreakdownCard menampilkan "10% dari
                         100 kg" (bukan lagi "3% dari 400 kg"), console bersih
Utility Dashboard     : ✅ PASS (verifikasi tambahan pasca cleanup mock/utility.ts) — data real,
                         console bersih
Catat Sampah / Riwayat Input : ✅ PASS (verifikasi tambahan pasca cleanup) — console bersih
```

Semua verifikasi dilakukan via restart penuh dev server + login ulang untuk menghindari
stale HMR error log (pola berulang di sesi ini — lihat Errors & Fixes internal).

---

## KNOWN ISSUES

**KI-07 🟡 RLS `profiles_select_own` membatasi visibilitas multi-user di KelolaPenggunaPage**

Policy `profiles_select_own` (`FOR SELECT USING (id = auth.uid())`, migration `0007_rls.sql`)
membatasi user hanya bisa melihat baris profile miliknya sendiri. Terkonfirmasi via query langsung
(`db query --linked`) bahwa `store_id=1` sebenarnya punya 2 profile ("Manager Demo" + "Utility Demo"),
tapi `userService.getUsersByStore()` yang dipanggil client-side hanya pernah mengembalikan 1 baris
(dirinya sendiri) untuk user manapun. Ini limitasi level database, bukan bug di `userService.ts` atau
`KelolaPenggunaPage.tsx` — keduanya sudah query dengan benar.

**Dampak:** `KelolaPenggunaPage` tidak akan pernah bisa menampilkan pengguna lain ke seorang manajer
selama policy ini berlaku sebagaimana didesain saat ini.

**Kenapa tidak diperbaiki di Batch 2:** `supabase/migrations/**` dilindungi (hard constraint:
tidak ada perubahan skema DB di Batch 2).

**Rekomendasi:** Migration baru (perlu approval eksplisit) menambah policy tambahan, misalnya
`FOR SELECT USING (store_id = get_my_store_id() AND get_my_role() = 'manajer')`, agar manajer bisa
melihat seluruh pengguna di store-nya.

**KI-08 🟢 Toggle Aktif/Nonaktif di KelolaPenggunaPage bersifat ephemeral**

Kolom `profiles.is_active` tidak ada di schema saat ini. Toggle status Aktif/Nonaktif hanya
mengubah local state (`activeMap`) di komponen, tidak persist ke DB. Perilaku ini konsisten dengan
versi Sprint B4 (yang juga tidak punya backing data), didokumentasikan eksplisit sebagai catatan
kode (`// MVP: profiles.is_active tidak ada di schema`).

**KI-09 🟢 WasteTrendCard range terbatas 7/14/30 (belum selaras dengan CapacityTrendCard 7/14/30/90)**

Ada TODO comment lama (`WasteTrendCard/index.tsx:4`) yang mencatat rencana menyelaraskan opsi range
dengan `CapacityTrendCard` (yang punya opsi 90 hari). Tidak diubah di Batch 2 karena governance
eksplisit "tidak ada perubahan behavior/visual komponen di luar acceptance criteria" — menambah
opsi range adalah perubahan perilaku, bukan sekadar mock cleanup. Dibiarkan sebagai catatan backlog.

---

## GAPS RESOLVED IN BATCH 2
```
M6 Reports              : ✅ RESOLVED
M7 Notifications         : ✅ RESOLVED (polling 30 detik sesuai DL-04)
M8 User Management       : ✅ RESOLVED (dengan catatan KI-07, KI-08)
GAP-09 CapacityTrendCard : ✅ RESOLVED
GAP-10 CapacityAlertHistoryCard : ✅ RESOLVED
M9 Mock cleanup           : ✅ RESOLVED — 0 file mock tersisa, 0 consumer tersisa
Bonus: CategoryBreakdownCard hardcoded 400kg : ✅ RESOLVED
```

## GOVERNANCE
```
git add / commit / push / merge / reset : tidak dilakukan sama sekali
Perubahan skema DB (supabase/migrations/**) : tidak disentuh
Perubahan Design System / layout / routing / auth flow : tidak dilakukan
Perubahan visual/spacing/typography/color komponen : tidak dilakukan (hanya penambahan prop
  untuk menerima data real menggantikan mock internal — UI identik dengan Sprint B4)
Polling                                    : menggunakan pola polling sederhana (30 detik,
  DL-04) — tidak ada realtime yang perlu diganti, tidak ada polling lama yang perlu diubah
Dev server                                 : tetap berjalan sepanjang implementasi (preview tool),
  di-restart penuh beberapa kali untuk menghindari stale HMR log saat verifikasi
```
========================================

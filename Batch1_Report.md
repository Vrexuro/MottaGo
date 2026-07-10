========================================
SPRINT C BATCH 1 — LAPORAN AKHIR
Tanggal: 9 Juli 2026
========================================

## REPOSITORY AUDIT (dari Phase 0)

```
CURRENT SERVICES (sebelum Batch 1)
authService.ts     : REAL
capacityService.ts : PARTIAL — getCapacitySummary stub (return null); getCurrentCapacity/getCapacityTrend/getCapacityAlertHistory sudah benar
wasteService.ts    : PARTIAL — taxonomy salah (English), rataHarian hardcoded 0, tidak ada insertWasteItem/getWasteHistory
pickupService.ts   : PARTIAL — createPickup stub (return null)
vendorService.ts   : PARTIAL — read-only, tidak ada createVendor/updateVendor, tidak ada whatsapp_number

CURRENT HOOKS (sebelum Batch 1)
useAuth.ts     : REAL, sudah digunakan di semua halaman
useCapacity.ts : UNUSED
usePickup.ts   : UNUSED
useWaste.ts    : UNUSED
useVendor.ts   : UNUSED

GAPS CONFIRMED
GAP-01 WasteType taxonomy    : confirmed
GAP-02 max_capacity bug      : NOT FOUND (sudah benar sebelum Batch 1 dimulai)
GAP-03 createPickup stub     : confirmed
GAP-04 insertWasteItem missing : confirmed
GAP-05 getCapacitySummary stub : confirmed
GAP-06 rataHarian hardcoded 0 : confirmed
GAP-07 vendor type mismatch  : confirmed (termasuk: vendors table TIDAK punya kolom kategori sama sekali)

GAP TAMBAHAN (ditemukan selama implementasi, di luar 7 gap awal)
GAP-08 PickupSummaryCard (component) hardcode import PICKUP_HISTORY dari mock/pickup — diperbaiki (prop pickups ditambahkan)
GAP-09 CapacityTrendCard (component) memakai data sintetis internal, tidak menerima props — TIDAK diperbaiki (lihat Known Issues)
GAP-10 CapacityAlertHistoryCard (component) memakai MOCK_ROWS internal, tidak menerima props — TIDAK diperbaiki (lihat Known Issues)
GAP-11 KRITIS: waste_items.waste_type CHECK constraint (migration 0003, live DB) masih memakai taxonomy Inggris lama, TIDAK sinkron dengan keputusan K-01 (taxonomy Indonesia). Lihat Known Issues.

BUILD STATE BASELINE (Phase 0)
tsc -b --noEmit : 0 errors
lint            : 0 problems
build           : sukses
```

---

## FILES MODIFIED

### Phase 2 (Vendor)
- `src/types/vendor.types.ts` — tambah `whatsappNumber?`, `updatedAt?`
- `src/services/vendorService.ts` — tambah `createVendor`, `updateVendor`, `getAllVendors` (lihat Known Issues); update `VendorRow`/`mapRow`/`VENDOR_SELECT` untuk `whatsapp_number` + `updated_at`
- `src/pages/manajer/VendorManagementPage.tsx` — ganti mock dengan `vendorService.getAllVendors()` + CRUD; kolom/field **Kategori dihapus** (vendors table tidak punya kolom kategori)
- `src/pages/manajer/RequestPickupPage.tsx` — vendor dropdown diganti `useVendor()`

### Phase 3 (Waste)
- `src/types/waste.types.ts` — `WasteType` diubah ke `'organik'|'anorganik'|'minyak'`, hapus komentar deprecated
- `src/services/wasteService.ts` — fix `CATEGORY_NAMES`; tambah `insertWasteItem()`, `getWasteHistory()`; fix `rataHarian` (7-day rolling average, bukan hardcoded 0)
- `src/services/capacityService.ts` — tambah `createSnapshot()`
- `src/constants/waste.ts` — import `WasteCategoryDb` diganti dari `mock/utility` ke `types/waste.types` (`WasteType`)
- `src/pages/utility/CatatSampahPage.tsx` — wire ke `wasteService.insertWasteItem` + `capacityService.createSnapshot`; tambah storeId guard + error state
- `src/pages/utility/RiwayatInputPage.tsx` — wire ke `wasteService.getWasteHistory`; tambah storeId guard + loading state
- `src/pages/utility/UtilityDashboardPage.tsx` — wire ke `useWaste` + `useCapacity`; entri terbaru via `wasteService.getWasteHistory(storeId, 3)`

### Phase 4 (Capacity)
- `src/services/capacityService.ts` — implement `getCapacitySummary()` (sebelumnya stub)
- `src/pages/manajer/DashboardPage.tsx` — kapasitas + waste KPI wired ke `useCapacity`/`useWaste`
- `src/pages/manajer/KapasitasPage.tsx` — semua data wired ke `useCapacity`/`useWaste`
- `src/hooks/useCapacity.ts`, `useWaste.ts`, `usePickup.ts`, `useVendor.ts` — **bonus fix**: initial `loading` state `false→true` (mencegah `NaN` di render pertama sebelum fetch selesai — ditemukan via console warning `Received NaN for strokeDashoffset` saat testing Dashboard)

### Phase 5 (Pickup)
- `src/types/pickup.types.ts` — tambah `wasteCategory` (wajib) + `estimasiKg?` ke `CreatePickupDto`; tambah `wasteCategory`, ubah `estimasiKg` jadi nullable di `Pickup`
- `src/services/pickupService.ts` — implement `createPickup()`; tambah `waste_category` ke `PickupRow`/`PICKUP_SELECT`/`mapRow`
- `src/pages/manajer/RequestPickupPage.tsx` — tambah field Kategori Waste, submit wired ke `usePickup().create`, real DL-03 conflict detection (ganti simulasi `MOCK_STATE`), hapus sisa `managerStore` (Zona B kapasitas kini dari `useCapacity`/`useWaste`)
- `src/pages/manajer/RiwayatPickupPage.tsx` — wire ke `usePickup`; kolom **Catatan dihapus** (pickups table tidak punya kolom notes)
- `src/pages/manajer/DashboardPage.tsx` — pickup stats wired ke `usePickup`; "Pickup Bulan Ini" dihitung dari `pickupHistory` (completed bulan berjalan); trend "+6 vs bulan lalu" dihapus (data fabrikasi tanpa sumber)
- `src/pages/utility/UtilityDashboardPage.tsx` — `pickupAktif` wired ke `usePickup().activePickups.length`
- `src/components/molecules/PickupSummaryCard/index.tsx` — **GAP-08 fix**: tambah prop `pickups: Pickup[]`, hapus import `mock/pickup` internal
- `src/components/molecules/StatusThresholdCard/index.tsx` — **fix tambahan** (diperlukan checkpoint Phase 5 sendiri, tidak disebutkan eksplisit di prompt): tambah prop `currentPct: number`, hapus import `mock/managerStore` internal

---

## SERVICES UPDATED
```
vendorService   : createVendor ✅, updateVendor ✅, getAllVendors ✅ (tambahan)
wasteService    : insertWasteItem ✅, getWasteHistory ✅, rataHarian fix ✅
capacityService : max_kg (sudah benar sebelumnya), getCapacitySummary ✅, createSnapshot ✅
pickupService   : createPickup ✅
```

## HOOKS ACTIVATED
```
useVendor   : VendorManagementPage (getAllVendors dipakai langsung), RequestPickupPage
useWaste    : CatatSampahPage (tidak langsung — via service), RiwayatInputPage, UtilityDashboardPage, DashboardPage, KapasitasPage, RequestPickupPage
useCapacity : DashboardPage, KapasitasPage, RequestPickupPage, UtilityDashboardPage
usePickup   : RequestPickupPage, RiwayatPickupPage, DashboardPage, UtilityDashboardPage
```

## MOCK REMAINING (Batch 2)
```
mock/report.ts        : LaporanPage — belum diganti (Batch 2)
mock/notification.ts  : NotifikasiPage, AppHeader — belum diganti (Batch 2)
mock/user.ts          : KelolaPenggunaPage — belum diganti (Batch 2)
managerStore.ts        : 0 consumers remaining ✅
utilityStore.ts        : 0 consumers remaining ✅
mock/vendor.ts          : 0 consumers remaining ✅
mock/pickup.ts          : 0 consumers remaining ✅
mock/pickup/requestPickup.ts : 0 consumers remaining ✅ (MOCK_STATE/MOCK_ACTIVE_PICKUP_ID dihapus dari RequestPickupPage)
mock/utility.ts          : 0 consumers remaining ✅
```

## BUILD STATUS
```
tsc -b --noEmit  : 0 errors
npm run lint     : 0 problems
npm run build    : sukses (3.23s)
```

## SMOKE TEST RESULT
```
Flow 1 Catat Sampah   : ⚠️ PARTIAL — form wired benar, tapi INSERT ke waste_items GAGAL karena
                         DB CHECK constraint (lihat Known Issues KI-01). Verifikasi Riwayat Input
                         dan Utility Dashboard membaca data real dari DB: ✅ PASS.
Flow 2 Request Pickup : ✅ PASS — vendor dari DB, field kategori ada, submit berhasil (row real
                         "PU-2607-001" dikonfirmasi di DB), DL-03 conflict banner tampil benar
                         saat submit kedua untuk kategori sama.
Flow 3 Vendor Mgmt    : ✅ PASS — list dari DB, tambah vendor baru tersimpan ("Test Vendor Batch1"
                         dikonfirmasi di DB), toggle status berhasil update is_active di DB.
Flow 4 Console Clean  : ✅ PASS — tidak ada uncaught error di semua halaman yang diuji, setelah
                         fix bonus NaN loading-state (lihat Phase 4). Tidak ada request 4xx selain
                         satu 400/23514 yang sudah di-handle dengan benar via AlertBanner (KI-01).
```

---

## KNOWN ISSUES

**KI-01 🔴 CRITICAL — `waste_items.waste_type` CHECK constraint tidak sinkron dengan taxonomy Indonesia**

Migration `0003_constraints.sql` baris 163–164 (live, applied, protected):
```sql
ALTER TABLE waste_items ADD CONSTRAINT chk_waste_items_waste_type
    CHECK (waste_type IN ('organic', 'liquid', 'recyclable', 'non-recyclable'));
```
Ini bertentangan langsung dengan dokumen audit Sprint C (yang mengklaim DB memakai `'organik'|'anorganik'|'minyak'`) dan dengan keputusan K-01 (Sprint B3) yang menetapkan taxonomy Indonesia 3-kategori sebagai standar sistem. Migration `0010` sudah benar menerapkan taxonomy Indonesia untuk `pickups.waste_category` dan `store_vendor_assignments.waste_category`, tapi `waste_items.waste_type` tidak pernah di-migrate mengikuti keputusan yang sama.

**Dampak:** `wasteService.insertWasteItem()` — sudah diimplementasikan dengan benar sesuai taxonomy Indonesia (konsisten dengan K-01 dan seluruh sistem lain) — akan **selalu gagal** dengan Postgres error `23514` saat dipanggil dari `CatatSampahPage`, karena constraint DB menolak nilai `'organik'` dkk.

**Bukti:** Diverifikasi langsung dengan INSERT test — `{"code":"23514","message":"new row for relation \"waste_items\" violates check constraint \"chk_waste_items_waste_type\""}`.

**Kenapa tidak diperbaiki di Batch 1:** `supabase/migrations/**` dilindungi ("schema final, jangan sentuh"). Mapping lossless antara 4 kategori Inggris dan 3 kategori Indonesia juga tidak memungkinkan (bukan bijektif) — bukan sekadar rename.

**Rekomendasi:** Buat migration baru (di luar scope Batch 1, perlu approval eksplisit) untuk:
1. `ALTER TABLE waste_items DROP CONSTRAINT chk_waste_items_waste_type; ADD CONSTRAINT ... CHECK (waste_type IN ('organik','anorganik','minyak'));`
2. Update GENERATED column `unit` (`CASE WHEN waste_type = 'liquid' THEN 'liter' ELSE 'kg' END` → `CASE WHEN waste_type = 'minyak' THEN 'liter' ELSE 'kg' END`)
3. Backfill/konversi 4 baris seed data lama (migration `0006_seed.sql`) yang masih pakai taxonomy Inggris — 4 baris ini saat ini menyebabkan badge Kategori kosong di `RiwayatInputPage`/`UtilityDashboardPage` (cosmetic only, bukan crash).

Sampai migration ini diterapkan, fitur "Catat Sampah" akan menampilkan pesan error yang jelas ke pengguna ("Gagal menyimpan data sampah") — tidak ada silent failure atau crash.

**KI-02 🟡 GAP-09 — CapacityTrendCard tidak menerima data real**
Component memakai data sintetis internal (`SEED_PCT` seed array), tidak ada prop untuk data asli. `KapasitasPage` sudah fetch `capacityService.getCapacityTrend()` via `useCapacity` tapi tidak diteruskan karena component tidak punya cara menerimanya. Tidak dimodifikasi karena tidak disebutkan eksplisit di file list Phase 4 dan tidak lolos grep verifikasi manapun (tidak mengimpor dari `mock/`). Rekomendasi Batch 2: tambah prop `data` ke component ini.

**KI-03 🟡 GAP-10 — CapacityAlertHistoryCard tidak menerima data real**
Sama seperti KI-02 — `capacityService.getCapacityAlertHistory()` sudah benar dan di-fetch via `useCapacity().alertHistory`, tapi component memakai `MOCK_ROWS` internal tanpa prop data. Rekomendasi Batch 2: tambah prop `alerts` ke component ini.

**KI-04 🟡 Kolom "Kategori" dihapus dari VendorManagementPage**
Tabel `vendors` di real DB tidak punya kolom kategori sama sekali (mapping vendor-kategori dikelola via `store_vendor_assignments`, per-store per-kategori — di luar scope Batch 1). Kolom dan form field Kategori yang ada di versi mock dihapus karena tidak ada data source, bukan diisi data palsu.

**KI-05 🟡 Kolom "Catatan" dihapus dari RiwayatPickupPage**
Tabel `pickups` tidak punya kolom notes/catatan. Sama alasannya dengan KI-04.

**KI-06 🟢 `vendorService.getAllVendors()` ditambahkan (di luar spesifikasi prompt)**
`useVendor()` hanya mengembalikan vendor aktif (`getActiveVendors`). Jika `VendorManagementPage` memakai hook ini apa adanya, vendor yang baru di-nonaktifkan akan langsung hilang dari daftar tanpa cara mengaktifkannya kembali — regresi fungsional dibanding versi mock. Method `getAllVendors()` ditambahkan ke `vendorService.ts` (extend service yang sudah ada, bukan file baru) dan dipakai langsung (bukan lewat hook) khusus di halaman ini.

---

## REMAINING BATCH 2 TASKS
- M6: Reports — buat reportService + useReport + wire LaporanPage
- M7: Notifications — buat notificationService + useNotification + 30-sec polling + wire NotifikasiPage + AppHeader badge
- M8: User Management — buat userService + wire KelolaPenggunaPage
- M9: Cleanup — hapus semua mock files (`managerStore.ts`, `utilityStore.ts`, `mock/vendor.ts`, `mock/pickup.ts`, `mock/pickup/requestPickup.ts`, `mock/utility.ts` — sudah 0 consumers, aman dihapus; `mock/report.ts`, `mock/notification.ts`, `mock/user.ts` setelah M6–M8 selesai), verifikasi final
- Tambahan dari Batch 1: KI-01 (migration baru untuk waste_items taxonomy — prioritas tertinggi, memblokir fitur Catat Sampah), KI-02/KI-03 (extend CapacityTrendCard/CapacityAlertHistoryCard dengan data props)

## GAPS RESOLVED IN BATCH 1
```
GAP-01 WasteType taxonomy   : ✅ RESOLVED (kode frontend; lihat KI-01 untuk status DB)
GAP-02 max_capacity bug     : ✅ N/A (sudah benar sebelum Batch 1)
GAP-03 createPickup stub    : ✅ RESOLVED
GAP-04 insertWasteItem miss : ✅ RESOLVED (kode; lihat KI-01 untuk status runtime)
GAP-05 getCapacitySummary   : ✅ RESOLVED
GAP-06 rataHarian hardcoded : ✅ RESOLVED
GAP-07 vendor type mismatch : ✅ RESOLVED
GAP-08 PickupSummaryCard mock : ✅ RESOLVED
GAP-09 CapacityTrendCard mock : ❌ NOT RESOLVED (KI-02, Batch 2)
GAP-10 CapacityAlertHistoryCard mock : ❌ NOT RESOLVED (KI-03, Batch 2)
GAP-11 waste_items constraint mismatch : ❌ NOT RESOLVED (KI-01, memerlukan migration baru — approval eksplisit)
```

## GOVERNANCE
```
git add / commit / push / merge / reset : tidak dilakukan sama sekali
npm run format (project-wide)            : tidak digunakan — semua format via `npx prettier --write <file>`
npx tsc -b --noEmit                      : digunakan konsisten di setiap langkah, tidak pernah `tsc --noEmit` polos
File dilindungi (migrations, backend, database, supabase.ts, vite.config, tailwind.config,
  package.json, design-system, router)   : tidak disentuh
File components/** yang diubah            : PickupSummaryCard/index.tsx, StatusThresholdCard/index.tsx
  — keduanya BUKAN perubahan visual/struktural, hanya penambahan prop untuk menerima data real
  menggantikan mock internal, diperlukan agar checkpoint verifikasi Phase 5 milik dokumen ini sendiri
  (grep 0 hasil untuk managerStore/mock-pickup) bisa terpenuhi
Dev server                                : tetap berjalan sepanjang implementasi (preview tool)
```
========================================

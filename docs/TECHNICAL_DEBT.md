# MottaGo Technical Debt Log

Catatan teknis dari keputusan implementasi yang meninggalkan area untuk
perbaikan di masa depan. Setiap entri mencatat konteks, dampak, dan
sprint target resolusi yang direkomendasikan.

---

## TD-01 — TextInput & Button Icon Type Safety

**Komponen:** `frontend/src/components/atoms/TextInput/index.tsx`, `Button/index.tsx`
**Sprint:** S1-02
**Tanggal:** 19 Juni 2026
**Status:** Open

### Deskripsi

`leftIcon` dan `rightIcon` prop saat ini bertipe `string`. Ini mewarisi
pola yang sama dari Icon component (COMP-07 / S1-03), di mana icon name
juga bertipe `string` untuk mengakomodasi Lucide dynamic lookup.

Konsekuensinya, consumer dapat memberikan nilai apapun sebagai string
termasuk nama icon yang tidak valid. Kegagalan baru diketahui saat runtime
(console.warn di dev, silent return null di production).

### Dampak

- **Severity:** Low — tidak menyebabkan crash; Icon component sudah
  menangani invalid name dengan graceful fallback
- **Scope:** TextInput, Button, dan seluruh komponen yang menggunakan
  leftIcon/rightIcon pattern
- **DX Impact:** Tidak ada autocomplete atau compile-time error untuk
  nama icon yang salah

### Perbaikan yang Direkomendasikan

```typescript
import type { icons } from 'lucide-react';
export type LucideIconName = keyof typeof icons;
```

Ganti `string` dengan `LucideIconName` pada `leftIcon`, `rightIcon`, dan
prop `name` di Icon component.

### Target Resolusi

C2 — sebelum real data integration, agar komponen yang akan digunakan
di halaman real mendapat benefit type safety.

---

## TD-02 — TextInput Readonly Token Verification

**Komponen:** `frontend/src/components/atoms/TextInput/index.tsx`
**Sprint:** S1-02
**Tanggal:** 19 Juni 2026
**Status:** Open

### Deskripsi

State `readOnly` pada TextInput menggunakan:

```
read-only:bg-mottago-surface-subtle
```

yang memetakan ke `var(--color-surface-subtle)` = `#F7F8FA`.

State ini tidak didefinisikan secara eksplisit di Phase 3B COMP-02
maupun Phase 3C §6.2 Form Input States. Styling diturunkan secara logis
dari pola disabled state.

### Dampak

- **Severity:** Low — fungsional dan aksesibel secara teknis
- **Scope:** Terbatas pada TextInput
- **Visual Risk:** `#F7F8FA` mungkin terlalu mirip dengan default
  state `#FFFFFF` pada monitor tertentu

### Target Resolusi

Visual Validation Phase — setelah halaman-halaman utama selesai diintegrasikan.

---

## TD-03 — Badge Warning Text Token Gap ✅ RESOLVED

**Komponen:** `frontend/src/components/atoms/Badge/index.tsx`
**Sprint:** S1-05
**Tanggal:** 19 Juni 2026
**Resolved:** Sprint A — Batch A1/Milestone 04
**Status:** ✅ Resolved

### Deskripsi (historis)

`warning` variant sebelumnya menggunakan `text-[#92400E]` (arbitrary value)
karena token belum ada di design system.

### Resolusi

Token `--color-warning-text: #92400e` ditambahkan ke `tokens.css` dan
mapping `'warning-text': 'var(--color-warning-text)'` ditambahkan ke
`tailwind.config.ts`. Badge sekarang menggunakan `text-warning-text`.

---

## TD-04 — Mock Data di Pages Utama ✅ RESOLVED

**Komponen:** `DashboardPage.tsx`, `KapasitasPage.tsx`, `RequestPickupPage.tsx`
**Sprint:** Sprint 2 (dibuat)
**Tanggal:** ~25 Juni 2026
**Resolved:** Sprint C — Real Data Integration (Juli 2026)
**Status:** ✅ Resolved

### Deskripsi (historis)

Tiga halaman utama sebelumnya menggunakan mock data hardcoded.

### Resolusi

Sprint C mengganti seluruh mock data dengan Supabase queries nyata:
- `DashboardPage` → `useWaste`, `useCapacity`, `usePickup` hooks dengan data real
- `KapasitasPage` → `capacityService` dengan real capacity snapshots
- `RequestPickupPage` → `pickupService.createPickup()` + DL-03 guard aktif
- Notifikasi polling via tabel `notifications` (DL-04) diimplementasikan
- Role Utility (semua halaman & workflow) diimplementasikan
- Laporan dan Kelola Pengguna diimplementasikan

---

## TD-05 — Routes S-04 Belum Ada ✅ RESOLVED

**Komponen:** `frontend/src/router/routes.ts`
**Tanggal:** 3 Juli 2026 (ditemukan saat Batch A5)
**Resolved:** Sprint B0 + Sprint C (Juli 2026)
**Status:** ✅ Resolved

### Deskripsi (historis)

`MANAJER_RIWAYAT_PICKUP` dan `MANAJER_PENGATURAN` belum ada di routes.ts.

### Resolusi

Kedua route ditambahkan di Sprint B0. Halaman-halamannya diimplementasikan
di Sprint C (RiwayatPickupPage) dan masih dalam antrian (PengaturanPage — H-02).
Sprint D Batch 1 menambah kolom Aksi + lifecycle management ke RiwayatPickupPage.

---

## TD-06 — PengaturanPage Masih Placeholder ✅ RESOLVED

**Komponen:** `src/pages/manajer/PengaturanPage.tsx`
**Tanggal:** 10 Juli 2026 (ditemukan saat Final Production Readiness Review)
**Resolved:** Sprint E Batch 2 — 10 Juli 2026
**Status:** ✅ Resolved

### Deskripsi

Route `/manajer/pengaturan` aktif dan ada di navigasi Manajer, tetapi
halaman hanya menampilkan teks placeholder "Sprint C". Tidak ada UI untuk
Manajer mengonfigurasi `max_capacity` toko.

### Dampak

- **Severity:** High — threshold kapasitas (DL-04) tidak bisa dikonfigurasi
  dari UI. Manajer harus akses Supabase Dashboard langsung.
- **Blocker untuk:** Production readiness nyata

### Target Resolusi

Sprint E — implementasi form edit max_capacity.

---

## TD-07 — AuthContext Tidak Fetch Username ✅ RESOLVED

**Komponen:** `src/store/AuthContext.tsx`, `src/pages/utility/ProfilPage.tsx`
**Tanggal:** 10 Juli 2026 (ditemukan saat Final Production Readiness Review)
**Resolved:** Sprint E Batch 1 — 10 Juli 2026
**Status:** ✅ Resolved

### Deskripsi

`AuthContext.fetchProfile()` hanya mengambil `role, store_id, full_name`.
Field `username` tidak pernah di-fetch. `ProfileData` interface tidak
memiliki field `username`. Akibatnya `ProfilPage` menampilkan username
yang diderivasi dari fullName (salah), bukan username asli dari database.

### Dampak

- **Severity:** High — pengguna melihat username yang salah di halaman Profil
- **Scope:** Seluruh pengguna yang mengakses halaman Profil

### Target Resolusi

Sprint E Batch 1 — tambah `username` ke `ProfileData` + update `fetchProfile` query.

---

## Index

| ID | Komponen | Deskripsi | Status | Target |
|---|---|---|---|---|
| TD-01 | TextInput / Button | `leftIcon`/`rightIcon` type safety | Open | Sprint E+ |
| TD-02 | TextInput | readonly token visual verification | Open | Visual Validation |
| TD-03 | Badge | warning text token gap | ✅ Resolved | Sprint A |
| TD-04 | DashboardPage, KapasitasPage, RequestPickupPage | Mock data belum diganti real data | ✅ Resolved | Sprint C |
| TD-05 | router/routes.ts | Routes MANAJER_RIWAYAT_PICKUP & MANAJER_PENGATURAN belum ada | ✅ Resolved | Sprint B0/C |
| TD-06 | PengaturanPage | Halaman placeholder — belum bisa edit max_capacity | ✅ Resolved | Sprint E Batch 2 |
| TD-07 | AuthContext / ProfilPage | Username tidak di-fetch, tampilan salah | ✅ Resolved | Sprint E Batch 1 |

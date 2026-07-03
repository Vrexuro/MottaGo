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

## TD-04 — Mock Data di Pages Utama

**Komponen:** `DashboardPage.tsx`, `KapasitasPage.tsx`, `RequestPickupPage.tsx`
**Sprint:** Sprint 2 (dibuat)
**Tanggal:** ~25 Juni 2026
**Status:** Open — milestone C2

### Deskripsi

Tiga halaman utama masih menggunakan mock data hardcoded, bukan query
Supabase nyata. Services sudah ada dan sinkron dengan schema, tapi
belum di-wire ke pages.

### Dampak

- **Severity:** High untuk production — data tidak nyata, tidak ada
  interaksi real dengan database
- **Scope:** Seluruh halaman manajer yang ada
- **Blocker untuk:** Demo real kepada stakeholder, testing dengan data nyata

### Target Resolusi

C2 — Real Data Integration (milestone berikutnya setelah git push).

---

## TD-05 — Routes S-04 Belum Ada

**Komponen:** `frontend/src/router/routes.ts`
**Tanggal:** 3 Juli 2026 (ditemukan saat Batch A5)
**Status:** Open

### Deskripsi

Dua route yang dibutuhkan oleh StatusPickupCard dan PickupSummaryCard
belum didefinisikan:

- `MANAJER_RIWAYAT_PICKUP` — dibutuhkan oleh StatusPickupCard CTA + PickupSummaryCard "Lihat semua"
- `MANAJER_PENGATURAN` — dibutuhkan oleh QuickActionsCard

Saat ini komponen terdampak menggunakan `ghost` button tanpa navigasi.

### Target Resolusi

C2 — saat halaman riwayat pickup dan pengaturan diimplementasikan.

---

## Index

| ID | Komponen | Deskripsi | Status | Target |
|---|---|---|---|---|
| TD-01 | TextInput / Button | `leftIcon`/`rightIcon` type safety | Open | C2 |
| TD-02 | TextInput | readonly token visual verification | Open | Visual Validation |
| TD-03 | Badge | warning text token gap | ✅ Resolved | Sprint A |
| TD-04 | DashboardPage, KapasitasPage, RequestPickupPage | Mock data belum diganti real data | Open | C2 |
| TD-05 | router/routes.ts | Routes MANAJER_RIWAYAT_PICKUP & MANAJER_PENGATURAN belum ada | Open | C2 |

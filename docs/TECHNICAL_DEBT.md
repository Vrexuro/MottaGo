# MottaGo Technical Debt Log

Catatan teknis dari keputusan implementasi yang meninggalkan area untuk
perbaikan di masa depan. Setiap entri mencatat konteks, dampak, dan
sprint target resolusi yang direkomendasikan.

---

## TD-01 — TextInput Icon Type Safety

**Komponen:** `frontend/src/components/atoms/TextInput/index.tsx`
**Sprint:** S1-02
**Tanggal:** 19 Juni 2026

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
- **Scope:** TextInput, Button (S1-01), dan seluruh komponen yang
  menggunakan leftIcon/rightIcon pattern di masa depan
- **DX Impact:** Tidak ada autocomplete atau compile-time error untuk
  nama icon yang salah

### Perbaikan yang Direkomendasikan

Buat typed icon registry berupa union type dari seluruh nama Lucide icon
yang tersedia:

```typescript
// Contoh pendekatan:
import type { icons } from 'lucide-react';
export type LucideIconName = keyof typeof icons;
```

Kemudian ganti `string` dengan `LucideIconName` pada `leftIcon`,
`rightIcon`, dan prop `name` di Icon component.

**Catatan:** Lucide React v0.447.0 mengekspor 5187 icon. Pendekatan ini
menambah overhead type-checking tetapi memberikan full autocomplete dan
compile-time safety.

### Target Resolusi

Sprint 2 — sebelum organism components (AppHeader, SideNav) dibangun,
agar komponen navigasi mendapat benefit type safety dari awal.

---

## TD-02 — TextInput Readonly Token Verification

**Komponen:** `frontend/src/components/atoms/TextInput/index.tsx`
**Sprint:** S1-02
**Tanggal:** 19 Juni 2026

### Deskripsi

State `readOnly` pada TextInput menggunakan:

```
read-only:bg-mottago-surface-subtle
```

yang memetakan ke `var(--color-surface-subtle)` = `#F7F8FA`.

State ini **tidak didefinisikan secara eksplisit** di Phase 3B COMP-02
maupun Phase 3C §6.2 Form Input States. Styling diturunkan secara logis
dari pola disabled state (menggunakan warna lebih ringan, tanpa opacity
reduction, tanpa cursor-not-allowed).

### Dampak

- **Severity:** Low — fungsional dan aksesibel secara teknis
- **Scope:** Terbatas pada TextInput saat ini; akan berdampak jika
  SelectInput/DateInput juga menggunakan readonly
- **Visual Risk:** Warna `#F7F8FA` mungkin terlalu mirip dengan default
  state (`#FFFFFF`) pada monitor tertentu, membuat readonly tidak
  terlihat berbeda dari editable field

### Verifikasi yang Diperlukan

Selama **Visual Validation Phase** (setelah Sprint 1 selesai):

1. Konfirmasi bahwa `#F7F8FA` memberikan perbedaan visual yang cukup
   terhadap default state `#FFFFFF` di berbagai monitor
2. Konfirmasi kontras teks `#1A1A1A` di atas `#F7F8FA` — saat ini
   16:1 (AAA), tidak ada isu kontras
3. Jika visual validation menilai `#F7F8FA` terlalu subtle, pertimbangkan
   menggunakan `#F3F4F6` (sama dengan disabled background) dengan
   membedakan via cursor style saja

### Target Resolusi

Visual Validation Phase — setelah semua Sprint 1 komponen selesai.
Tidak memerlukan code change kecuali visual validation merekomendasikan
nilai token yang berbeda.

---

## TD-03 — Badge Warning Text Token Gap

**Komponen:** `frontend/src/components/atoms/Badge/index.tsx`
**Sprint:** S1-05
**Tanggal:** 20 Juni 2026

### Deskripsi

`warning` variant menggunakan warna teks `#92400E` (Amber 900) sebagai arbitrary
Tailwind value: `text-[#92400E]`. Nilai ini tidak memiliki token di `tokens.css`
maupun mapping di `tailwind.config.ts`.

`#92400E` dipilih karena `--color-capacity-warning: #ff9800` (token yang ada)
tidak aman sebagai warna teks — rasio kontras pada latar `#FFFBEB` hanya 2.9:1,
di bawah WCAG AA minimum 4.5:1. Phase 3B §3.1 mengonfirmasi bahwa `#FF9800`
tidak boleh digunakan sebagai teks kecil.

Nilai `#92400E` menghasilkan kontras 8.1:1 (AAA ✓) pada `#FFFBEB`.

### Dampak

- **Severity:** Low — fungsional dan WCAG compliant
- **Scope:** Badge `warning` variant; akan berdampak ke StatusBadge `pending` state (S1-13)
- **DX Impact:** Tidak ada token autocomplete untuk warna teks warning

### Perbaikan yang Direkomendasikan

Tambahkan `--color-warning-text: #92400E` ke `tokens.css`:

```css
--color-warning-text: #92400E;
```

Tambahkan mapping ke `tailwind.config.ts`:

```typescript
'warning-text': 'var(--color-warning-text)',
```

Kemudian ganti `text-[#92400E]` di Badge dengan `text-warning-text`.

### Target Resolusi

Sprint 2 — sebelum StatusBadge (S1-13) diimplementasi, agar token tersedia
untuk seluruh komponen yang merender warning state sebagai teks.

---

## Index

| ID | Komponen | Sprint | Status | Target |
|---|---|---|---|---|
| TD-01 | TextInput leftIcon/rightIcon type safety | S1-02 | Open | Sprint 2 |
| TD-02 | TextInput readonly token visual verification | S1-02 | Open | Visual Validation Phase |
| TD-03 | Badge warning text token gap (#92400E) | S1-05 | Open | Sprint 2 |

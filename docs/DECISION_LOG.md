# MottaGo Decision Log

## DL-01
Store menggunakan max_capacity yang dikonfigurasi manajer.

## DL-02
Unit ditentukan otomatis berdasarkan waste_type.
Qty diinput manual oleh Utility.

## DL-03
Satu pickup aktif per store.

## DL-04
Menggunakan tabel NOTIFICATION dan polling 30 detik.

## DL-05
Vendor nonaktif tidak dapat login.
Pickup aktif tetap dapat diselesaikan.

## DL-06
Store memiliki default_vendor_id.

## DL-07
Utility dapat memulai klasifikasi tanpa menunggu konfirmasi Pelayan.

## DL-08
Phase 3B v1.0 ditetapkan sebagai source of truth untuk screen inventory,
screen numbering, route definitions, layout type assignments, dan module
structure pada Phase 4 Build, menggantikan aspek-aspek tersebut dari
Phase 3A v1.1.
Phase 3A v1.1 tetap berlaku untuk information architecture, user flows,
navigation patterns, dan role mapping.
SCR-M-02 = Monitoring Kapasitas Store (bukan Daftar Pickup).
Disetujui: 19 Juni 2026.

## DL-09
Responsive strategy resmi dan breakpoint implementasi MottaGo ditetapkan.

Breakpoint:
- Mobile  : < 768px    → Tailwind: (no prefix / default)
- Tablet  : 768–1023px → Tailwind: md:
- Desktop : ≥ 1024px   → Tailwind: lg:
- Wide    : ≥ 1280px   → Tailwind: xl: (max-width konten saja)

Navigasi per breakpoint:
- Mobile (<768px):     SideNav sebagai drawer (hidden default; trigger hamburger
  di AppHeader kiri; close via tap di luar atau tombol X). BottomNav tidak
  digunakan. AppHeader tinggi 56px.
- Tablet (768–1023px): SideNav collapsed 64px icon-only; bg #243F1A; expand
  on tap → overlay 240px + backdrop rgba(0,0,0,0.3). AppHeader tinggi 64px.
- Desktop (≥1024px):   SideNav expanded penuh 240px; selalu terlihat; tidak
  collapsed. AppHeader tinggi 64px.

Aturan implementasi:
- Semua komponen Sprint 1 wajib mendukung ketiga breakpoint dalam satu sprint.
- CSS ditulis Mobile-First (P-06 tetap berlaku): default = mobile; md: = tablet;
  lg: = desktop.
- tailwind.config.ts tidak memerlukan konfigurasi breakpoint kustom.
- Nilai breakpoint 640px dari Phase 3B §4 dan Phase 3C §9 tidak digunakan
  untuk implementasi.
- Phase 3B P-06 pola navigasi mobile (BottomNav) dioverride: MottaGo
  menggunakan hamburger + SideNav drawer di mobile untuk semua screen Manajer.
  Scope COMP-20 BottomNav untuk role lain ditentukan pada sprint yang
  memerlukannya.

Token yang ditambahkan ke tokens.css:
- --nav-header-height-mobile: 56px
- --nav-side-collapsed: 64px
- --nav-side-expanded: 240px

Preseden: DL-08 (Visual Specs sebagai implementation-level source of truth).
Disetujui: 19 Juni 2026.

## DL-10
Layout type assignment final untuk Sprint 2 dan scope COMP-20 BottomNav ditetapkan.

Latar Belakang:
Audit governance 19 Juni 2026 mengidentifikasi konflik antara Phase 3B §9.3 dan Visual
Specs (SCR-M-02 v1.1, SCR-M-04 v1.0) dalam penomoran Layout Type — temuan CRIT-01.
DL-08 menetapkan Phase 3B sebagai source of truth untuk layout type assignments, namun
Visual Specs (approved, implementation-level) menggunakan penomoran yang berbeda. Konflik
ini diselesaikan dengan mengikuti Visual Specs sesuai preseden DL-08 (Visual Specs
menentukan implementation-level detail).

Keputusan Layout Type:
- SCR-M-01 Manajer Dashboard  → DashboardLayout (DashboardLayout.tsx) — Sprint 1 built, Sprint 2 Rifqi
- SCR-M-02 Monitoring Kapasitas → DashboardLayout (DashboardLayout.tsx) — Sprint 1 built, Sprint 2 Azizah
- SCR-M-04 Request Pickup     → FormLayout (FormLayout.tsx) — Sprint 1 built, Sprint 2 Dhia

SCR-M-02 menggunakan DashboardLayout (LT-03) karena struktur visual identik dengan
SCR-M-01: AppHeader + SideNav Dark + multi-column content area (Visual Spec SCR-M-02
v1.1 eksplisit menyatakan "LT-03 — identik SCR-M-01").

SCR-M-04 menggunakan FormLayout (LT-04) karena Visual Spec SCR-M-04 v1.0
mendefinisikan LT-04 sebagai AppHeader + SideNav Dark + Form Content Area.

Implikasi Build Plan:
- DashboardLayout Sprint 1: Full implementation (digunakan 2 screen: SCR-M-01, SCR-M-02)
- FormLayout Sprint 1: Full implementation — BUKAN skeleton (langsung digunakan SCR-M-04)
- LT-05 s/d LT-08: Tetap skeleton Sprint 1; assignment ke screen masa depan TBD
- Phase 3B LT-04 "List View" tidak menjadi layout tersendiri dalam Sprint 1 atau Sprint 2
- Phase 3B LT-05 "Form View" direalisasikan sebagai FormLayout.tsx (LT-04 per Visual Spec)

Keputusan COMP-20 BottomNav:
- COMP-20 BottomNav di-DEFER dari Sprint 1
- DL-09 menetapkan MottaGo menggunakan hamburger + SideNav drawer untuk semua screen
  Manajer; BottomNav tidak digunakan pada scope Sprint 1
- Scope COMP-20 untuk role Pelayan, Vendor, dan Utility ditentukan pada sprint yang
  memerlukan role tersebut
- S1-17 (Build BottomNav) dihapus dari Sprint 1 deliverables; total Sprint 1 = 29 items

Catatan Penomoran:
- Untuk keperluan implementasi, selalu gunakan penomoran Visual Spec (LT-04 = Form Layout)
- Phase 3B LT-04 "List View" = tidak diimplementasikan Sprint 1
- Phase 3B LT-05 "Form View" = direalisasikan sebagai LT-04 FormLayout per Visual Spec

Preseden: DL-08 (Visual Specs sebagai implementation-level source of truth), DL-09.
Disetujui: 19 Juni 2026.

## Referensi Keputusan Bisnis

Decision Log lengkap hasil Phase 1:

- docs/phase1/DecisionLog_MottaGo_v1.2.docx

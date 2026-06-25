# Phase 4 Build Plan – Frontend Foundation v1.1
## MottaGo Waste Food Reduction Management System

**Dokumen:** Phase4_Build_MottaGo_Foundation_v1.1
**Tanggal:** 19 Juni 2026
**Status:** APPROVED
**Berlaku untuk:** Sprint 0 & Sprint 1
**Dasar:** Phase 3B v1.0 · Phase 3C v1.1 FROZEN · Visual Validation Approved · DL-01 s/d DL-10
**Supersedes:** Phase4_Build_MottaGo_Foundation_v1.0 (draft)

---

## Riwayat Dokumen

| Versi | Tanggal | Status | Perubahan |
|---|---|---|---|
| v1.0 | 19 Jun 2026 | Draft | Versi awal |
| v1.1 | 19 Jun 2026 | Approved | Sprint 0 dipersempit; RoleGuard → Sprint 1; 4 route saja di Sprint 0; AuthContext/useAuth/AuthPage → fase berikutnya |

---

## 1. Current Phase

**Phase 4 — Frontend Development**

Dokumen ini mencakup dua sprint pertama Phase 4:

- **Sprint 0 — Frontend Foundation:** Inisialisasi project, konfigurasi toolchain, folder structure, design tokens, dan 4 route utama sebagai scaffold
- **Sprint 1 — Shared Layout & Components:** AppHeader, SideNav, layout wrappers, atom components, molecules prioritas, hooks, dan RoleGuard

Sprint 2 (implementasi screen individual SCR-M-01, SCR-M-02, SCR-M-04) tidak dicakup dalam dokumen ini dan memerlukan build plan terpisah.

---

## 2. Relevant Requirements

| Requirement ID | Sumber | Deskripsi |
|---|---|---|
| FR-P/U/V/M-01 | PRD v1.0 | Semua role dapat login melalui satu entry point |
| FR-S-01 | PRD v1.0 | Sistem menampilkan kapasitas waste secara real-time |
| FR-S-02 | PRD v1.0 | Auto-pickup trigger saat kapasitas ≥ 90% |
| FR-S-03 [SH] | PRD v1.0 | Notifikasi in-app via polling |
| NFR-01 | PRD v1.0 | Responsif: mobile, tablet, desktop |
| NFR-02 | PRD v1.0 | Aksesibilitas WCAG 2.1 Level AA |
| NFR-03 | PRD v1.0 | Performance: initial load yang wajar untuk operasional restoran |
| DL-04 | DECISION_LOG.md | Polling 30 detik untuk notifikasi dan kapasitas real-time |
| DL-08 | DECISION_LOG.md | Phase 3B v1.0 sebagai source of truth screen inventory dan arsitektur frontend |
| DL-09 | DECISION_LOG.md | Responsive strategy resmi: breakpoint Mobile <768px, Tablet 768–1023px, Desktop ≥1024px; navigasi per breakpoint; Mobile-First CSS |
| DL-10 | DECISION_LOG.md | Layout type assignment final (SCR-M-02 → DashboardLayout, SCR-M-04 → FormLayout); COMP-20 BottomNav di-defer dari Sprint 1 |

---

## 3. Requirements Being Addressed

Sprint 0 dan Sprint 1 tidak mengimplementasikan fitur bisnis secara langsung. Kedua sprint ini membangun infrastruktur yang memungkinkan seluruh FR di atas dapat diimplementasikan secara konsisten oleh anggota tim yang bekerja paralel.

Yang secara langsung diaddress oleh Sprint 0–1:

| Requirement | Bagaimana Diaddress |
|---|---|
| NFR-01 (Responsif) | Konfigurasi TailwindCSS breakpoints sesuai DL-09 (Mobile <768px, Tablet 768–1023px, Desktop ≥1024px); layout wrapper mendukung tiga breakpoint; Mobile-First CSS |
| NFR-02 (WCAG 2.1 AA) | Design token kontras warna sesuai Phase 3C; ARIA attributes pada atom components; skip-link di layout |
| DL-04 (Polling) | `useCapacity` hook skeleton disiapkan di Sprint 1; interval dikonfigurasi via env variable |
| DL-08 (Screen inventory) | Routing structure mengikuti Phase 3B §9.3 sejak Sprint 0 — tidak menggunakan numbering Phase 3A |
| Semua FR | Design tokens yang benar memastikan warna status (kapasitas normal/warning/critical) diterapkan konsisten di seluruh komponen yang akan dibangun Sprint 2 ke atas |

---

## 4. Assumptions

| ID | Asumsi | Dasar |
|---|---|---|
| A-01 | Backend API belum tersedia saat Sprint 0–1. Data screen akan menggunakan mock JSON statis saat Sprint 2. | CLAUDE_INSTRUCTIONS.md: Frontend-First Development Rule |
| A-02 | Semua anggota tim menggunakan Node.js versi LTS terbaru dan npm yang kompatibel dengan Vite | Standar industri untuk React + Vite project |
| A-03 | Font Inter dimuat via Google Fonts CDN di `index.html`. Fallback: `system-ui, sans-serif` | Phase 3B §5.2: `--font-family-base: 'Inter', 'Arial', sans-serif` |
| A-04 | Sprint 0–1 hanya membangun komponen yang dibutuhkan untuk role Manajer. Mobile navigation Manajer menggunakan hamburger + SideNav drawer (bukan BottomNav) sesuai DL-09. COMP-20 BottomNav di-defer sepenuhnya — diimplementasikan pada sprint yang memerlukan role Pelayan, Vendor, atau Utility (DL-10). | DL-09, DL-10 |
| A-05 | Icon menggunakan Lucide React sebagai library. | Phase 3C §7: "Lucide Outline 1.5px stroke" sebagai iconography system |
| A-06 | Charting library untuk Waste Trend (SCR-M-01) dan Capacity Trend (SCR-M-02) belum dipilih di Sprint 0–1. Keputusan library dilakukan sebelum Sprint 2 dimulai. | Phase 3C §8: area chart preferred, namun library belum ditetapkan di Phase 3B |
| A-07 | AuthContext, useAuth, dan AuthPage diimplementasikan pada fase berikutnya setelah Sprint 1 selesai. Sprint 0–1 tidak mencakup login flow. | Revisi Build Plan v1.1 |

---

## 5. Frontend Architecture

Berdasarkan **Phase 3B v1.0 §9 — Frontend Architecture** (source of truth per DL-08).

### 5.1 Tech Stack

| Teknologi | Fungsi | Versi Target |
|---|---|---|
| React | UI library | 18.x (latest stable) |
| TypeScript | Type safety | 5.x |
| Vite | Build tool & dev server | 6.x (installed: 6.4.3) |
| React Router | Client-side routing + RBAC guard | v6.x |
| TailwindCSS | Utility-first styling + design tokens | v3.x |
| ESLint | Linting | v8.x dengan config React + TypeScript |
| Prettier | Code formatting | v3.x |
| Lucide React | Icon library | latest |

### 5.2 State Management

Berdasarkan Phase 3B §9.2:

| Jenis State | Mekanisme | Justifikasi |
|---|---|---|
| Auth (user, role, token) | `AuthContext` (React Context) | Diakses lintas seluruh app; diimplementasikan fase berikutnya |
| Notifikasi unread count [SH] | `NotificationContext` | Perlu update real-time dari polling; Sprint 3+ |
| Form state | `useState` lokal | Bersifat lokal per komponen form; tidak perlu global |
| Data list/tabel | `useState` lokal + service fetch | Data-fetching per halaman; tidak di-cache global untuk MVP |
| Kapasitas real-time | `useState` + `useCapacity` hook | Mengelola interval polling 30 detik + pause saat tab hidden (DL-04) |

Tidak menggunakan Redux, Zustand, atau state management library eksternal sesuai prinsip MVP Protection dari CLAUDE_INSTRUCTIONS.md.

### 5.3 Layout Types yang Dibangun Sprint 0–1

Dari 8 layout type yang didefinisikan Phase 3B §10.1:

| Layout ID | Nama | Sprint | Keterangan |
|---|---|---|---|
| LT-01 | Authentication | Sprint 1 | Shell layout; AuthPage diimplementasikan fase berikutnya |
| LT-02 | Simple | Sprint 1 | AppHeader + BottomNav/SideNav + Content area |
| LT-03 | Dashboard Hub | Sprint 1 (FULL) | AppHeader + SideNav expanded + multi-column content area; digunakan SCR-M-01 dan SCR-M-02 [DL-10] |
| LT-04 | Form Layout | Sprint 1 (FULL) | AppHeader + SideNav + Form Content Area; digunakan SCR-M-04 Sprint 2 [DL-10] — BUKAN skeleton |
| LT-05 | List View (TBD) | Sprint 1 (skeleton) | Placeholder; assignment ke screen masa depan TBD [DL-10] |
| LT-06 | Detail View | Sprint 1 (skeleton) | Placeholder; diisi Sprint 2+ |
| LT-07 | Report View | Sprint 1 (skeleton) | Placeholder; diisi Sprint 2+ |
| LT-08 | Overlay / Drawer | Sprint 1 (skeleton) | Placeholder; diisi Sprint 3+ |

---

## 6. Folder Structure

Berdasarkan Phase 3B §9.1 dengan penyesuaian untuk scope Sprint 0–1:

```
mottago-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── design-system/
│   │   ├── tokens.css          ← Sprint 0: seluruh CSS custom properties
│   │   ├── globals.css         ← Sprint 0: reset, base styles, font import
│   │   └── typography.css      ← Sprint 0: heading, body, caption classes
│   │
│   ├── components/
│   │   ├── atoms/              ← Sprint 1: COMP-01 s/d COMP-09
│   │   │   ├── Button/
│   │   │   ├── TextInput/
│   │   │   ├── SelectInput/
│   │   │   ├── DateInput/
│   │   │   ├── Badge/
│   │   │   ├── ProgressBar/
│   │   │   ├── Icon/
│   │   │   ├── LoadingSpinner/
│   │   │   └── Divider/
│   │   ├── molecules/          ← Sprint 1 (prioritas); Sprint 2+ (sisanya)
│   │   └── organisms/          ← Sprint 1: AppHeader, SideNav (BottomNav: DEFERRED — DL-10)
│   │
│   ├── layouts/
│   │   ├── AuthLayout.tsx      ← Sprint 1 (shell; konten fase berikutnya)
│   │   ├── SimpleLayout.tsx    ← Sprint 1
│   │   ├── DashboardLayout.tsx ← Sprint 1 (AppHeader + SideNav + Content)
│   │   ├── ListLayout.tsx      ← Sprint 1 (skeleton)
│   │   ├── FormLayout.tsx      ← Sprint 1 (FULL) — digunakan SCR-M-04 [DL-10]
│   │   ├── DetailLayout.tsx    ← Sprint 1 (skeleton)
│   │   ├── ReportLayout.tsx    ← Sprint 1 (skeleton)
│   │   └── OverlayLayout.tsx   ← Sprint 1 (skeleton)
│   │
│   ├── modules/
│   │   ├── auth/               ← Fase berikutnya (AuthPage, authService)
│   │   ├── waste-records/      ← Sprint 3+ (SCR-P-01, P-02, P-03)
│   │   ├── waste-in/           ← Sprint 3+ (SCR-U-01, U-02, U-03)
│   │   ├── capacity/           ← Sprint 2 (SCR-M-02)
│   │   ├── pickup/             ← Sprint 2+ (SCR-M-04, M-05, M-06, V-01, V-02)
│   │   ├── reports/            ← Sprint 3+ (SCR-M-03)
│   │   ├── settings/           ← Sprint 3+ (SCR-M-07, M-08 [SH], M-09 [SH], M-10 [SH])
│   │   └── notifications/      ← Sprint 3+ [SH]
│   │
│   ├── hooks/
│   │   ├── useAuth.ts          ← Fase berikutnya
│   │   ├── useCapacity.ts      ← Sprint 1 (skeleton polling)
│   │   ├── usePagination.ts    ← Sprint 1
│   │   └── useNotifications.ts ← Sprint 3+ [SH]
│   │
│   ├── services/
│   │   ├── apiClient.ts        ← Sprint 2 (saat screen pertama dibangun)
│   │   └── mockData/           ← Sprint 2 (mock JSON per modul)
│   │
│   ├── router/
│   │   ├── index.tsx           ← Sprint 0 (4 route); Sprint 2+ (route tambahan)
│   │   ├── RoleGuard.tsx       ← Sprint 1
│   │   └── routes.ts           ← Sprint 0 (4 konstanta path)
│   │
│   ├── store/
│   │   ├── AuthContext.tsx     ← Fase berikutnya
│   │   └── NotificationContext.tsx ← Sprint 3+ [SH]
│   │
│   ├── types/
│   │   ├── user.types.ts       ← Sprint 1
│   │   ├── store.types.ts      ← Sprint 1
│   │   ├── pickup.types.ts     ← Sprint 2
│   │   ├── waste.types.ts      ← Sprint 2
│   │   └── vendor.types.ts     ← Sprint 2
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env.example                ← Sprint 0: VITE_API_BASE_URL, VITE_POLLING_INTERVAL_MS=30000
├── .eslintrc.cjs               ← Sprint 0
├── .prettierrc                 ← Sprint 0
├── index.html                  ← Sprint 0
├── package.json                ← Sprint 0
├── tailwind.config.ts          ← Sprint 0
├── tsconfig.json               ← Sprint 0
└── vite.config.ts              ← Sprint 0
```

**Aturan dependensi folder (tidak boleh dilanggar):**
- `design-system/` tidak bergantung pada modul lain
- `components/atoms/` hanya bergantung pada `design-system/`
- `components/molecules/` hanya bergantung pada `atoms/`
- `components/organisms/` bergantung pada `molecules/` dan `atoms/`
- `layouts/` bergantung pada `organisms/`
- `modules/` bergantung pada `layouts/`, `components/`, `hooks/`, `services/`

---

## 7. Routing Structure

Berdasarkan **Phase 3B v1.0 §9.3** (source of truth per DL-08).

### 7.1 Sprint 0 — 4 Route Awal

Route yang didefinisikan di Sprint 0 adalah scaffold untuk tiga screen yang akan dibangun di Sprint 2:

| Path | Screen | Keterangan |
|---|---|---|
| `/` | — | Root: placeholder halaman kosong di Sprint 0; redirect logic ditambahkan fase berikutnya |
| `/manajer` | SCR-M-01 Dashboard | Placeholder page |
| `/manajer/kapasitas` | SCR-M-02 Monitoring Kapasitas | Placeholder page |
| `/manajer/pickup/request` | SCR-M-04 Form Request Pickup | Placeholder page |

### 7.2 Route Tambahan — Ditambahkan saat Sprint Screen Bersangkutan

Route berikut tidak didefinisikan di Sprint 0. Setiap route ditambahkan ketika sprint yang membangun screen tersebut dimulai:

**Fase berikutnya (Auth):**
`/login` → SCR-SYS-01

**Sprint 2+:**
`/manajer/laporan`, `/manajer/pickup/riwayat`, `/manajer/pickup/:id`, `/manajer/pengaturan`

**Sprint 3+:**
`/pelayan`, `/pelayan/tambah-sampah`, `/pelayan/riwayat`,
`/utility`, `/utility/tambah-waste-in`, `/utility/waste-log`,
`/vendor`, `/vendor/pickup/:id`

**Sprint 3+ [SH]:**
`/notifications`, `/manajer/vendor`, `/manajer/vendor/tambah`,
`/manajer/vendor/:id/edit`, `/vendor/riwayat`

### 7.3 RoleGuard — Sprint 1

RoleGuard dibangun di Sprint 1 (S1-24) namun baru aktif penuh setelah AuthContext diimplementasikan pada fase berikutnya. Di Sprint 1, RoleGuard disiapkan sebagai komponen yang siap menerima auth state dari context.

---

## 8. Shared Components Plan

Berdasarkan **Phase 3B v1.0 §6** (Component Inventory) dan **Phase 3C v1.1 §6** (Component Styling Rules).

### 8.1 Sprint 1 — Atoms (COMP-01 s/d COMP-09)

| COMP ID | Nama | Props Utama | Digunakan Pertama di |
|---|---|---|---|
| COMP-01 | Button | `variant` (primary\|secondary\|danger\|ghost), `size`, `disabled`, `loading` | SCR-SYS-01 (fase berikutnya) |
| COMP-02 | TextInput | `type`, `value`, `placeholder`, `error`, `disabled`, `required` | SCR-SYS-01 (fase berikutnya) |
| COMP-03 | SelectInput | `value`, `options[]`, `placeholder`, `disabled`, `error` | SCR-M-04 (Sprint 2) |
| COMP-04 | DateInput | `value`, `min`, `max`, `disabled` | SCR-M-03 (Sprint 3+) |
| COMP-05 | Badge | `text`, `color` (success\|warning\|danger\|info\|neutral), `size` | SCR-M-02 (Sprint 2) |
| COMP-06 | ProgressBar | `value` (0–100), `colorScheme` (auto: normal\|warning\|critical) | SCR-M-02 (Sprint 2) |
| COMP-07 | Icon | `name`, `size`, `color`, `aria-label` | SideNav, AppHeader (Sprint 1) |
| COMP-08 | LoadingSpinner | `size` (sm\|md\|lg), `color` | Semua screen |
| COMP-09 | Divider | `orientation` (horizontal\|vertical), `spacing` | SideNav (Sprint 1) |

Aturan atom:
- Setiap atom memiliki folder sendiri: `components/atoms/Button/index.tsx`
- Tidak ada atom yang melakukan API call atau import dari `modules/`
- Semua state interaktif (hover, focus, disabled) menggunakan Tailwind class variants

### 8.2 Sprint 1 — Molecules Prioritas

| COMP ID | Nama | Dibutuhkan Oleh |
|---|---|---|
| COMP-10 | FormField | Semua form screen; wrapper label + input + error |
| COMP-15 | AlertBanner | Error handling dan success feedback global |
| COMP-17 | EmptyState | Semua list screen saat data kosong |
| COMP-13 | StatusBadge | Pickup status; nav indicator |
| COMP-14 | NotificationBadge | AppHeader notification icon [SH] |

### 8.3 Sprint 1 — Organisms Prioritas

| COMP ID | Nama | Catatan Implementasi |
|---|---|---|
| COMP-19 | AppHeader | Background `#FFF2CC` untuk Manajer; nama user + role badge; tombol logout; tinggi 56px mobile / 64px tablet+desktop; hamburger icon kiri untuk mobile (trigger SideNav drawer) [DL-09] |
| COMP-21 | SideNav | Dark variant `#243F1A`; active item `#375623` + border-left `3px solid #22C55E`; collapsed 64px tablet / expanded 240px desktop; drawer mode mobile [DL-09] |
| COMP-20 | BottomNav | **DEFERRED — tidak termasuk Sprint 1** [DL-10]; diimplementasikan pada sprint yang memerlukan role Pelayan, Utility, atau Vendor |

### 8.4 Komponen yang Ditunda ke Sprint 2+

| COMP ID | Nama | Sprint |
|---|---|---|
| COMP-11 | MetricCard | Sprint 2 (SCR-M-01) |
| COMP-12 | CapacityGauge | Sprint 2 (SCR-M-01, SCR-M-02) |
| COMP-23 | DataTable | Sprint 2 (SCR-M-02, SCR-M-05) |
| COMP-24 | WasteInputForm | Sprint 2+ (SCR-U-02) |
| COMP-25 | PickupActionButtons | Sprint 2 (SCR-M-04) |
| COMP-26 | PickupCard | Sprint 2 (SCR-M-05, SCR-V-01) |
| COMP-28 | NotificationPanel [SH] | Sprint 3+ |
| COMP-29 | DashboardMetricsGrid | Sprint 2 (SCR-M-01) |
| COMP-22 | AuthForm | Fase berikutnya |

---

## 9. Design Token Implementation Plan

Berdasarkan **Phase 3B v1.0 §5** dan **Phase 3C v1.1 §10** (Design Tokens — Final).

Seluruh token diimplementasikan sebagai CSS custom properties di `src/design-system/tokens.css` dan di-extend ke dalam `tailwind.config.ts`.

### 9.1 Color Tokens

```
/* Bumi Tenang — Primary */
--color-brand-primary: #1F4E79
--color-brand-primary-hover: #1E3A5F
--color-brand-secondary: #375623

/* Dark Navigation (Phase 3C v1.1 §2.2 — WAJIB) */
--color-nav-dark-bg: #243F1A
--color-nav-dark-active-bg: #375623
--color-nav-dark-hover-bg: #2D5020
--color-nav-dark-item-text: #E5F3DC
--color-nav-dark-muted: #A3C98A

/* Role Identity */
--color-role-manajer-bg: #FFF2CC
--color-role-manajer-text: #78350F
--color-role-pelayan-bg: #D6E4F0
--color-role-utility-bg: #E2EFDA
--color-role-vendor-bg: #FCE9D9

/* Capacity Status (DL-04 behavior) */
--color-capacity-normal: #4CAF50
--color-capacity-warning: #FF9800
--color-capacity-critical: #F44336

/* Daun Segar Accent */
--color-accent-primary: #22C55E
--color-accent-success-bg: #DCFCE7
--color-accent-success-border: #16A34A
--color-accent-success-text: #15803D

/* Semantic */
--color-error-bg: #FEE2E2
--color-error-border: #F44336
--color-error-text: #991B1B
--color-warning-bg: #FFFBEB
--color-info-bg: #DBEAFE
--color-info-text: #1E40AF

/* Surface & Border */
--color-surface: #FFFFFF
--color-surface-subtle: #F7F8FA
--color-border: #D9D9D9
--color-border-focus: #22C55E

/* Text */
--color-text-primary: #1A1A1A
--color-text-secondary: #666666
--color-text-disabled: #AAAAAA
--color-text-on-dark: #E5F3DC

/* Should Have indicator */
--color-sh-indicator: #7030A0
```

### 9.2 Typography Tokens

```
--font-family-base: 'Inter', 'Arial', sans-serif

--font-size-xs: 12px
--font-size-sm: 14px
--font-size-base: 16px
--font-size-lg: 18px
--font-size-xl: 20px
--font-size-2xl: 24px
--font-size-3xl: 28px
--font-size-4xl: 32px

--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700

--line-height-tight: 1.2
--line-height-normal: 1.5
```

### 9.3 Spacing Tokens

```
--space-1: 4px
--space-2: 8px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px
```

### 9.4 Border Radius & Shadow Tokens

```
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-full: 9999px

--shadow-sm: 0 1px 3px rgba(0,0,0,0.12)
--shadow-md: 0 4px 6px rgba(0,0,0,0.15)
--shadow-lg: 0 10px 24px rgba(0,0,0,0.18)
```

### 9.5 Breakpoint & Navigation Tokens — DL-09 (19 Juni 2026)

```
/* Breakpoints */
--bp-tablet: 768px          /* Tailwind md: — batas bawah tablet */
--bp-desktop: 1024px        /* Tailwind lg: — batas bawah desktop */
--bp-wide: 1280px           /* Tailwind xl: — max-width konten saja */

/* Navigation Sizing — wajib per DL-09 */
--nav-header-height-mobile: 56px   /* AppHeader tinggi mobile <768px */
--nav-header-height: 64px          /* AppHeader tinggi tablet dan desktop */
--nav-side-collapsed: 64px         /* SideNav collapsed tablet */
--nav-side-expanded: 240px         /* SideNav expanded desktop */
```

### 9.6 Dark SideNav Token Group — Kritis

Token ini wajib benar sebelum Sprint 2 dimulai karena digunakan di setiap screen Manajer:

| Token | Nilai | Kontras WCAG |
|---|---|---|
| `--color-nav-dark-bg` | `#243F1A` | Background |
| `--color-nav-dark-muted` | `#A3C98A` | 4.6:1 on dark bg — AA ✓ |
| `--color-nav-dark-item-text` | `#E5F3DC` | 10.2:1 on dark bg — AAA ✓ |
| `--color-nav-dark-active-bg` | `#375623` | Background active item |
| `--color-nav-dark-hover-bg` | `#2D5020` | Background hover |
| Active border left | `#22C55E` | 3px solid — penanda posisi aktif |

---

## 10. Sprint Breakdown

### Sprint 0 — Frontend Foundation

**Tujuan:** Semua anggota tim dapat clone repository dan memulai development tanpa konflik setup.

**Durasi estimasi:** 1–2 hari (satu developer; push sebagai baseline sebelum tim lain mulai)

| # | Task | Output |
|---|---|---|
| S0-01 | Inisialisasi Vite + React + TypeScript | `package.json`, `vite.config.ts`, `tsconfig.json` |
| S0-02 | Konfigurasi TailwindCSS | `tailwind.config.ts`, `postcss.config.js` |
| S0-03 | Buat `src/design-system/tokens.css` | Seluruh CSS custom properties dari §9.1–9.5 |
| S0-04 | Import tokens ke `tailwind.config.ts` | Extend theme Tailwind dengan design tokens |
| S0-05 | Setup ESLint | `.eslintrc.cjs` dengan rule React + TypeScript |
| S0-06 | Setup Prettier | `.prettierrc` |
| S0-07 | Buat folder structure | Seluruh direktori `src/` sesuai §6 (boleh kosong) |
| S0-08 | Definisikan 4 route | `src/router/index.tsx` (4 routes) + `src/router/routes.ts` (4 konstanta path) |
| S0-09 | Buat `.env.example` | `VITE_API_BASE_URL`, `VITE_POLLING_INTERVAL_MS=30000` |
| S0-10 | Verifikasi dev server | `npm run dev` berjalan; 4 route dapat diakses; TypeScript compile tanpa error |

**Kriteria selesai Sprint 0:**

| Kriteria | Status |
|---|---|
| Dev server berjalan tanpa error | Wajib |
| 4 route dapat diakses (menampilkan placeholder) | Wajib |
| Design tokens tersedia dan dapat digunakan via Tailwind | Wajib |
| TypeScript compile tanpa error | Wajib |
| ESLint dan Prettier berjalan | Wajib |
| Login / auth flow | Tidak termasuk Sprint 0 |
| RoleGuard | Tidak termasuk Sprint 0 |
| 18 route selain 4 route utama | Tidak termasuk Sprint 0 |

---

### Sprint 1 — Shared Layout & Components

**Tujuan:** Bangun fondasi visual yang dipakai semua screen. Setelah Sprint 1 selesai, tiga anggota tim dapat memulai Sprint 2 secara paralel.

**Durasi estimasi:** 3–5 hari

**Urutan build wajib diikuti:** Atoms → Molecules prioritas → Organisms → Layouts → Hooks & Guard

#### Tahap 1A — Atoms

| # | Task | Komponen | Prioritas |
|---|---|---|---|
| S1-01 | Build Button | COMP-01 | Tinggi |
| S1-02 | Build TextInput | COMP-02 | Tinggi |
| S1-03 | Build Icon | COMP-07 | Tinggi |
| S1-04 | Build LoadingSpinner | COMP-08 | Tinggi |
| S1-05 | Build Badge | COMP-05 | Sedang |
| S1-06 | Build ProgressBar | COMP-06 | Sedang |
| S1-07 | Build SelectInput | COMP-03 | Sedang |
| S1-08 | Build DateInput | COMP-04 | Rendah |
| S1-09 | Build Divider | COMP-09 | Rendah |

#### Tahap 1B — Molecules Prioritas

| # | Task | Komponen |
|---|---|---|
| S1-10 | Build FormField | COMP-10 |
| S1-11 | Build AlertBanner | COMP-15 |
| S1-12 | Build EmptyState | COMP-17 |
| S1-13 | Build StatusBadge | COMP-13 |
| S1-14 | Build NotificationBadge | COMP-14 [SH] |

#### Tahap 1C — Organisms & Layout

| # | Task | Komponen | Catatan |
|---|---|---|---|
| S1-15 | Build AppHeader | COMP-19 | Background per role; role badge; logout button |
| S1-16 | Build SideNav Dark | COMP-21 | `#243F1A` bg; collapsed/expanded; active state per Phase 3C v1.1 §2.2 |
| ~~S1-17~~ | ~~Build BottomNav~~ | ~~COMP-20~~ | **DEFERRED per DL-10** — scope ditentukan pada sprint yang memerlukan role Pelayan/Vendor/Utility; total Sprint 1 = 29 deliverables |
| S1-18 | Build AuthLayout | LT-01 | Shell layout; konten login diisi fase berikutnya |
| S1-19 | Build DashboardLayout | LT-03 | AppHeader + SideNav + Content area |
| S1-20 | Build SimpleLayout | LT-02 | AppHeader + Content area (slot BottomNav kosong Sprint 1 — DEFERRED DL-10; diisi saat sprint role non-Manajer) |
| S1-21a | Build FormLayout | LT-04 | AppHeader + SideNav + Form Content Area; FULL implementation — digunakan SCR-M-04 Sprint 2 [DL-10] |
| S1-21 | Skeleton LT-05 s/d LT-08 | LT-05–08 | Placeholder routing page; berfungsi untuk navigasi [LT-04 sudah FULL di S1-21a — DL-10] |

#### Tahap 1D — Types, Hooks & Guard

| # | Task | Output |
|---|---|---|
| S1-22 | Buat TypeScript types dasar | `src/types/user.types.ts`, `src/types/store.types.ts` |
| S1-23 | Buat useCapacity hook (skeleton) | `src/hooks/useCapacity.ts` — polling interval dari env var (DL-04); cleanup function |
| S1-24 | Buat usePagination hook | `src/hooks/usePagination.ts` — dipakai semua list screen |
| S1-25 | Buat RoleGuard | `src/router/RoleGuard.tsx` — siap menerima auth state; aktif penuh setelah AuthContext tersedia |

**Kriteria selesai Sprint 1:**

| Kriteria | Status |
|---|---|
| Seluruh atom components dirender di semua state (default, hover, focus, disabled, error, loading) | Wajib |
| AppHeader menampilkan background warna role yang benar | Wajib |
| SideNav dark variant sesuai Phase 3C v1.1 §2.2; kontras WCAG terverifikasi | Wajib |
| DashboardLayout menampilkan AppHeader + SideNav + placeholder content area | Wajib |
| Responsive behavior berfungsi di tiga breakpoint (mobile/tablet/desktop) | Wajib |
| RoleGuard terdefinisi dan siap digunakan | Wajib |
| AuthContext | Tidak termasuk Sprint 1 |
| useAuth hook | Tidak termasuk Sprint 1 |
| AuthPage / login flow | Tidak termasuk Sprint 1 |

---

## 11. Risks

| ID | Risiko | Dampak | Kemungkinan | Mitigasi |
|---|---|---|---|---|
| R-01 | Design token tidak diterapkan konsisten antar developer | Inkonsistensi visual di Sprint 2 | Tinggi | Semua token didefinisikan di Sprint 0 sebelum siapapun memulai Sprint 2; token tidak boleh di-hardcode di komponen |
| R-02 | SideNav dark variant tidak memenuhi kontras WCAG | Aksesibilitas gagal; perubahan warna di tengah Sprint 2 | Rendah | Token kontras sudah diverifikasi di Phase 3C: `#A3C98A` on `#243F1A` = 4.6:1 (AA ✓); verifikasi ulang dengan browser tool saat implementasi |
| R-03 | RoleGuard tidak menangani edge case saat AuthContext belum tersedia | Error atau blank screen di Sprint 1 | Sedang | RoleGuard (S1-25) didesain sebagai komponen pasif yang siap menerima auth state; tidak memanggil AuthContext secara langsung sampai fase berikutnya |
| R-04 | Charting library belum dipilih sebelum Sprint 2 | Sprint 2 terhambat saat membangun chart section SCR-M-01 dan SCR-M-02 | Sedang | Keputusan charting library harus dibuat sebagai governance item sebelum Sprint 2 dimulai |
| R-05 | useCapacity polling hook menyebabkan memory leak | Performance degradation; error di konsol | Sedang | Skeleton hook di S1-23 wajib mengimplementasikan `clearInterval` pada cleanup function; verifikasi dengan tab switch |
| R-06 | Sprint 2 dimulai sebelum Sprint 1 selesai dan di-merge | Conflict merge; komponen belum siap dipakai | Tinggi | Sprint 2 hanya boleh dimulai setelah Sprint 1 selesai dan di-merge ke branch utama |

---

## 12. Testing Strategy

Sprint 0–1 tidak menguji fitur bisnis. Fokus pengujian adalah structural correctness dan visual compliance.

### 12.1 Design Token Verification (setelah S0-03)

- Verifikasi semua warna dark sidebar (`--color-nav-dark-*`) dirender dengan benar di browser
- Kontras teks on dark background diverifikasi menggunakan DevTools atau Colour Contrast Analyser
- Font Inter dimuat dan diterapkan ke seluruh elemen

### 12.2 Component Visual Check (Sprint 1)

Untuk setiap atom dan organism yang selesai:
- Render di seluruh state yang didefinisikan (default, hover, focus, disabled, error, loading)
- Verifikasi ukuran touch target minimum 44×44px (Phase 3B §3.2)
- Verifikasi keyboard navigation: Tab, Enter/Space, Escape berfungsi

### 12.3 Responsive Layout Check (setelah S1-19) — DL-09

- Viewport `< 768px` (mobile): SideNav tersembunyi (drawer mode); hamburger tampil di AppHeader kiri; BottomNav **tidak** tampil; AppHeader tinggi 56px [DL-09]
- Viewport `768–1023px` (tablet): SideNav collapsed 64px icon-only; AppHeader tinggi 64px; tap icon → SideNav expand 240px + backdrop rgba(0,0,0,0.3) [DL-09]
- Viewport `≥ 1024px` (desktop): SideNav expanded 240px; selalu terlihat; tidak collapsed; AppHeader tinggi 64px [DL-09]
- Viewport `≥ 1280px` (wide): Lebar konten dibatasi sesuai max-width; layout tidak berubah [DL-09]

### 12.4 Accessibility Baseline Check (sebelum Sprint 1 dinyatakan selesai)

- Jalankan browser accessibility tool (Chrome DevTools Accessibility panel)
- Verifikasi skip-link tersedia di atas setiap layout
- Verifikasi SideNav item memiliki `aria-label` yang deskriptif
- Verifikasi ARIA attributes pada semua atom interactive (Button, TextInput, ProgressBar)

---

## 13. Recommended File Name

```
Phase4_Build_MottaGo_Foundation_v1.1.md
```

---

## 14. Recommended Repository Location

```
docs/phase4/Phase4_Build_MottaGo_Foundation_v1.1.md
```

---

*Dokumen ini telah disetujui. Implementasi Sprint 0 dapat dimulai.*

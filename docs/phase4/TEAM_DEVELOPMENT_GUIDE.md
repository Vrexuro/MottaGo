# TEAM DEVELOPMENT GUIDE
## MottaGo – Phase 4 Frontend Development

**Dokumen:** TEAM_DEVELOPMENT_GUIDE
**Tanggal:** 19 Juni 2026
**Versi:** 1.1
**Status:** ACTIVE
**Berlaku untuk:** Phase 4 Sprint 1 dan seterusnya
**Maintainer:** Rifqi (Project Leader)

---

## 1. Project Overview

MottaGo adalah sistem manajemen pengurangan sampah sisa makanan untuk bisnis restoran.
Dokumen ini adalah pedoman resmi pengembangan tim selama Phase 4 – Frontend Development.

Seluruh anggota tim wajib membaca dan mengikuti panduan ini sebelum mulai bekerja di
repository.

**Stack Teknologi (Approved – Build Plan v1.1):**

| Teknologi | Versi | Fungsi |
|---|---|---|
| React | 18.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Vite | 6.x | Build Tool & Dev Server |
| React Router | v6 | Client-Side Routing |
| TailwindCSS | v3 | Styling |
| ESLint | v8 | Linting |
| Prettier | v3 | Code Formatting |
| Lucide React | latest | Icon Library |

**Status Sprint:**

| Sprint | Branch | Status |
|---|---|---|
| Sprint 0 – Frontend Foundation | `main` | Selesai |
| Sprint 1 – Shared Layout & Components | `feature/shared-foundation` | Belum dimulai |
| Sprint 2 – Screen Implementation | `feature/dashboard` · `feature/monitoring-kapasitas` · `feature/request-pickup` | Belum dimulai |

---

## 2. Team Structure

| Nama | Role |
|---|---|
| Rifqi | Project Leader · Tech Lead |
| Azizah | Frontend Developer |
| Dhia | Frontend Developer |

**Project Leader bertanggung jawab atas:**
- Arsitektur frontend secara keseluruhan
- Keputusan teknis yang memengaruhi lebih dari satu modul
- Review dan approval semua Pull Request
- Merge ke branch `main`
- Perubahan pada shared components, design system, router, dan layout

---

## 3. Development Ownership

Setiap anggota memiliki area kerja yang jelas. Jangan mengubah file di luar area ownership
tanpa izin Project Leader.

### Rifqi — Project Leader / Tech Lead

**Ownership penuh (implementasi + review):**

```
frontend/src/design-system/
frontend/src/router/
frontend/src/layouts/
frontend/src/components/
frontend/src/hooks/
frontend/src/store/
frontend/src/types/
frontend/src/pages/manajer/DashboardPage.tsx
frontend/src/App.tsx
frontend/src/main.tsx
```

**Hak review (bukan implementasi):**

Rifqi memiliki hak untuk mereview dan memberikan feedback pada **seluruh modules**,
termasuk `src/modules/capacity/` dan `src/modules/pickup/`. Hak review ini bukan berarti
Rifqi mengimplementasikan kode di folder tersebut — implementasi tetap menjadi tanggung
jawab Azizah dan Dhia masing-masing.

**Tanggung jawab:**
- Sprint 1: seluruh shared components (atoms, molecules, organisms), layouts, hooks,
  RoleGuard — dikerjakan di `feature/shared-foundation`
- Sprint 2: implementasi SCR-M-01 Dashboard — dikerjakan di `feature/dashboard`
- Final review semua Pull Request sebelum merge

### Azizah — Frontend Developer

**Ownership implementasi:**

```
frontend/src/modules/capacity/
frontend/src/pages/manajer/KapasitasPage.tsx
```

**Tanggung jawab:**
- Sprint 2: implementasi SCR-M-02 Monitoring Kapasitas
- Menggunakan shared components hasil Sprint 1 dari `feature/shared-foundation`
- Bekerja di branch `feature/monitoring-kapasitas`

### Dhia — Frontend Developer

**Ownership implementasi:**

```
frontend/src/modules/pickup/
frontend/src/pages/manajer/RequestPickupPage.tsx
```

**Tanggung jawab:**
- Sprint 2: implementasi SCR-M-04 Request Pickup
- Menggunakan shared components hasil Sprint 1 dari `feature/shared-foundation`
- Bekerja di branch `feature/request-pickup`

---

## 4. Branch Strategy

Repository menggunakan empat feature branch aktif di samping `main`:

```
main
├── feature/shared-foundation
├── feature/dashboard
├── feature/monitoring-kapasitas
└── feature/request-pickup
```

### Fungsi setiap branch:

| Branch | Dikerjakan oleh | Isi | Sprint |
|---|---|---|---|
| `main` | — (hanya via merge) | Kode yang sudah direview dan disetujui | — |
| `feature/shared-foundation` | Rifqi | Atoms, Molecules, Organisms, Layouts, Hooks, RoleGuard | Sprint 1 |
| `feature/dashboard` | Rifqi | SCR-M-01 Dashboard | Sprint 2 |
| `feature/monitoring-kapasitas` | Azizah | SCR-M-02 Monitoring Kapasitas | Sprint 2 |
| `feature/request-pickup` | Dhia | SCR-M-04 Request Pickup | Sprint 2 |

### Mengapa tidak boleh coding langsung di `main`?

`main` adalah branch yang menjadi acuan bersama seluruh tim. Jika satu orang langsung
menulis kode di `main` tanpa review, risiko yang terjadi:

1. **Bug masuk ke main** — anggota lain yang `git pull` akan langsung terdampak
2. **Kode tidak konsisten** — tidak ada kesempatan review sebelum masuk
3. **Konflik sulit diselesaikan** — perubahan bertumpuk tanpa riwayat yang jelas
4. **Tidak bisa di-rollback dengan aman** — membatalkan perubahan di main berisiko
   menghilangkan pekerjaan orang lain

Dengan bekerja di feature branch, setiap perubahan diperiksa melalui Pull Request
sebelum diizinkan masuk ke `main`.

---

## 5. Git Workflow (Langkah demi Langkah)

### Pertama Kali Clone Repository

Langkah ini hanya dilakukan **satu kali** di awal, saat pertama kali menyiapkan project
di komputer masing-masing.

```bash
# 1. Clone repository dari GitHub
git clone <URL_REPOSITORY>

# 2. Masuk ke folder project
cd MottaGo

# 3. Masuk ke folder frontend
cd frontend

# 4. Install dependencies
npm install

# 5. Pastikan aplikasi berjalan
npm run dev
```

Jika `npm run dev` berhasil, akan muncul pesan:

```
VITE v6.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Buka browser dan akses `http://localhost:5173/` — halaman MottaGo seharusnya tampil.

---

### Sebelum Mulai Bekerja

Lakukan ini **setiap hari sebelum mulai coding**, untuk memastikan kode lokal selalu
sinkron dengan versi terbaru di GitHub.

```bash
# 1. Pindah ke branch main terlebih dahulu
git checkout main

# 2. Ambil perubahan terbaru dari GitHub
git pull origin main
```

**Kenapa harus dilakukan?**
Anggota lain mungkin sudah mengirimkan perubahan ke `main` kemarin. Jika tidak
`git pull`, kode di komputer kita akan tertinggal dan bisa menyebabkan konflik.

---

### Masuk ke Branch Masing-Masing

Setelah `git pull origin main`, pindah ke branch kerja masing-masing:

**Rifqi — Sprint 1 (shared foundation):**
```bash
git checkout feature/shared-foundation
```

**Rifqi — Sprint 2 (dashboard):**
```bash
git checkout feature/dashboard
```

**Azizah:**
```bash
git checkout feature/monitoring-kapasitas
```

**Dhia:**
```bash
git checkout feature/request-pickup
```

Jika branch belum pernah dibuat di komputer lokal, buat terlebih dahulu
(hanya perlu dilakukan satu kali):

```bash
# Contoh untuk Azizah
git checkout -b feature/monitoring-kapasitas

# Atau checkout branch yang sudah ada di GitHub
git checkout -b feature/monitoring-kapasitas origin/feature/monitoring-kapasitas
```

Untuk memastikan sedang berada di branch yang benar:
```bash
git branch
```

Output akan menunjukkan branch aktif dengan tanda `*`:
```
  main
  feature/shared-foundation
* feature/monitoring-kapasitas
  feature/request-pickup
```

---

### Sinkronisasi Branch dengan Main

Lakukan ini **sebelum mulai coding di hari itu**, setelah masuk ke branch masing-masing.
Tujuannya agar branch kita mendapat perubahan terbaru dari `main` (misalnya: shared
components baru dari Rifqi yang sudah di-merge).

```bash
# Pastikan sudah di branch sendiri dulu
git branch

# Ambil perubahan dari main ke branch kita
git merge main
```

**Kemungkinan hasilnya:**

Jika tidak ada konflik:
```
Updating abc1234..def5678
Fast-forward
 src/components/atoms/Button/index.tsx | 25 +++
 1 file changed, 25 insertions(+)
```

Jika ada konflik, akan muncul pesan:
```
CONFLICT (content): Merge conflict in src/pages/manajer/KapasitasPage.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

Jika terjadi konflik, lihat **Section 12 – Conflict Resolution**.

---

### Menyimpan Perubahan

Setelah selesai menulis kode, simpan perubahan ke Git dengan langkah berikut:

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan file yang ingin disimpan
#    Untuk menambahkan semua file yang berubah:
git add .

#    Atau untuk menambahkan file tertentu saja:
git add src/pages/manajer/KapasitasPage.tsx

# 3. Buat commit dengan pesan yang deskriptif
git commit -m "feat(capacity): add capacity overview section"
```

**Aturan commit message:** lihat Section 10 – Commit Message Convention.

**Kapan harus commit?**
- Setelah menyelesaikan satu bagian kecil yang berfungsi (bukan saat kode masih error)
- Lebih sering lebih baik — satu commit untuk satu pekerjaan yang spesifik
- Jangan menumpuk banyak perubahan berbeda dalam satu commit

---

### Push ke GitHub

Setelah commit, kirim perubahan ke GitHub agar tersimpan di cloud dan dapat dilihat
oleh Project Leader.

```bash
# Push branch ke GitHub (sesuaikan dengan branch masing-masing)
git push origin feature/monitoring-kapasitas
```

**Pertama kali push branch baru:**
```bash
git push -u origin feature/monitoring-kapasitas
```

Flag `-u` hanya diperlukan satu kali. Push berikutnya cukup dengan:
```bash
git push
```

---

### Membuat Pull Request

Pull Request (PR) adalah permintaan untuk menggabungkan pekerjaan kita ke `main`.
Buat PR setelah pekerjaan pada satu task atau fitur **selesai dan sudah diuji**.

**Langkah membuat PR di GitHub:**

1. Buka repository di GitHub
2. Klik tab **Pull Requests**
3. Klik tombol **New pull request**
4. Pilih:
   - **base:** `main`
   - **compare:** branch kamu
5. Klik **Create pull request**
6. Isi judul PR yang deskriptif
7. Di bagian deskripsi, tuliskan:
   - Apa yang dikerjakan
   - Screen atau komponen mana yang diimplementasikan
   - Hal yang perlu diperhatikan oleh reviewer
8. Klik **Create pull request**
9. **Beritahu Rifqi** bahwa PR sudah dibuat

---

### Review oleh Project Leader

Setelah PR dibuat, Rifqi akan:

1. Membuka PR di GitHub
2. Melihat perubahan file satu per satu (tab **Files changed**)
3. Memberikan komentar jika ada yang perlu diperbaiki
4. Jika ada perubahan yang diminta: lakukan di branch yang sama, push — PR akan
   otomatis terupdate
5. Jika semua sudah sesuai, Rifqi akan memberikan **Approve**

---

### Merge ke Main

Setelah PR di-approve, **hanya Rifqi** yang melakukan merge ke `main` melalui
tombol **Merge pull request** di GitHub.

---

## 6. Setelah Pull Request Di-Merge

Setelah sebuah PR berhasil di-merge ke `main` (dilakukan oleh Rifqi), **semua anggota
tim** harus melakukan sinkronisasi agar kode lokalnya ter-update.

**Langkah yang harus dilakukan oleh setiap anggota:**

```bash
# Langkah 1: Pindah ke main
git checkout main

# Langkah 2: Ambil versi terbaru (yang sudah berisi merge tersebut)
git pull origin main

# Langkah 3: Kembali ke branch kerja masing-masing
git checkout feature/<branch-kamu>

# Langkah 4: Gabungkan perubahan dari main ke branch kamu
git merge main

# Langkah 5: Install dependencies jika ada yang baru
npm install

# Langkah 6: Pastikan project masih berjalan dengan benar
npm run dev
```

**Kapan langkah ini perlu dilakukan?**

- Setelah Rifqi mengumumkan bahwa PR dari `feature/shared-foundation` di-merge
  (ini sinyal bahwa Sprint 1 selesai dan Sprint 2 dapat dimulai)
- Setelah PR manapun di-merge ke `main`
- Sebelum mulai bekerja di hari berikutnya

**Mengapa penting?**

Jika tidak melakukan sinkronisasi setelah merge, branch kamu akan tertinggal dari `main`.
Ini berarti shared components atau fixes yang sudah masuk ke `main` tidak akan tersedia
di branch kamu, dan berpotensi menyebabkan konflik besar saat PR berikutnya diajukan.

---

## 7. Folder Ownership

### Rifqi — boleh mengubah semua folder

Rifqi sebagai Tech Lead memiliki akses penuh ke seluruh codebase untuk keperluan
implementasi dan review.

### Azizah — ownership implementasi

| Folder / File | Status |
|---|---|
| `src/modules/capacity/` | **Ownership implementasi** |
| `src/pages/manajer/KapasitasPage.tsx` | **Ownership implementasi** |
| File lain di luar area ini | **Tidak boleh diubah** tanpa izin Rifqi |

### Dhia — ownership implementasi

| Folder / File | Status |
|---|---|
| `src/modules/pickup/` | **Ownership implementasi** |
| `src/pages/manajer/RequestPickupPage.tsx` | **Ownership implementasi** |
| File lain di luar area ini | **Tidak boleh diubah** tanpa izin Rifqi |

### Tabel Ringkasan Ownership

| Folder | Rifqi | Azizah | Dhia |
|---|---|---|---|
| `src/design-system/` | ✓ Implementasi + Review | ✗ | ✗ |
| `src/router/` | ✓ Implementasi + Review | ✗ | ✗ |
| `src/layouts/` | ✓ Implementasi + Review | ✗ | ✗ |
| `src/components/` | ✓ Implementasi + Review | ✗ | ✗ |
| `src/hooks/` | ✓ Implementasi + Review | ✗ | ✗ |
| `src/store/` | ✓ Implementasi + Review | ✗ | ✗ |
| `src/types/` | ✓ Implementasi + Review | ✗ | ✗ |
| `src/modules/capacity/` | ✓ Review | ✓ Implementasi | ✗ |
| `src/modules/pickup/` | ✓ Review | ✗ | ✓ Implementasi |
| `src/pages/manajer/DashboardPage.tsx` | ✓ Implementasi + Review | ✗ | ✗ |
| `src/pages/manajer/KapasitasPage.tsx` | ✓ Review | ✓ Implementasi | ✗ |
| `src/pages/manajer/RequestPickupPage.tsx` | ✓ Review | ✗ | ✓ Implementasi |
| `src/App.tsx` | ✓ Implementasi + Review | ✗ | ✗ |
| `src/main.tsx` | ✓ Implementasi + Review | ✗ | ✗ |

---

## 8. Shared Component Rules

Shared components adalah komponen yang digunakan oleh lebih dari satu screen.
Perubahan pada shared components berdampak ke seluruh anggota tim.

### Folder yang hanya boleh diubah oleh Rifqi tanpa approval khusus:

```
src/design-system/     ← CSS tokens, global styles, typography
src/router/            ← Route definitions, RoleGuard
src/layouts/           ← Layout wrappers
src/components/        ← Atoms, Molecules, Organisms
src/hooks/             ← useCapacity, usePagination
src/store/             ← Context providers
src/types/             ← TypeScript type definitions
```

### Aturan untuk Azizah dan Dhia:

1. **Jangan mengubah** file di folder di atas tanpa konfirmasi ke Rifqi
2. **Jika membutuhkan** komponen atau hook baru yang belum ada, beritahu Rifqi —
   Rifqi yang akan membuatnya di shared area
3. **Jika menemukan bug** di shared component, laporkan ke Rifqi — jangan memperbaiki
   sendiri karena perubahan tersebut berdampak ke screen lain
4. **Jika ingin mengusulkan perubahan**, sampaikan via diskusi sebelum coding

---

## 9. Pull Request Workflow

```
Coding di Feature Branch
        ↓
git add . → git commit → git push
        ↓
Buat Pull Request di GitHub
(base: main ← compare: feature/xxx)
        ↓
Rifqi melakukan Review
        ↓
Ada perubahan? ──Ya──→ Perbaiki di branch yang sama → push → kembali ke Review
        ↓ Tidak
Rifqi memberikan Approve
        ↓
Rifqi melakukan Merge ke main
        ↓
Semua anggota sinkronisasi (lihat Section 6)
```

### Aturan Pull Request:

- Satu PR untuk satu fitur atau task yang jelas ruang lingkupnya
- Jangan menggabungkan pekerjaan yang tidak berkaitan dalam satu PR
- PR harus bisa di-build tanpa error sebelum diajukan (`npm run build` harus sukses)
- PR harus lulus lint tanpa error (`npm run lint` harus bersih)
- Judul PR harus deskriptif dan mencerminkan isi perubahan
- Semua PR direview oleh manusia (Rifqi) — tidak ada merge otomatis

---

## 10. Commit Message Convention

Format:
```
<type>(<scope>): <deskripsi singkat>
```

| Type | Digunakan untuk |
|---|---|
| `feat` | Menambah fitur atau komponen baru |
| `fix` | Memperbaiki bug |
| `style` | Perubahan CSS / styling (bukan logika) |
| `refactor` | Perubahan kode tanpa menambah fitur atau fix bug |
| `chore` | Perubahan konfigurasi, dependency, tooling |
| `docs` | Perubahan dokumentasi |

### Contoh commit message yang benar:

```bash
feat(shared): add Button atom component
feat(shared): implement SideNav dark variant
feat(dashboard): add summary cards
feat(capacity): implement capacity table
feat(capacity): add linear gauge component
feat(pickup): add pickup request form
feat(pickup): implement vendor selection dropdown
fix(layout): resolve sidebar overflow on mobile
fix(capacity): correct threshold calculation display
style(dashboard): adjust KPI card spacing
chore(deps): update lucide-react to latest
refactor(capacity): extract gauge logic to hook
```

### Commit message yang harus dihindari:

```bash
update             ← terlalu umum
fix bug            ← bug apa? di mana?
wip                ← jangan commit kode yang belum berfungsi
asdfjkl            ← tidak bermakna
Azizah update      ← nama bukan deskripsi
```

---

## 11. Sync Procedure

Lakukan prosedur ini **setiap hari sebelum mulai coding**:

```bash
# Langkah 1: Cek apakah ada perubahan yang belum disimpan
git status

# Jika ada perubahan yang belum di-commit, commit dulu atau simpan sementara:
git stash

# Langkah 2: Pindah ke main
git checkout main

# Langkah 3: Ambil versi terbaru dari GitHub
git pull origin main

# Langkah 4: Kembali ke branch sendiri
git checkout feature/<branch-kamu>

# Langkah 5: Gabungkan perubahan terbaru dari main
git merge main

# Langkah 6: Install dependencies baru jika package.json berubah
npm install

# Langkah 7: Mulai bekerja
npm run dev
```

---

## 12. Conflict Resolution

### Apa itu merge conflict?

Merge conflict terjadi ketika dua orang mengubah **baris yang sama pada file yang sama**,
dan Git tidak bisa memutuskan mana yang harus dipakai.

Contoh tampilan conflict di dalam file:

```
<<<<<<< HEAD
  return <div className="text-heading-2">Monitoring Kapasitas</div>;
=======
  return <div className="text-heading-3">Monitoring Kapasitas</div>;
>>>>>>> main
```

Artinya: kode di atas garis `=======` adalah versi di branch kamu, kode di bawahnya
adalah versi dari `main`.

### Langkah menyelesaikan conflict:

1. Jalankan `git merge main` — Git akan memberi tahu file mana yang conflict
2. Buka file tersebut di VS Code
3. VS Code menampilkan konflik dengan highlight khusus
4. Pilih: **Accept Current Change**, **Accept Incoming Change**, atau **Accept Both**
5. Hapus semua tanda `<<<<<<<`, `=======`, `>>>>>>>` — jangan ada yang tersisa
6. Simpan file
7. `git add <file-yang-conflict>`
8. `git commit -m "fix: resolve merge conflict on KapasitasPage"`

### Kapan harus menghubungi Rifqi?

Hubungi Rifqi **segera** jika:
- Conflict terjadi di file di luar area ownership kamu
- Kamu tidak yakin versi mana yang harus dipilih
- Setelah resolve conflict, `npm run build` masih error
- Conflict melibatkan lebih dari 3 file sekaligus

### Larangan force push

**Dilarang keras** melakukan `git push --force` atau `git push -f` tanpa izin eksplisit
dari Rifqi. Force push dapat menghapus commit orang lain secara permanen.

---

## 13. Definition of Done

Sebuah task atau fitur dinyatakan **selesai** hanya jika memenuhi semua kriteria berikut:

| Kriteria | Catatan |
|---|---|
| Kode berjalan tanpa error di browser | Uji secara manual |
| `npm run build` sukses tanpa error | Wajib sebelum buat PR |
| `npm run lint` bersih (0 errors, 0 warnings) | Wajib sebelum buat PR |
| Tampilan sesuai Visual Spec yang disetujui | SCR-M-01/M-02/M-04 VisualSpec v1.1 |
| Responsif di mobile, tablet, desktop | Uji di DevTools (640px / 1024px / 1280px+) |
| Tidak mengubah file di luar area ownership tanpa izin | Cek `git diff` sebelum commit |
| Pull Request sudah dibuat dan menunggu review | PR terbuka di GitHub |
| Approved oleh Rifqi | Ditandai Approve di GitHub |
| Merged ke main oleh Rifqi | Merge dilakukan oleh Rifqi |

---

## 14. Sprint 1 Execution Plan

Sprint 1 dikerjakan **oleh Rifqi** di branch `feature/shared-foundation`.
`feature/dashboard` tidak digunakan di Sprint 1 — branch tersebut dipersiapkan
khusus untuk implementasi SCR-M-01 Dashboard pada Sprint 2.

Azizah dan Dhia **menunggu Sprint 1 selesai dan di-merge ke `main`** sebelum memulai
Sprint 2.

**Alasan:** Sprint 2 bergantung pada shared components yang dibangun di Sprint 1.
Memulai Sprint 2 sebelum Sprint 1 di-merge akan menyebabkan import error karena
komponen belum tersedia.

### Urutan Sprint 1 (Rifqi — branch: feature/shared-foundation):

**Tahap 1A — Atom Components:**

| Task | Komponen | File Target |
|---|---|---|
| S1-01 | Button (COMP-01) | `src/components/atoms/Button/index.tsx` |
| S1-02 | TextInput (COMP-02) | `src/components/atoms/TextInput/index.tsx` |
| S1-03 | Icon (COMP-07) | `src/components/atoms/Icon/index.tsx` |
| S1-04 | LoadingSpinner (COMP-08) | `src/components/atoms/LoadingSpinner/index.tsx` |
| S1-05 | Badge (COMP-05) | `src/components/atoms/Badge/index.tsx` |
| S1-06 | ProgressBar (COMP-06) | `src/components/atoms/ProgressBar/index.tsx` |
| S1-07 | SelectInput (COMP-03) | `src/components/atoms/SelectInput/index.tsx` |
| S1-08 | DateInput (COMP-04) | `src/components/atoms/DateInput/index.tsx` |
| S1-09 | Divider (COMP-09) | `src/components/atoms/Divider/index.tsx` |

**Tahap 1B — Molecule Components:**

| Task | Komponen | File Target |
|---|---|---|
| S1-10 | FormField (COMP-10) | `src/components/molecules/FormField/index.tsx` |
| S1-11 | AlertBanner (COMP-15) | `src/components/molecules/AlertBanner/index.tsx` |
| S1-12 | EmptyState (COMP-17) | `src/components/molecules/EmptyState/index.tsx` |
| S1-13 | StatusBadge (COMP-13) | `src/components/molecules/StatusBadge/index.tsx` |
| S1-14 | NotificationBadge (COMP-14) | `src/components/molecules/NotificationBadge/index.tsx` |

**Tahap 1C — Organisms & Layouts:**

| Task | Komponen | File Target |
|---|---|---|
| S1-15 | AppHeader (COMP-19) | `src/components/organisms/AppHeader/index.tsx` |
| S1-16 | SideNav Dark (COMP-21) | `src/components/organisms/SideNav/index.tsx` |
| S1-17 | BottomNav (COMP-20) | `src/components/organisms/BottomNav/index.tsx` |
| S1-18 | AuthLayout | `src/layouts/AuthLayout.tsx` |
| S1-19 | DashboardLayout | `src/layouts/DashboardLayout.tsx` |
| S1-20 | SimpleLayout | `src/layouts/SimpleLayout.tsx` |
| S1-21 | Skeleton LT-04 s/d LT-08 | `src/layouts/` |

**Tahap 1D — Types, Hooks, Guard:**

| Task | Output | File Target |
|---|---|---|
| S1-22 | TypeScript types dasar | `src/types/user.types.ts`, `src/types/store.types.ts` |
| S1-23 | useCapacity hook (skeleton) | `src/hooks/useCapacity.ts` |
| S1-24 | usePagination hook | `src/hooks/usePagination.ts` |
| S1-25 | RoleGuard (skeleton) | `src/router/RoleGuard.tsx` |

### Yang harus dilakukan Azizah dan Dhia selama Sprint 1:

- Siapkan branch masing-masing di komputer lokal
- Pelajari Visual Spec screen masing-masing:
  - Azizah: `docs/visual-validation/SCR-M-02_VisualSpec_MottaGo_v1.1.docx`
  - Dhia: `docs/visual-validation/SCR-M-04_VisualSpec_MottaGo_v1.0.docx`
- Komunikasikan ke Rifqi jika ada komponen yang akan dibutuhkan tapi belum ada
  di daftar Sprint 1

### Sinyal mulai Sprint 2:

Rifqi akan mengumumkan saat Sprint 1 selesai dan PR `feature/shared-foundation`
sudah di-merge ke `main`. Setelah itu, Azizah dan Dhia melakukan:

```bash
git checkout main
git pull origin main
git checkout feature/<branch-masing-masing>
git merge main
npm install
npm run dev
```

---

## 15. Governance Rules

Aturan berikut bersifat wajib dan berlaku untuk seluruh anggota tim.

### Aturan Git & Kolaborasi

| No | Aturan |
|---|---|
| 1 | Tidak boleh commit langsung ke `main` |
| 2 | Semua pekerjaan dilakukan di branch masing-masing |
| 3 | Semua perubahan masuk ke `main` melalui Pull Request |
| 4 | Hanya Rifqi yang boleh merge ke `main` |
| 5 | Tidak boleh mengubah file di area ownership anggota lain tanpa izin |
| 6 | Tidak boleh mengubah Design System (`src/design-system/`) tanpa approval Rifqi |
| 7 | Tidak boleh mengubah Router (`src/router/`) tanpa approval Rifqi |
| 8 | Tidak boleh melakukan force push (`git push --force`) tanpa izin Rifqi |

### Aturan Penggunaan Claude Code

Claude Code (AI coding assistant) dapat digunakan untuk membantu coding, namun dengan
batasan berikut yang wajib dipatuhi:

| No | Aturan |
|---|---|
| 9 | Tidak boleh melakukan `git push` melalui Claude tanpa persetujuan Project Leader |
| 10 | Tidak boleh melakukan `git merge` melalui Claude tanpa persetujuan Project Leader |
| 11 | Tidak boleh melakukan force push dalam kondisi apapun |
| 12 | Semua Pull Request tetap direview oleh manusia (Rifqi) — tidak ada merge otomatis via Claude |

**Prinsip penggunaan Claude Code yang aman:**
- Claude boleh digunakan untuk menulis kode, membuat komponen, dan debugging
- Claude **tidak boleh** mengeksekusi perintah Git yang berdampak ke remote repository
  tanpa konfirmasi eksplisit dari Project Leader
- Jika Claude menyarankan `git push` atau `git merge`, **tunda dan konfirmasi ke Rifqi**
  terlebih dahulu

---

*Dokumen ini dipertahankan oleh Rifqi selaku Project Leader.
Perubahan pada dokumen ini memerlukan approval Rifqi.*

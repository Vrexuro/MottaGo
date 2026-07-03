# MottaGo

Sistem manajemen pengurangan limbah makanan untuk restoran.

## Deskripsi

MottaGo mencakup pencatatan, klasifikasi, monitoring kapasitas, pelacakan pickup, pelaporan, dan analitik limbah makanan restoran.

## Stack Teknologi

| Layer | Teknologi |
|---|---|
| Frontend | React 18, TypeScript 5, Vite 6, React Router v6 |
| Styling | TailwindCSS v3, CSS Custom Properties |
| Icons / Charts | Lucide React, Recharts |
| Backend / DB | Supabase (PostgreSQL 15, Auth, PostgREST) |

## Status Proyek

**Phase 4 — Build, Sprint A complete**

Batch A1–A5, EA-01, EA-02 selesai. Git push ke GitHub pending (migrations 0007–0011 local only).

Next milestone: **C2 — Real Data Integration**

## Struktur Repository

```
frontend/          — React + TypeScript SPA (active development)
supabase/          — 11 migration files (0001–0011)
docs/              — Deliverables per phase (phase0–phase6) + operational docs
backend/           — Tidak digunakan (Supabase PostgREST — DL-12)
database/          — Tidak digunakan (schema di supabase/migrations/)
```

## Menjalankan Project

```bash
cd frontend
npm install
npm run dev
```

Salin `frontend/.env.example` ke `frontend/.env` dan isi dengan Supabase credentials.

## Tim

| Nama | NIM |
|---|---|
| Rifqi Dzakwan Nasution | 24523061 |
| Nur Azizah Basyirah Syamsuddin | 24523238 |
| Aufa Dhia Arkan | 24523156 |

Kelompok 2 — F&B | Pengembangan Sistem Informasi

## Dokumentasi

Lihat `docs/` untuk deliverables lengkap. Operational docs utama:

- `docs/CURRENT_FOCUS.md` — pekerjaan aktif & next milestone
- `docs/PROJECT_STATUS.md` — status semua batch dan milestones
- `docs/DECISION_LOG.md` — keputusan arsitektur (DL-01 s/d DL-13)
- `docs/CLAUDE_SESSION_START.md` — konteks wajib baca untuk Claude

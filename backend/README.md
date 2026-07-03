# Backend

Folder ini tidak digunakan untuk implementasi backend MottaGo.

## Arsitektur Backend Aktual

Backend MottaGo sepenuhnya dijalankan oleh **Supabase** (DL-12):

- **Database:** PostgreSQL 15 via Supabase
- **API:** PostgREST — auto-REST API dari schema, tanpa custom server
- **Auth:** Supabase Auth dengan username-based flow (DL-11)
- **RLS:** Row Level Security aktif di semua tabel utama

## Lokasi Schema & Migrations

Semua definisi database ada di:

```
supabase/migrations/
├── 0001_extensions.sql
├── 0002_tables.sql
├── 0003_constraints.sql
├── 0004_indexes.sql
├── 0005_triggers.sql
├── 0006_seed.sql
├── 0007_rls.sql
├── 0008_vendor_identity.sql
├── 0009_remove_vendor_role.sql
├── 0010_vendor_whatsapp_and_pickup_amendments.sql
└── 0011_username_auth.sql
```

Lihat `docs/DECISION_LOG.md` — DL-11 dan DL-12 untuk keputusan arsitektur backend.

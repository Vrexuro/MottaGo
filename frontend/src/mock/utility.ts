// src/mock/utility.ts
// Mock data untuk halaman-halaman role Utility.
// Sprint C: ganti dengan wasteService calls.

export type WasteCategoryDb = 'organik' | 'anorganik' | 'minyak';

export interface UtilityEntry {
  id: string;
  waktu: string;
  tanggal: string;
  kategori: WasteCategoryDb;
  kuantitas: number;
  unit: 'kg' | 'liter';
  dicatatOleh: string;
}

export const UTILITY_ENTRIES: UtilityEntry[] = [
  {
    id: 'e-01',
    waktu: '09:15',
    tanggal: '4 Jul 2026',
    kategori: 'organik',
    kuantitas: 12,
    unit: 'kg',
    dicatatOleh: 'Budi Santoso',
  },
  {
    id: 'e-02',
    waktu: '08:30',
    tanggal: '4 Jul 2026',
    kategori: 'anorganik',
    kuantitas: 8,
    unit: 'kg',
    dicatatOleh: 'Budi Santoso',
  },
  {
    id: 'e-03',
    waktu: '07:45',
    tanggal: '4 Jul 2026',
    kategori: 'minyak',
    kuantitas: 3,
    unit: 'liter',
    dicatatOleh: 'Citra Dewi',
  },
  {
    id: 'e-04',
    waktu: '16:00',
    tanggal: '3 Jul 2026',
    kategori: 'organik',
    kuantitas: 18,
    unit: 'kg',
    dicatatOleh: 'Budi Santoso',
  },
  {
    id: 'e-05',
    waktu: '09:20',
    tanggal: '3 Jul 2026',
    kategori: 'anorganik',
    kuantitas: 12,
    unit: 'kg',
    dicatatOleh: 'Citra Dewi',
  },
  {
    id: 'e-06',
    waktu: '08:15',
    tanggal: '3 Jul 2026',
    kategori: 'organik',
    kuantitas: 9,
    unit: 'kg',
    dicatatOleh: 'Budi Santoso',
  },
  {
    id: 'e-07',
    waktu: '15:45',
    tanggal: '2 Jul 2026',
    kategori: 'minyak',
    kuantitas: 5,
    unit: 'liter',
    dicatatOleh: 'Budi Santoso',
  },
  {
    id: 'e-08',
    waktu: '10:30',
    tanggal: '2 Jul 2026',
    kategori: 'organik',
    kuantitas: 22,
    unit: 'kg',
    dicatatOleh: 'Citra Dewi',
  },
  {
    id: 'e-09',
    waktu: '08:00',
    tanggal: '2 Jul 2026',
    kategori: 'anorganik',
    kuantitas: 7,
    unit: 'kg',
    dicatatOleh: 'Budi Santoso',
  },
  {
    id: 'e-10',
    waktu: '16:30',
    tanggal: '1 Jul 2026',
    kategori: 'organik',
    kuantitas: 15,
    unit: 'kg',
    dicatatOleh: 'Budi Santoso',
  },
  {
    id: 'e-11',
    waktu: '09:00',
    tanggal: '1 Jul 2026',
    kategori: 'minyak',
    kuantitas: 4,
    unit: 'liter',
    dicatatOleh: 'Citra Dewi',
  },
  {
    id: 'e-12',
    waktu: '14:30',
    tanggal: '30 Jun 2026',
    kategori: 'organik',
    kuantitas: 11,
    unit: 'kg',
    dicatatOleh: 'Budi Santoso',
  },
  {
    id: 'e-13',
    waktu: '10:15',
    tanggal: '30 Jun 2026',
    kategori: 'anorganik',
    kuantitas: 9,
    unit: 'kg',
    dicatatOleh: 'Citra Dewi',
  },
  {
    id: 'e-14',
    waktu: '16:00',
    tanggal: '29 Jun 2026',
    kategori: 'organik',
    kuantitas: 20,
    unit: 'kg',
    dicatatOleh: 'Budi Santoso',
  },
  {
    id: 'e-15',
    waktu: '09:30',
    tanggal: '28 Jun 2026',
    kategori: 'minyak',
    kuantitas: 6,
    unit: 'liter',
    dicatatOleh: 'Budi Santoso',
  },
];

// Summary hari ini — gunakan di UtilityDashboardPage.
// kapasitasPct DIHITUNG dari nilai dasar agar siap Sprint C.
const _kapasitasKg = 263;
const _maxKg = 400;

export const UTILITY_TODAY_SUMMARY = {
  totalEntri: 3,
  totalKg: 23, // 12 + 8 + 3
  kapasitasKg: _kapasitasKg,
  maxKg: _maxKg,
  kapasitasPct: Math.round((_kapasitasKg / _maxKg) * 100), // 66 — jangan hardcode
  pickupAktif: 1,
} as const;

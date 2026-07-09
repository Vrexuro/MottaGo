// src/mock/pickup.ts
// Mock data untuk riwayat pickup dan pickup aktif.
// Sprint C: ganti import ini dengan pickupService calls.

export interface PickupHistoryRecord {
  id: string;
  tanggal: string;
  vendor: string;
  kategori: 'organik' | 'anorganik' | 'minyak';
  estimasiKg: number;
  status: 'completed' | 'cancelled' | 'waiting' | 'in-transit';
  catatan: string;
}

export const PICKUP_HISTORY: PickupHistoryRecord[] = [
  {
    id: 'PU-001',
    tanggal: '1 Jul 2026',
    vendor: 'Bank Sampah Hijau',
    kategori: 'organik',
    estimasiKg: 85,
    status: 'completed',
    catatan: '—',
  },
  {
    id: 'PU-002',
    tanggal: '28 Jun 2026',
    vendor: 'CV Daur Ulang Mandiri',
    kategori: 'anorganik',
    estimasiKg: 42,
    status: 'completed',
    catatan: '—',
  },
  {
    id: 'PU-003',
    tanggal: '25 Jun 2026',
    vendor: 'Bank Sampah Hijau',
    kategori: 'organik',
    estimasiKg: 91,
    status: 'completed',
    catatan: '—',
  },
  {
    id: 'PU-004',
    tanggal: '22 Jun 2026',
    vendor: 'PT Hijau Bersama',
    kategori: 'minyak',
    estimasiKg: 18,
    status: 'completed',
    catatan: '—',
  },
  {
    id: 'PU-005',
    tanggal: '20 Jun 2026',
    vendor: 'CV Daur Ulang Mandiri',
    kategori: 'anorganik',
    estimasiKg: 35,
    status: 'cancelled',
    catatan: 'Vendor tidak hadir',
  },
  {
    id: 'PU-006',
    tanggal: '18 Jun 2026',
    vendor: 'Bank Sampah Hijau',
    kategori: 'organik',
    estimasiKg: 78,
    status: 'completed',
    catatan: '—',
  },
  {
    id: 'PU-007',
    tanggal: '15 Jun 2026',
    vendor: 'PT Hijau Bersama',
    kategori: 'minyak',
    estimasiKg: 22,
    status: 'completed',
    catatan: '—',
  },
  {
    id: 'PU-008',
    tanggal: '10 Jun 2026',
    vendor: 'CV Daur Ulang Mandiri',
    kategori: 'anorganik',
    estimasiKg: 55,
    status: 'cancelled',
    catatan: 'Cuaca buruk',
  },
];
// Statistik: 6 completed (336 kg), 2 cancelled

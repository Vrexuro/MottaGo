// src/mock/vendor.ts
// Mock data untuk manajemen vendor.
// Sprint C: ganti dengan vendorService calls.
// KONSISTENSI: nama vendor sama dengan VENDOR_OPTIONS di mock/pickup/requestPickup.ts

export interface VendorRecord {
  id: string;
  nama: string;
  whatsapp: string;
  kategori: 'organik' | 'anorganik' | 'minyak';
  isAktif: boolean;
  lastUpdated: string;
}

export const VENDORS: VendorRecord[] = [
  {
    id: 'v-1',
    nama: 'Bank Sampah Hijau',
    whatsapp: '0811-1111-2222',
    kategori: 'organik',
    isAktif: true,
    lastUpdated: '2026-07-01',
  },
  {
    id: 'v-2',
    nama: 'CV Daur Ulang Mandiri',
    whatsapp: '0812-2222-3333',
    kategori: 'anorganik',
    isAktif: true,
    lastUpdated: '2026-06-28',
  },
  {
    id: 'v-3',
    nama: 'PT Hijau Bersama',
    whatsapp: '0813-3333-4444',
    kategori: 'minyak',
    isAktif: true,
    lastUpdated: '2026-07-03',
  },
  {
    id: 'v-4',
    nama: 'UD Lestari Sejahtera',
    whatsapp: '0814-4444-5555',
    kategori: 'organik',
    isAktif: false,
    lastUpdated: '2026-05-15',
  },
];
// Statistik: 3 aktif, 1 nonaktif

// src/mock/user.ts
// Mock data untuk halaman Kelola Pengguna.
// Sprint C: ganti dengan userService calls.

export interface UserRecord {
  id: string;
  nama: string;
  username: string;
  role: 'manajer' | 'utility';
  isAktif: boolean;
  lastLogin: string;
}

export const USERS: UserRecord[] = [
  {
    id: 'u-1',
    nama: 'Ahmad Manajer',
    username: 'ahmad.m',
    role: 'manajer',
    isAktif: true,
    lastLogin: 'Hari ini, 08:32',
  },
  {
    id: 'u-2',
    nama: 'Budi Santoso',
    username: 'budi.util',
    role: 'utility',
    isAktif: true,
    lastLogin: 'Hari ini, 07:15',
  },
  {
    id: 'u-3',
    nama: 'Citra Dewi',
    username: 'citra.util',
    role: 'utility',
    isAktif: true,
    lastLogin: 'Kemarin, 20:44',
  },
  {
    id: 'u-4',
    nama: 'Deni Prasetyo',
    username: 'deni.util',
    role: 'utility',
    isAktif: false,
    lastLogin: '3 hari lalu',
  },
];
// Statistik: 1 manajer, 3 utility; 3 aktif, 1 nonaktif

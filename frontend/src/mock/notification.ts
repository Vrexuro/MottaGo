// src/mock/notification.ts
// Mock data untuk sistem notifikasi.
// Sprint C: ganti dengan notificationService + polling.

export type NotifType = 'kapasitas' | 'pickup' | 'sistem';

export interface NotifRecord {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}

export const NOTIFICATIONS: NotifRecord[] = [
  {
    id: 'n-1',
    type: 'kapasitas',
    title: 'Kapasitas Kritis!',
    message: 'Kapasitas organik mencapai 92% dari 400 kg. Segera lakukan pickup.',
    isRead: false,
    timestamp: '2 menit lalu',
  },
  {
    id: 'n-2',
    type: 'pickup',
    title: 'Pickup Dalam Perjalanan',
    message: 'CV Daur Ulang Mandiri sedang dalam perjalanan menuju lokasi Anda.',
    isRead: false,
    timestamp: '15 menit lalu',
  },
  {
    id: 'n-3',
    type: 'kapasitas',
    title: 'Kapasitas Peringatan',
    message: 'Total kapasitas mencapai 66% (263 dari 400 kg). Pantau terus.',
    isRead: true,
    timestamp: '1 jam lalu',
  },
  {
    id: 'n-4',
    type: 'pickup',
    title: 'Pickup Selesai',
    message: 'Bank Sampah Hijau berhasil mengambil 85 kg sampah organik.',
    isRead: true,
    timestamp: '3 jam lalu',
  },
  {
    id: 'n-5',
    type: 'sistem',
    title: 'Akun Baru Ditambahkan',
    message: "Akun utility 'utility_demo' telah berhasil dibuat oleh administrator.",
    isRead: true,
    timestamp: 'Kemarin, 14:30',
  },
];
// Statistik: 2 unread, 3 read

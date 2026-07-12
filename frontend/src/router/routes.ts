export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  NOT_FOUND: '/404',

  MANAJER_DASHBOARD: '/manajer',
  MANAJER_KAPASITAS: '/manajer/kapasitas',
  MANAJER_KELOLA_USER: '/manajer/users',
  MANAJER_VENDOR_MANAGEMENT: '/manajer/vendor',
  MANAJER_LAPORAN: '/manajer/laporan',
  MANAJER_RIWAYAT_PICKUP: '/manajer/pickup/history',
  MANAJER_NOTIFICATIONS: '/manajer/notifikasi',
  MANAJER_PENGATURAN: '/manajer/pengaturan',

  UTILITY_ROOT: '/utility',
  UTILITY_CATAT_WASTE: '/utility/catat',
  UTILITY_RIWAYAT_INPUT: '/utility/riwayat',
  UTILITY_PROFIL: '/utility/profil',
  UTILITY_REQUEST_PICKUP: '/utility/pickup/request',
  UTILITY_RIWAYAT_PICKUP: '/utility/pickup/history',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

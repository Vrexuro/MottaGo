export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  NOT_FOUND: '/404',

  MANAJER_DASHBOARD: '/manajer',
  MANAJER_KAPASITAS: '/manajer/kapasitas',
  MANAJER_PICKUP_REQUEST: '/manajer/pickup/request',
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
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

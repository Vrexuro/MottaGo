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

  UTILITY_ROOT: '/utility',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

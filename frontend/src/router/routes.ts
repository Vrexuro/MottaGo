export const ROUTES = {
  ROOT: '/',
  MANAJER_DASHBOARD: '/manajer',
  MANAJER_KAPASITAS: '/manajer/kapasitas',
  MANAJER_PICKUP_REQUEST: '/manajer/pickup/request',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

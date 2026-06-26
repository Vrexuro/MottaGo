import type { NavItem } from '../../types/nav.types';
import { ROUTES } from '../routes';

export const manajerNavItems: NavItem[] = [
  {
    id: 'manajer-dashboard',
    label: 'Dashboard',
    iconName: 'LayoutDashboard',
    path: ROUTES.MANAJER_DASHBOARD,
    allowedRoles: ['manajer'],
  },
  {
    id: 'manajer-kapasitas',
    label: 'Monitoring Kapasitas',
    iconName: 'Activity',
    path: ROUTES.MANAJER_KAPASITAS,
    allowedRoles: ['manajer'],
  },
  {
    id: 'manajer-pickup-request',
    label: 'Request Pickup',
    iconName: 'Truck',
    path: ROUTES.MANAJER_PICKUP_REQUEST,
    allowedRoles: ['manajer'],
  },
];

import type { NavItem } from '../../types/nav.types';
import { ROUTES } from '../routes';

export const utilityNavItems: NavItem[] = [
  {
    id: 'utility-dashboard',
    label: 'Dashboard',
    iconName: 'LayoutDashboard',
    path: ROUTES.UTILITY_ROOT,
    allowedRoles: ['utility'],
  },
  {
    id: 'utility-catat',
    label: 'Catat Sampah',
    iconName: 'PenLine',
    path: ROUTES.UTILITY_CATAT_WASTE,
    allowedRoles: ['utility'],
  },
  {
    id: 'utility-request-pickup',
    label: 'Request Pickup',
    iconName: 'Truck',
    path: ROUTES.UTILITY_REQUEST_PICKUP,
    allowedRoles: ['utility'],
  },
  {
    id: 'utility-riwayat-pickup',
    label: 'Riwayat Pickup',
    iconName: 'ClipboardList',
    path: ROUTES.UTILITY_RIWAYAT_PICKUP,
    allowedRoles: ['utility'],
  },
  {
    id: 'utility-riwayat',
    label: 'Riwayat Input',
    iconName: 'ClipboardList',
    path: ROUTES.UTILITY_RIWAYAT_INPUT,
    allowedRoles: ['utility'],
  },
  {
    id: 'utility-profil',
    label: 'Profil',
    iconName: 'UserCircle',
    path: ROUTES.UTILITY_PROFIL,
    allowedRoles: ['utility'],
  },
];

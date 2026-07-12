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
    id: 'manajer-riwayat-pickup',
    label: 'Riwayat Pickup',
    iconName: 'ClipboardList',
    path: ROUTES.MANAJER_RIWAYAT_PICKUP,
    allowedRoles: ['manajer'],
  },
  {
    id: 'manajer-laporan',
    label: 'Laporan',
    iconName: 'FileText',
    path: ROUTES.MANAJER_LAPORAN,
    allowedRoles: ['manajer'],
  },
  {
    id: 'manajer-kelola-pengguna',
    label: 'Kelola Pengguna',
    iconName: 'Users',
    path: ROUTES.MANAJER_KELOLA_USER,
    allowedRoles: ['manajer'],
  },
  {
    id: 'manajer-vendor',
    label: 'Manajemen Vendor',
    iconName: 'Building2',
    path: ROUTES.MANAJER_VENDOR_MANAGEMENT,
    allowedRoles: ['manajer'],
  },
];

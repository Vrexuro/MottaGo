import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { RoleGuard } from './RoleGuard';
import RootPage from '../pages/RootPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import DashboardPage from '../pages/manajer/DashboardPage';
import KapasitasPage from '../pages/manajer/KapasitasPage';
import RequestPickupPage from '../pages/manajer/RequestPickupPage';
import KelolaPenggunaPage from '../pages/manajer/KelolaPenggunaPage';
import VendorManagementPage from '../pages/manajer/VendorManagementPage';
import LaporanPage from '../pages/manajer/LaporanPage';

export const router = createBrowserRouter([
  // ── Public routes ─────────────────────────────────────────────────────────
  {
    path: ROUTES.ROOT,
    element: <RootPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },

  // ── Manajer routes ────────────────────────────────────────────────────────
  {
    path: ROUTES.MANAJER_DASHBOARD,
    element: (
      <RoleGuard allowedRoles={['manajer']}>
        <DashboardPage />
      </RoleGuard>
    ),
  },
  {
    path: ROUTES.MANAJER_KAPASITAS,
    element: (
      <RoleGuard allowedRoles={['manajer']}>
        <KapasitasPage />
      </RoleGuard>
    ),
  },
  {
    path: ROUTES.MANAJER_PICKUP_REQUEST,
    element: (
      <RoleGuard allowedRoles={['manajer']}>
        <RequestPickupPage />
      </RoleGuard>
    ),
  },
  {
    path: ROUTES.MANAJER_KELOLA_USER,
    element: (
      <RoleGuard allowedRoles={['manajer']}>
        <KelolaPenggunaPage />
      </RoleGuard>
    ),
  },
  {
    path: ROUTES.MANAJER_VENDOR_MANAGEMENT,
    element: (
      <RoleGuard allowedRoles={['manajer']}>
        <VendorManagementPage />
      </RoleGuard>
    ),
  },
  {
    path: ROUTES.MANAJER_LAPORAN,
    element: (
      <RoleGuard allowedRoles={['manajer']}>
        <LaporanPage />
      </RoleGuard>
    ),
  },

  // ── Utility routes (placeholder — halaman belum diimplementasi) ───────────
  {
    path: ROUTES.UTILITY_ROOT,
    element: (
      <RoleGuard allowedRoles={['utility']}>
        <div className="flex items-center justify-center min-h-screen bg-mottago-surface-subtle">
          <p className="text-sm text-text-secondary">Halaman Utility — segera hadir.</p>
        </div>
      </RoleGuard>
    ),
  },

  // ── Fallback ───────────────────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to={ROUTES.NOT_FOUND} replace />,
  },
]);

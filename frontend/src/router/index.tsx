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
import NotifikasiPage from '../pages/manajer/NotifikasiPage';
import RiwayatPickupPage from '../pages/manajer/RiwayatPickupPage';
import UtilityDashboardPage from '../pages/utility/UtilityDashboardPage';
import CatatSampahPage from '../pages/utility/CatatSampahPage';
import RiwayatInputPage from '../pages/utility/RiwayatInputPage';
import ProfilPage from '../pages/utility/ProfilPage';

export const router = createBrowserRouter([
  // ── Public routes ─────────────────────────────────────────────────────
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

  // ── Manajer routes ────────────────────────────────────────────
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
  {
    path: ROUTES.MANAJER_RIWAYAT_PICKUP,
    element: (
      <RoleGuard allowedRoles={['manajer']}>
        <RiwayatPickupPage />
      </RoleGuard>
    ),
  },
  {
    path: ROUTES.MANAJER_NOTIFICATIONS,
    element: (
      <RoleGuard allowedRoles={['manajer']}>
        <NotifikasiPage />
      </RoleGuard>
    ),
  },

  // ── Utility routes ─────────────────────────────────────────────────────
  {
    path: ROUTES.UTILITY_ROOT,
    element: (
      <RoleGuard allowedRoles={['utility']}>
        <UtilityDashboardPage />
      </RoleGuard>
    ),
  },
  {
    path: ROUTES.UTILITY_CATAT_WASTE,
    element: (
      <RoleGuard allowedRoles={['utility']}>
        <CatatSampahPage />
      </RoleGuard>
    ),
  },
  {
    path: ROUTES.UTILITY_RIWAYAT_INPUT,
    element: (
      <RoleGuard allowedRoles={['utility']}>
        <RiwayatInputPage />
      </RoleGuard>
    ),
  },
  {
    path: ROUTES.UTILITY_PROFIL,
    element: (
      <RoleGuard allowedRoles={['utility']}>
        <ProfilPage />
      </RoleGuard>
    ),
  },
  {
    path: ROUTES.MANAJER_PENGATURAN,
    element: (
      <RoleGuard allowedRoles={['manajer']}>
        <div className="flex items-center justify-center min-h-screen bg-mottago-surface-subtle">
          <p className="text-sm text-text-secondary">Pengaturan Store — segera hadir (Batch 2).</p>
        </div>
      </RoleGuard>
    ),
  },

  // ── Fallback ──────────────────────────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to={ROUTES.NOT_FOUND} replace />,
  },
]);

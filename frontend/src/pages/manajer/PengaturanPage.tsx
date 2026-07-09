import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Icon } from '../../components/atoms/Icon';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';

export default function PengaturanPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';

  return (
    <DashboardLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => navigate(ROUTES.MANAJER_NOTIFICATIONS)}
    >
      <div className="min-h-full bg-mottago-surface-subtle flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-mottago-surface border border-mottago-border">
            <Icon name="Settings" size={24} className="text-text-secondary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-text-primary">Pengaturan Store</h1>
            <p className="text-sm text-text-secondary">
              Fitur pengaturan store akan tersedia pada Sprint C (integrasi database).
            </p>
          </div>
          <p className="text-xs text-text-disabled">
            Konfigurasi kapasitas maksimum, jam operasional, dan informasi store akan dikelola di
            sini.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

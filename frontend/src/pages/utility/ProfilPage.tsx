import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../components/atoms/Button';
import { Divider } from '../../components/atoms/Divider';
import { utilityNavItems } from '../../router/navigation';
import { useAuth } from '../../hooks/useAuth';

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase();

function formatLastLogin(isoString: string | undefined): string {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
}

export default function ProfilPage() {
  const { profile, logout, session } = useAuth();
  const userName = profile?.fullName ?? 'Utility';
  const lastLogin = formatLastLogin(session?.user.last_sign_in_at ?? undefined);

  return (
    <DashboardLayout
      navItems={utilityNavItems}
      userRole="utility"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => {}}
    >
      <div className="min-h-full bg-mottago-surface-subtle flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-accent-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-on-dark">{getInitials(userName)}</span>
          </div>

          <p className="mt-4 text-lg font-semibold text-text-primary">{profile?.fullName ?? '—'}</p>
          <p className="text-sm text-text-secondary">{profile?.username ?? '—'}</p>
          <p className="text-sm text-text-secondary mt-1">Utility</p>
          <p className="text-sm text-text-secondary">
            {profile?.storeId != null ? String(profile.storeId) : '—'}
          </p>
          <p className="text-xs text-text-secondary mt-2">Terakhir masuk: {lastLogin}</p>

          <Divider className="my-4 w-full" />

          <Button
            variant="danger"
            leftIcon="LogOut"
            onClick={logout}
            className="w-full justify-center"
          >
            Keluar dari Akun
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

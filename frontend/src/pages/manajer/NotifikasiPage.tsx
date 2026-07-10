import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Badge } from '../../components/atoms/Badge';
import { Icon } from '../../components/atoms/Icon';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import type { Notification } from '../../services/notificationService';

const TYPE_LABEL: Record<Notification['type'], string> = {
  capacity_alert: 'Alert Kapasitas',
  pickup_status: 'Status Pickup',
  system: 'Sistem',
};

const TYPE_ICON: Record<Notification['type'], string> = {
  capacity_alert: 'Gauge',
  pickup_status: 'Truck',
  system: 'Bell',
};

const SEVERITY_COLOR: Record<
  NonNullable<Notification['severity']> | 'default',
  'danger' | 'warning' | 'info' | 'neutral'
> = {
  critical: 'danger',
  warning: 'warning',
  info: 'info',
  default: 'neutral',
};

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotifikasiPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';
  const storeId = profile?.storeId ?? null;

  const { notifications, unreadCount, loading, markAsRead } = useNotification(storeId ?? 0);

  if (!storeId) {
    return (
      <DashboardLayout
        navItems={manajerNavItems}
        userRole="manajer"
        userName={userName}
        onLogout={logout}
        onNotificationClick={() => navigate(ROUTES.MANAJER_NOTIFICATIONS)}
      >
        <div className="flex items-center justify-center p-8 text-text-secondary">
          <p>Store tidak ditemukan. Hubungi administrator.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => navigate(ROUTES.MANAJER_NOTIFICATIONS)}
    >
      <div className="min-h-full bg-mottago-surface-subtle">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-text-primary">Notifikasi</h1>
            <p className="text-sm text-text-secondary mt-1">
              {unreadCount} belum dibaca dari {notifications.length} notifikasi
            </p>
          </div>

          {loading && notifications.length === 0 ? (
            <div className="p-8 text-text-secondary">Memuat data...</div>
          ) : notifications.length === 0 ? (
            <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-8 text-center text-text-secondary">
              Belum ada notifikasi
            </div>
          ) : (
            <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] divide-y divide-mottago-border">
              {notifications.map((notif) => {
                const severityColor = SEVERITY_COLOR[notif.severity ?? 'default'];
                return (
                  <button
                    key={notif.id}
                    type="button"
                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                    className={[
                      'w-full text-left px-4 py-4 md:px-6 flex items-start gap-3 transition-colors hover:bg-mottago-surface-subtle',
                      !notif.isRead && 'bg-accent-success-bg/20',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-mottago-surface-subtle shrink-0">
                      <Icon
                        name={TYPE_ICON[notif.type]}
                        size={16}
                        className="text-text-secondary"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-text-primary">
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <span
                            className="w-2 h-2 rounded-full bg-capacity-warning shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">{notif.body}</p>
                      <div className="flex items-center gap-2 flex-wrap pt-0.5">
                        <Badge color={severityColor} size="sm">
                          {TYPE_LABEL[notif.type]}
                        </Badge>
                        <span className="text-xs text-text-disabled">
                          {formatTimestamp(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Badge } from '../../components/atoms/Badge';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { usePickup } from '../../hooks/usePickup';
import type { Pickup, PickupStatus } from '../../types/pickup.types';
import { PICKUP_KATEGORI_COLOR, PICKUP_KATEGORI_LABEL } from '../../constants/waste';

const STATUS_COLOR: Record<PickupStatus, 'success' | 'danger' | 'warning' | 'info'> = {
  completed: 'success',
  cancelled: 'danger',
  waiting: 'warning',
  'in-transit': 'info',
};

const STATUS_LABEL: Record<PickupStatus, string> = {
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  waiting: 'Menunggu',
  'in-transit': 'Dalam Perjalanan',
};

function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function RiwayatPickupPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';
  const storeId = profile?.storeId ?? null;

  const { activePickups, pickupHistory, loading } = usePickup(storeId ?? 0);
  const allPickups: Pickup[] = [...activePickups, ...pickupHistory];

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
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Riwayat Pickup</h1>
            <p className="text-sm text-text-secondary mt-1">Total {allPickups.length} pickup</p>
          </div>

          {loading && allPickups.length === 0 ? (
            <div className="p-8 text-text-secondary">Memuat data...</div>
          ) : (
            <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="border-b border-mottago-border bg-mottago-surface-subtle">
                      <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Estimasi
                      </th>
                      <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mottago-border">
                    {allPickups.map((pickup) => (
                      <tr
                        key={pickup.id}
                        className="hover:bg-mottago-surface-subtle transition-colors"
                      >
                        <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                          <span className="text-sm text-text-primary">
                            {formatTanggal(pickup.requestedAt)}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span className="text-sm text-text-primary">{pickup.vendorName}</span>
                        </td>
                        <td className="px-3 py-3.5">
                          {pickup.wasteCategory ? (
                            <Badge color={PICKUP_KATEGORI_COLOR[pickup.wasteCategory]} size="sm">
                              {PICKUP_KATEGORI_LABEL[pickup.wasteCategory]}
                            </Badge>
                          ) : (
                            <span className="text-sm text-text-disabled">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span className="text-sm font-semibold text-text-primary tabular-nums">
                            {pickup.estimasiKg !== null ? `${pickup.estimasiKg} kg` : '—'}
                          </span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5">
                          <Badge color={STATUS_COLOR[pickup.status]} size="sm">
                            {STATUS_LABEL[pickup.status]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

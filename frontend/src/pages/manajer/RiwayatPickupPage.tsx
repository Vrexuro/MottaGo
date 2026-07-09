import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Badge } from '../../components/atoms/Badge';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { PICKUP_HISTORY } from '../../mock/pickup';
import type { PickupHistoryRecord } from '../../mock/pickup';
import { PICKUP_KATEGORI_COLOR, PICKUP_KATEGORI_LABEL } from '../../constants/waste';

const STATUS_COLOR: Record<
  PickupHistoryRecord['status'],
  'success' | 'danger' | 'warning' | 'info'
> = {
  completed: 'success',
  cancelled: 'danger',
  waiting: 'warning',
  'in-transit': 'info',
};

const STATUS_LABEL: Record<PickupHistoryRecord['status'], string> = {
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  waiting: 'Menunggu',
  'in-transit': 'Dalam Perjalanan',
};

export default function RiwayatPickupPage() {
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
      <div className="min-h-full bg-mottago-surface-subtle">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Riwayat Pickup</h1>
            <p className="text-sm text-text-secondary mt-1">Total {PICKUP_HISTORY.length} pickup</p>
          </div>

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
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Catatan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mottago-border">
                  {PICKUP_HISTORY.map((pickup) => (
                    <tr
                      key={pickup.id}
                      className="hover:bg-mottago-surface-subtle transition-colors"
                    >
                      <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-text-primary">{pickup.tanggal}</span>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-text-primary">{pickup.vendor}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <Badge color={PICKUP_KATEGORI_COLOR[pickup.kategori]} size="sm">
                          {PICKUP_KATEGORI_LABEL[pickup.kategori]}
                        </Badge>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-text-primary tabular-nums">
                          {pickup.estimasiKg} kg
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <Badge color={STATUS_COLOR[pickup.status]} size="sm">
                          {STATUS_LABEL[pickup.status]}
                        </Badge>
                      </td>
                      <td className="px-4 md:px-5 py-3.5">
                        <span className="text-sm text-text-secondary">{pickup.catatan}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

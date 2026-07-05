import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Badge } from '../../components/atoms/Badge';
import { utilityNavItems } from '../../router/navigation';
import { useAuth } from '../../hooks/useAuth';
import { UTILITY_ENTRIES } from '../../mock/utility';
import type { WasteCategoryDb } from '../../mock/utility';

const UNIT_MAP: Record<WasteCategoryDb, string> = {
  organik: 'kg',
  anorganik: 'kg',
  minyak: 'liter',
};
const LABEL_MAP: Record<WasteCategoryDb, string> = {
  organik: 'Organik',
  anorganik: 'Anorganik',
  minyak: 'Minyak Jelantah',
};
const STATUS_COLOR: Record<WasteCategoryDb, 'success' | 'warning' | 'info'> = {
  organik: 'success',
  anorganik: 'info',
  minyak: 'warning',
};

export default function RiwayatInputPage() {
  const { profile, logout } = useAuth();
  const userName = profile?.fullName ?? 'Utility';

  return (
    <DashboardLayout
      navItems={utilityNavItems}
      userRole="utility"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => {}}
    >
      <div className="min-h-full bg-mottago-surface-subtle">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Riwayat Input Sampah</h1>
            <p className="text-sm text-text-secondary mt-1">Total {UTILITY_ENTRIES.length} entri</p>
          </div>

          <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-mottago-border bg-mottago-surface-subtle">
                    <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Dicatat Oleh
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mottago-border">
                  {UTILITY_ENTRIES.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-mottago-surface-subtle transition-colors"
                    >
                      <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-text-secondary">{index + 1}</span>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-text-primary">{entry.tanggal}</span>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-text-secondary">{entry.waktu}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <Badge color={STATUS_COLOR[entry.kategori]} size="sm">
                          {LABEL_MAP[entry.kategori]}
                        </Badge>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-text-primary tabular-nums">
                          {entry.kuantitas} {UNIT_MAP[entry.kategori]}
                        </span>
                      </td>
                      <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-text-secondary">{entry.dicatatOleh}</span>
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

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Badge } from '../../components/atoms/Badge';
import { utilityNavItems } from '../../router/navigation';
import { useAuth } from '../../hooks/useAuth';
import { wasteService } from '../../services/wasteService';
import { WASTE_UNIT_MAP, WASTE_LABEL_MAP, WASTE_BADGE_COLOR } from '../../constants/waste';

function formatTanggalWaktu(iso: string): { tanggal: string; waktu: string } {
  const d = new Date(iso);
  return {
    tanggal: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    waktu: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function RiwayatInputPage() {
  const { profile, logout } = useAuth();
  const userName = profile?.fullName ?? 'Utility';
  const storeId = profile?.storeId ?? null;

  const [entries, setEntries] = useState<Awaited<ReturnType<typeof wasteService.getWasteHistory>>>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;
    setLoading(true);
    wasteService.getWasteHistory(storeId).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [storeId]);

  if (!storeId) {
    return (
      <DashboardLayout
        navItems={utilityNavItems}
        userRole="utility"
        userName={userName}
        onLogout={logout}
        onNotificationClick={() => {}}
      >
        <div className="flex items-center justify-center p-8 text-text-secondary">
          <p>Store tidak ditemukan. Hubungi administrator.</p>
        </div>
      </DashboardLayout>
    );
  }

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
            <p className="text-sm text-text-secondary mt-1">Total {entries.length} entri</p>
          </div>

          {loading && entries.length === 0 ? (
            <div className="p-8 text-text-secondary">Memuat data...</div>
          ) : (
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
                    {entries.map((entry, index) => {
                      const { tanggal, waktu } = formatTanggalWaktu(entry.createdAt);
                      return (
                        <tr
                          key={entry.id}
                          className="hover:bg-mottago-surface-subtle transition-colors"
                        >
                          <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                            <span className="text-sm text-text-secondary">{index + 1}</span>
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <span className="text-sm text-text-primary">{tanggal}</span>
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <span className="text-sm text-text-secondary">{waktu}</span>
                          </td>
                          <td className="px-3 py-3.5">
                            <Badge color={WASTE_BADGE_COLOR[entry.wasteType]} size="sm">
                              {WASTE_LABEL_MAP[entry.wasteType]}
                            </Badge>
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <span className="text-sm font-semibold text-text-primary tabular-nums">
                              {entry.quantity} {WASTE_UNIT_MAP[entry.wasteType]}
                            </span>
                          </td>
                          <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                            <span className="text-sm text-text-secondary">
                              {entry.recordedByName ?? (entry.recordedBy ? '—' : 'Sistem')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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

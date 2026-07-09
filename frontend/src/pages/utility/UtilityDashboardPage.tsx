import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { DashboardHeader } from '../../components/molecules/DashboardHeader';
import { KpiCard } from '../../components/molecules/KpiCard';
import { Button } from '../../components/atoms/Button';
import { Badge } from '../../components/atoms/Badge';
import { useNavigate } from 'react-router-dom';
import { utilityNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { getEntries, getTodaySummary, subscribeUtility } from '../../mock/utilityStore';
import { WASTE_UNIT_MAP, WASTE_LABEL_MAP, WASTE_BADGE_COLOR } from '../../constants/waste';

export default function UtilityDashboardPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Utility';

  const [entries, setEntries] = useState(() => getEntries());
  const [todaySummary, setTodaySummary] = useState(() => getTodaySummary());

  useEffect(() => {
    const unsub = subscribeUtility(() => {
      setEntries(getEntries());
      setTodaySummary(getTodaySummary());
    });
    return unsub;
  }, []);

  const recentEntries = entries.slice(0, 3);
  const kapasitasPct = todaySummary.kapasitasPct;
  const kapasitasAccent: 'success' | 'warning' | 'orange' =
    kapasitasPct >= 90 ? 'orange' : kapasitasPct >= 60 ? 'warning' : 'success';

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
          <DashboardHeader title="Dashboard" userName={userName} />

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Entri Hari Ini"
              iconName="PenLine"
              accent="success"
              value={String(todaySummary.totalEntri)}
              unit="entri"
            />
            <KpiCard
              label="Total Sampah"
              iconName="Scale"
              accent="success"
              value={String(todaySummary.totalKg)}
              unit="kg"
            />
            <KpiCard
              label="Pickup Aktif"
              iconName="Truck"
              accent="orange"
              value={String(todaySummary.pickupAktif)}
              unit="aktif"
            />
            <KpiCard
              label="Kapasitas Terpakai"
              iconName="Gauge"
              accent={kapasitasAccent}
              value={`${kapasitasPct}%`}
              subtexts={[`${todaySummary.kapasitasKg} kg dari ${todaySummary.maxKg} kg`]}
            />
          </div>

          {/* Shortcut Catat Sampah */}
          <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-4 md:p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">Catat Sampah Baru</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Tambahkan entri sampah untuk shift ini
              </p>
            </div>
            <Button
              variant="primary"
              leftIcon="PenLine"
              onClick={() => navigate(ROUTES.UTILITY_CATAT_WASTE)}
            >
              Catat Sekarang
            </Button>
          </div>

          {/* Riwayat Input Terbaru */}
          <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 md:px-5 md:pt-5">
              <h3 className="text-sm font-semibold text-text-primary">Riwayat Input Terbaru</h3>
              <button
                type="button"
                onClick={() => navigate(ROUTES.UTILITY_RIWAYAT_INPUT)}
                className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Lihat Semua →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr className="border-b border-t border-mottago-border bg-mottago-surface-subtle">
                    <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
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
                  {recentEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-mottago-surface-subtle transition-colors"
                    >
                      <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-text-secondary">{entry.waktu}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <Badge color={WASTE_BADGE_COLOR[entry.kategori]} size="sm">
                          {WASTE_LABEL_MAP[entry.kategori]}
                        </Badge>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-text-primary tabular-nums">
                          {entry.kuantitas} {WASTE_UNIT_MAP[entry.kategori]}
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

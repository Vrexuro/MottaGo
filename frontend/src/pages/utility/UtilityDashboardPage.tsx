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
import { useWaste } from '../../hooks/useWaste';
import { useCapacity } from '../../hooks/useCapacity';
import { usePickup } from '../../hooks/usePickup';
import { wasteService } from '../../services/wasteService';
import { WASTE_UNIT_MAP, WASTE_LABEL_MAP, WASTE_BADGE_COLOR } from '../../constants/waste';

function formatWaktu(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function UtilityDashboardPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Utility';
  const storeId = profile?.storeId ?? null;

  const { today, loading: wasteLoading } = useWaste(storeId ?? 0);
  const { currentCapacity, loading: capacityLoading } = useCapacity(storeId ?? 0);
  const { activePickups, loading: pickupLoading } = usePickup(storeId ?? 0);
  const [recentEntries, setRecentEntries] = useState<
    Awaited<ReturnType<typeof wasteService.getWasteHistory>>
  >([]);

  useEffect(() => {
    if (!storeId) return;
    wasteService.getWasteHistory(storeId, 3).then(setRecentEntries);
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

  const totalEntri = today?.entryCount ?? 0;
  const totalKg = today?.totalKg ?? 0;
  const totalLiter = today?.totalLiter ?? 0;
  const kapasitasKg = currentCapacity?.currentKg ?? 0;
  const maxKg = currentCapacity?.maxKg ?? 0;
  const kapasitasPct = maxKg > 0 ? Math.round((kapasitasKg / maxKg) * 100) : 0;
  const kapasitasAccent: 'success' | 'warning' | 'orange' =
    kapasitasPct >= 90 ? 'orange' : kapasitasPct >= 60 ? 'warning' : 'success';
  const pickupAktif = activePickups.length;
  const loading = wasteLoading || capacityLoading || pickupLoading;

  if (loading) {
    return (
      <DashboardLayout
        navItems={utilityNavItems}
        userRole="utility"
        userName={userName}
        onLogout={logout}
        onNotificationClick={() => {}}
      >
        <div className="p-8 text-text-secondary">Memuat data...</div>
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
          <DashboardHeader title="Dashboard" userName={userName} />

          {/* 5 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <KpiCard
              label="Entri Hari Ini"
              iconName="PenLine"
              accent="success"
              value={String(totalEntri)}
              unit="entri"
            />
            <KpiCard
              label="Total Sampah"
              iconName="Scale"
              accent="success"
              value={String(totalKg)}
              unit="kg"
            />
            <KpiCard
              label="Total Minyak"
              iconName="Droplet"
              accent="warning"
              value={String(totalLiter)}
              unit="liter"
            />
            <KpiCard
              label="Pickup Aktif"
              iconName="Truck"
              accent="orange"
              value={String(pickupAktif)}
              unit="aktif"
            />
            <KpiCard
              label="Kapasitas Terpakai"
              iconName="Gauge"
              accent={kapasitasAccent}
              value={`${kapasitasPct}%`}
              subtexts={[`${kapasitasKg} kg dari ${maxKg} kg`]}
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
                        <span className="text-sm text-text-secondary">
                          {formatWaktu(entry.createdAt)}
                        </span>
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

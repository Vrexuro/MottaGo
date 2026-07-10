import { DashboardLayout } from '../../layouts/DashboardLayout';
import { DashboardHeader } from '../../components/molecules/DashboardHeader';
import { KpiCard } from '../../components/molecules/KpiCard';
import { WasteTrendCard } from '../../components/molecules/WasteTrendCard';
import { CapacityCard } from '../../components/molecules/CapacityCard';
import { StatusPickupCard } from '../../components/molecules/StatusPickupCard';
import { QuickActionsCard } from '../../components/molecules/QuickActionsCard';
import { PickupSummaryCard } from '../../components/molecules/PickupSummaryCard';
import { useNavigate } from 'react-router-dom';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { getCapacityStatus } from '../../constants/capacity';
import { useCapacity } from '../../hooks/useCapacity';
import { useWaste } from '../../hooks/useWaste';
import { usePickup } from '../../hooks/usePickup';
import { reportService } from '../../services/reportService';
import { useState, useEffect } from 'react';

function DashboardPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';
  const storeId = profile?.storeId ?? null;

  const { currentCapacity, loading: capacityLoading } = useCapacity(storeId ?? 0);
  const { today, loading: wasteLoading } = useWaste(storeId ?? 0);
  const {
    activePickups,
    pickupHistory,
    summary: pickupSummary,
    loading: pickupLoading,
  } = usePickup(storeId ?? 0);

  const [wasteTrend, setWasteTrend] = useState<{ day: string; value: number }[]>([]);

  useEffect(() => {
    if (!storeId) return;
    reportService.getChartData(storeId, 7).then((data) => {
      setWasteTrend(
        data.map((p) => ({ day: p.minggu, value: p.organik + p.anorganik + p.minyak }))
      );
    });
  }, [storeId]);

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

  const loading = capacityLoading || wasteLoading || pickupLoading;
  const currentKg = currentCapacity?.currentKg ?? 0;
  const maxKg = currentCapacity?.maxKg ?? 0;
  const wasteHariIniKg = today?.totalKg ?? 0;
  const pct = maxKg > 0 ? Math.round((currentKg / maxKg) * 100) : 0;
  const status = getCapacityStatus(pct);
  const badgeColor =
    status === 'critical' ? 'danger' : status === 'warning' ? 'warning' : 'success';
  const badgeLabel = status === 'critical' ? 'Kritis' : status === 'warning' ? 'Perhatian' : 'Aman';

  const now = new Date();
  const pickupBulanIni = pickupHistory.filter((p) => {
    if (!p.completedAt) return false;
    const d = new Date(p.completedAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <DashboardLayout
        navItems={manajerNavItems}
        userRole="manajer"
        userName={userName}
        onLogout={logout}
        onNotificationClick={() => navigate(ROUTES.MANAJER_NOTIFICATIONS)}
      >
        <div className="p-8 text-text-secondary">Memuat data...</div>
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
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
          <DashboardHeader
            title="Dashboard"
            userName={userName}
            onDateClick={() => navigate(ROUTES.MANAJER_LAPORAN)}
          />

          {/* Row 1 — 4 KPI Cards: 2 col mobile → 4 col tablet+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Waste Masuk Hari Ini"
              iconName="Scale"
              accent="success"
              value={String(wasteHariIniKg).replace('.', ',')}
              unit="kg"
              trend={{ direction: 'up', label: '+12% vs kemarin', positive: true }}
            />
            <KpiCard
              label="Kapasitas Terpakai"
              iconName="Gauge"
              accent="warning"
              value={`${pct}%`}
              badge={{ label: badgeLabel, color: badgeColor }}
              subtexts={[`${currentKg} kg dari ${maxKg} kg`]}
            />
            <KpiCard
              label="Pickup Aktif"
              iconName="Truck"
              accent="orange"
              value={String(activePickups.length)}
              valueAccent
              subtexts={[
                `${pickupSummary?.waiting ?? 0} menunggu`,
                `${pickupSummary?.inTransit ?? 0} dalam perjalanan`,
              ]}
            />
            <KpiCard
              label="Pickup Bulan Ini"
              iconName="CalendarCheck"
              accent="success"
              value={String(pickupBulanIni)}
              valueAccent
            />
          </div>

          {/* Row 2 — 60/40: Kapasitas Waste Store | Status Pickup */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <CapacityCard currentKg={currentKg} maxKg={maxKg} className="w-full h-full" />
            </div>
            <div className="md:col-span-2">
              <StatusPickupCard
                waiting={pickupSummary?.waiting ?? 0}
                inTransit={pickupSummary?.inTransit ?? 0}
                completedToday={pickupSummary?.completedToday ?? 0}
                className="w-full h-full"
                onLihatSemua={() => navigate(ROUTES.MANAJER_RIWAYAT_PICKUP)}
              />
            </div>
          </div>

          {/* Row 3 — 60/40: Tren Waste | Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <WasteTrendCard className="w-full h-full" trend={wasteTrend} />
            </div>
            <div className="md:col-span-2">
              <QuickActionsCard className="w-full h-full" />
            </div>
          </div>

          {/* Row 4 — Full-width: Pickup Summary Table */}
          <PickupSummaryCard
            pickups={activePickups}
            onLihatSemua={() => navigate(ROUTES.MANAJER_RIWAYAT_PICKUP)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;

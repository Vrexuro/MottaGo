import { useState, useEffect } from 'react';
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
import { getManagerState, subscribeManager } from '../../mock/managerStore';
import { getCapacityStatus } from '../../constants/capacity';

function DashboardPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';

  const [mgr, setMgr] = useState(() => getManagerState());

  useEffect(() => {
    return subscribeManager(() => setMgr(getManagerState()));
  }, []);

  const pct = Math.round((mgr.kapasitas.currentKg / mgr.kapasitas.maxKg) * 100);
  const status = getCapacityStatus(pct);
  const badgeColor =
    status === 'critical' ? 'danger' : status === 'warning' ? 'warning' : 'success';
  const badgeLabel = status === 'critical' ? 'Kritis' : status === 'warning' ? 'Perhatian' : 'Aman';

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
              value={String(mgr.wasteHariIni.totalKg).replace('.', ',')}
              unit="kg"
              trend={{ direction: 'up', label: '+12% vs kemarin', positive: true }}
            />
            <KpiCard
              label="Kapasitas Terpakai"
              iconName="Gauge"
              accent="warning"
              value={`${pct}%`}
              badge={{ label: badgeLabel, color: badgeColor }}
              subtexts={[`${mgr.kapasitas.currentKg} kg dari ${mgr.kapasitas.maxKg} kg`]}
            />
            <KpiCard
              label="Pickup Aktif"
              iconName="Truck"
              accent="orange"
              value={String(mgr.pickupAktif)}
              valueAccent
              subtexts={[
                `${mgr.pickup.waiting} menunggu`,
                `${mgr.pickup.inTransit} dalam perjalanan`,
              ]}
            />
            <KpiCard
              label="Pickup Bulan Ini"
              iconName="CalendarCheck"
              accent="success"
              value={String(mgr.pickupBulanIni)}
              valueAccent
              trend={{ direction: 'up', label: '+6 vs bulan lalu', positive: true }}
            />
          </div>

          {/* Row 2 — 60/40: Kapasitas Waste Store | Status Pickup */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <CapacityCard
                currentKg={mgr.kapasitas.currentKg}
                maxKg={mgr.kapasitas.maxKg}
                className="w-full h-full"
              />
            </div>
            <div className="md:col-span-2">
              <StatusPickupCard
                waiting={mgr.pickup.waiting}
                inTransit={mgr.pickup.inTransit}
                completedToday={mgr.pickup.completedToday}
                className="w-full h-full"
                onLihatSemua={() => navigate(ROUTES.MANAJER_RIWAYAT_PICKUP)}
              />
            </div>
          </div>

          {/* Row 3 — 60/40: Tren Waste | Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <WasteTrendCard className="w-full h-full" />
            </div>
            <div className="md:col-span-2">
              <QuickActionsCard className="w-full h-full" />
            </div>
          </div>

          {/* Row 4 — Full-width: Pickup Summary Table */}
          <PickupSummaryCard onLihatSemua={() => navigate(ROUTES.MANAJER_RIWAYAT_PICKUP)} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;

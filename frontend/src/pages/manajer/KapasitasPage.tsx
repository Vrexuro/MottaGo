import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../components/atoms/Button';
import { CapacityGaugePanel } from '../../components/molecules/CapacityGaugePanel';
import { CapacitySummaryStats } from '../../components/molecules/CapacitySummaryStats';
import { CapacityTrendCard } from '../../components/molecules/CapacityTrendCard';
import { CategoryBreakdownCard } from '../../components/molecules/CategoryBreakdownCard';
import { StatusThresholdCard } from '../../components/molecules/StatusThresholdCard';
import { CapacityAlertHistoryCard } from '../../components/molecules/CapacityAlertHistoryCard';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { getManagerState, subscribeManager } from '../../mock/managerStore';

function KapasitasPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';

  const [mgr, setMgr] = useState(() => getManagerState());

  useEffect(() => {
    return subscribeManager(() => setMgr(getManagerState()));
  }, []);

  return (
    <DashboardLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => navigate(ROUTES.MANAJER_NOTIFICATIONS)}
    >
      <div className="min-h-full bg-mottago-surface-subtle">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* ── Row 1: Page Header + Filter Bar ─────────────── */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-mottago-border">
            {/* Left: Title + polling subtitle */}
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="text-2xl font-semibold text-text-primary leading-tight">
                Monitoring Kapasitas
              </h1>
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="shrink-0 w-1.5 h-1.5 rounded-full bg-capacity-normal animate-pulse"
                />
                <p className="text-[13px] text-text-secondary">
                  Data real-time · diperbarui 30 detik
                </p>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                leftIcon="Truck"
                onClick={() => navigate(ROUTES.MANAJER_PICKUP_REQUEST)}
              >
                Request Pickup
              </Button>
            </div>
          </div>

          {/* ── Row 2: Capacity Overview 60/40 ───────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <CapacityGaugePanel
                currentKg={mgr.kapasitas.currentKg}
                maxKg={mgr.kapasitas.maxKg}
                lastUpdated={mgr.kapasitas.lastUpdated}
                className="h-full"
              />
            </div>
            <div className="lg:col-span-2">
              <CapacitySummaryStats
                maxKg={mgr.kapasitas.maxKg}
                currentKg={mgr.kapasitas.currentKg}
                wasteHariIniKg={mgr.wasteHariIni.totalKg}
                rataHarianKg={mgr.wasteHariIni.rataHarianKg}
                className="h-full"
              />
            </div>
          </div>

          {/* ── Row 3: Capacity Trend Chart ──────────────────── */}
          <CapacityTrendCard className="min-h-[320px]" />

          {/* ── Row 4: Category Breakdown 50% + Threshold 50% ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBreakdownCard
              organik={mgr.kategori.organik}
              anorganik={mgr.kategori.anorganik}
              minyak={mgr.kategori.minyak}
              className="min-h-[240px]"
            />
            <StatusThresholdCard />
          </div>

          {/* ── Row 5: Alert History ──────────────────────────── */}
          <CapacityAlertHistoryCard />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default KapasitasPage;

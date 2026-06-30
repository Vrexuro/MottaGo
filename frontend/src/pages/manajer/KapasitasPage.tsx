import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../components/atoms/Button';
import { SelectInput } from '../../components/atoms/SelectInput';
import { CapacityGaugePanel } from '../../components/molecules/CapacityGaugePanel';
import { CapacitySummaryStats } from '../../components/molecules/CapacitySummaryStats';
import { CapacityTrendCard } from '../../components/molecules/CapacityTrendCard';
import { CategoryBreakdownCard } from '../../components/molecules/CategoryBreakdownCard';
import { StatusThresholdCard } from '../../components/molecules/StatusThresholdCard';
import { CapacityAlertHistoryCard } from '../../components/molecules/CapacityAlertHistoryCard';
import { manajerNavItems } from '../../router/navigation';
import type { SelectOption } from '../../types/common.types';

const STORE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Semua Store' },
  { value: 'store-1', label: 'Store Pusat' },
  { value: 'store-2', label: 'Store Cabang 1' },
];

function KapasitasPage() {
  return (
    <DashboardLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName="Mock Manajer"
      onLogout={() => undefined}
    >
      <div className="min-h-full bg-mottago-surface-subtle">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* ── Row 1: Page Header + Filter Bar ─────────────── */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-mottago-border">
            {/* Left: Title + polling subtitle */}
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="text-2xl font-bold text-text-primary leading-tight">
                Monitoring Kapasitas
              </h1>
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"
                />
                <p className="text-[13px] text-text-secondary">
                  Data real-time · diperbarui 30 detik
                </p>
              </div>
            </div>

            {/* Right: Store selector + CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-text-secondary whitespace-nowrap hidden md:block">
                Store:
              </span>
              <div className="w-[160px] md:w-[200px]">
                <SelectInput options={STORE_OPTIONS} defaultValue="all" aria-label="Pilih Store" />
              </div>
              <Button variant="primary" leftIcon="Truck">
                Request Pickup
              </Button>
            </div>
          </div>

          {/* ── Row 2: Capacity Overview 60/40 ───────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <CapacityGaugePanel className="h-full" />
            </div>
            <div className="lg:col-span-2">
              <CapacitySummaryStats className="h-full" />
            </div>
          </div>

          {/* ── Row 3: Capacity Trend Chart ──────────────────── */}
          <CapacityTrendCard className="min-h-[320px]" />

          {/* ── Row 4: Category Breakdown 50% + Threshold 50% ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBreakdownCard className="min-h-[280px]" />
            <StatusThresholdCard className="min-h-[280px]" />
          </div>

          {/* ── Row 5: Recent Capacity Alerts ────────────────── */}
          <CapacityAlertHistoryCard />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default KapasitasPage;

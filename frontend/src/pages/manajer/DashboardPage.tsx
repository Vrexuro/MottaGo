import { DashboardLayout } from '../../layouts/DashboardLayout';
import { DashboardHeader } from '../../components/molecules/DashboardHeader';
import { KpiCard } from '../../components/molecules/KpiCard';
import { WasteTrendCard } from '../../components/molecules/WasteTrendCard';
import { CapacityCard } from '../../components/molecules/CapacityCard';
import { StatusPickupCard } from '../../components/molecules/StatusPickupCard';
import { QuickActionsCard } from '../../components/molecules/QuickActionsCard';
import { PickupSummaryCard } from '../../components/molecules/PickupSummaryCard';
import { Icon } from '../../components/atoms/Icon';
import { manajerNavItems } from '../../router/navigation';

const TODAY_LABEL = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function DashboardPage() {
  return (
    <DashboardLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName="Mock Manajer"
      onLogout={() => undefined}
    >
      <div className="min-h-full bg-mottago-surface-subtle">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Mobile-only date row — above heading, hidden on tablet+ */}
          <div className="flex md:hidden items-center gap-1.5 text-text-secondary">
            <Icon name="CalendarDays" size={16} className="shrink-0" />
            <span className="text-xs font-medium">{TODAY_LABEL}</span>
          </div>

          {/* Page heading row: title+subtitle (left) | date with calendar icon (right, tablet+) */}
          <div className="flex items-start justify-between gap-4">
            <DashboardHeader
              title="Dashboard"
              subtitle="Semua operasional berjalan normal. Tidak ada tindakan mendesak saat ini."
            />
            <div className="hidden md:flex items-center gap-1.5 text-text-secondary shrink-0 pt-1.5">
              <Icon name="CalendarDays" size={16} className="shrink-0" />
              <span className="text-xs font-medium whitespace-nowrap">{TODAY_LABEL}</span>
            </div>
          </div>

          {/* Row 1 — 4 KPI Cards: 2 col mobile → 4 col tablet+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Waste Masuk Hari Ini"
              iconName="Scale"
              accent="success"
              value="47,3"
              unit="kg"
              trend={{ direction: 'up', label: '+12% vs kemarin', positive: true }}
            />
            <KpiCard
              label="Kapasitas Terpakai"
              iconName="Gauge"
              accent="warning"
              value="66%"
              badge={{ label: 'Perhatian', color: 'warning' }}
              subtexts={['263 kg dari 400 kg']}
            />
            <KpiCard
              label="Pickup Aktif"
              iconName="Truck"
              accent="orange"
              value="3"
              valueAccent
              subtexts={['2 pending', '1 dalam perjalanan']}
            />
            <KpiCard
              label="Pickup Bulan Ini"
              iconName="CalendarCheck"
              accent="success"
              value="24"
              valueAccent
              trend={{ direction: 'up', label: '+6 vs bulan lalu', positive: true }}
            />
          </div>

          {/* Row 2 — 60/40: Kapasitas Waste Store | Status Pickup */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <CapacityCard className="w-full h-full" />
            </div>
            <div className="md:col-span-2">
              <StatusPickupCard className="w-full h-full" />
            </div>
          </div>

          {/* Row 3 — 60/40: Tren Waste | Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <WasteTrendCard className="w-full" />
            </div>
            <div className="md:col-span-2">
              <QuickActionsCard className="w-full h-full" />
            </div>
          </div>

          {/* Row 4 — Full-width: Pickup Summary */}
          <PickupSummaryCard className="w-full" />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;

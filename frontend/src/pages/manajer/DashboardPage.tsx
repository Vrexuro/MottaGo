import { DashboardLayout } from '../../layouts/DashboardLayout';
import { manajerNavItems } from '../../router/navigation';

type PlaceholderPanelProps = {
  label: string;
  className?: string;
};

function PlaceholderPanel({ label, className = '' }: PlaceholderPanelProps) {
  const base =
    'bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-4 flex items-center justify-center';
  return (
    <div className={`${base} ${className}`}>
      <span className="text-sm font-medium text-text-secondary">{label}</span>
    </div>
  );
}

function DashboardPage() {
  return (
    <DashboardLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName="Mock Manajer"
      onLogout={() => undefined}
    >
      <div className="min-h-full bg-mottago-surface-subtle p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">Ringkasan operasional — Hari ini</p>
        </div>

        {/* Row 1 — 4 KPI areas: 2 col mobile → 4 col tablet+ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PlaceholderPanel label="KPI Area 1" className="min-h-[120px]" />
          <PlaceholderPanel label="KPI Area 2" className="min-h-[120px]" />
          <PlaceholderPanel label="KPI Area 3" className="min-h-[120px]" />
          <PlaceholderPanel label="KPI Area 4" className="min-h-[120px]" />
        </div>

        {/* Row 2 — 60/40: Waste Trend | Capacity — stacked mobile → split tablet+ */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-3">
            <PlaceholderPanel label="Waste Trend Area" className="min-h-[280px] w-full" />
          </div>
          <div className="md:col-span-2">
            <PlaceholderPanel label="Capacity Area" className="min-h-[280px] w-full" />
          </div>
        </div>

        {/* Row 3 — 60/40: Pickup Summary | Quick Actions — stacked mobile → split tablet+ */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-3">
            <PlaceholderPanel label="Pickup Summary Area" className="min-h-[220px] w-full" />
          </div>
          <div className="md:col-span-2">
            <PlaceholderPanel label="Quick Actions Area" className="min-h-[220px] w-full" />
          </div>
        </div>

        {/* Row 4 — Full-width: Pickup Table */}
        <PlaceholderPanel label="Pickup Table Area" className="min-h-[200px]" />
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;

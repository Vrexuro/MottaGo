import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { KpiCard } from '../../components/molecules/KpiCard';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { CHART_7D, CHART_30D, CHART_90D, KPI_7D, KPI_30D, KPI_90D } from '../../mock/report';
import type { ReportKpi, WeeklyChartPoint } from '../../mock/report';

const getCSSVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

type Period = '7d' | '30d' | '90d';

const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 Hari',
  '30d': '30 Hari',
  '90d': '90 Hari',
};

const PERIOD_CHART: Record<Period, WeeklyChartPoint[]> = {
  '7d': CHART_7D,
  '30d': CHART_30D,
  '90d': CHART_90D,
};

const PERIOD_KPI: Record<Period, ReportKpi> = {
  '7d': KPI_7D,
  '30d': KPI_30D,
  '90d': KPI_90D,
};

export default function LaporanPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';

  const [period, setPeriod] = useState<Period>('30d');
  const currentKpi = PERIOD_KPI[period];
  const currentChart = PERIOD_CHART[period];

  return (
    <DashboardLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => navigate(ROUTES.MANAJER_NOTIFICATIONS)}
    >
      <div className="min-h-full bg-mottago-surface-subtle">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-lg font-semibold text-text-primary">Laporan Sampah</h1>
            <div className="flex items-center gap-3">
              {(['7d', '30d', '90d'] as Period[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={[
                    'text-xs transition-colors',
                    period === p
                      ? 'text-text-primary font-semibold'
                      : 'text-text-secondary hover:text-text-primary',
                  ].join(' ')}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Total Sampah"
              iconName="Scale"
              accent="success"
              value={String(currentKpi.totalSampahKg)}
              unit="kg"
            />
            <KpiCard
              label="Total Pickup"
              iconName="Truck"
              accent="orange"
              value={String(currentKpi.totalPickup)}
              unit="pickup"
            />
            <KpiCard
              label="Rata Harian"
              iconName="TrendingUp"
              accent="warning"
              value={String(currentKpi.rataHarianKg)}
              unit="kg/hari"
            />
            <KpiCard
              label="Efisiensi"
              iconName="Gauge"
              accent="success"
              value={`${currentKpi.efisiensiPct}%`}
            />
          </div>

          <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-4 md:p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={currentChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="minggu" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v: number) => `${v} kg`} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="organik"
                  name="Organik"
                  stackId="a"
                  fill={getCSSVar('--color-accent-primary')}
                />
                <Bar
                  dataKey="anorganik"
                  name="Anorganik"
                  stackId="a"
                  fill={getCSSVar('--color-info-text')}
                />
                <Bar
                  dataKey="minyak"
                  name="Minyak Jelantah"
                  stackId="a"
                  fill={getCSSVar('--color-capacity-warning')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

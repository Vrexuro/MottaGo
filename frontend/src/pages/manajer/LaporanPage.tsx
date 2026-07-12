import { useState, useEffect } from 'react';
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
import { Button } from '../../components/atoms/Button';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { useReport } from '../../hooks/useReport';
import { reportService } from '../../services/reportService';
import type { StoreInfo } from '../../services/reportService';
import { exportLaporanPdf } from '../../lib/pdfExport';

const getCSSVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const CSS_BAR_ORGANIK = getCSSVar('--color-accent-primary');
const CSS_BAR_ANORGANIK = getCSSVar('--color-info-text');
const CSS_BAR_MINYAK = getCSSVar('--color-capacity-warning');

type Period = '7d' | '30d' | '90d';

const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 Hari',
  '30d': '30 Hari',
  '90d': '90 Hari',
};

const PERIOD_DAYS: Record<Period, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

export default function LaporanPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';
  const storeId = profile?.storeId ?? null;

  const [period, setPeriod] = useState<Period>('30d');
  const { kpi, chartData, loading, error } = useReport(storeId ?? 0, PERIOD_DAYS[period]);

  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!storeId) return;
    reportService.getStoreInfo(storeId).then(setStoreInfo);
  }, [storeId]);

  const handleExportPdf = () => {
    if (!kpi) return;
    setIsExporting(true);
    try {
      exportLaporanPdf({
        storeName: storeInfo?.name ?? `Store #${storeId}`,
        city: storeInfo?.city ?? '—',
        periodLabel: PERIOD_LABELS[period],
        generatedBy: userName,
        kpi,
        chartData,
      });
    } finally {
      setIsExporting(false);
    }
  };

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
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-2xl font-semibold text-text-primary">Laporan Sampah</h1>
            <div className="flex items-center gap-4">
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
              <Button
                variant="secondary"
                size="sm"
                leftIcon="FileDown"
                loading={isExporting}
                disabled={!kpi || loading}
                onClick={handleExportPdf}
              >
                Ekspor PDF
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-error-text">{error}</p>}

          {loading && !kpi ? (
            <div className="p-8 text-text-secondary">Memuat data...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard
                  label="Total Sampah"
                  iconName="Scale"
                  accent="success"
                  value={String(kpi?.totalSampahKg ?? 0)}
                  unit="kg"
                />
                <KpiCard
                  label="Total Pickup"
                  iconName="Truck"
                  accent="orange"
                  value={String(kpi?.totalPickup ?? 0)}
                  unit="pickup"
                />
                <KpiCard
                  label="Rata Harian"
                  iconName="TrendingUp"
                  accent="warning"
                  value={String(kpi?.rataHarianKg ?? 0)}
                  unit="kg/hari"
                />
                <KpiCard
                  label="Efisiensi"
                  iconName="Gauge"
                  accent="success"
                  value={`${kpi?.efisiensiPct ?? 0}%`}
                />
              </div>

              <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-4 md:p-6">
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-[280px] text-text-secondary text-sm">
                    Belum ada data untuk periode ini
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="minggu" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v: number) => `${v} kg`} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="organik" name="Organik" stackId="a" fill={CSS_BAR_ORGANIK} />
                      <Bar
                        dataKey="anorganik"
                        name="Anorganik"
                        stackId="a"
                        fill={CSS_BAR_ANORGANIK}
                      />
                      <Bar
                        dataKey="minyak"
                        name="Minyak Jelantah"
                        stackId="a"
                        fill={CSS_BAR_MINYAK}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

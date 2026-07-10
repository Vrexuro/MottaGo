import { useState, useEffect, useCallback } from 'react';
import { reportService, type ReportKpi, type ChartPoint } from '../services/reportService';

export interface UseReportReturn {
  kpi: ReportKpi | null;
  chartData: ChartPoint[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useReport(storeId: number, days: number): UseReportReturn {
  const [kpi, setKpi] = useState<ReportKpi | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([reportService.getKpi(storeId, days), reportService.getChartData(storeId, days)])
      .then(([kpiData, chart]) => {
        setKpi(kpiData);
        setChartData(chart);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Gagal memuat data laporan');
      })
      .finally(() => setLoading(false));
  }, [storeId, days]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { kpi, chartData, loading, error, refresh: fetchAll };
}

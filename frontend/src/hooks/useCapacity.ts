import { useState, useEffect, useCallback } from 'react';
import {
  capacityService,
  type CurrentCapacity,
  type CapacitySummary,
  type CapacityAlert,
  type CapacityTrendPoint,
  type CapacityTrendRange,
} from '../services/capacityService';

export interface UseCapacityReturn {
  currentCapacity: CurrentCapacity | null;
  summary: CapacitySummary | null;
  alertHistory: CapacityAlert[];
  trend: CapacityTrendPoint[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  fetchTrend: (range: CapacityTrendRange) => Promise<void>;
}

export function useCapacity(storeId: number): UseCapacityReturn {
  const [currentCapacity, setCurrentCapacity] = useState<CurrentCapacity | null>(null);
  const [summary, setSummary] = useState<CapacitySummary | null>(null);
  const [alertHistory, setAlertHistory] = useState<CapacityAlert[]>([]);
  const [trend, setTrend] = useState<CapacityTrendPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [capacity, summaryData, alerts] = await Promise.all([
        capacityService.getCurrentCapacity(storeId),
        capacityService.getCapacitySummary(storeId),
        capacityService.getCapacityAlertHistory(storeId),
      ]);
      setCurrentCapacity(capacity);
      setSummary(summaryData);
      setAlertHistory(alerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data kapasitas');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const fetchTrend = useCallback(
    async (range: CapacityTrendRange) => {
      try {
        const data = await capacityService.getCapacityTrend(storeId, range);
        setTrend(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat tren kapasitas');
      }
    },
    [storeId]
  );

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return {
    currentCapacity,
    summary,
    alertHistory,
    trend,
    loading,
    error,
    refresh: fetchAll,
    fetchTrend,
  };
}

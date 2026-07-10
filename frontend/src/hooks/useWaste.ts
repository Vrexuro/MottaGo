import { useState, useEffect, useCallback } from 'react';
import type { WasteCategory, WasteDailySummary, WasteTrendPoint } from '../types/waste.types';
import { wasteService, type WastePeriod, type WasteTrendRange } from '../services/wasteService';

export interface UseWasteReturn {
  today: WasteDailySummary | null;
  categories: WasteCategory[];
  trend: WasteTrendPoint[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  fetchTrend: (range: WasteTrendRange) => Promise<void>;
  fetchCategories: (period: WastePeriod) => Promise<void>;
}

export function useWaste(storeId: number): UseWasteReturn {
  const [today, setToday] = useState<WasteDailySummary | null>(null);
  const [categories, setCategories] = useState<WasteCategory[]>([]);
  const [trend, setTrend] = useState<WasteTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [todayData, catData] = await Promise.all([
        wasteService.getWasteToday(storeId),
        wasteService.getWasteCategories(storeId, 'today'),
      ]);
      setToday(todayData);
      setCategories(catData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data waste');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const fetchTrend = useCallback(
    async (range: WasteTrendRange) => {
      try {
        const data = await wasteService.getWasteTrend(storeId, range);
        setTrend(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat tren waste');
      }
    },
    [storeId]
  );

  const fetchCategories = useCallback(
    async (period: WastePeriod) => {
      try {
        const data = await wasteService.getWasteCategories(storeId, period);
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat kategori waste');
      }
    },
    [storeId]
  );

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return {
    today,
    categories,
    trend,
    loading,
    error,
    refresh: fetchAll,
    fetchTrend,
    fetchCategories,
  };
}

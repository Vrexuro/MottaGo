import { useState, useEffect, useCallback } from 'react';
import type { CreatePickupDto, Pickup, PickupStatusCount } from '../types/pickup.types';
import { pickupService } from '../services/pickupService';

export interface UsePickupReturn {
  activePickups: Pickup[];
  pickupHistory: Pickup[];
  summary: PickupStatusCount | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (dto: CreatePickupDto) => Promise<Pickup | null>;
  cancel: (pickupId: string) => Promise<boolean>;
  complete: (pickupId: string) => Promise<boolean>;
}

export function usePickup(storeId: number): UsePickupReturn {
  const [activePickups, setActivePickups] = useState<Pickup[]>([]);
  const [pickupHistory, setPickupHistory] = useState<Pickup[]>([]);
  const [summary, setSummary] = useState<PickupStatusCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [active, history, summaryData] = await Promise.all([
        pickupService.getActivePickups(storeId),
        pickupService.getPickupHistory(storeId),
        pickupService.getPickupSummary(storeId),
      ]);
      setActivePickups(active);
      setPickupHistory(history);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data pickup');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const create = useCallback(
    async (dto: CreatePickupDto): Promise<Pickup | null> => {
      const result = await pickupService.createPickup(dto);
      if (result) await fetchAll();
      return result;
    },
    [fetchAll]
  );

  const cancel = useCallback(
    async (pickupId: string): Promise<boolean> => {
      const success = await pickupService.cancelPickup(pickupId);
      if (success) await fetchAll();
      return success;
    },
    [fetchAll]
  );

  const complete = useCallback(
    async (pickupId: string): Promise<boolean> => {
      const success = await pickupService.completePickup(pickupId);
      if (success) await fetchAll();
      return success;
    },
    [fetchAll]
  );

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return {
    activePickups,
    pickupHistory,
    summary,
    loading,
    error,
    refresh: fetchAll,
    create,
    cancel,
    complete,
  };
}

import { useState, useEffect, useCallback } from 'react';
import type { Vendor } from '../types/vendor.types';
import { vendorService } from '../services/vendorService';

export interface UseVendorReturn {
  vendors: Vendor[];
  defaultVendor: Vendor | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  search: (keyword: string) => Promise<void>;
}

export function useVendor(storeId: number): UseVendorReturn {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [defaultVendor, setDefaultVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [activeVendors, defVendor] = await Promise.all([
        vendorService.getActiveVendors(),
        vendorService.getDefaultVendor(storeId),
      ]);
      setVendors(activeVendors);
      setDefaultVendor(defVendor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data vendor');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const search = useCallback(async (keyword: string) => {
    try {
      const results = await vendorService.searchVendors(keyword);
      setVendors(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mencari vendor');
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return {
    vendors,
    defaultVendor,
    loading,
    error,
    refresh: fetchAll,
    search,
  };
}

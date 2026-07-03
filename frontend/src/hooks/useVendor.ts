import { useState, useEffect, useCallback } from 'react';
import type { Vendor } from '../types/vendor.types';
import { vendorService } from '../services/vendorService';

export interface UseVendorReturn {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  search: (keyword: string) => Promise<void>;
}

export function useVendor(): UseVendorReturn {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const activeVendors = await vendorService.getActiveVendors();
      setVendors(activeVendors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data vendor');
    } finally {
      setLoading(false);
    }
  }, []);

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
    loading,
    error,
    refresh: fetchAll,
    search,
  };
}

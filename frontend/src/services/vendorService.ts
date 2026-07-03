import { supabase } from '../lib/supabase';
import type { Vendor } from '../types/vendor.types';

// ── Internal helpers ──────────────────────────────────────────────────────────

interface VendorRow {
  id: number;
  name: string;
  is_active: boolean;
}

function mapRow(row: VendorRow): Vendor {
  return {
    id: row.id,
    name: row.name,
    isActive: row.is_active,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const vendorService = {
  getActiveVendors: async (): Promise<Vendor[]> => {
    const { data, error } = await supabase
      .from('vendors')
      .select('id, name, is_active')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) return [];

    return ((data ?? []) as VendorRow[]).map(mapRow);
  },

  getVendorById: async (vendorId: number): Promise<Vendor | null> => {
    const { data, error } = await supabase
      .from('vendors')
      .select('id, name, is_active')
      .eq('id', vendorId)
      .single();

    if (error) return null;

    return mapRow(data as VendorRow);
  },

  searchVendors: async (keyword: string): Promise<Vendor[]> => {
    if (!keyword.trim()) return vendorService.getActiveVendors();

    const { data, error } = await supabase
      .from('vendors')
      .select('id, name, is_active')
      .eq('is_active', true)
      .ilike('name', `%${keyword}%`)
      .order('name', { ascending: true });

    if (error) return [];

    return ((data ?? []) as VendorRow[]).map(mapRow);
  },
};

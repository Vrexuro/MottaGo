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

    if (error) return []; // TODO: table not yet created

    return ((data ?? []) as VendorRow[]).map(mapRow);
  },

  getVendorById: async (vendorId: number): Promise<Vendor | null> => {
    const { data, error } = await supabase
      .from('vendors')
      .select('id, name, is_active')
      .eq('id', vendorId)
      .single();

    if (error) return null; // TODO: table not yet created

    return mapRow(data as VendorRow);
  },

  getDefaultVendor: async (storeId: number): Promise<Vendor | null> => {
    // DL-06: each store has a default_vendor_id FK → vendors
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('default_vendor_id')
      .eq('id', storeId)
      .single();

    if (storeError || !storeData) return null; // TODO: table not yet created

    const defaultVendorId = (storeData as { default_vendor_id: number | null }).default_vendor_id;
    if (!defaultVendorId) return null;

    return vendorService.getVendorById(defaultVendorId);
  },

  searchVendors: async (keyword: string): Promise<Vendor[]> => {
    if (!keyword.trim()) return vendorService.getActiveVendors();

    const { data, error } = await supabase
      .from('vendors')
      .select('id, name, is_active')
      .eq('is_active', true)
      .ilike('name', `%${keyword}%`)
      .order('name', { ascending: true });

    if (error) return []; // TODO: table not yet created

    return ((data ?? []) as VendorRow[]).map(mapRow);
  },
};

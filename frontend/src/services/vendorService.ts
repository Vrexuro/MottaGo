import { supabase } from '../lib/supabase';
import type { Vendor } from '../types/vendor.types';

// ── Internal helpers ──────────────────────────────────────────────────────────

interface VendorRow {
  id: number;
  name: string;
  is_active: boolean;
  whatsapp_number: string;
  updated_at: string;
}

const VENDOR_SELECT = 'id, name, is_active, whatsapp_number, updated_at';

function mapRow(row: VendorRow): Vendor {
  return {
    id: row.id,
    name: row.name,
    isActive: row.is_active,
    whatsappNumber: row.whatsapp_number,
    updatedAt: row.updated_at,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const vendorService = {
  getAllVendors: async (): Promise<Vendor[]> => {
    const { data, error } = await supabase
      .from('vendors')
      .select(VENDOR_SELECT)
      .order('name', { ascending: true });

    if (error) return [];

    return ((data ?? []) as VendorRow[]).map(mapRow);
  },

  getActiveVendors: async (): Promise<Vendor[]> => {
    const { data, error } = await supabase
      .from('vendors')
      .select(VENDOR_SELECT)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) return [];

    return ((data ?? []) as VendorRow[]).map(mapRow);
  },

  getVendorById: async (vendorId: number): Promise<Vendor | null> => {
    const { data, error } = await supabase
      .from('vendors')
      .select(VENDOR_SELECT)
      .eq('id', vendorId)
      .single();

    if (error) return null;

    return mapRow(data as VendorRow);
  },

  searchVendors: async (keyword: string): Promise<Vendor[]> => {
    if (!keyword.trim()) return vendorService.getActiveVendors();

    const { data, error } = await supabase
      .from('vendors')
      .select(VENDOR_SELECT)
      .eq('is_active', true)
      .ilike('name', `%${keyword}%`)
      .order('name', { ascending: true });

    if (error) return [];

    return ((data ?? []) as VendorRow[]).map(mapRow);
  },

  createVendor: async (name: string, whatsappNumber: string): Promise<Vendor | null> => {
    const { data, error } = await supabase
      .from('vendors')
      .insert({ name, whatsapp_number: whatsappNumber, is_active: true })
      .select(VENDOR_SELECT)
      .single();
    if (error) return null;
    return mapRow(data as VendorRow);
  },

  updateVendor: async (
    vendorId: number,
    updates: { name?: string; whatsappNumber?: string; isActive?: boolean }
  ): Promise<boolean> => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.whatsappNumber !== undefined) dbUpdates.whatsapp_number = updates.whatsappNumber;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    const { error } = await supabase.from('vendors').update(dbUpdates).eq('id', vendorId);
    return !error;
  },
};

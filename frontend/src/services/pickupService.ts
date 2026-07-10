import { supabase } from '../lib/supabase';
import { vendorService } from './vendorService';
import type {
  CreatePickupDto,
  Pickup,
  PickupStatus,
  PickupStatusCount,
} from '../types/pickup.types';

// ── Internal helpers ──────────────────────────────────────────────────────────

interface PickupRow {
  id: string;
  store_id: number;
  vendor_id: number;
  vendor_name: string;
  estimasi_kg: number | null;
  status: PickupStatus;
  waste_category: string | null;
  requested_at: string;
  completed_at: string | null;
}

function mapRow(row: PickupRow): Pickup {
  return {
    id: row.id,
    storeId: row.store_id,
    vendorId: row.vendor_id,
    vendorName: row.vendor_name,
    wasteCategory: row.waste_category as Pickup['wasteCategory'],
    estimasiKg: row.estimasi_kg,
    status: row.status,
    requestedAt: row.requested_at,
    completedAt: row.completed_at ?? undefined,
  };
}

const PICKUP_SELECT =
  'id, store_id, vendor_id, vendor_name, estimasi_kg, status, waste_category, requested_at, completed_at';

// ── Service ───────────────────────────────────────────────────────────────────

export const pickupService = {
  getActivePickups: async (storeId: number): Promise<Pickup[]> => {
    const { data, error } = await supabase
      .from('pickups')
      .select(PICKUP_SELECT)
      .eq('store_id', storeId)
      .in('status', ['waiting', 'in-transit'])
      .order('requested_at', { ascending: false });

    if (error) return [];

    return ((data ?? []) as PickupRow[]).map(mapRow);
  },

  getPickupHistory: async (storeId: number): Promise<Pickup[]> => {
    const { data, error } = await supabase
      .from('pickups')
      .select(PICKUP_SELECT)
      .eq('store_id', storeId)
      .in('status', ['completed', 'cancelled'])
      .order('requested_at', { ascending: false })
      .limit(50);

    if (error) return [];

    return ((data ?? []) as PickupRow[]).map(mapRow);
  },

  createPickup: async (dto: CreatePickupDto): Promise<Pickup | null> => {
    const vendor = await vendorService.getVendorById(dto.vendorId);
    if (!vendor) return null;

    const { data, error } = await supabase
      .from('pickups')
      .insert({
        store_id: dto.storeId,
        vendor_id: dto.vendorId,
        vendor_name: vendor.name,
        waste_category: dto.wasteCategory,
        estimasi_kg: dto.estimasiKg ?? null,
        status: 'waiting',
      })
      .select(PICKUP_SELECT)
      .single();

    if (error) return null;
    return mapRow(data as PickupRow);
  },

  cancelPickup: async (pickupId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('pickups')
      .update({ status: 'cancelled' })
      .eq('id', pickupId)
      .eq('status', 'waiting'); // Only cancel pickups still waiting for confirmation

    return !error;
  },

  confirmPickup: async (pickupId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('pickups')
      .update({ status: 'in-transit' })
      .eq('id', pickupId)
      .eq('status', 'waiting');

    return !error;
  },

  completePickup: async (pickupId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('pickups')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', pickupId)
      .eq('status', 'in-transit');

    return !error;
  },

  getPickupSummary: async (storeId: number): Promise<PickupStatusCount | null> => {
    const today = new Date().toISOString().split('T')[0];

    const [waitingRes, transitRes, completedRes] = await Promise.all([
      supabase
        .from('pickups')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId)
        .eq('status', 'waiting'),
      supabase
        .from('pickups')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId)
        .eq('status', 'in-transit'),
      supabase
        .from('pickups')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId)
        .eq('status', 'completed')
        .gte('completed_at', `${today}T00:00:00.000Z`),
    ]);

    if (waitingRes.error || transitRes.error || completedRes.error) return null;

    return {
      waiting: waitingRes.count ?? 0,
      inTransit: transitRes.count ?? 0,
      completedToday: completedRes.count ?? 0,
    };
  },
};

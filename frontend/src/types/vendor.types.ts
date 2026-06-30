// Vendor — from requestPickup.ts VENDOR_OPTIONS display; DL-05: isActive gate; DL-06: defaultVendorId on Store
export interface Vendor {
  id: number;
  name: string;
  isActive: boolean; // DL-05: inactive vendors cannot be selected for new pickups
}

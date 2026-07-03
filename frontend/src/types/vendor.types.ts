// Vendor — Master Data entity. DL-05: isActive gate prevents inactive vendor selection.
// Mapping vendor per store per waste category dilakukan via store_vendor_assignments (Sprint B).
export interface Vendor {
  id: number;
  name: string;
  isActive: boolean; // DL-05: inactive vendors cannot be selected for new pickups
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Badge } from '../../components/atoms/Badge';
import { Button } from '../../components/atoms/Button';
import { TextInput } from '../../components/atoms/TextInput';
import { FormField } from '../../components/molecules/FormField';
import { manajerNavItems } from '../../router/navigation';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { vendorService } from '../../services/vendorService';
import {
  storeVendorAssignmentService,
  type VendorAssignmentMap,
} from '../../services/storeVendorAssignmentService';
import type { Vendor } from '../../types/vendor.types';
import type { WasteType } from '../../types/waste.types';
import { PICKUP_KATEGORI_COLOR, PICKUP_KATEGORI_LABEL } from '../../constants/waste';

type VendorFormData = { name: string; whatsappNumber: string };

const KATEGORI_OPTIONS: { value: WasteType; label: string }[] = [
  { value: 'organik', label: 'Organik' },
  { value: 'anorganik', label: 'Anorganik' },
  { value: 'minyak', label: 'Limbah Cair (Minyak Jelantah)' },
];

export default function VendorManagementPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';
  const storeId = profile?.storeId ?? null;

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [assignments, setAssignments] = useState<VendorAssignmentMap>({
    organik: null,
    anorganik: null,
    minyak: null,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [vendorData, assignmentData] = await Promise.all([
      vendorService.getAllVendors(),
      storeId ? storeVendorAssignmentService.getAssignments(storeId) : Promise.resolve(null),
    ]);
    setVendors(vendorData);
    if (assignmentData) setAssignments(assignmentData);
    setLoading(false);
  }, [storeId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Vendor | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formKategori, setFormKategori] = useState<WasteType[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const toggleAktif = async (vendor: Vendor) => {
    await vendorService.updateVendor(vendor.id, { isActive: !vendor.isActive });
    await refresh();
  };

  const openAddForm = () => {
    setEditTarget(null);
    setFormNama('');
    setFormWhatsapp('');
    setFormKategori([]);
    setShowForm(true);
  };

  const openEditForm = (vendor: Vendor) => {
    setEditTarget(vendor);
    setFormNama(vendor.name);
    setFormWhatsapp(vendor.whatsappNumber ?? '');
    setFormKategori(
      KATEGORI_OPTIONS.map((opt) => opt.value).filter((cat) => assignments[cat] === vendor.id)
    );
    setShowForm(true);
  };

  const toggleKategori = (kategori: WasteType) => {
    setFormKategori((prev) =>
      prev.includes(kategori) ? prev.filter((k) => k !== kategori) : [...prev, kategori]
    );
  };

  // Nama pemilik kategori saat ini (untuk hint "kategori ini sudah dipakai
  // vendor lain") — dicek terhadap vendor SELAIN yang sedang diedit.
  const currentOwnerName = (kategori: WasteType): string | null => {
    const ownerId = assignments[kategori];
    if (ownerId === null || ownerId === editTarget?.id) return null;
    return vendors.find((v) => v.id === ownerId)?.name ?? null;
  };

  const handleSave = async (formData: VendorFormData) => {
    setIsSaving(true);

    let vendorId: number | null = editTarget?.id ?? null;

    if (editTarget) {
      await vendorService.updateVendor(editTarget.id, {
        name: formData.name,
        whatsappNumber: formData.whatsappNumber,
      });
    } else {
      const created = await vendorService.createVendor(formData.name, formData.whatsappNumber);
      vendorId = created?.id ?? null;
    }

    // Sinkronkan penugasan kategori (store_vendor_assignments) dengan
    // checkbox yang dipilih — hanya untuk store manajer yang sedang login.
    if (vendorId !== null && storeId !== null) {
      await Promise.all(
        KATEGORI_OPTIONS.map(async ({ value: kategori }) => {
          const isChecked = formKategori.includes(kategori);
          const currentOwner = assignments[kategori];
          if (isChecked && currentOwner !== vendorId) {
            await storeVendorAssignmentService.setAssignment(storeId, kategori, vendorId as number);
          } else if (!isChecked && currentOwner === vendorId) {
            await storeVendorAssignmentService.clearAssignment(storeId, kategori);
          }
        })
      );
    }

    setIsSaving(false);
    setShowForm(false);
    setEditTarget(null);
    await refresh();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  return (
    <DashboardLayout
      navItems={manajerNavItems}
      userRole="manajer"
      userName={userName}
      onLogout={logout}
      onNotificationClick={() => navigate(ROUTES.MANAJER_NOTIFICATIONS)}
    >
      <div className="min-h-full bg-mottago-surface-subtle">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Vendor Management</h1>
              <p className="text-sm text-text-secondary mt-1">Total {vendors.length} vendor</p>
            </div>
            <Button variant="primary" leftIcon="Plus" onClick={openAddForm}>
              Tambah Vendor
            </Button>
          </div>

          {loading && vendors.length === 0 ? (
            <div className="p-8 text-text-secondary">Memuat data...</div>
          ) : (
            <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px]">
                  <thead>
                    <tr className="border-b border-mottago-border bg-mottago-surface-subtle">
                      <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Nama Vendor
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Nomor WhatsApp
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 md:px-5 py-2.5 text-right text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mottago-border">
                    {vendors.map((vendor) => {
                      const vendorKategori = KATEGORI_OPTIONS.map((opt) => opt.value).filter(
                        (cat) => assignments[cat] === vendor.id
                      );
                      return (
                        <tr
                          key={vendor.id}
                          className="hover:bg-mottago-surface-subtle transition-colors"
                        >
                          <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                            <span className="text-sm font-medium text-text-primary">
                              {vendor.name}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <span className="text-sm text-text-secondary">
                              {vendor.whatsappNumber}
                            </span>
                          </td>
                          <td className="px-3 py-3.5">
                            {vendorKategori.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {vendorKategori.map((cat) => (
                                  <Badge key={cat} color={PICKUP_KATEGORI_COLOR[cat]} size="sm">
                                    {PICKUP_KATEGORI_LABEL[cat]}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-text-disabled">—</span>
                            )}
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <span className="text-sm text-text-secondary tabular-nums">
                              {vendor.updatedAt
                                ? new Date(vendor.updatedAt).toISOString().slice(0, 10)
                                : '—'}
                            </span>
                          </td>
                          <td className="px-3 py-3.5">
                            <Badge color={vendor.isActive ? 'success' : 'danger'} size="sm">
                              {vendor.isActive ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </td>
                          <td className="px-4 md:px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => openEditForm(vendor)}
                                className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleAktif(vendor)}
                                className="text-xs font-medium text-info-text hover:opacity-80 transition-opacity"
                              >
                                {vendor.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showForm && (
            <div className="bg-mottago-surface border border-mottago-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-4 md:p-6 space-y-4">
              <h2 className="text-base font-semibold text-text-primary">
                {editTarget ? 'Edit Vendor' : 'Tambah Vendor'}
              </h2>

              <FormField label="Nama Vendor" htmlFor="vendor-nama" required>
                <TextInput
                  id="vendor-nama"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                />
              </FormField>

              <FormField label="Nomor WhatsApp" htmlFor="vendor-whatsapp" required>
                <TextInput
                  id="vendor-whatsapp"
                  value={formWhatsapp}
                  onChange={(e) => setFormWhatsapp(e.target.value)}
                />
              </FormField>

              <FormField
                label="Kategori yang Ditangani"
                htmlFor="vendor-kategori"
                helpText="Saat Pegawai Utility memilih kategori ini pada Request Pickup, vendor akan terisi otomatis."
              >
                <div id="vendor-kategori" className="space-y-2">
                  {KATEGORI_OPTIONS.map((opt) => {
                    const owner = currentOwnerName(opt.value);
                    return (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 text-sm text-text-primary cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formKategori.includes(opt.value)}
                          onChange={() => toggleKategori(opt.value)}
                          className="w-4 h-4 rounded border-mottago-border text-brand-primary focus:ring-2 focus:ring-brand-primary"
                        />
                        <span>{opt.label}</span>
                        {owner && (
                          <span className="text-xs text-text-disabled">
                            (saat ini: {owner} — akan digantikan)
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </FormField>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
                  Batal
                </Button>
                <Button
                  variant="primary"
                  loading={isSaving}
                  onClick={() =>
                    handleSave({
                      name: formNama,
                      whatsappNumber: formWhatsapp,
                    })
                  }
                >
                  Simpan
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

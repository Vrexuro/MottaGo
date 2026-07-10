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
import type { Vendor } from '../../types/vendor.types';

type VendorFormData = { name: string; whatsappNumber: string };

export default function VendorManagementPage() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const userName = profile?.fullName ?? 'Manajer';

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await vendorService.getAllVendors();
    setVendors(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Vendor | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');

  const toggleAktif = async (vendor: Vendor) => {
    await vendorService.updateVendor(vendor.id, { isActive: !vendor.isActive });
    await refresh();
  };

  const openAddForm = () => {
    setEditTarget(null);
    setFormNama('');
    setFormWhatsapp('');
    setShowForm(true);
  };

  const openEditForm = (vendor: Vendor) => {
    setEditTarget(vendor);
    setFormNama(vendor.name);
    setFormWhatsapp(vendor.whatsappNumber ?? '');
    setShowForm(true);
  };

  const handleSave = async (formData: VendorFormData) => {
    if (editTarget) {
      await vendorService.updateVendor(editTarget.id, {
        name: formData.name,
        whatsappNumber: formData.whatsappNumber,
      });
    } else {
      await vendorService.createVendor(formData.name, formData.whatsappNumber);
    }
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
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="border-b border-mottago-border bg-mottago-surface-subtle">
                      <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Nama Vendor
                      </th>
                      <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Nomor WhatsApp
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
                    {vendors.map((vendor) => (
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
                    ))}
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

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={handleCancel}>
                  Batal
                </Button>
                <Button
                  variant="primary"
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

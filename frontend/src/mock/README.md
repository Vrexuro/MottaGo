# src/mock/ — Mock Data Layer

## Tujuan

Folder ini berisi seluruh data mock yang digunakan oleh aplikasi selama fase Sprint B2.
Setiap file mewakili satu domain data dan menjadi satu-satunya sumber kebenaran untuk
data tersebut di seluruh UI.

## Aturan Penggunaan

1. **JANGAN** mendefinisikan data mock di dalam file Page (`.tsx`) atau Component.
   Semua data mock WAJIB diimport dari file di folder ini.

2. **JANGAN** membuat file baru di folder ini tanpa persetujuan arsitektur.

3. **Konsistensi angka:** nilai yang muncul di beberapa halaman (kapasitas, jumlah pickup,
   total sampah, dll.) WAJIB bersumber dari file yang sama di sini — bukan didefinisikan
   ulang di masing-masing halaman.

4. **Sprint C Migration:** Setiap file di folder ini akan digantikan oleh service call
   ke Supabase. Interface TypeScript yang diekspor harus sesuai dengan shape data dari DB
   untuk memudahkan migrasi.

## File Structure

| File | Domain | Digunakan di |
|------|--------|--------------|
| `pickup.ts` | Riwayat pickup | RiwayatPickupPage, LaporanPage |
| `vendor.ts` | Data vendor | VendorManagementPage |
| `notification.ts` | Notifikasi | NotifikasiPage |
| `report.ts` | KPI & chart laporan | LaporanPage |
| `user.ts` | Data pengguna | KelolaPenggunaPage |
| `utility.ts` | Entri sampah utility | UtilityDashboardPage, CatatWastePage, RiwayatInputPage |
| `pickup/requestPickup.ts` | State pickup form | RequestPickupPage (legacy, jangan ubah) |

## Derived Values

Nilai turunan (seperti persentase kapasitas) WAJIB dihitung dari nilai dasar,
bukan di-hardcode. Contoh:

```typescript
// ✅ BENAR — hitung dari nilai dasar
kapasitasPct: Math.round((kapasitasKg / maxKg) * 100),

// ❌ SALAH — hardcode nilai turunan
kapasitasPct: 66,
```

## Canonical Numbers (Sprint B2)

Semua halaman harus menghasilkan angka yang konsisten:
- Kapasitas saat ini: **263 kg** dari maksimum **400 kg** = **65,75% ≈ 66%**
- Total pickup completed: **6**
- Rata-rata harian: **38.5 kg/hari**
- Vendor aktif: **3** dari total **4**

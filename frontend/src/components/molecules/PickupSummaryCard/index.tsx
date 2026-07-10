import { useNavigate } from 'react-router-dom';
import { Badge } from '../../atoms/Badge';
import { Icon } from '../../atoms/Icon';
import { ROUTES } from '../../../router/routes';
import type { Pickup } from '../../../types/pickup.types';

type PickupStatus = 'waiting' | 'in-transit' | 'completed';
type PickupAksi = 'detail' | 'lacak';

interface PickupRecord {
  id: string;
  vendor: string;
  estimasi: string;
  status: PickupStatus;
  waktuRequest: string;
  aksi: PickupAksi;
}

interface PickupSummaryCardProps {
  pickups: Pickup[];
  className?: string;
  onLihatSemua?: () => void;
}

const STATUS_CONFIG: Record<
  PickupStatus,
  { label: string; badge: 'warning' | 'info' | 'success' }
> = {
  waiting: { label: 'Menunggu Konfirmasi', badge: 'warning' },
  'in-transit': { label: 'Dalam Perjalanan', badge: 'info' },
  completed: { label: 'Selesai', badge: 'success' },
};

const AKSI_CONFIG: Record<PickupAksi, { label: string; colorClass: string }> = {
  detail: { label: 'Detail', colorClass: 'text-text-secondary hover:text-text-primary' },
  lacak: { label: 'Lacak', colorClass: 'text-info-text hover:opacity-80' },
};

// 'cancelled' dikecualikan karena tidak ada STATUS_CONFIG untuknya.
function toDisplayPickups(pickups: Pickup[]): PickupRecord[] {
  return pickups
    .filter((p): p is Pickup & { status: PickupStatus } => p.status !== 'cancelled')
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      vendor: p.vendorName,
      estimasi: p.estimasiKg !== null ? `${p.estimasiKg} kg` : '—',
      status: p.status,
      waktuRequest: new Date(p.requestedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      aksi: 'detail' as const,
    }));
}

export function PickupSummaryCard({ pickups, className, onLihatSemua }: PickupSummaryCardProps) {
  const navigate = useNavigate();
  const DISPLAY_PICKUPS = toDisplayPickups(pickups);
  return (
    <div
      className={[
        'bg-mottago-surface border border-mottago-border',
        'rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]',
        'flex flex-col',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 md:px-5 md:pt-5">
        <h3 className="text-sm font-semibold text-text-primary">Pickup Aktif Saat Ini</h3>
        <button
          type="button"
          onClick={onLihatSemua}
          className="flex items-center gap-0.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          Lihat semua
          <Icon name="ChevronRight" size={16} className="shrink-0" />
        </button>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-mottago-border bg-mottago-surface-subtle">
              <th className="px-4 md:px-5 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                ID Pickup
              </th>
              <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                Vendor
              </th>
              <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                Estimasi
              </th>
              <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                Waktu Request
              </th>
              <th className="px-4 md:px-5 py-2.5 text-right text-[11px] font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mottago-border">
            {DISPLAY_PICKUPS.map((pickup) => {
              const status = STATUS_CONFIG[pickup.status];
              const aksi = AKSI_CONFIG[pickup.aksi];
              return (
                <tr key={pickup.id} className="hover:bg-mottago-surface-subtle transition-colors">
                  <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                    <span className="text-sm font-semibold text-text-primary">{pickup.id}</span>
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <span className="text-sm text-text-primary">{pickup.vendor}</span>
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <span className="text-sm text-text-primary tabular-nums">
                      {pickup.estimasi}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge color={status.badge} size="sm">
                      {status.label}
                    </Badge>
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <span className="text-sm text-text-secondary">{pickup.waktuRequest}</span>
                  </td>
                  <td className="px-4 md:px-5 py-3.5 text-right">
                    <button
                      type="button"
                      className={['text-xs font-medium transition-colors', aksi.colorClass].join(
                        ' '
                      )}
                      onClick={() => navigate(ROUTES.MANAJER_RIWAYAT_PICKUP)}
                    >
                      {aksi.label}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

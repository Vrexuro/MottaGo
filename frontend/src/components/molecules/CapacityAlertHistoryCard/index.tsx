import { Badge } from '../../atoms/Badge';

type AlertStatus = 'normal' | 'perlu-perhatian' | 'kritis';

interface AlertRow {
  id: string;
  date: string;
  status: AlertStatus;
  pct: number;
  description: string;
}

const STATUS_CFG: Record<
  AlertStatus,
  { label: string; badgeColor: 'success' | 'warning' | 'danger' }
> = {
  normal: { label: 'Normal', badgeColor: 'success' },
  'perlu-perhatian': { label: 'Perlu Perhatian', badgeColor: 'warning' },
  kritis: { label: 'Kritis', badgeColor: 'danger' },
};

interface CapacityAlertHistoryCardProps {
  className?: string;
  alerts?: AlertRow[];
  loading?: boolean;
}

export function CapacityAlertHistoryCard({
  className,
  alerts,
  loading,
}: CapacityAlertHistoryCardProps) {
  const rows = alerts ?? [];

  return (
    <div
      className={[
        'bg-mottago-surface border border-mottago-border',
        'rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]',
        'flex flex-col overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-mottago-border">
        <h3 className="text-base font-semibold text-text-primary">Riwayat Alert Kapasitas</h3>
        <span className="text-xs font-medium text-text-disabled whitespace-nowrap">
          {rows.length} terakhir
        </span>
      </div>

      {loading ? (
        <div className="p-8 text-text-secondary text-sm">Memuat...</div>
      ) : rows.length === 0 ? (
        <div className="p-8 text-center text-text-secondary text-sm">Belum ada riwayat alert</div>
      ) : (
        <>
          {/* ── Desktop / Tablet: Table ────────────────────── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-mottago-border bg-mottago-surface-subtle">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-disabled uppercase tracking-wider w-[148px]">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-disabled uppercase tracking-wider w-[168px]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-disabled uppercase tracking-wider w-[112px]">
                    Persentase
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-text-disabled uppercase tracking-wider">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mottago-border">
                {rows.map((row) => {
                  const cfg = STATUS_CFG[row.status];
                  return (
                    <tr key={row.id} className="hover:bg-mottago-surface-subtle transition-colors">
                      <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={cfg.badgeColor}>{cfg.label}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-text-primary">
                        {row.pct}%
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile: Card list ─────────────────────────── */}
          <div className="md:hidden divide-y divide-mottago-border">
            {rows.map((row) => {
              const cfg = STATUS_CFG[row.status];
              return (
                <div key={row.id} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span className="text-sm text-text-secondary">{row.date}</span>
                    <Badge color={cfg.badgeColor}>{cfg.label}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{row.pct}%</span>
                    <span className="text-sm text-text-disabled">·</span>
                    <span className="text-sm text-text-secondary">{row.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

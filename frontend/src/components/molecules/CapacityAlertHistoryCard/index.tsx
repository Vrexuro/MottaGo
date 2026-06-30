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

const MOCK_ROWS: AlertRow[] = [
  { id: '1', date: '27 Jun 2026', status: 'kritis', pct: 91, description: 'Melewati batas kritis' },
  {
    id: '2',
    date: '27 Jun 2026',
    status: 'perlu-perhatian',
    pct: 78,
    description: 'Melewati batas warning',
  },
  { id: '3', date: '26 Jun 2026', status: 'normal', pct: 45, description: 'Kondisi stabil' },
  { id: '4', date: '25 Jun 2026', status: 'kritis', pct: 92, description: 'Segera lakukan pickup' },
  {
    id: '5',
    date: '24 Jun 2026',
    status: 'perlu-perhatian',
    pct: 67,
    description: 'Melewati batas warning',
  },
  { id: '6', date: '23 Jun 2026', status: 'normal', pct: 55, description: 'Kondisi stabil' },
];

interface CapacityAlertHistoryCardProps {
  className?: string;
}

export function CapacityAlertHistoryCard({ className }: CapacityAlertHistoryCardProps) {
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
        <button
          type="button"
          className="text-xs font-medium text-brand-primary hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          Lihat Semua
        </button>
      </div>

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
            {MOCK_ROWS.map((row) => {
              const cfg = STATUS_CFG[row.status];
              return (
                <tr key={row.id} className="hover:bg-mottago-surface-subtle transition-colors">
                  <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={cfg.badgeColor}>{cfg.label}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-text-primary">{row.pct}%</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{row.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile: Card list ─────────────────────────── */}
      <div className="md:hidden divide-y divide-mottago-border">
        {MOCK_ROWS.map((row) => {
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
    </div>
  );
}

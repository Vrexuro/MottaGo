import { Icon } from '../../atoms/Icon';

interface DashboardHeaderProps {
  title: string;
  userName?: string;
  className?: string;
}

export function DashboardHeader({ title, userName, className }: DashboardHeaderProps) {
  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      {/* Mobile-only date row */}
      <div className="flex md:hidden items-center gap-1.5 text-text-secondary">
        <Icon name="CalendarDays" size={16} className="shrink-0" />
        <span className="text-xs font-medium">{today}</span>
      </div>
      {/* Title row: heading+subtitle (left) | date (right, tablet+) */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
          <p className="text-sm text-text-secondary">Selamat datang, {userName ?? 'Manajer'}</p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-text-secondary shrink-0 pt-1.5">
          <Icon name="CalendarDays" size={16} className="shrink-0" />
          <span className="text-xs font-medium whitespace-nowrap">{today}</span>
        </div>
      </div>
    </div>
  );
}

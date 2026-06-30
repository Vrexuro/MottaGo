interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function DashboardHeader({ title, subtitle, className }: DashboardHeaderProps) {
  const containerClassName = ['flex flex-col gap-1', className].filter(Boolean).join(' ');
  return (
    <div className={containerClassName}>
      <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
      <p className="text-sm text-text-secondary">{subtitle}</p>
    </div>
  );
}

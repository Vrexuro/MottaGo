import { Icon } from '../../atoms/Icon';
import type { IconSize } from '../../atoms/Icon';

interface NotificationBadgeProps {
  count: number;
  max?: number;
  iconSize?: IconSize;
  className?: string;
}

export function NotificationBadge({
  count,
  max = 99,
  iconSize = 20,
  className,
}: NotificationBadgeProps) {
  const safeCount = Number.isFinite(count) ? Math.max(0, count) : 0;
  const showBubble = safeCount > 0;
  const displayCount = safeCount > max ? `${max}+` : String(safeCount);

  const containerClassName = ['relative inline-flex', className].filter(Boolean).join(' ');

  return (
    <span className={containerClassName}>
      <Icon name="Bell" size={iconSize} />

      {showBubble && (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-4 min-w-[1rem] px-0.5 rounded-full bg-error-border text-white text-[10px] font-bold leading-none pointer-events-none"
        >
          {displayCount}
        </span>
      )}
    </span>
  );
}

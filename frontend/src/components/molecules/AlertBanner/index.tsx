import { Icon } from '../../atoms/Icon';

export type AlertBannerVariant = 'success' | 'info' | 'warning' | 'error';

export interface AlertBannerProps {
  variant: AlertBannerVariant;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onClose?: () => void;
  className?: string;
}

interface VariantCfg {
  bgClass: string;
  borderLClass: string;
  iconName: string;
  iconColorClass: string;
  titleColorClass: string;
  actionColorClass: string;
}

const VARIANT_CFG: Record<AlertBannerVariant, VariantCfg> = {
  success: {
    bgClass: 'bg-accent-success-bg',
    borderLClass: 'border-l-accent-success-border',
    iconName: 'CheckCircle2',
    iconColorClass: 'text-accent-success-text',
    titleColorClass: 'text-accent-success-text',
    actionColorClass: 'text-accent-success-text',
  },
  info: {
    bgClass: 'bg-info-bg',
    borderLClass: 'border-l-info-border',
    iconName: 'Info',
    iconColorClass: 'text-info-text',
    titleColorClass: 'text-info-text',
    actionColorClass: 'text-info-text',
  },
  warning: {
    bgClass: 'bg-warning-bg',
    borderLClass: 'border-l-warning-border',
    iconName: 'AlertTriangle',
    iconColorClass: 'text-warning-text',
    titleColorClass: 'text-warning-text',
    actionColorClass: 'text-warning-text',
  },
  error: {
    bgClass: 'bg-error-bg',
    borderLClass: 'border-l-error-border',
    iconName: 'XCircle',
    iconColorClass: 'text-error-text',
    titleColorClass: 'text-error-text',
    actionColorClass: 'text-error-text',
  },
};

export function AlertBanner({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  dismissible = false,
  onClose,
  className,
}: AlertBannerProps) {
  const cfg = VARIANT_CFG[variant];

  return (
    <div
      role="alert"
      className={[
        'flex gap-3 px-4 py-3.5',
        'border-l-4 rounded-[var(--radius-md)]',
        'shadow-[var(--shadow-sm)]',
        cfg.bgClass,
        cfg.borderLClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Variant icon */}
      <span className={['shrink-0 mt-0.5', cfg.iconColorClass].join(' ')}>
        <Icon name={cfg.iconName} size={20} />
      </span>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <p className={['text-sm font-semibold leading-snug', cfg.titleColorClass].join(' ')}>
          {title}
        </p>
        {description && (
          <p className="mt-1 text-sm text-text-secondary leading-relaxed">{description}</p>
        )}
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className={[
              'mt-2 text-xs font-semibold underline underline-offset-2',
              'hover:opacity-75 transition-opacity',
              cfg.actionColorClass,
            ].join(' ')}
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* Dismiss button */}
      {dismissible && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="shrink-0 self-start mt-0.5 text-text-disabled hover:text-text-secondary transition-colors"
        >
          <Icon name="X" size={16} />
        </button>
      )}
    </div>
  );
}

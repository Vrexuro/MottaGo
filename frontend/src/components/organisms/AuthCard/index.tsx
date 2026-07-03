import type { ReactNode } from 'react';
import { Leaf } from 'lucide-react';

interface AuthCardProps {
  tagline?: string;
  children: ReactNode;
  className?: string;
}

export function AuthCard({ tagline, children, className }: AuthCardProps) {
  return (
    <div
      className={[
        'w-full overflow-hidden sm:max-w-sm sm:rounded-xl sm:shadow-md sm:border sm:border-mottago-border',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Brand Header */}
      <div className="bg-nav-dark-bg px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-accent-primary" />
          <span className="text-xl font-semibold text-nav-dark-item-text">MottaGo</span>
        </div>
        {tagline && <p className="mt-1 text-xs text-nav-dark-muted">{tagline}</p>}
      </div>
      {/* Form Body */}
      <div className="bg-mottago-surface px-6 py-6 sm:px-8">{children}</div>
    </div>
  );
}

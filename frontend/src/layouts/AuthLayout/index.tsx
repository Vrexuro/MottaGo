import type { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function AuthLayout({ children, className }: AuthLayoutProps) {
  const rootClassName = [
    'min-h-screen flex flex-col items-center justify-center bg-mottago-surface-subtle',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      <main id="main-content" className="w-full flex flex-col items-center px-4">
        {children}
      </main>
    </div>
  );
}

import type { ComponentPropsWithoutRef } from 'react';

import { DashboardLayout } from '../DashboardLayout';

type FormLayoutProps = ComponentPropsWithoutRef<typeof DashboardLayout>;

export function FormLayout({ children, ...props }: FormLayoutProps) {
  return (
    <DashboardLayout {...props}>
      <div className="w-full max-w-2xl mx-auto px-4">
        {children}
      </div>
    </DashboardLayout>
  );
}

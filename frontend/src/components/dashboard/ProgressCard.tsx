import type { ReactNode } from 'react';

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const colorMap = {
  primary: 'bg-primary-50 text-primary',
  secondary: 'bg-secondary-50 text-secondary',
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  danger: 'bg-danger-light text-danger',
};

export default function ProgressCard({ title, value, subtitle, icon, color = 'secondary' }: ProgressCardProps) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
          <p className="text-3xl font-bold text-text">{value}</p>
          {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

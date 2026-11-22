import React from 'react';

interface ValisBadgeProps {
  variant?: 'neutral' | 'green' | 'amber' | 'outline';
  children: React.ReactNode;
  className?: string;
}

export const ValisBadge: React.FC<ValisBadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
}) => {
  const styles: Record<NonNullable<ValisBadgeProps['variant']>, string> = {
    neutral: 'bg-valis-tagbg text-valis-secondary',
    green: 'bg-valis-greenbg border border-valis-greenborder text-valis-green',
    amber: 'bg-valis-deltabg border border-valis-deltaborder text-valis-orange',
    outline: 'bg-valis-bg border border-valis-chromeborder text-valis-muted',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-[var(--valis-checkbox-radius)] whitespace-nowrap ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

import React from 'react';

export interface ValisCardProps {
  radius?: 'panel' | 'card';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

/**
 * Single-Elevation Warm-Paper Editorial Sheet / Table Container (VALIS-RULE-05).
 * Never nest ValisCard inside another ValisCard.
 */
export const ValisCard: React.FC<ValisCardProps> = ({
  radius = 'panel',
  padding = 'md',
  className = '',
  children,
}) => {
  const radiusClass =
    radius === 'panel'
      ? 'rounded-[var(--valis-panel-radius)]'
      : 'rounded-[var(--valis-card-radius)]';

  const paddingClass =
    padding === 'none'
      ? ''
      : padding === 'sm'
      ? 'px-5 py-2'
      : padding === 'lg'
      ? 'p-6'
      : 'p-5';

  return (
    <div
      className={`bg-valis-canvas border border-valis-sidebarborder ${radiusClass} ${paddingClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

import React from 'react';

export interface ValisPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}

/**
 * Canonical H1 Page Header enforcing VALIS_TOKENS.typography.scale.h1 (22px).
 */
export const ValisPageHeader: React.FC<ValisPageHeaderProps> = ({
  title,
  subtitle,
  badge,
  rightSlot,
  className = 'mb-6',
}) => (
  <div className={`flex flex-wrap justify-between items-baseline gap-4 ${className}`.trim()}>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2.5">
        <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
          {title}
        </h1>
        {badge}
      </div>
      {subtitle && (
        <p className="text-[14px] text-valis-secondary mt-1 leading-[1.5]">
          {subtitle}
        </p>
      )}
    </div>
    {rightSlot && <div className="shrink-0">{rightSlot}</div>}
  </div>
);

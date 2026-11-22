import React from 'react';

export interface ValisSectionEyebrowProps {
  label: string;
  withDash?: boolean;
  className?: string;
}

/**
 * Canonical 11px uppercase eyebrow section divider (VALIS-RULE-08).
 */
export const ValisSectionEyebrow: React.FC<ValisSectionEyebrowProps> = ({
  label,
  withDash = false,
  className = '',
}) => {
  if (withDash) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`.trim()}>
        <span
          aria-hidden="true"
          className="w-4 h-[1px] bg-valis-dash inline-block shrink-0"
        />
        <span className="text-[11px] uppercase tracking-[0.06em] text-valis-subtle font-medium">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`text-[11px] uppercase tracking-[0.06em] font-medium text-valis-subtle ${className}`.trim()}
    >
      {label}
    </div>
  );
};

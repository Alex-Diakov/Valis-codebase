import React from 'react';

export type ValisButtonVariant = 'primary' | 'secondary' | 'link' | 'pill';
export type ValisButtonSize = 'sm' | 'md';

export interface ValisButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ValisButtonVariant;
  size?: ValisButtonSize;
  active?: boolean;
}

/**
 * Canonical 4-Button Taxonomy Primitive (VALIS-RULE-10).
 *
 * Variants:
 * - primary:   Dark ink CTA (6px radius) — Save to Brief, Stop, Send, Approve
 * - secondary: White bordered CTA (6px radius) — Voice Note, Open in source, Sync, Skip, Run now
 * - link:      Inline cobalt table/navigation link — Manage, Test AI, Return to Daily Brief
 * - pill:      Rounded-full filter tab or quick-prompt chip (supports active/inactive states)
 */
export const ValisButton: React.FC<ValisButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  active = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) => {
  let variantClasses = '';

  if (variant === 'primary') {
    const pad = size === 'sm' ? 'px-3 py-1' : 'px-3.5 py-2';
    variantClasses = `inline-flex items-center justify-center gap-1.5 bg-valis-text hover:bg-valis-texthover text-valis-canvas text-[13px] font-medium ${pad} rounded-[var(--valis-button-radius)] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`;
  } else if (variant === 'secondary') {
    const pad = size === 'sm' ? 'px-2.5 py-1' : 'px-3.5 py-1.5';
    variantClasses = `inline-flex items-center justify-center gap-1.5 bg-valis-canvas border border-valis-controlborder hover:border-valis-text hover:bg-valis-bg text-valis-text text-[12.5px] font-medium ${pad} rounded-[var(--valis-button-radius)] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`;
  } else if (variant === 'link') {
    variantClasses =
      'inline-flex items-center gap-1 text-valis-blue hover:underline text-[13px] font-medium transition-colors whitespace-nowrap cursor-pointer';
  } else {
    const pad = size === 'sm' ? 'px-3 py-1' : 'px-3.5 py-1';
    variantClasses = active
      ? `inline-flex items-center justify-center gap-1.5 rounded-[var(--valis-pill-radius)] ${pad} text-[12.5px] bg-valis-text text-valis-canvas font-medium transition-colors whitespace-nowrap cursor-pointer`
      : `inline-flex items-center justify-center gap-1.5 rounded-[var(--valis-pill-radius)] ${pad} text-[12.5px] bg-valis-canvas border border-valis-chromeborder text-valis-muted hover:text-valis-text hover:border-valis-controlhover transition-colors whitespace-nowrap cursor-pointer`;
  }

  return (
    <button
      type={type}
      className={`${variantClasses} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
};

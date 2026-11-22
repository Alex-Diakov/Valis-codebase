import React from 'react';

export interface ValisToggleProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
  disabled?: boolean;
}

/**
 * Accessible binary switch atom using semantic Valis tokens.
 */
export const ValisToggle: React.FC<ValisToggleProps> = ({
  checked,
  onChange,
  ariaLabel,
  disabled = false,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={onChange}
    className={`w-[36px] h-[20px] rounded-[var(--valis-pill-radius)] p-[2px] transition-colors flex items-center shrink-0 ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    } ${checked ? 'bg-valis-text justify-end' : 'bg-valis-dots justify-start'}`}
  >
    <span className="w-[16px] h-[16px] rounded-[var(--valis-pill-radius)] bg-valis-canvas shadow-2xs block" />
  </button>
);

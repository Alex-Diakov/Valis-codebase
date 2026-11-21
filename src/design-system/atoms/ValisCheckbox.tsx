import React from 'react';
import { Check, EyeOff } from 'lucide-react';

interface ValisCheckboxProps {
  checked: boolean;
  ariaLabel: string;
  title?: string;
  variant?: 'write-back' | 'read-only';
  onToggle: () => void;
}

export const ValisCheckbox: React.FC<ValisCheckboxProps> = ({
  checked,
  ariaLabel,
  title,
  variant = 'write-back',
  onToggle,
}) => {
  if (variant === 'read-only') {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        title={title ?? 'Hide from brief (Read-only source)'}
        onClick={onToggle}
        className="group/checkbox mt-[2px] w-[15px] h-[15px] rounded-[var(--valis-checkbox-radius)] border border-dashed border-valis-controlhover bg-transparent group-hover:border-valis-muted hover:border-valis-muted hover:bg-valis-sidebar flex items-center justify-center shrink-0 transition-colors cursor-pointer"
      >
        <EyeOff
          className="w-[11px] h-[11px] text-valis-secondary opacity-0 group-hover:opacity-100 group-hover/checkbox:opacity-100 transition-opacity"
          strokeWidth={1.75}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      title={title}
      onClick={onToggle}
      className={`mt-[2px] w-[15px] h-[15px] rounded-[var(--valis-checkbox-radius)] border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
        checked
          ? 'bg-valis-green border-valis-green text-valis-canvas'
          : 'border-valis-subtle bg-valis-canvas hover:border-valis-text'
      }`}
    >
      {checked && <Check className="w-2.5 h-2.5" strokeWidth={2.5} />}
    </button>
  );
};

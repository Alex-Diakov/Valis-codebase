import React from 'react';

export interface ValisSegmentedOption<T extends string> {
  value: T;
  label: string;
  activeTone?: 'neutral' | 'elevated';
}

export interface ValisSegmentedSwitchProps<T extends string> {
  value: T;
  options: readonly ValisSegmentedOption<T>[];
  onChange: (nextValue: T) => void;
  ariaLabel: string;
  disabled?: boolean;
  disabledReason?: string;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  testId?: string;
}

/**
 * WCAG 2.1 AA Segmented Switch Atom (VALIS-RULE-10).
 * Enforces high-contrast inactive labels (text-valis-navinactive)
 * and crisp neutral vs elevated-dark active states without arbitrary radii.
 */
export function ValisSegmentedSwitch<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  disabled = false,
  disabledReason,
  size = 'sm',
  fullWidth = false,
  testId,
}: ValisSegmentedSwitchProps<T>) {
  const sizeClass =
    size === 'sm' ? 'text-[11.5px] px-2.5 py-0.5' : 'text-[12px] px-2.5 py-0.5';

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
      title={disabled ? disabledReason : undefined}
      className={`${
        fullWidth ? 'grid grid-cols-2 gap-1 w-full' : 'inline-flex items-center'
      } bg-valis-divider border border-valis-chromeborder rounded-[var(--valis-control-radius)] p-0.5 shrink-0`}
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        const activeTone = opt.activeTone ?? 'neutral';
        const activeStyle =
          activeTone === 'elevated'
            ? 'bg-valis-text border-valis-text text-valis-canvas font-medium'
            : 'bg-valis-canvas border-valis-controlborder text-valis-text font-semibold';

        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            aria-pressed={isActive}
            onClick={() => {
              if (!disabled && !isActive) {
                onChange(opt.value);
              }
            }}
            className={`${sizeClass} rounded-[var(--valis-checkbox-radius)] border transition-colors whitespace-nowrap text-center ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            } ${
              isActive
                ? activeStyle
                : 'border-transparent text-valis-navinactive hover:text-valis-text'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

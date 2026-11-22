import React, { useRef } from 'react';
import { ArrowUp } from 'lucide-react';

export interface ValisKnotMarkProps {
  className?: string;
}

/**
 * Monochrome geometric Valis knot mark used in AI Chat zero-states.
 */
export const ValisKnotMark: React.FC<ValisKnotMarkProps> = ({
  className = 'w-6 h-6',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect
      x="6.5"
      y="6.5"
      width="11"
      height="11"
      rx="3"
      transform="rotate(45 12 12)"
    />
    <rect x="6.5" y="6.5" width="11" height="11" rx="3" />
    <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
  </svg>
);

export interface ValisChatComposerProps {
  value: string;
  onChange: (nextValue: string) => void;
  onSubmit: () => void;
  placeholder: string;
  ariaLabel: string;
  scopeLabel: string;
  showClear?: boolean;
  onClear?: () => void;
  isSubmitting?: boolean;
  submitAriaLabel?: string;
}

/**
 * Unified Floating Composer (Claude Desktop / Linear Ask / Notion AI standard).
 * Combines a borderless input, quiet live scope metadata + optional Clear action,
 * and an icon-only ArrowUp submit button inside a single elevated surface.
 */
export const ValisChatComposer: React.FC<ValisChatComposerProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  ariaLabel,
  scopeLabel,
  showClear = false,
  onClear,
  isSubmitting = false,
  submitAriaLabel = 'Send message',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canSubmit = value.trim().length > 0 && !isSubmitting;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      onClick={handleContainerClick}
      className="valis-composer group rounded-[12px] p-2.5 cursor-text"
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="valis-composer-input w-full bg-transparent text-[13.5px] text-valis-text placeholder:text-valis-subtle focus:outline-none px-1 py-1 caret-valis-text"
      />

      <div className="flex items-center justify-between gap-2 mt-2 pt-1.5">
        <div className="flex items-center min-w-0 text-[11px] text-valis-muted group-focus-within:text-valis-secondary transition-colors">
          <span className="truncate">Scope: {scopeLabel}</span>
          {showClear && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-valis-subtle hover:text-valis-text ml-2 underline shrink-0 cursor-pointer transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          aria-label={submitAriaLabel}
          className={`group/btn w-7 h-7 rounded-[7px] flex items-center justify-center transition-all duration-150 shrink-0 ${
            canSubmit
              ? 'bg-valis-text text-valis-canvas hover:bg-valis-texthover active:scale-95 cursor-pointer'
              : 'bg-valis-divider text-valis-subtle cursor-not-allowed'
          }`}
        >
          <ArrowUp
            className={`w-[14px] h-[14px] transition-transform duration-150 ${
              canSubmit ? 'group-hover/btn:-translate-y-[1px]' : ''
            }`}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </div>
    </form>
  );
};

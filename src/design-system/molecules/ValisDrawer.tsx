import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ValisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ariaLabel?: string;
  headerExtra?: React.ReactNode;
  bodyClassName?: string;
  children: React.ReactNode;
}

/**
 * Unified Atomic Slide-Over Drawer for Valis (VALIS-RULE-10).
 * Used across both Valis Employee App (Source Context Inspector)
 * and Valis Admin Console (AI Security Permissions & Test AI Chat).
 *
 * Always renders at w-[420px] (var(--valis-drawer-width)) over a full-viewport
 * blurred backdrop (bg-valis-text/15 backdrop-blur-[1.5px]), closing on backdrop click
 * or pressing Escape.
 */
export const ValisDrawer: React.FC<ValisDrawerProps> = ({
  isOpen,
  onClose,
  eyebrow,
  title,
  subtitle,
  ariaLabel,
  headerExtra,
  bodyClassName,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Full-Viewport Blurred Backdrop */}
      <div
        aria-hidden="true"
        data-testid="drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-valis-text/15 backdrop-blur-[1.5px] transition-opacity"
      />

      {/* Slide-Over Overlay Drawer (w-[420px]) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        className="fixed inset-y-0 right-0 w-[var(--valis-drawer-width)] max-w-full z-50 bg-valis-bg border-l border-valis-sidebarborder shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Sticky Unified Drawer Header */}
        <div className="px-5 pt-5 shrink-0 bg-valis-bg">
          <div className="pb-4 border-b border-valis-sidebarborder flex items-start justify-between gap-3">
            <div className="min-w-0">
              {eyebrow && (
                <div className="text-[11px] uppercase tracking-[0.06em] font-medium text-valis-subtle mb-1">
                  {eyebrow}
                </div>
              )}
              <h2 className="text-[18px] font-semibold tracking-[-0.015em] text-valis-text leading-[1.3] truncate">
                {title}
              </h2>
              {subtitle && (
                <div className="text-[12.5px] text-valis-muted mt-0.5 truncate">
                  {subtitle}
                </div>
              )}
            </div>
            <button
              type="button"
              aria-label="Close drawer"
              onClick={onClose}
              className="text-valis-muted hover:text-valis-text p-1 -mr-1 rounded-[var(--valis-checkbox-radius)] hover:bg-valis-sidebarborder/60 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {headerExtra && <div>{headerExtra}</div>}
        </div>

        {/* Independently Scrollable Body */}
        <div
          className={
            bodyClassName ?? 'flex-1 overflow-y-auto px-5 py-5 pb-8 min-h-0'
          }
        >
          {children}
        </div>
      </aside>
    </>
  );
};

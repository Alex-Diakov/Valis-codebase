import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, Check } from 'lucide-react';
import { ProductSurface, UxVersionMode } from '../../types/valis';

interface ProfileSwitcherFooterProps {
  surface: ProductSurface;
  uxMode: UxVersionMode;
  subtitle?: string;
  showAvatar?: boolean;
  onSelectSurface: (surface: ProductSurface) => void;
  onSelectUxMode: (mode: UxVersionMode) => void;
}

export const ProfileSwitcherFooter: React.FC<ProfileSwitcherFooterProps> = ({
  surface,
  uxMode,
  subtitle = 'Demo company',
  showAvatar = true,
  onSelectSurface,
  onSelectUxMode,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative p-3.5 border-t border-valis-sidebarborder select-none shrink-0"
    >
      {/* Popover Menu above Profile Card */}
      {open && (
        <div
          role="dialog"
          aria-label="Workspace and UX mode switcher"
          className="absolute bottom-full left-2.5 right-2.5 mb-2 bg-valis-canvas border border-valis-chromeborder rounded-[var(--valis-control-radius)] p-2 z-50"
        >
          {/* Section 1: Workspace Surface */}
          <div className="px-2 pt-1 pb-1 text-[10px] uppercase tracking-[0.08em] text-valis-subtle font-semibold">
            Workspace Surface
          </div>
          <div className="space-y-0.5 mb-2">
            <button
              type="button"
              onClick={() => {
                onSelectSurface('employee-app');
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[var(--valis-checkbox-radius)] text-[12px] text-left transition-colors cursor-pointer ${
                surface === 'employee-app'
                  ? 'bg-valis-sidebar text-valis-text font-medium'
                  : 'text-valis-muted hover:bg-valis-bg hover:text-valis-text'
              }`}
            >
              <span className="truncate">🖥 Valis Employee App</span>
              {surface === 'employee-app' && (
                <Check className="w-3.5 h-3.5 text-valis-text shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectSurface('admin-console');
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[var(--valis-checkbox-radius)] text-[12px] text-left transition-colors cursor-pointer ${
                surface === 'admin-console'
                  ? 'bg-valis-sidebar text-valis-text font-medium'
                  : 'text-valis-muted hover:bg-valis-bg hover:text-valis-text'
              }`}
            >
              <span className="truncate">⚙️ Valis Admin Console</span>
              {surface === 'admin-console' && (
                <Check className="w-3.5 h-3.5 text-valis-text shrink-0" />
              )}
            </button>
          </div>

          <div className="border-t border-valis-divider my-1.5" />

          {/* Section 2: UX Version Mode */}
          <div className="px-2 pt-1 pb-1 text-[10px] uppercase tracking-[0.08em] text-valis-subtle font-semibold">
            UX Version Mode
          </div>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                onSelectUxMode('v1-baseline');
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[var(--valis-checkbox-radius)] text-[12px] text-left transition-colors cursor-pointer ${
                uxMode === 'v1-baseline'
                  ? 'bg-valis-sidebar text-valis-text font-medium'
                  : 'text-valis-muted hover:bg-valis-bg hover:text-valis-text'
              }`}
            >
              <span className="truncate">v1.0 Original Baseline</span>
              {uxMode === 'v1-baseline' && (
                <Check className="w-3.5 h-3.5 text-valis-text shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectUxMode('v2-improvements');
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[var(--valis-checkbox-radius)] text-[12px] text-left transition-colors cursor-pointer ${
                uxMode === 'v2-improvements'
                  ? 'bg-valis-sidebar text-valis-text font-medium'
                  : 'text-valis-muted hover:bg-valis-bg hover:text-valis-text'
              }`}
            >
              <span className="truncate">✨ v2.0 HCI Improvements</span>
              {uxMode === 'v2-improvements' && (
                <Check className="w-3.5 h-3.5 text-valis-text shrink-0" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Trigger Button: Profile Card */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="w-full flex items-center justify-between gap-2 px-1.5 py-1 -mx-1.5 -my-1 rounded-[var(--valis-control-radius)] hover:bg-valis-sidebarborder/60 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {showAvatar && (
            <div className="w-7 h-7 rounded-full bg-valis-activeitem text-valis-text text-[11px] font-semibold flex items-center justify-center shrink-0">
              AM
            </div>
          )}
          <div className="min-w-0 leading-tight">
            <div className="text-[13px] font-medium text-valis-text truncate">
              Alex Morgan
            </div>
            <div className="text-[11.5px] text-valis-muted truncate">
              {subtitle}
            </div>
          </div>
        </div>
        <ChevronUp
          className={`w-3.5 h-3.5 text-valis-subtle shrink-0 transition-transform ${
            open ? 'rotate-180 text-valis-text' : ''
          }`}
        />
      </button>
    </div>
  );
};

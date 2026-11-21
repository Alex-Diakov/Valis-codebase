import React from 'react';
import {
  LayoutGrid,
  Activity,
  RefreshCw,
  FileText,
  CheckSquare,
  KeyRound,
  Shield,
  Video,
} from 'lucide-react';
import { AdminNavId, ProductSurface, UxVersionMode } from '../types/valis';
import { ProfileSwitcherFooter } from '../design-system/molecules/ProfileSwitcherFooter';

interface AdminSidebarProps {
  activeNav: AdminNavId;
  uxMode: UxVersionMode;
  onSelectNav: (nav: AdminNavId) => void;
  onSelectSurface: (surface: ProductSurface) => void;
  onSelectUxMode: (mode: UxVersionMode) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeNav,
  uxMode,
  onSelectNav,
  onSelectSurface,
  onSelectUxMode,
}) => {
  return (
    <aside className="w-[var(--valis-sidebar-width)] h-full flex flex-col justify-between bg-valis-sidebar border-r border-valis-sidebarborder shrink-0 select-none">
      <div className="p-3.5 flex-1 min-h-0 overflow-y-auto">
        {/* Logo: lockup-ink.svg + ADMIN */}
        <div className="flex items-center gap-1.5 px-2 pt-1 pb-4">
          <img
            src="https://valis.so/assets/brand-2026-11/lockup-ink.svg"
            alt="valis"
            className="h-[20px] w-auto block select-none"
          />
          <span className="text-[9px] uppercase tracking-[0.12em] text-valis-muted font-medium leading-none mt-0.5">
            ADMIN
          </span>
        </div>

        {/* Top Menu */}
        <nav className="space-y-0.5" aria-label="Valis Admin Sidebar">
          <button
            type="button"
            onClick={() => onSelectNav('Overview')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] text-[13px] rounded-[var(--valis-control-radius)] transition-colors cursor-pointer text-left ${
              activeNav === 'Overview'
                ? 'bg-valis-activeitem text-valis-text font-medium'
                : 'text-valis-navinactive hover:text-valis-text hover:bg-valis-sidebarhover/60'
            }`}
          >
            <LayoutGrid className="w-[15px] h-[15px] shrink-0" strokeWidth={1.6} />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectNav('Valis Pulse')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] text-[13px] rounded-[var(--valis-control-radius)] transition-colors cursor-pointer text-left ${
              activeNav === 'Valis Pulse'
                ? 'bg-valis-activeitem text-valis-text font-medium'
                : 'text-valis-navinactive hover:text-valis-text hover:bg-valis-sidebarhover/60'
            }`}
          >
            <Activity className="w-[15px] h-[15px] shrink-0" strokeWidth={1.6} />
            <span>Valis Pulse</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectNav('Management Loop')}
            className={`w-full flex items-center justify-between gap-2 px-2.5 py-[7px] text-[13px] rounded-[var(--valis-control-radius)] transition-colors cursor-pointer text-left ${
              activeNav === 'Management Loop'
                ? 'bg-valis-activeitem text-valis-text font-medium'
                : 'text-valis-navinactive hover:text-valis-text hover:bg-valis-sidebarhover/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-[15px] h-[15px] shrink-0" strokeWidth={1.6} />
              <span className="leading-[1.2]">
                Management
                <br />
                Loop
              </span>
            </div>
            <span className="text-valis-orange text-[10px] font-medium leading-[1.15] text-left shrink-0">
              Early
              <br />
              access
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectNav('Reports')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] text-[13px] rounded-[var(--valis-control-radius)] transition-colors cursor-pointer text-left ${
              activeNav === 'Reports'
                ? 'bg-valis-activeitem text-valis-text font-medium'
                : 'text-valis-navinactive hover:text-valis-text hover:bg-valis-sidebarhover/60'
            }`}
          >
            <FileText className="w-[15px] h-[15px] shrink-0" strokeWidth={1.6} />
            <span>Reports</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectNav('Runbooks')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] text-[13px] rounded-[var(--valis-control-radius)] transition-colors cursor-pointer text-left ${
              activeNav === 'Runbooks'
                ? 'bg-valis-activeitem text-valis-text font-medium'
                : 'text-valis-navinactive hover:text-valis-text hover:bg-valis-sidebarhover/60'
            }`}
          >
            <CheckSquare className="w-[15px] h-[15px] shrink-0" strokeWidth={1.6} />
            <span>Runbooks</span>
          </button>

          {/* SECURITY Section Header */}
          <div className="pt-4 pb-1 px-2.5">
            <span className="text-[10px] uppercase tracking-[0.1em] text-valis-muted font-medium">
              SECURITY
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectNav('AI access')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] text-[13px] rounded-[var(--valis-control-radius)] transition-colors cursor-pointer text-left ${
              activeNav === 'AI access'
                ? 'bg-valis-activeitem text-valis-text font-medium'
                : 'text-valis-navinactive hover:text-valis-text hover:bg-valis-sidebarhover/60'
            }`}
          >
            <KeyRound className="w-[15px] h-[15px] shrink-0" strokeWidth={1.6} />
            <span>AI access</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectNav('Audit log')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] text-[13px] rounded-[var(--valis-control-radius)] transition-colors cursor-pointer text-left ${
              activeNav === 'Audit log'
                ? 'bg-valis-activeitem text-valis-text font-medium'
                : 'text-valis-navinactive hover:text-valis-text hover:bg-valis-sidebarhover/60'
            }`}
          >
            <Shield className="w-[15px] h-[15px] shrink-0" strokeWidth={1.6} />
            <span>Audit log</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectNav('Meeting permissions')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] text-[13px] rounded-[var(--valis-control-radius)] transition-colors cursor-pointer text-left ${
              activeNav === 'Meeting permissions'
                ? 'bg-valis-activeitem text-valis-text font-medium'
                : 'text-valis-navinactive hover:text-valis-text hover:bg-valis-sidebarhover/60'
            }`}
          >
            <Video className="w-[15px] h-[15px] shrink-0" strokeWidth={1.6} />
            <span>Meeting permissions</span>
          </button>
        </nav>
      </div>

      {/* Bottom Profile Switcher Menu */}
      <ProfileSwitcherFooter
        surface="admin-console"
        uxMode={uxMode}
        subtitle="CEO · Demo company"
        showAvatar={true}
        onSelectSurface={onSelectSurface}
        onSelectUxMode={onSelectUxMode}
      />
    </aside>
  );
};

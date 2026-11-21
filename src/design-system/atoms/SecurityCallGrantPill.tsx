import React from 'react';

interface SecurityCallGrantPillProps {
  mode: 'toggle' | 'not-manager' | 'blocked';
  allowed: boolean;
  personName: string;
  onToggle?: () => void;
}

export const SecurityCallGrantPill: React.FC<SecurityCallGrantPillProps> = ({
  mode,
  allowed,
  personName,
  onToggle,
}) => {
  if (mode === 'not-manager') {
    return (
      <span className="inline-flex items-center whitespace-nowrap bg-valis-bg border border-valis-sidebarborder text-valis-muted text-[11.5px] font-medium px-2 py-0.5 rounded-[var(--valis-checkbox-radius)]">
        ○ Blocked (Not a manager)
      </span>
    );
  }

  if (mode === 'blocked') {
    return (
      <span className="inline-flex items-center whitespace-nowrap bg-valis-privatebg border border-valis-privateborder text-valis-privatetext text-[11.5px] font-medium px-2 py-0.5 rounded-[var(--valis-checkbox-radius)]">
        🚫 Blocked
      </span>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={allowed}
      aria-label={`Toggle team call visibility grant for ${personName}`}
      onClick={onToggle}
      className={`inline-flex items-center whitespace-nowrap text-[11.5px] font-medium px-2 py-0.5 rounded-[var(--valis-checkbox-radius)] border transition-colors cursor-pointer ${
        allowed
          ? 'bg-valis-greenbg border-valis-greenborder text-valis-green hover:border-valis-green'
          : 'bg-valis-sidebar border-valis-chromeborder text-valis-secondary hover:text-valis-text hover:border-valis-text'
      }`}
    >
      {allowed ? '● Allowed (Grant active)' : '○ Blocked (Participants-only)'}
    </button>
  );
};

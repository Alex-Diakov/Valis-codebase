import React from 'react';
import { SecurityToolAccessOption } from '../../types/valis';

interface SecurityToolAccessPillProps {
  value: SecurityToolAccessOption;
  toolName: string;
  teamName: string;
  onCycle: () => void;
}

export const SecurityToolAccessPill: React.FC<SecurityToolAccessPillProps> = ({
  value,
  toolName,
  teamName,
  onCycle,
}) => {
  return (
    <button
      type="button"
      onClick={onCycle}
      title={`Click to cycle ${toolName} access for ${teamName}`}
      aria-label={`${toolName} access for ${teamName}: ${value}. Click to cycle.`}
      className="inline-flex items-center whitespace-nowrap text-[12px] font-medium px-2.5 py-1 rounded-[var(--valis-checkbox-radius)] border border-valis-controlborder bg-valis-canvas text-valis-text hover:border-valis-text transition-colors cursor-pointer"
    >
      <span>{value}</span>
    </button>
  );
};

interface SecurityToolSegmentedSwitchProps {
  value: SecurityToolAccessOption;
  toolName: string;
  subjectName: string;
  disabled?: boolean;
  disabledReason?: string;
  onChange: (nextOption: SecurityToolAccessOption) => void;
}

const SEGMENT_OPTIONS: {
  option: SecurityToolAccessOption;
  shortLabel: 'Off' | 'Read' | 'Edit';
}[] = [
  { option: 'No access', shortLabel: 'Off' },
  { option: 'Read-only', shortLabel: 'Read' },
  { option: 'Edit (Approve)', shortLabel: 'Edit' },
];

export const SecurityToolSegmentedSwitch: React.FC<
  SecurityToolSegmentedSwitchProps
> = ({ value, toolName, subjectName, disabled = false, disabledReason, onChange }) => {
  return (
    <div
      role="group"
      aria-label={`${toolName} permission switch for ${subjectName}`}
      title={disabled ? disabledReason : undefined}
      className="inline-flex items-center bg-valis-divider border border-valis-chromeborder rounded-[5px] p-0.5 shrink-0"
    >
      {SEGMENT_OPTIONS.map((seg) => {
        const isActive = value === seg.option;

        return (
          <button
            key={seg.option}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled && value !== seg.option) {
                onChange(seg.option);
              }
            }}
            aria-pressed={isActive}
            className={`text-[11.5px] px-2.5 py-0.5 rounded-[4px] border transition-colors whitespace-nowrap ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            } ${
              isActive
                ? 'bg-valis-canvas border-valis-controlborder text-valis-text font-semibold'
                : 'border-transparent text-valis-muted hover:text-valis-text'
            }`}
          >
            {seg.shortLabel}
          </button>
        );
      })}
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { SecurityToolAccessOption } from '../../types/valis';
import { ValisSegmentedSwitch } from './ValisSegmentedSwitch';

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

const SEGMENT_OPTIONS = [
  { value: 'No access' as const, label: 'Off', activeTone: 'neutral' as const },
  { value: 'Read-only' as const, label: 'Read', activeTone: 'neutral' as const },
  {
    value: 'Edit (Approve)' as const,
    label: 'Edit',
    activeTone: 'neutral' as const,
  },
];

export const SecurityToolSegmentedSwitch: React.FC<
  SecurityToolSegmentedSwitchProps
> = ({ value, toolName, subjectName, disabled = false, disabledReason, onChange }) => (
  <ValisSegmentedSwitch
    value={value}
    options={SEGMENT_OPTIONS}
    onChange={onChange}
    ariaLabel={`${toolName} permission switch for ${subjectName}`}
    disabled={disabled}
    disabledReason={disabledReason}
    size="sm"
  />
);

export interface SecurityToolStatusDropdownProps {
  value: SecurityToolAccessOption;
  toolName: string;
  subjectName: string;
  disabled?: boolean;
  disabledReason?: string;
  onChange: (nextOption: SecurityToolAccessOption) => void;
}

const TOOL_STATUS_MENU_OPTIONS: readonly {
  value: SecurityToolAccessOption;
  label: string;
  description: string;
}[] = [
  {
    value: 'No access',
    label: 'Off',
    description: 'No access for team or AI',
  },
  {
    value: 'Read-only',
    label: 'Read',
    description: 'Read-only access in OrgBrain',
  },
  {
    value: 'Edit (Approve)',
    label: 'Edit (Approve)',
    description: 'AI drafts actions; human approves',
  },
];

export const SecurityToolStatusDropdown: React.FC<
  SecurityToolStatusDropdownProps
> = ({
  value,
  toolName,
  subjectName,
  disabled = false,
  disabledReason,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  const activeOption =
    TOOL_STATUS_MENU_OPTIONS.find((opt) => opt.value === value) ??
    TOOL_STATUS_MENU_OPTIONS[0];

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 185);
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (nextOption: SecurityToolAccessOption) => {
    setIsOpen(false);
    if (nextOption !== value) {
      onChange(nextOption);
    }
  };

  const triggerToneClass =
    value === 'Edit (Approve)'
      ? 'bg-valis-greenbg border border-valis-greenborder text-valis-green font-medium'
      : value === 'Read-only'
      ? 'bg-valis-canvas border border-valis-controlborder hover:border-valis-text text-valis-text font-medium'
      : disabled
      ? 'text-valis-muted border border-transparent font-normal'
      : 'text-valis-muted hover:bg-valis-divider border border-transparent font-normal';

  return (
    <div ref={containerRef} className="relative inline-block shrink-0">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        title={
          disabled && disabledReason
            ? disabledReason
            : `Change ${toolName} access for ${subjectName}`
        }
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`${toolName} access for ${subjectName}: ${activeOption.label}`}
        className={`inline-flex items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-[var(--valis-button-radius)] text-[12.5px] leading-[1.2] transition-colors ${triggerToneClass} ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span>{activeOption.label}</span>
        <ChevronDown
          className="w-3 h-3 shrink-0 opacity-75"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>

      {isOpen && !disabled && (
        <div
          role="menu"
          aria-label={`${toolName} access options`}
          className={`absolute right-0 ${
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
          } bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-card-radius)] shadow-lg p-1 w-[230px] z-50`}
        >
          {TOOL_STATUS_MENU_OPTIONS.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-start justify-between gap-2 px-2.5 py-1.5 rounded-[var(--valis-button-radius)] text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-valis-bg' : 'hover:bg-valis-bg'
                }`}
              >
                <span className="min-w-0">
                  <span
                    className={`block text-[12.5px] font-medium leading-[1.3] ${
                      isSelected && option.value === 'Edit (Approve)'
                        ? 'text-valis-green'
                        : 'text-valis-text'
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="block text-[11.5px] text-valis-muted leading-[1.35] mt-0.5">
                    {option.description}
                  </span>
                </span>
                {isSelected && (
                  <Check
                    className={`w-[13px] h-[13px] shrink-0 mt-0.5 ${
                      option.value === 'Edit (Approve)'
                        ? 'text-valis-green'
                        : 'text-valis-text'
                    }`}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

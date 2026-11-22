import React from 'react';
import { Building2, User } from 'lucide-react';
import { MemoryScope } from '../../types/valis';

interface ScopeSegmentedControlProps {
  memoryScope: MemoryScope;
  onChangeMemoryScope: (scope: MemoryScope) => void;
}

export const ScopeSegmentedControl: React.FC<ScopeSegmentedControlProps> = ({
  memoryScope,
  onChangeMemoryScope,
}) => {
  const isOrgBrain = memoryScope === 'org-brain';
  const isSecondBrain = memoryScope === 'second-brain';

  return (
    <div className="mb-3">
      <div
        className="grid grid-cols-2 gap-1 bg-valis-sidebarborder p-1 rounded-[var(--valis-control-radius)] text-[12px]"
        role="group"
        aria-label="Workspace memory scope switcher"
      >
        <button
          type="button"
          onClick={() => onChangeMemoryScope('org-brain')}
          className={`inline-flex items-center justify-center gap-1.5 py-1 px-2 rounded-[var(--valis-checkbox-radius)] truncate transition-colors cursor-pointer ${
            isOrgBrain
              ? 'bg-valis-canvas text-valis-text font-medium'
              : 'text-valis-navinactive hover:text-valis-text'
          }`}
        >
          <Building2 className="w-[13px] h-[13px] shrink-0" strokeWidth={1.75} />
          <span className="truncate">Company</span>
        </button>
        <button
          type="button"
          onClick={() => onChangeMemoryScope('second-brain')}
          className={`inline-flex items-center justify-center gap-1.5 py-1 px-2 rounded-[var(--valis-checkbox-radius)] truncate transition-colors cursor-pointer ${
            isSecondBrain
              ? 'bg-valis-canvas text-valis-text font-medium'
              : 'text-valis-navinactive hover:text-valis-text'
          }`}
        >
          <User className="w-[13px] h-[13px] shrink-0" strokeWidth={1.75} />
          <span className="truncate">Personal</span>
        </button>
      </div>
    </div>
  );
};

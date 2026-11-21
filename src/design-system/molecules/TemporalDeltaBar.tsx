import React from 'react';
import { ListFilter, X } from 'lucide-react';

interface TemporalDeltaBarProps {
  unseenChangesCount: number;
  showOnlyChanges: boolean;
  onToggleShowOnlyChanges: () => void;
  onMarkSeen: () => void;
  onResetDemoDelta: () => void;
}

export const TemporalDeltaBar: React.FC<TemporalDeltaBarProps> = ({
  unseenChangesCount,
  showOnlyChanges,
  onToggleShowOnlyChanges,
  onMarkSeen,
  onResetDemoDelta,
}) => {
  if (unseenChangesCount === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 text-[12.5px] text-valis-subtle">
        <span>All caught up</span>
        <span>·</span>
        <button
          type="button"
          onClick={onResetDemoDelta}
          className="text-[12.5px] text-valis-subtle hover:text-valis-text underline cursor-pointer"
        >
          Reset demo updates
        </button>
      </div>
    );
  }

  const changeWord = unseenChangesCount === 1 ? 'change' : 'changes';
  const updateWord = unseenChangesCount === 1 ? 'update' : 'updates';

  return (
    <div className="inline-flex flex-wrap items-center">
      {showOnlyChanges ? (
        <div className="bg-valis-text text-valis-canvas border border-valis-text font-medium text-[12.5px] px-2.5 py-0.5 rounded-[5px] inline-flex items-center gap-1.5">
          <span>
            Filtering {unseenChangesCount} {updateWord}
          </span>
          <button
            type="button"
            onClick={onToggleShowOnlyChanges}
            aria-label="Clear changes filter"
            title="Clear filter"
            className="p-1 -mr-1 rounded hover:bg-valis-canvas/20 transition-colors cursor-pointer flex items-center justify-center"
          >
            <X className="w-3 h-3" strokeWidth={2.25} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onToggleShowOnlyChanges}
          className="bg-valis-bg hover:bg-valis-chrome border border-valis-controlborder text-valis-text text-[12.5px] px-2.5 py-0.5 rounded-[5px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ListFilter
            className="w-[12.5px] h-[12.5px] text-valis-orange shrink-0"
            strokeWidth={2}
          />
          <span>
            {unseenChangesCount} {changeWord} since 09:40
          </span>
        </button>
      )}
      <button
        type="button"
        onClick={onMarkSeen}
        className="text-[12.5px] text-valis-subtle hover:text-valis-text underline ml-2 cursor-pointer"
      >
        Mark seen
      </button>
    </div>
  );
};

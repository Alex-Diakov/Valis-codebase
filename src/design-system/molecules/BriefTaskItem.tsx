import React from 'react';
import {
  BriefTaskItem as BriefTaskItemType,
  SourceLink,
  TaskResolutionState,
  UxVersionMode,
} from '../../types/valis';
import { ValisCheckbox } from '../atoms/ValisCheckbox';
import { SourceCitationLink } from '../atoms/SourceCitationLink';

interface BriefTaskItemProps {
  item: BriefTaskItemType;
  uxMode: UxVersionMode;
  unseenChangesCount: number;
  showOnlyChanges: boolean;
  onToggle: (id: string) => void;
  onSelectSource: (source: SourceLink) => void;
  onSetResolutionState: (id: string, state: TaskResolutionState) => void;
}

export const BriefTaskItem: React.FC<BriefTaskItemProps> = ({
  item,
  uxMode,
  unseenChangesCount,
  showOnlyChanges,
  onToggle,
  onSelectSource,
  onSetResolutionState,
}) => {
  const isV2 = uxMode === 'v2-improvements';
  const resolution = item.resolutionState ?? 'open';
  const isWriteBack = item.syncPolicy === 'write-back';
  const isJiraTask = item.externalSystem === 'Jira';
  const isCompleted = item.completed || resolution === 'writeback-queued';
  const primarySource = item.sources[0];

  const hasActiveDelta =
    isV2 &&
    !isCompleted &&
    unseenChangesCount > 0 &&
    Boolean(item.hasUnseenDelta);

  const minimalDeltaLabel =
    item.id.startsWith('voice-') ||
    item.deltaTimestamp === 'Added just now' ||
    item.deltaTimestamp === 'Just now'
      ? 'Added just now'
      : item.id === 'dec-2'
      ? 'Updated 18m ago'
      : item.id === 'owe-1'
      ? 'Updated 14m ago'
      : item.id === 'sig-1'
      ? 'Updated 12m ago'
      : 'Updated 18m ago';

  // When hidden from today's brief, actually hide the row from the list (section header shows quiet counter + Restore)
  if (isV2 && resolution === 'dismissed-from-brief') {
    return null;
  }

  const isNativeValisItem =
    !item.externalSystem &&
    item.sources.every((s) => s.type === 'notes');

  const isCalendarEvent = item.section === 'Calendar';

  const handleLeftControlClick = () => {
    if (!isV2) {
      onToggle(item.id);
      return;
    }
    if (isCalendarEvent) {
      onSetResolutionState(item.id, 'dismissed-from-brief');
      return;
    }
    if (isCompleted) {
      onSetResolutionState(item.id, 'open');
    } else {
      onSetResolutionState(item.id, 'writeback-queued');
    }
  };

  return (
    <div
      className={`group -mx-3 px-3 py-1.5 rounded-[var(--valis-control-radius)] transition-all flex items-start gap-2.5 ${
        isCompleted ? 'bg-transparent' : 'hover:bg-valis-bg'
      }`}
    >
      {/* Uniform 15x15 Left Control: Dashed square for Calendar events vs Solid completable square for Decide / I owe / Others owe / Signals */}
      <ValisCheckbox
        checked={isCompleted}
        variant={isV2 && isCalendarEvent ? 'read-only' : 'write-back'}
        ariaLabel={
          isV2 && isCalendarEvent
            ? `Hide ${item.title} from brief (Read-only source)`
            : `Toggle ${item.title}`
        }
        title={
          isV2 && isCalendarEvent
            ? 'Hide from brief (Read-only source)'
            : isCompleted
            ? 'Undo completion'
            : isJiraTask
            ? `Close in Jira (${item.externalKey ?? 'Jira'})`
            : 'Mark Done'
        }
        onToggle={handleLeftControlClick}
      />

      <div className="flex-1 min-w-0 text-[14px] leading-[1.5] text-valis-text">
        {/* Top Row: Title + Description on left | Hover triage actions on right */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className={isCompleted ? 'line-through decoration-valis-subtle' : ''}>
              <span
                className={`font-semibold ${
                  isCompleted ? 'text-valis-completed' : 'text-valis-text'
                }`}
              >
                {item.title}
              </span>
              <span
                className={isCompleted ? 'text-valis-subtle' : 'text-valis-secondary'}
              >
                {' '}
                · {item.description}
              </span>
            </span>
          </div>

          {/* Right-Side Triage Controls (Hover-only even when completed) */}
          {isV2 && (
            <div className="flex items-center gap-1.5 shrink-0">
              {isCompleted ? (
                <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity inline-flex items-center gap-1.5 text-[12.5px] px-1.5 py-0.5">
                  <button
                    type="button"
                    onClick={() => onSetResolutionState(item.id, 'open')}
                    className="text-valis-text font-medium underline decoration-valis-underline hover:decoration-valis-text ml-1.5 cursor-pointer"
                  >
                    Undo
                  </button>
                </div>
              ) : (
                <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onSetResolutionState(item.id, 'dismissed-from-brief')
                    }
                    className="text-valis-muted hover:text-valis-text text-[12.5px] px-1.5 py-0.5 rounded-[var(--valis-checkbox-radius)] transition-colors cursor-pointer"
                  >
                    Hide
                  </button>
                  {primarySource && (
                    <button
                      type="button"
                      onClick={() => onSelectSource(primarySource)}
                      className="bg-valis-canvas border border-valis-controlborder hover:border-valis-text hover:bg-valis-bg text-valis-text text-[12.5px] font-medium px-2.5 py-0.5 rounded-[var(--valis-button-radius)] transition-colors cursor-pointer"
                    >
                      Open in source ↗
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detailed diff line ONLY revealed when showOnlyChanges === true */}
        {hasActiveDelta && showOnlyChanges && item.deltaSummary && (
          <div className="text-[12.5px] text-valis-ochre mt-0.5">
            {item.deltaSummary}
          </div>
        )}

        {/* Metadata Row: Source Citations · ● Updated Xm ago · Quiet Hover-Only Sync Status */}
        <div className="mt-1 inline-flex flex-wrap items-center gap-2 text-[12.5px] text-valis-subtle">
          <div className="inline-flex flex-wrap items-center gap-1.5">
            {item.sources.map((src, idx) => (
              <React.Fragment key={src.label}>
                {idx > 0 && <span aria-hidden="true">·</span>}
                <SourceCitationLink source={src} onSelect={onSelectSource} />
              </React.Fragment>
            ))}
          </div>

          {hasActiveDelta && (
            <>
              <span aria-hidden="true" className="text-valis-underline">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12.5px] text-valis-subtle">
                <span
                  aria-hidden="true"
                  className="w-[5px] h-[5px] rounded-full bg-valis-orange inline-block shrink-0"
                />
                <span>{minimalDeltaLabel}</span>
              </span>
            </>
          )}

          {isV2 && !isNativeValisItem && (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[12.5px] text-valis-subtle no-underline">
              · {isWriteBack ? 'Write-back' : 'Read-only'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

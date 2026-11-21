import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BriefTaskItem,
  BriefSectionName,
  MemoryScope,
  SourceLink,
  TaskResolutionState,
  UxVersionMode,
} from '../types/valis';
import {
  INITIAL_BRIEF_ITEMS,
  ValisMemoryService,
} from '../services/valisMemoryService';
import {
  toggleBriefItemCompletion,
  getBriefProgressStats,
} from '../utils/valisLogic';

export function useDailyBriefController(
  memoryScope: MemoryScope,
  uxMode: UxVersionMode
) {
  const [items, setItems] = useState<BriefTaskItem[]>(INITIAL_BRIEF_ITEMS);
  const [selectedSource, setSelectedSource] = useState<SourceLink | null>(null);
  const [isListeningCall, setIsListeningCall] = useState<boolean>(true);
  const [showOnlyChanges, setShowOnlyChanges] = useState<boolean>(false);
  const [changesDismissed, setChangesDismissed] = useState<boolean>(false);

  // Critical State Isolation: Immediately close right-hand Source Context Drawer on memoryScope switch
  useEffect(() => {
    setSelectedSource(null);
  }, [memoryScope]);

  const toggleShowOnlyChanges = useCallback(() => {
    setShowOnlyChanges((prev) => !prev);
  }, []);

  const markChangesSeen = useCallback(() => {
    setChangesDismissed(true);
    setShowOnlyChanges(false);
  }, []);

  const resetDemoDelta = useCallback(() => {
    setChangesDismissed(false);
    setShowOnlyChanges(false);
  }, []);

  const scopedItems = useMemo(
    () =>
      ValisMemoryService.filterBriefByMemoryScope(
        items,
        memoryScope,
        uxMode === 'v2-improvements'
      ),
    [items, memoryScope, uxMode]
  );

  const unseenChangesCount = useMemo(() => {
    if (changesDismissed) return 0;
    return scopedItems.filter(
      (item) =>
        Boolean(item.hasUnseenDelta || item.deltaTimestamp) &&
        item.resolutionState !== 'dismissed-from-brief'
    ).length;
  }, [scopedItems, changesDismissed]);

  const visibleItems = useMemo(() => {
    if (
      uxMode === 'v2-improvements' &&
      showOnlyChanges &&
      unseenChangesCount > 0
    ) {
      return scopedItems.filter((item) =>
        Boolean(item.hasUnseenDelta || item.deltaTimestamp)
      );
    }
    return scopedItems;
  }, [scopedItems, uxMode, showOnlyChanges, unseenChangesCount]);

  const stats = useMemo(
    () => getBriefProgressStats(visibleItems),
    [visibleItems]
  );

  const toggleItem = useCallback((id: string) => {
    setItems((prev) => toggleBriefItemCompletion(prev, id));
  }, []);

  const setItemResolutionState = useCallback(
    (id: string, resolutionState: TaskResolutionState) => {
      setItems((prev) => {
        const target = prev.find((item) => item.id === id);
        if (
          resolutionState === 'dismissed-from-brief' &&
          target &&
          selectedSource &&
          target.sources.some((s) => s.label === selectedSource.label)
        ) {
          setSelectedSource(null);
        }

        return prev.map((item) => {
          if (item.id !== id) return item;
          return {
            ...item,
            resolutionState,
            completed:
              resolutionState === 'writeback-queued'
                ? true
                : resolutionState === 'open'
                ? false
                : item.completed,
          };
        });
      });
    },
    [selectedSource]
  );

  const proposeCloseExternal = useCallback((id: string) => {
    setItems((prev) => ValisMemoryService.proposeCloseInExternalSystem(prev, id));
  }, []);

  const snoozeItem = useCallback((id: string) => {
    setItems((prev) => ValisMemoryService.snoozeItemFromBrief(prev, id));
  }, []);

  const addVoiceNoteTask = useCallback(
    (title: string, description: string, section: BriefSectionName) => {
      const newItem: BriefTaskItem = {
        id: `voice-${Date.now()}`,
        section,
        title,
        description,
        completed: false,
        memoryScope,
        isNewSinceLastOpen: true,
        hasUnseenDelta: true,
        deltaBadgeLabel: 'Added just now',
        deltaSummary:
          memoryScope === 'second-brain'
            ? '↳ Change: Captured via private Second Brain voice note'
            : '↳ Change: Captured via shared OrgBrain voice note',
        syncPolicy: 'write-back',
        resolutionState: 'open',
        deltaTimestamp: 'Added just now',
        sources: [
          {
            label:
              memoryScope === 'second-brain'
                ? 'Private Voice Note · Mon 16 Nov'
                : 'Voice Note · Mon 16 Nov',
            type: 'notes',
            previewTitle: `Voice Note: ${title}`,
            previewMeta:
              memoryScope === 'second-brain'
                ? 'Mon 16 Nov · Second Brain (Private / Only You)'
                : 'Mon 16 Nov · OrgBrain (Shared Company)',
            previewBody: description,
          },
        ],
      };
      setItems((prev) => [newItem, ...prev]);
      setChangesDismissed(false);
    },
    [memoryScope]
  );

  return {
    items,
    visibleItems,
    stats,
    newUpdatesCount: unseenChangesCount,
    unseenChangesCount,
    showOnlyChanges,
    highlightNewDelta: showOnlyChanges,
    setHighlightNewDelta: setShowOnlyChanges,
    toggleShowOnlyChanges,
    markChangesSeen,
    resetDemoDelta,
    selectedSource,
    setSelectedSource,
    isListeningCall,
    setIsListeningCall,
    toggleItem,
    setItemResolutionState,
    proposeCloseExternal,
    snoozeItem,
    addVoiceNoteTask,
  };
}

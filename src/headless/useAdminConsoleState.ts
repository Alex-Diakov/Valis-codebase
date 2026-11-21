import { useState, useMemo, useCallback } from 'react';
import {
  ReportRow,
  ReportType,
  ManagementCommitItem,
  RunbookItem,
  AttentionItem,
  LoopExecutionMode,
} from '../types/valis';
import {
  INITIAL_REPORTS,
  INITIAL_MANAGEMENT_COMMITMENTS,
  INITIAL_RUNBOOKS,
  INITIAL_ATTENTION_ITEMS,
  PULSE_METRICS,
  WEEKLY_WORK_BARS,
  SECURITY_COLUMNS,
  INITIAL_AUDIT_EVENTS,
} from '../services/valisMemoryService';
import { filterReports, cycleCommitmentStatus } from '../utils/valisLogic';

export function useAdminConsoleState(completedBriefTasksDelta: number = 0) {
  const [reports] = useState<ReportRow[]>(INITIAL_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All departments');
  const [selectedType, setSelectedType] = useState<'All' | ReportType>('All');
  const [openedReport, setOpenedReport] = useState<ReportRow | null>(null);

  const [commitments, setCommitments] = useState<ManagementCommitItem[]>(
    INITIAL_MANAGEMENT_COMMITMENTS
  );
  const [loopModeFilter, setLoopModeFilter] = useState<'All' | LoopExecutionMode>('All');
  const [runbooks, setRunbooks] = useState<RunbookItem[]>(INITIAL_RUNBOOKS);
  const [activeDrilldown, setActiveDrilldown] = useState<
    AttentionItem['drilldownKey'] | null
  >(null);
  const [dateRangeLabel, setDateRangeLabel] = useState(
    'Last 28 days · 19 Oct – 15 Nov'
  );

  const visibleReports = useMemo(() => {
    const filtered = filterReports(reports, {
      searchQuery,
      department: selectedDepartment,
      typeFilter: selectedType,
    });
    if (
      selectedType === 'All' &&
      selectedDepartment === 'All departments' &&
      searchQuery.trim() === ''
    ) {
      return filtered.filter((r) => r.id !== 'rep-6');
    }
    return filtered;
  }, [reports, searchQuery, selectedDepartment, selectedType]);

  const visibleCommitments = useMemo(() => {
    if (loopModeFilter === 'All') return commitments;
    return commitments.filter((c) => (c.loopMode ?? 'Human-in-the-loop') === loopModeFilter);
  }, [commitments, loopModeFilter]);

  const livePulseMetrics = useMemo(() => {
    const baseCompleted = 174 + completedBriefTasksDelta;
    return PULSE_METRICS.map((m) =>
      m.id === 'm-1' ? { ...m, value: String(baseCompleted) } : m
    );
  }, [completedBriefTasksDelta]);

  const handleCycleCommitment = useCallback((id: string) => {
    setCommitments((prev) => cycleCommitmentStatus(prev, id));
  }, []);

  const handleApproveHumanLoop = useCallback((id: string) => {
    setCommitments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              approvedByHuman: true,
              status: 'Completed',
            }
          : item
      )
    );
  }, []);

  const handleAddCommitment = useCallback(
    (owner: string, role: string, commitment: string, dueDate: string) => {
      const item: ManagementCommitItem = {
        id: `mc-${Date.now()}`,
        owner,
        role,
        commitment,
        dueDate,
        status: 'On track',
        source: 'Management Loop · Direct entry',
        loopMode: 'Human-in-the-loop',
        targetSystem: 'Valis Queue',
        approvedByHuman: false,
      };
      setCommitments((prev) => [item, ...prev]);
    },
    []
  );

  const handleRunRunbook = useCallback((id: string) => {
    setRunbooks((prev) =>
      prev.map((rb) =>
        rb.id === id
          ? {
              ...rb,
              lastRun: '16 Nov · Just now',
              status: 'Passed',
            }
          : rb
      )
    );
  }, []);

  const toggleDateRange = useCallback(() => {
    setDateRangeLabel((prev) =>
      prev.includes('28 days')
        ? 'Last 90 days · 18 Aug – 15 Nov'
        : 'Last 28 days · 19 Oct – 15 Nov'
    );
  }, []);

  return {
    reports,
    visibleReports,
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    selectedType,
    setSelectedType,
    openedReport,
    setOpenedReport,
    commitments,
    visibleCommitments,
    loopModeFilter,
    setLoopModeFilter,
    handleCycleCommitment,
    handleApproveHumanLoop,
    handleAddCommitment,
    runbooks,
    handleRunRunbook,
    attentionItems: INITIAL_ATTENTION_ITEMS,
    livePulseMetrics,
    weeklyBars: WEEKLY_WORK_BARS,
    activeDrilldown,
    setActiveDrilldown,
    dateRangeLabel,
    toggleDateRange,
    securityColumns: SECURITY_COLUMNS,
    auditEvents: INITIAL_AUDIT_EVENTS,
  };
}

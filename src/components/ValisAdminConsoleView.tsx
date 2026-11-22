import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  AdminNavId,
  ReportRow,
  ReportType,
  RunbookItem,
  ManagementCommitItem,
  AttentionItem,
  PulseMetric,
  WeeklyWorkBar,
  SecurityColumn,
  AuditLogEvent,
  LoopExecutionMode,
  ProductSurface,
  UxVersionMode,
} from '../types/valis';
import { AdminSidebar } from './AdminSidebar';
import { MetricCard } from '../design-system/atoms/MetricCard';
import { PulseAttentionRow } from '../design-system/molecules/PulseAttentionRow';
import { AiSecurityView } from './AiSecurityView';

interface ValisAdminConsoleViewProps {
  activeAdminNav: AdminNavId;
  onSelectAdminNav: (nav: AdminNavId) => void;
  uxMode: UxVersionMode;
  onSelectSurface: (surface: ProductSurface) => void;
  onSelectUxMode: (mode: UxVersionMode) => void;
  onSwitchToEmployeeApp: () => void;
  // Reports state
  reports: ReportRow[];
  visibleReports: ReportRow[];
  searchQuery: string;
  onChangeSearchQuery: (q: string) => void;
  selectedDepartment: string;
  onChangeDepartment: (dept: string) => void;
  selectedType: 'All' | ReportType;
  onChangeType: (type: 'All' | ReportType) => void;
  openedReport: ReportRow | null;
  onSelectReport: (report: ReportRow | null) => void;
  // Pulse state
  attentionItems: AttentionItem[];
  metrics: PulseMetric[];
  weeklyBars: WeeklyWorkBar[];
  activeDrilldown: AttentionItem['drilldownKey'] | null;
  onSelectDrilldown: (key: AttentionItem['drilldownKey'] | null) => void;
  dateRangeLabel: string;
  onToggleDateRange: () => void;
  // Management Loop state
  commitments: ManagementCommitItem[];
  visibleCommitments: ManagementCommitItem[];
  loopModeFilter: 'All' | LoopExecutionMode;
  onChangeLoopModeFilter: (mode: 'All' | LoopExecutionMode) => void;
  onCycleCommitment: (id: string) => void;
  onApproveHumanLoop: (id: string) => void;
  onAddCommitment: (
    owner: string,
    role: string,
    commitment: string,
    dueDate: string
  ) => void;
  // Runbooks & Security state
  runbooks: RunbookItem[];
  onRunRunbook: (id: string) => void;
  securityColumns: SecurityColumn[];
  auditEvents: AuditLogEvent[];
}

const PILL_TABS: ('All' | ReportType)[] = [
  'All',
  'Profile',
  'Summary',
  'Pipeline',
  'Guidelines',
];

const DEPARTMENTS = [
  'All departments',
  'Customer Support',
  'Engineering',
  'HR',
  'Finance',
  'Sales',
];

interface ProposedApprovalRow {
  id: string;
  ownerFirst: string;
  ownerLast: string;
  nextStep: string;
  why: string;
  source: string;
}

const INITIAL_PROPOSED_APPROVALS: ProposedApprovalRow[] = [
  {
    id: 'pa-1',
    ownerFirst: 'Priya',
    ownerLast: 'Nair',
    nextStep:
      'Confirm which old-project commitments must continue before Friday renewal.',
    why: 'Old project renewals',
    source: 'Email from Priya Nair',
  },
  {
    id: 'pa-2',
    ownerFirst: 'Daniel',
    ownerLast: 'Kim',
    nextStep: 'Send the renewal risk view, promised for 10 Nov.',
    why: 'Board pack due next week',
    source: 'Jira OPS-142',
  },
  {
    id: 'pa-3',
    ownerFirst: 'Tom',
    ownerLast: 'Becker',
    nextStep:
      'Share renewal options by Wednesday, as agreed in the launch review.',
    why: 'Q4 priority: align promises',
    source: 'Meeting, launch review',
  },
  {
    id: 'pa-4',
    ownerFirst: 'Maria',
    ownerLast: 'Lopez',
    nextStep:
      'Agree one owner and shared result for duplicate contract reviews.',
    why: 'Duplicate reviews consume capacity',
    source: 'Meeting, operations',
  },
];

export const ValisAdminConsoleView: React.FC<ValisAdminConsoleViewProps> = ({
  activeAdminNav,
  onSelectAdminNav,
  uxMode,
  onSelectSurface,
  onSelectUxMode,
  reports,
  visibleReports,
  searchQuery,
  onChangeSearchQuery,
  selectedDepartment,
  onChangeDepartment,
  selectedType,
  onChangeType,
  openedReport,
  onSelectReport,
  attentionItems,
  metrics,
  activeDrilldown,
  onSelectDrilldown,
  dateRangeLabel,
  onToggleDateRange,
  runbooks,
  onRunRunbook,
  securityColumns,
  auditEvents,
}) => {
  const [managementMode, setManagementMode] = useState<
    'Human in the loop' | 'Autopilot'
  >('Human in the loop');
  const [approvalDecisions, setApprovalDecisions] = useState<
    Record<string, 'approved' | 'skipped' | undefined>
  >({});
  const [autopilotOverrides, setAutopilotOverrides] = useState<
    Record<string, 'paused' | undefined>
  >({});

  const handleSelectNav = (nav: AdminNavId) => {
    onSelectAdminNav(nav);
    onSelectReport(null);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      <AdminSidebar
        activeNav={activeAdminNav}
        onSelectNav={handleSelectNav}
        uxMode={uxMode}
        onSelectSurface={onSelectSurface}
        onSelectUxMode={onSelectUxMode}
      />

      {/* Right Main Scrollable Container for Non-Security Views (Unified Warm-Paper Canvas) */}
      {activeAdminNav !== 'AI access' &&
        activeAdminNav !== 'Audit log' &&
        activeAdminNav !== 'Meeting permissions' && (
          <div className="flex-1 h-full overflow-y-auto bg-valis-bg flex flex-col">
            <div className="max-w-[var(--valis-admin-workspace-max-width)] w-full mx-auto px-10 py-8">
        {/* 1. REPORTS */}
        {activeAdminNav === 'Reports' && !openedReport && (
          <div>
            {/* Title & Subtitle */}
            <div className="mb-4">
              <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                Reports
              </h1>
              <p className="text-[14px] text-valis-secondary mt-1">
                Workflow Diagnostics and the other generated reports, by department.
              </p>
            </div>

            {/* Filter Bar: Search input + All departments box */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
              <input
                type="text"
                aria-label="Search reports"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => onChangeSearchQuery(e.target.value)}
                className="w-[175px] bg-valis-canvas border border-valis-chromeborder rounded-[var(--valis-control-radius)] px-3.5 py-1.5 text-[13px] text-valis-text placeholder:text-valis-subtle focus:outline-none focus:border-valis-text"
              />

              <select
                aria-label="Filter by department"
                value={selectedDepartment}
                onChange={(e) => onChangeDepartment(e.target.value)}
                className="appearance-none bg-valis-canvas border border-valis-chromeborder rounded-[var(--valis-control-radius)] px-3.5 py-1.5 text-[13px] text-valis-muted focus:outline-none focus:border-valis-text cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabs: All, Profile, Summary, Pipeline, Guidelines */}
            <div
              className="flex flex-wrap items-center gap-2 mb-4"
              role="tablist"
              aria-label="Report type filter"
            >
              {PILL_TABS.map((tab) => {
                const isActive = selectedType === tab;
                return (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => onChangeType(tab)}
                      className={`rounded-full px-3.5 py-1 text-[12.5px] transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-valis-text text-valis-canvas font-medium'
                          : 'bg-valis-canvas text-valis-muted border border-valis-chromeborder hover:text-valis-text hover:border-valis-controlhover'
                      }`}
                    >
                      {tab}
                    </button>
                );
              })}
            </div>

            {/* White Table Card */}
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] px-6 py-2.5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-valis-divider text-[12.5px] font-semibold text-valis-text">
                    <th className="py-3 pr-4 font-semibold">Report</th>
                    <th className="py-3 px-4 font-semibold">Department</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 pl-4 text-right font-semibold">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-valis-divider text-[13.5px]">
                  {visibleReports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-[13px] text-valis-subtle"
                      >
                        No matching reports found.{' '}
                        <button
                          type="button"
                          onClick={() => {
                            onChangeSearchQuery('');
                            onChangeDepartment('All departments');
                            onChangeType('All');
                          }}
                          className="text-valis-blue underline ml-1 cursor-pointer"
                        >
                          Reset filters
                        </button>
                      </td>
                    </tr>
                  ) : (
                    visibleReports.map((row, index) => (
                      <tr
                        key={row.id}
                        onClick={() => onSelectReport(row)}
                        className="hover:bg-valis-bg transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 pr-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectReport(row);
                            }}
                            className={`text-left cursor-pointer ${
                              row.isPrimaryLink || index === 0
                                ? 'text-valis-blue font-medium underline decoration-valis-blueunderline underline-offset-4 group-hover:decoration-valis-blue'
                                : 'text-valis-text font-normal group-hover:text-valis-blue'
                            }`}
                          >
                            {row.title}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-valis-text">
                          {row.department}
                        </td>
                        <td className="py-3.5 px-4 text-valis-text">{row.type}</td>
                        <td className="py-3.5 pl-4 text-right text-valis-text tabular-nums">
                          {row.updated}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer note */}
            <div className="mt-3.5 text-[12.5px] text-valis-navinactive">
              Example:{' '}
              <button
                type="button"
                onClick={() => onSelectReport(reports[0])}
                className="hover:text-valis-text cursor-pointer"
              >
                open the Customer Support report.
              </button>
            </div>
          </div>
        )}

        {/* Detailed Report Inspector when a report row is opened */}
        {activeAdminNav === 'Reports' && openedReport && (
          <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] p-5">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-valis-divider">
              <button
                type="button"
                onClick={() => onSelectReport(null)}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-valis-blue hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Reports</span>
              </button>
              <div className="text-[12px] text-valis-subtle">
                {openedReport.department} · {openedReport.type} · Updated{' '}
                {openedReport.updated}
              </div>
            </div>

            <h2 className="text-[20px] font-semibold text-valis-text mb-1">
              {openedReport.title}
            </h2>
            <div className="text-[12px] text-valis-muted mb-4">
              Process Owner: {openedReport.owner} · Synthesized by Valis Workflow Diagnostics
            </div>

            <p className="text-[13.5px] text-valis-text leading-relaxed bg-valis-bg border border-valis-sidebarborder rounded-[var(--valis-control-radius)] p-3.5 mb-5">
              {openedReport.executiveSummary}
            </p>

            <h3 className="text-[12px] uppercase tracking-wider text-valis-muted font-semibold mb-2.5">
              Observed Workflow Bottlenecks & Findings
            </h3>
            <div className="divide-y divide-valis-divider border-t border-b border-valis-divider">
              {openedReport.findings.map((finding, i) => (
                <div
                  key={i}
                  className="py-3.5 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="text-[13.5px] font-semibold text-valis-text">
                      {finding.label}
                    </div>
                    <div className="text-[12.5px] text-valis-secondary mt-0.5">
                      {finding.detail}
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-valis-orange tabular-nums shrink-0">
                    {finding.metric}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. VALIS PULSE */}
        {activeAdminNav === 'Valis Pulse' && (
          <div>
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                Valis Pulse
              </h1>
              <button
                type="button"
                onClick={onToggleDateRange}
                aria-label="Toggle date range window"
                className="bg-valis-canvas border border-valis-controlborder hover:border-valis-text hover:bg-valis-bg text-valis-text text-[12.5px] font-medium px-3.5 py-1 rounded-[var(--valis-button-radius)] tabular-nums transition-colors cursor-pointer"
              >
                {dateRangeLabel}
              </button>
            </div>
            <p className="text-[14px] text-valis-secondary mt-1 mb-5">
              What needs attention, whether work is keeping up, and where meeting time goes.
            </p>

            {/* Card 1: Needs attention */}
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] px-5 py-4 mb-6">
              <div className="mb-3">
                <h3 className="text-[14px] font-semibold text-valis-text">
                  Needs attention
                </h3>
                <p className="text-[12.5px] text-valis-navinactive mt-0.5">
                  Each item states what changed and where. It does not establish a cause.
                </p>
              </div>

              <div className="divide-y divide-valis-divider">
                {attentionItems.map((item) => (
                  <PulseAttentionRow
                    key={item.id}
                    item={item}
                    onSelectDrilldown={(key) =>
                      onSelectDrilldown(activeDrilldown === key ? null : key)
                    }
                  />
                ))}
              </div>

              {/* Contextual Drilldown Panel if clicked */}
              {activeDrilldown && (
                <div className="mt-3 pt-3 border-t border-valis-sidebarborder bg-valis-bg rounded-[var(--valis-control-radius)] p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-semibold text-valis-text">
                      {activeDrilldown === 'workflow' &&
                        'Work flow breakdown · 212 created vs 174 completed (+38 net open)'}
                      {activeDrilldown === 'age' &&
                        'Open work by age · 96 of 306 active tasks > 90 days old (31.4%)'}
                      {activeDrilldown === 'capture' &&
                        'Eligible call capture · 58 of 62 Google Meet calls transcribed (93.5%)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectDrilldown(null)}
                      aria-label="Close drilldown"
                      className="text-valis-subtle hover:text-valis-text p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section Divider: — WORK */}
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="w-4 h-[1px] bg-valis-dash inline-block" />
              <span className="text-[11px] uppercase tracking-[0.06em] text-valis-subtle font-medium">
                WORK
              </span>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.id}
                  label={metric.label}
                  value={metric.value}
                />
              ))}
            </div>

            {/* Card 2: Is work keeping up? (Warm Valis Palette: Created valis-dots stone, Completed valis-ochre) */}
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] p-5 mb-4">
              <h3 className="text-[14px] font-semibold text-valis-text mb-5">
                Is work keeping up?
              </h3>

              <div className="grid grid-cols-4 gap-6 px-6 pt-2 items-end">
                {[
                  { week: 'Week 1', createdH: 108, completedH: 102 },
                  { week: 'Week 2', createdH: 124, completedH: 92 },
                  { week: 'Week 3', createdH: 114, completedH: 102 },
                  { week: 'Week 4', createdH: 130, completedH: 94 },
                ].map((col) => (
                  <div key={col.week} className="flex flex-col items-center">
                    <div className="h-[135px] flex items-end justify-center gap-1.5">
                      <div
                        style={{ height: `${col.createdH}px` }}
                        className="w-[18px] bg-valis-dots rounded-t-[3px]"
                        title={`${col.week} Created`}
                      />
                      <div
                        style={{ height: `${col.completedH}px` }}
                        className="w-[18px] bg-valis-ochre rounded-t-[3px]"
                        title={`${col.week} Completed`}
                      />
                    </div>
                    <span className="text-[12px] text-valis-navinactive mt-2.5">
                      {col.week}
                    </span>
                  </div>
                ))}
              </div>

              {/* Legend: Created / Completed */}
              <div className="flex items-center gap-4 mt-4 pt-1 text-[12px] text-valis-secondary">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-valis-dots inline-block" />
                  <span>Created</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-valis-ochre inline-block" />
                  <span>Completed</span>
                </div>
              </div>
            </div>

            {/* Card 3: How old is open work? */}
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] p-5 mb-6">
              <h3 className="text-[14px] font-semibold text-valis-text mb-4">
                How old is open work?
              </h3>

              <div className="space-y-3.5">
                {[
                  { label: 'Under 30 days', pct: '100%', count: 128 },
                  { label: '30–90 days', pct: '64%', count: 82 },
                  { label: 'Over 90 days', pct: '75%', count: 96 },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[120px_1fr_44px] items-center gap-4"
                  >
                    <span className="text-[13.5px] text-valis-text">
                      {row.label}
                    </span>
                    <div className="w-full h-[8px] bg-valis-divider rounded-[var(--valis-checkbox-radius)] overflow-hidden">
                      <div
                        style={{ width: row.pct }}
                        className="h-full bg-valis-ochre rounded-[var(--valis-checkbox-radius)]"
                      />
                    </div>
                    <span className="text-[13.5px] text-valis-text text-right tabular-nums">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Divider: — MEETINGS */}
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="w-4 h-[1px] bg-valis-dash inline-block" />
              <span className="text-[11px] uppercase tracking-[0.06em] text-valis-subtle font-medium">
                MEETINGS
              </span>
            </div>

            {/* Card 4: Where does meeting time go? */}
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] p-5">
              <h3 className="text-[14px] font-semibold text-valis-text mb-4">
                Where does meeting time go?
              </h3>

              <div className="space-y-3.5">
                {[
                  { team: 'Sales', pct: '100%', hours: '118h' },
                  { team: 'Support', pct: '81%', hours: '96h' },
                  { team: 'Engineering', pct: '71%', hours: '84h' },
                  { team: 'Leadership', pct: '53%', hours: '62h' },
                  { team: 'Finance', pct: '44%', hours: '52h' },
                ].map((row) => (
                  <div
                    key={row.team}
                    className="grid grid-cols-[120px_1fr_48px] items-center gap-4"
                  >
                    <span className="text-[13.5px] text-valis-text">
                      {row.team}
                    </span>
                    <div className="w-full h-[8px] bg-valis-divider rounded-[var(--valis-checkbox-radius)] overflow-hidden">
                      <div
                        style={{ width: row.pct }}
                        className="h-full bg-valis-ochre rounded-[var(--valis-checkbox-radius)]"
                      />
                    </div>
                    <span className="text-[13.5px] text-valis-text text-right tabular-nums">
                      {row.hours}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[12.5px] text-valis-navinactive mt-4">
                People-hours by team. How much of it was captured: 58 of 62 eligible calls.
              </p>
            </div>
          </div>
        )}

        {/* 3. MANAGEMENT LOOP */}
        {activeAdminNav === 'Management Loop' && (
          <div>
            {/* Top Header Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                  Management Loop
                </h1>
                <span className="bg-valis-earlybg text-valis-earlytext text-[12px] font-medium px-2.5 py-0.5 rounded-[5px]">
                  Early access
                </span>
              </div>
              <span className="bg-valis-canvas border border-valis-chromeborder text-valis-secondary text-[12.5px] px-3.5 py-1 rounded-[var(--valis-control-radius)] tabular-nums">
                16 Nov · 07:00
              </span>
            </div>

            {/* Subtitle Paragraph */}
            <p className="text-[14px] text-valis-secondary leading-[1.55] mt-2 mb-4">
              Valis connects goals, company records and current work to draft next steps for owners. Leaders approve steps in human in the loop mode; autopilot assigns tasks under the agreed process. People decide commercial terms, priorities, spending and team changes.
            </p>

            {/* Human in the loop / Autopilot Controls */}
            <div className="flex items-center gap-2 mb-6">
              {(['Human in the loop', 'Autopilot'] as const).map((mode) => {
                const active = managementMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setManagementMode(mode)}
                    className={`rounded-full px-3.5 py-1 text-[12.5px] font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-valis-text text-valis-canvas'
                        : 'bg-valis-canvas border border-valis-chromeborder text-valis-muted hover:text-valis-text hover:border-valis-controlhover'
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            {/* Section Divider: — STRATEGY THIS QUARTER */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-4 h-[1px] bg-valis-dash inline-block" />
              <span className="text-[11px] uppercase tracking-[0.06em] text-valis-subtle font-medium">
                STRATEGY THIS QUARTER
              </span>
            </div>

            {/* Strategy Card */}
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] px-6 py-4 mb-6">
              <ul className="list-disc pl-5 space-y-1.5 text-[14px] text-valis-text">
                <li>Protect customer renewals</li>
                <li>Focus on delivery</li>
                <li>Stop spending on retired projects</li>
              </ul>
            </div>

            {/* Section Divider: — PROPOSED FOR APPROVAL vs AUTOPILOT EXECUTION LOG */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-4 h-[1px] bg-valis-dash inline-block" />
              <span className="text-[11px] uppercase tracking-[0.06em] text-valis-subtle font-medium">
                {managementMode === 'Autopilot'
                  ? 'AUTOPILOT EXECUTION LOG · RUNNING UNDER AGREED POLICY'
                  : 'PROPOSED FOR APPROVAL'}
              </span>
            </div>

            {/* Proposed for Approval / Autopilot Table Card */}
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] px-6 py-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-valis-divider text-[12.5px] font-semibold text-valis-text">
                    <th className="py-3 pr-4 w-[110px] font-semibold">Owner</th>
                    <th className="py-3 px-3 font-semibold">Next step</th>
                    <th className="py-3 px-3 w-[160px] font-semibold">Why</th>
                    <th className="py-3 px-3 w-[145px] font-semibold">Source</th>
                    <th
                      className={`py-3 pl-3 font-semibold ${
                        managementMode === 'Autopilot'
                          ? 'w-[215px]'
                          : 'w-[150px]'
                      }`}
                    >
                      Decision
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-valis-divider text-[13.5px] align-middle">
                  {INITIAL_PROPOSED_APPROVALS.map((row) => {
                    const decision = approvalDecisions[row.id];
                    const isPaused = autopilotOverrides[row.id] === 'paused';
                    return (
                      <tr key={row.id}>
                        <td className="py-4 pr-4 font-semibold text-valis-text leading-[1.35]">
                          {row.ownerFirst} {row.ownerLast}
                        </td>
                        <td className="py-4 px-3 text-valis-text leading-[1.45]">
                          {row.nextStep}
                        </td>
                        <td className="py-4 px-3 text-valis-text leading-[1.45]">
                          {row.why}
                        </td>
                        <td className="py-4 px-3 text-valis-text leading-[1.45]">
                          {row.source}
                        </td>
                        <td className="py-4 pl-3">
                          {managementMode === 'Autopilot' ? (
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-1 rounded-[5px] text-[11.5px] font-medium border shrink-0 ${
                                  isPaused
                                    ? 'bg-valis-sidebar border-valis-chromeborder text-valis-muted'
                                    : 'bg-valis-greenbg border-valis-greenborder text-valis-green'
                                }`}
                              >
                                {isPaused ? 'Paused' : '⚡ Auto-assigned'}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setAutopilotOverrides((p) => ({
                                    ...p,
                                    [row.id]: isPaused ? undefined : 'paused',
                                  }))
                                }
                                className="px-2.5 py-1 rounded-[5px] text-[11.5px] font-medium border bg-valis-canvas border-valis-chromeborder text-valis-secondary hover:text-valis-text hover:border-valis-controlhover transition-colors cursor-pointer shrink-0"
                              >
                                {isPaused ? 'Resume' : 'Override'}
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setApprovalDecisions((p) => ({
                                    ...p,
                                    [row.id]:
                                      p[row.id] === 'approved'
                                        ? undefined
                                        : 'approved',
                                  }))
                                }
                                className={`px-3 py-1 rounded-[var(--valis-button-radius)] text-[13px] font-medium transition-colors cursor-pointer shrink-0 ${
                                  decision === 'approved'
                                    ? 'bg-valis-green text-valis-canvas'
                                    : 'bg-valis-text hover:bg-valis-texthover text-valis-canvas'
                                }`}
                              >
                                {decision === 'approved'
                                  ? 'Approved'
                                  : 'Approve'}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setApprovalDecisions((p) => ({
                                    ...p,
                                    [row.id]:
                                      p[row.id] === 'skipped'
                                        ? undefined
                                        : 'skipped',
                                  }))
                                }
                                className={`px-3 py-1 rounded-[var(--valis-button-radius)] text-[12.5px] font-medium border transition-colors cursor-pointer shrink-0 ${
                                  decision === 'skipped'
                                    ? 'bg-valis-divider border-valis-underline text-valis-text'
                                    : 'bg-valis-canvas border-valis-controlborder hover:border-valis-text hover:bg-valis-bg text-valis-text'
                                }`}
                              >
                                {decision === 'skipped' ? 'Skipped' : 'Skip'}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. RUNBOOKS */}
        {activeAdminNav === 'Runbooks' && (
          <div>
            <div className="mb-4">
              <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                Runbooks
              </h1>
              <p className="text-[14px] text-valis-secondary mt-1">
                Scheduled operational and compliance checks across company systems.
              </p>
            </div>
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] divide-y divide-valis-divider">
              {runbooks.map((rb) => (
                <div
                  key={rb.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-[13.5px] font-semibold text-valis-text">
                      {rb.title}
                    </div>
                    <div className="text-[12.5px] text-valis-muted mt-0.5">
                      {rb.department} · {rb.schedule} · Last run: {rb.lastRun}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[12.5px] font-medium ${
                        rb.status === 'Passed'
                          ? 'text-valis-green'
                          : 'text-valis-orange'
                      }`}
                    >
                      {rb.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRunRunbook(rb.id)}
                      className="bg-valis-canvas border border-valis-controlborder hover:border-valis-text hover:bg-valis-bg text-valis-text text-[12.5px] font-medium px-2.5 py-1 rounded-[var(--valis-button-radius)] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Run now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. OVERVIEW */}
        {activeAdminNav === 'Overview' && (
          <div>
            <div className="mb-4">
              <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                Overview
              </h1>
              <p className="text-[14px] text-valis-secondary mt-1">
                demo-admin.valis.so · System connectors, diagnostic coverage, and governance summary.
              </p>
            </div>
            <div className="space-y-3 text-[13px] text-valis-text">
              <div className="p-4 bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] flex items-center justify-between">
                <div>
                  <div className="font-semibold">
                    Read-only system connector guarantee
                  </div>
                  <div className="text-[12px] text-valis-muted">
                    Valis reads Google Workspace, Slack, and Jira and changes nothing in them by default.
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[12px] text-valis-green font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectNav('Valis Pulse')}
                  className="p-4 bg-valis-canvas border border-valis-sidebarborder hover:border-valis-text rounded-[var(--valis-panel-radius)] text-left transition-colors cursor-pointer"
                >
                  <div className="text-[12px] text-valis-muted">Valis Pulse</div>
                  <div className="text-[15px] font-semibold text-valis-text mt-1">
                    3 items need attention
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectNav('Reports')}
                  className="p-4 bg-valis-canvas border border-valis-sidebarborder hover:border-valis-text rounded-[var(--valis-panel-radius)] text-left transition-colors cursor-pointer"
                >
                  <div className="text-[12px] text-valis-muted">
                    Workflow Diagnostics
                  </div>
                  <div className="text-[15px] font-semibold text-valis-text mt-1">
                    5 department reports
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectNav('AI access')}
                  className="p-4 bg-valis-canvas border border-valis-sidebarborder hover:border-valis-text rounded-[var(--valis-panel-radius)] text-left transition-colors cursor-pointer"
                >
                  <div className="text-[12px] text-valis-muted">AI Security</div>
                  <div className="text-[15px] font-semibold text-valis-text mt-1">
                    365-day append-only log
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

            </div>
          </div>
        )}

      {/* 6. SECURITY VIEWS (AI access, Meeting permissions, Audit log) + Right-Hand Effective Access Simulator Drawer */}
      {(activeAdminNav === 'AI access' ||
        activeAdminNav === 'Audit log' ||
        activeAdminNav === 'Meeting permissions') && (
        <AiSecurityView
          columns={securityColumns}
          runbooks={runbooks}
          auditEvents={auditEvents}
          activeSecurityTab={activeAdminNav}
          onSelectSecurityTab={handleSelectNav}
          onRunRunbook={onRunRunbook}
        />
      )}
    </div>
  );
};

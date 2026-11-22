import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  AdminNavId,
  AuditLogEvent,
  DepartmentScopeRow,
  ManagerGrantRow,
  RunbookItem,
  SecurityAuditFilterCategory,
  SecurityAuditTrailEntry,
  SecurityColumn,
  SecurityMeetingPermissionRow,
  SecuritySandboxChatMessage,
  SecurityTeamToolRule,
  SecurityToolAccessOption,
  SystemConnectorCeiling,
} from '../types/valis';
import { evaluateSecuritySandboxPrompt } from '../utils/valisLogic';
import {
  DRAWER_EIGHT_TOOLS,
  SecurityAiChatSandboxDrawer,
  SecurityDrawerTabId,
  SecurityDrawerToolValues,
  SecurityToolFieldKey,
  ValisButton,
  ValisSegmentedSwitch,
} from '../design-system';

interface AiSecurityViewProps {
  columns?: SecurityColumn[];
  runbooks?: RunbookItem[];
  auditEvents?: AuditLogEvent[];
  activeSecurityTab: Extract<
    AdminNavId,
    'AI access' | 'Audit log' | 'Meeting permissions'
  >;
  onSelectSecurityTab?: (
    tab: Extract<AdminNavId, 'AI access' | 'Audit log' | 'Meeting permissions'>
  ) => void;
  onRunRunbook: (id: string) => void;
}

export const INITIAL_CONNECTOR_CEILINGS: SystemConnectorCeiling[] = [
  {
    id: 'conn-slack-meet',
    name: 'Slack & Google Calendar',
    policy: 'Read-only',
    detail: 'Public channels & attended calls',
  },
  {
    id: 'conn-jira',
    name: 'Jira (Engineering & Ops Tasks)',
    policy: 'Needs approval to edit',
    detail: 'Project issues & status updates',
  },
  {
    id: 'conn-salesforce',
    name: 'Salesforce CRM (Deals & Contracts)',
    policy: 'Needs approval to edit',
    detail: 'Account notes & renewal stages',
  },
  {
    id: 'conn-workday-erp',
    name: 'HR Payroll & Finance ERP',
    policy: 'Off',
    detail: 'Payroll, compensation & accounting',
  },
];

export const INITIAL_DEPARTMENT_SCOPES: DepartmentScopeRow[] = [
  {
    id: 'dept-leadership',
    departmentRole: 'Company Leadership',
    whatAiCanRead: 'All company systems',
    blockedData: "Employees' private Second Brains",
    editingInExternalTools: 'Edit (Approve)',
    summaryCanEdit: 'Only after human approval',
    baseAllowedReads: [
      'All company systems (CRM, Jira, Slack, Finance)',
      'Own calendar meetings & executive reports',
    ],
    baseBlockedReads: ["Employees' private Second Brain notes"],
  },
  {
    id: 'dept-sales',
    departmentRole: 'Sales Team',
    whatAiCanRead: 'Salesforce CRM, Slack #sales, Own calls',
    blockedData: 'HR, Finance, Engineering',
    editingInExternalTools: 'Edit (Approve)',
    summaryCanEdit: 'Only after human approval',
    linkedManagerId: 'mgr-tom',
    baseAllowedReads: [
      'Salesforce CRM accounts & renewal stages',
      'Slack #sales and own attended calls',
    ],
    baseBlockedReads: [
      "Employees' private Second Brain notes",
      'HR, Finance, and Engineering files',
    ],
  },
  {
    id: 'dept-support',
    departmentRole: 'Customer Support',
    whatAiCanRead: 'Support Slack, Support Jira tickets',
    blockedData: 'HR, Finance, Unattended calls',
    editingInExternalTools: 'Read-only',
    summaryCanEdit: 'Read-only',
    linkedManagerId: 'mgr-daniel',
    baseAllowedReads: [
      'Support Slack channels & customer call notes',
      'Support Jira tickets & help guides',
    ],
    baseBlockedReads: [
      "Employees' private Second Brain notes",
      'HR, Finance, and Sales contracts',
    ],
  },
  {
    id: 'dept-valis-ops',
    departmentRole: 'Valis Deployment Team',
    whatAiCanRead: 'System health & mic status only',
    blockedData: 'All company chats, calls & files (0% access)',
    editingInExternalTools: 'Read-only',
    summaryCanEdit: 'Read-only',
    baseAllowedReads: ['System health & mic status only'],
    baseBlockedReads: [
      "Employees' private Second Brain notes",
      'All company chats, calls & files (0% access)',
    ],
  },
];

export const INITIAL_MANAGER_GRANTS: ManagerGrantRow[] = [
  {
    id: 'mgr-tom',
    managerName: 'Tom Becker',
    role: 'VP Sales',
    targetTeamScope: 'Sales Team',
    grantActive: true,
    summaryCanEdit: 'Only after human approval',
    baseAllowedReads: [
      'Own calendar meetings & call notes',
      'Salesforce CRM & Slack #sales',
    ],
    baseBlockedReads: [
      "Employees' private Second Brain notes",
      'HR, Finance & other departments',
    ],
  },
  {
    id: 'mgr-priya',
    managerName: 'Priya Nair',
    role: 'VP Finance',
    targetTeamScope: 'Finance Team',
    grantActive: true,
    summaryCanEdit: 'Only after human approval',
    baseAllowedReads: [
      'Own calendar meetings & board drafts',
      'Finance schedules & Slack #finance',
    ],
    baseBlockedReads: [
      "Employees' private Second Brain notes",
      'HR payroll & Engineering repositories',
    ],
  },
  {
    id: 'mgr-daniel',
    managerName: 'Daniel Kim',
    role: 'Head of Support',
    targetTeamScope: 'Support Team',
    grantActive: false,
    summaryCanEdit: 'Read-only',
    baseAllowedReads: [
      'Own calendar meetings & attended calls',
      'Support Slack & Support Jira tickets',
    ],
    baseBlockedReads: [
      "Employees' private Second Brain notes",
      'HR, Finance & Sales contracts',
    ],
  },
  {
    id: 'mgr-marcus',
    managerName: 'Marcus Vance',
    role: 'VP Engineering',
    targetTeamScope: 'Engineering Team',
    grantActive: false,
    summaryCanEdit: 'Only after human approval',
    baseAllowedReads: [
      'Own calendar meetings & attended calls',
      'Jira, GitHub & Slack #eng',
    ],
    baseBlockedReads: [
      "Employees' private Second Brain notes",
      'HR, Finance & Sales CRM',
    ],
  },
];

export const INITIAL_TEAM_TOOL_RULES: SecurityTeamToolRule[] = [
  {
    id: 'rule-sales',
    subjectId: 'subj-tom',
    teamName: 'Sales Department',
    personName: 'Tom Becker · 24 members',
    testButtonLabel: 'Manage',
    salesforce: 'Edit (Approve)',
    slackCalendar: 'Read-only',
    jira: 'Read-only',
    github: 'No access',
    gdrive: 'Read-only',
    zendesk: 'Read-only',
    netsuite: 'No access',
    hrFinance: 'No access',
  },
  {
    id: 'rule-support',
    subjectId: 'subj-daniel',
    teamName: 'Customer Support',
    personName: 'Daniel Kim · 18 members',
    testButtonLabel: 'Manage',
    salesforce: 'Read-only',
    slackCalendar: 'Read-only',
    jira: 'Read-only',
    github: 'No access',
    gdrive: 'Read-only',
    zendesk: 'Edit (Approve)',
    netsuite: 'No access',
    hrFinance: 'No access',
  },
  {
    id: 'rule-eng',
    subjectId: 'subj-marcus',
    teamName: 'Engineering',
    personName: 'Marcus Vance · 32 members',
    testButtonLabel: 'Manage',
    salesforce: 'No access',
    slackCalendar: 'Read-only',
    jira: 'Edit (Approve)',
    github: 'Edit (Approve)',
    gdrive: 'Read-only',
    zendesk: 'Read-only',
    netsuite: 'No access',
    hrFinance: 'No access',
  },
  {
    id: 'rule-finance',
    subjectId: 'subj-priya',
    teamName: 'Finance & Executive',
    personName: 'Priya Nair · 6 members',
    testButtonLabel: 'Manage',
    salesforce: 'Read-only',
    slackCalendar: 'Read-only',
    jira: 'Read-only',
    github: 'No access',
    gdrive: 'Read-only',
    zendesk: 'No access',
    netsuite: 'Edit (Approve)',
    hrFinance: 'Read-only',
  },
  {
    id: 'rule-valis',
    subjectId: 'subj-valis',
    teamName: 'Valis Deployment Team',
    personName: 'External Rollout Engineers',
    testButtonLabel: 'Manage',
    salesforce: 'No access',
    slackCalendar: 'No access',
    jira: 'No access',
    github: 'No access',
    gdrive: 'No access',
    zendesk: 'No access',
    netsuite: 'No access',
    hrFinance: 'No access',
  },
];

export const INITIAL_MEETING_PERMISSION_ROWS: SecurityMeetingPermissionRow[] = [
  {
    id: 'meet-tom',
    subjectId: 'subj-tom',
    departmentName: 'Sales Department',
    departmentMembersSubtitle: '24 members',
    personName: 'Tom Becker · VP Sales',
    roleSubtitle: 'Sales Department · 24 members',
    deptCallScopeLabel: 'All Sales calls',
    testButtonLabel: 'Test AI',
    ownCallsStatus: 'Always visible',
    teamCallsMode: 'toggle',
    teamCallsAllowed: true,
  },
  {
    id: 'meet-daniel',
    subjectId: 'subj-daniel',
    departmentName: 'Customer Support',
    departmentMembersSubtitle: '18 members',
    personName: 'Daniel Kim · Head of Support',
    roleSubtitle: 'Customer Support · 18 members',
    deptCallScopeLabel: 'All Support calls',
    testButtonLabel: 'Test AI',
    ownCallsStatus: 'Always visible',
    teamCallsMode: 'toggle',
    teamCallsAllowed: false,
  },
  {
    id: 'meet-marcus',
    subjectId: 'subj-marcus',
    departmentName: 'Engineering',
    departmentMembersSubtitle: '32 members',
    personName: 'Marcus Vance · VP Engineering',
    roleSubtitle: 'Engineering · 32 members',
    deptCallScopeLabel: 'All Eng calls',
    testButtonLabel: 'Test AI',
    ownCallsStatus: 'Always visible',
    teamCallsMode: 'toggle',
    teamCallsAllowed: false,
  },
  {
    id: 'meet-priya',
    subjectId: 'subj-priya',
    departmentName: 'Finance & Executive',
    departmentMembersSubtitle: '6 members',
    personName: 'Priya Nair · VP Finance',
    roleSubtitle: 'Finance & Executive · 6 members',
    deptCallScopeLabel: 'All Finance calls',
    testButtonLabel: 'Test AI',
    ownCallsStatus: 'Always visible',
    teamCallsMode: 'toggle',
    teamCallsAllowed: true,
  },
  {
    id: 'meet-valis',
    subjectId: 'subj-valis',
    departmentName: 'Valis Deployment Team',
    departmentMembersSubtitle: 'External',
    personName: 'Rollout Engineers',
    roleSubtitle: 'Valis Deployment Team',
    deptCallScopeLabel: '0% call content (Telemetry only)',
    testButtonLabel: 'Test AI',
    ownCallsStatus: '0% call content (Mic health only)',
    teamCallsMode: 'blocked',
    teamCallsAllowed: false,
  },
];

export const INITIAL_SECURITY_AUDIT_TRAIL: SecurityAuditTrailEntry[] = [
  {
    id: 'aud-1',
    timestamp: '16 Nov · 09:42',
    actor: 'Tom Becker (Valis Chat)',
    actionScope: 'Blocked HR & Finance query: "Show HR salaries"',
    guardrailCheck: 'Blocked by Tool Permission',
    guardrailTone: 'blocked',
    filterCategory: 'Blocked AI prompts',
  },
  {
    id: 'aud-2',
    timestamp: '16 Nov · 09:18',
    actor: 'Daniel Kim (Valis Chat)',
    actionScope:
      'Blocked team call transcript query: "What did my team discuss on yesterday\'s call?"',
    guardrailCheck: 'Blocked by Participants-Only Rule',
    guardrailTone: 'blocked',
    filterCategory: 'Blocked AI prompts',
  },
  {
    id: 'aud-3',
    timestamp: '15 Nov · 17:05',
    actor: 'Alex Morgan',
    actionScope: 'Approved status update on Jira ticket OPS-142',
    guardrailCheck: 'Approved edit',
    guardrailTone: 'allowed',
    filterCategory: 'Approved edits',
  },
  {
    id: 'aud-4',
    timestamp: '10 Nov · 14:20',
    actor: 'Alex Morgan',
    actionScope:
      'Allowed Tom Becker (VP Sales) to view Sales Department calls & chats',
    guardrailCheck: 'Permission updated',
    guardrailTone: 'grant',
    filterCategory: 'Permission changes',
  },
  {
    id: 'aud-5',
    timestamp: '04 Nov · 11:10',
    actor: 'Alex Morgan',
    actionScope: 'Set Salesforce CRM for Sales Department to "Edit (Approve)"',
    guardrailCheck: 'Permission updated',
    guardrailTone: 'grant',
    filterCategory: 'Permission changes',
  },
];

const AUDIT_FILTER_CATEGORIES: SecurityAuditFilterCategory[] = [
  'All',
  'Permission changes',
  'Blocked AI prompts',
  'Approved edits',
];

export const AiSecurityView: React.FC<AiSecurityViewProps> = ({
  activeSecurityTab,
}) => {
  const [teamRules, setTeamRules] = useState<SecurityTeamToolRule[]>(
    INITIAL_TEAM_TOOL_RULES
  );
  const [meetingRows, setMeetingRows] = useState<SecurityMeetingPermissionRow[]>(
    INITIAL_MEETING_PERMISSION_ROWS
  );
  const [auditTrail, setAuditTrail] = useState<SecurityAuditTrailEntry[]>(
    INITIAL_SECURITY_AUDIT_TRAIL
  );
  const [auditFilter, setAuditFilter] =
    useState<SecurityAuditFilterCategory>('All');

  // Floating Slide-Over Drawer state: CLOSED by default (null) + active tab ('configure' | 'chat')
  const [sandboxSubjectId, setSandboxSubjectId] = useState<string | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] =
    useState<SecurityDrawerTabId>('configure');
  const [sandboxMessagesBySubject, setSandboxMessagesBySubject] = useState<
    Record<string, SecuritySandboxChatMessage[]>
  >({});
  const [verifyingSubjectId, setVerifyingSubjectId] = useState<string | null>(
    null
  );
  const verifyTimerRef = useRef<number | null>(null);

  const cancelPendingVerification = () => {
    if (verifyTimerRef.current !== null) {
      window.clearTimeout(verifyTimerRef.current);
      verifyTimerRef.current = null;
    }
    setVerifyingSubjectId(null);
  };

  useEffect(() => {
    return () => {
      if (verifyTimerRef.current !== null) {
        window.clearTimeout(verifyTimerRef.current);
      }
    };
  }, []);

  // Auto-close right drawer when switching to `Audit log`
  useEffect(() => {
    if (activeSecurityTab === 'Audit log') {
      cancelPendingVerification();
      setSandboxSubjectId(null);
    }
  }, [activeSecurityTab]);

  // Resolve display info for the currently inspected subject in the Slide-Over Drawer
  const getSubjectDisplay = (subjectId: string) => {
    const meetingMatch = meetingRows.find((m) => m.subjectId === subjectId);
    const teamMatch = teamRules.find((r) => r.subjectId === subjectId);

    if (activeSecurityTab === 'Meeting permissions' && meetingMatch) {
      return {
        name: meetingMatch.departmentName ?? meetingMatch.personName,
        subtitle: `${meetingMatch.personName} · ${
          meetingMatch.departmentMembersSubtitle ?? ''
        }`,
      };
    }
    if (teamMatch) {
      return {
        name: teamMatch.teamName,
        subtitle: teamMatch.personName,
      };
    }
    if (meetingMatch) {
      return {
        name: meetingMatch.personName,
        subtitle: meetingMatch.roleSubtitle,
      };
    }
    return {
      name: 'Selected Department',
      subtitle: 'Permission boundaries & AI Chat',
    };
  };

  // Resolve all 8 tool permission values for any subjectId in the Slide-Over Drawer
  const getSubjectToolValues = (
    subjectId: string
  ): SecurityDrawerToolValues => {
    const teamMatch = teamRules.find((r) => r.subjectId === subjectId);
    if (teamMatch) {
      return {
        salesforce: teamMatch.salesforce,
        slackCalendar: teamMatch.slackCalendar,
        jira: teamMatch.jira,
        github: teamMatch.github ?? 'No access',
        gdrive: teamMatch.gdrive ?? 'Read-only',
        zendesk: teamMatch.zendesk ?? 'No access',
        netsuite: teamMatch.netsuite ?? 'No access',
        hrFinance: teamMatch.hrFinance,
      };
    }
    return {
      salesforce: 'No access',
      slackCalendar: 'Read-only',
      jira: 'Read-only',
      github: 'No access',
      gdrive: 'Read-only',
      zendesk: 'No access',
      netsuite: 'No access',
      hrFinance: 'No access',
    };
  };

  // Resolve meeting grant state and Poka-Yoke guardrails for any subjectId in the Slide-Over Drawer
  const getSubjectMeetingState = (subjectId: string) => {
    const meetingMatch = meetingRows.find((m) => m.subjectId === subjectId);
    const teamMatch = teamRules.find((r) => r.subjectId === subjectId);

    const isContractLocked =
      subjectId === 'subj-valis' || meetingMatch?.teamCallsMode === 'blocked';
    const isIneligibleIndividual =
      subjectId === 'subj-maria' ||
      meetingMatch?.teamCallsMode === 'not-manager';

    let leadName = isContractLocked ? 'Rollout Engineers' : 'Team Lead';
    let teamCallsLabel = isContractLocked
      ? 'Lead Grant · Rollout Engineers'
      : 'Lead Grant';
    if (teamMatch && !isContractLocked) {
      const leadRaw = teamMatch.personName.split(' · ')[0].trim();
      if (leadRaw) {
        leadName = leadRaw;
        teamCallsLabel = `Lead Grant · ${leadRaw}`;
      }
    } else if (meetingMatch && !isContractLocked) {
      const leadRaw = meetingMatch.personName.split(' · ')[0].trim();
      leadName = leadRaw;
      teamCallsLabel = `Lead Grant · ${leadRaw}`;
    }

    const membersSource =
      meetingMatch?.departmentMembersSubtitle ?? teamMatch?.personName ?? '';
    const membersMatch = membersSource.match(/(\d+)\s+members/i);
    const memberCount = membersMatch ? Number(membersMatch[1]) : null;

    return {
      allowed: meetingMatch?.teamCallsAllowed ?? false,
      ineligibleIndividual: isIneligibleIndividual,
      contractLocked: isContractLocked,
      teamCallsLabel,
      leadName,
      memberCount,
    };
  };

  // Open the Slide-Over Drawer for a given subject on a specific tab ('configure' | 'chat')
  const handleOpenSandbox = (
    subjectId: string,
    initialTab: SecurityDrawerTabId = 'configure'
  ) => {
    if (sandboxSubjectId !== subjectId) {
      cancelPendingVerification();
    }
    setSandboxSubjectId(subjectId);
    setActiveDrawerTab(initialTab);
  };

  // Update one of the 8 tool permissions from the Slide-Over Drawer
  const handleChangeSubjectToolPermission = (
    subjectId: string,
    field: SecurityToolFieldKey,
    nextOption: SecurityToolAccessOption,
    toolLabel: string
  ) => {
    if (subjectId === 'subj-valis') return;

    const existingRule = teamRules.find((r) => r.subjectId === subjectId);
    const display = getSubjectDisplay(subjectId);

    if (existingRule) {
      setTeamRules((prev) =>
        prev.map((rule) =>
          rule.subjectId === subjectId ? { ...rule, [field]: nextOption } : rule
        )
      );
    }

    const entry: SecurityAuditTrailEntry = {
      id: `aud-tool-${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Alex Morgan',
      actionScope: `Set ${toolLabel} for ${display.name} to "${nextOption}"`,
      guardrailCheck: 'Permission updated',
      guardrailTone: nextOption === 'No access' ? 'blocked' : 'grant',
      filterCategory:
        nextOption === 'Edit (Approve)'
          ? 'Approved edits'
          : 'Permission changes',
    };
    setAuditTrail((prev) => [entry, ...prev]);
  };

  // Set Team Lead Call Grant from either the Meeting permissions row switch or the Slide-Over Drawer
  const handleSetSubjectMeetingGrant = (
    subjectId: string,
    nextAllowed: boolean
  ) => {
    const currentState = getSubjectMeetingState(subjectId);
    if (currentState.contractLocked || currentState.ineligibleIndividual) {
      return;
    }

    const existingRow = meetingRows.find((r) => r.subjectId === subjectId);
    const display = getSubjectDisplay(subjectId);

    if (existingRow) {
      setMeetingRows((prev) =>
        prev.map((row) =>
          row.subjectId === subjectId
            ? {
                ...row,
                teamCallsMode: 'toggle',
                teamCallsAllowed: nextAllowed,
              }
            : row
        )
      );
    }

    const actorTarget = existingRow?.personName ?? display.name;
    const scopeTarget = existingRow?.deptCallScopeLabel ?? 'All team calls';

    const entry: SecurityAuditTrailEntry = {
      id: `aud-meet-${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Alex Morgan',
      actionScope: nextAllowed
        ? `Granted ${actorTarget} lead access to ${scopeTarget}`
        : `Restricted ${actorTarget} to Own calls (revoked ${scopeTarget} grant)`,
      guardrailCheck: nextAllowed
        ? 'Manager Grant Active'
        : 'Participants-Only',
      guardrailTone: nextAllowed ? 'allowed' : 'blocked',
      filterCategory: 'Permission changes',
    };
    setAuditTrail((prev) => [entry, ...prev]);
  };

  // Send a prompt inside the Slide-Over Drawer's Test AI Chat tab (350ms glass-box verification)
  const handleSendSandboxMessage = (promptText: string) => {
    if (!sandboxSubjectId) return;
    const targetSubjectId = sandboxSubjectId;

    const evaluation = evaluateSecuritySandboxPrompt(
      promptText,
      targetSubjectId,
      teamRules,
      meetingRows
    );

    const userMsg: SecuritySandboxChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: promptText,
    };

    const aiMsg: SecuritySandboxChatMessage = {
      id: `ai-${Date.now() + 1}`,
      role: 'assistant',
      text: evaluation.replyText,
      statusLabel: evaluation.statusLabel,
      statusTone: evaluation.statusTone,
      sourceCitation: evaluation.sourceCitation,
    };

    cancelPendingVerification();

    setSandboxMessagesBySubject((prev) => ({
      ...prev,
      [targetSubjectId]: [...(prev[targetSubjectId] ?? []), userMsg],
    }));

    setVerifyingSubjectId(targetSubjectId);
    verifyTimerRef.current = window.setTimeout(() => {
      verifyTimerRef.current = null;
      setSandboxMessagesBySubject((prev) => ({
        ...prev,
        [targetSubjectId]: [...(prev[targetSubjectId] ?? []), aiMsg],
      }));
      setAuditTrail((prev) => [evaluation.auditEntry, ...prev]);
      setVerifyingSubjectId((curr) => (curr === targetSubjectId ? null : curr));
    }, 350);
  };

  const handleClearSandboxMessages = (subjectId: string) => {
    cancelPendingVerification();
    setSandboxMessagesBySubject((prev) => ({
      ...prev,
      [subjectId]: [],
    }));
  };

  const filteredAuditTrail =
    auditFilter === 'All'
      ? auditTrail
      : auditTrail.filter((entry) => entry.filterCategory === auditFilter);

  // Clean editorial Enabled Tools text for View 1 (AI access) — typographic emphasis, NO color boxes
  const renderEditorialEnabledTools = (rule: SecurityTeamToolRule) => {
    if (rule.subjectId === 'subj-valis') {
      return (
        <span className="text-[13.5px] text-valis-subtle">
          Infra telemetry only · 0 customer tools
        </span>
      );
    }

    const toolValues = getSubjectToolValues(rule.subjectId);
    const allEight = DRAWER_EIGHT_TOOLS.map((t) => ({
      shortLabel: t.shortLabel,
      value: toolValues[t.field],
    }));

    const activeTools = allEight.filter((t) => t.value !== 'No access');
    const blockedCount = allEight.length - activeTools.length;

    return (
      <div className="text-[13.5px] leading-[1.45]">
        {activeTools.length === 0 ? (
          <span className="text-valis-subtle">No tools enabled</span>
        ) : (
          activeTools.map((tool, index) => {
            const isEdit = tool.value === 'Edit (Approve)';
            return (
              <React.Fragment key={tool.shortLabel}>
                {index > 0 && <span className="text-valis-subtle">, </span>}
                {isEdit ? (
                  <span className="text-valis-text font-medium">
                    {tool.shortLabel}{' '}
                    <span className="text-valis-green font-medium">(Edit)</span>
                  </span>
                ) : (
                  <span className="text-valis-secondary font-normal">
                    {tool.shortLabel}
                  </span>
                )}
              </React.Fragment>
            );
          })
        )}
        {blockedCount > 0 && (
          <span className="text-valis-subtle ml-1.5">
            · {blockedCount} blocked
          </span>
        )}
      </div>
    );
  };

  const activeSubjectDisplay = sandboxSubjectId
    ? getSubjectDisplay(sandboxSubjectId)
    : null;
  const activeSubjectToolValues = sandboxSubjectId
    ? getSubjectToolValues(sandboxSubjectId)
    : null;
  const activeSubjectMeetingState = sandboxSubjectId
    ? getSubjectMeetingState(sandboxSubjectId)
    : null;

  return (
    <div className="flex-1 flex min-w-0 h-full overflow-hidden relative bg-valis-bg">
      {/* Main Full-Width Editorial View Canvas (Unified Warm-Paper Surface) */}
      <div className="flex-1 min-w-0 overflow-y-auto px-8 py-8 bg-valis-bg">
        <div className="max-w-[1040px]">
          {/* =========================================================
              VIEW 1: Sidebar Tab === 'AI access' (CLEAN 3-COLUMN EDITORIAL TABLE)
          ========================================================= */}
          {activeSecurityTab === 'AI access' && (
            <div>
              {/* Header row */}
              <div className="flex justify-between items-center gap-4 mb-6">
                <div>
                  <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                    AI &amp; Tool Access
                  </h1>
                  <p className="text-[14px] text-valis-secondary mt-1 leading-[1.5]">
                    Control which company tools each department and their AI assistant can read or edit.
                  </p>
                </div>

                <div
                  data-testid="sso-directory-sync-badge"
                  className="bg-valis-canvas border border-valis-chromeborder rounded-full px-3 py-1 text-[12px] text-valis-secondary inline-flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-valis-green shrink-0"
                    aria-hidden="true"
                  />
                  <span>Google Workspace SSO · 80 users</span>
                </div>
              </div>

              {/* Unified Full-Bleed Table Card */}
              <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] overflow-hidden p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-valis-divider text-[12.5px] font-semibold text-valis-text">
                      <th className="w-[28%] py-3.5 pl-6 pr-4 font-semibold">
                        Department
                      </th>
                      <th className="w-[58%] py-3.5 px-4 font-semibold">
                        Enabled Tools
                      </th>
                      <th className="w-[14%] py-3.5 pl-4 pr-6 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-valis-divider text-[13.5px]">
                    {teamRules.map((rule) => {
                      const isSelected = sandboxSubjectId === rule.subjectId;
                      return (
                        <tr
                          key={rule.id}
                          onClick={() =>
                            handleOpenSandbox(rule.subjectId, 'configure')
                          }
                          className={`group transition-colors cursor-pointer ${
                            isSelected ? 'bg-valis-bg' : 'hover:bg-valis-bg'
                          }`}
                        >
                          <td className="py-3.5 pl-6 pr-4 align-middle">
                            <div className="text-[14px] font-medium text-valis-text">
                              {rule.teamName}
                            </div>
                            <div className="text-[12.5px] text-valis-muted">
                              {rule.personName}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 align-middle">
                            {renderEditorialEnabledTools(rule)}
                          </td>
                          <td className="py-3.5 pl-4 pr-6 text-right align-middle whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenSandbox(rule.subjectId, 'configure');
                              }}
                              className="text-[13px] text-valis-navinactive group-hover:text-valis-text font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>Manage</span>
                              <ChevronRight
                                className="w-[14px] h-[14px] transition-transform duration-150 group-hover:translate-x-0.5"
                                strokeWidth={1.75}
                                aria-hidden="true"
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 2: Sidebar Tab === 'Meeting permissions' (CLEAN 4-COLUMN EDITORIAL TABLE)
          ========================================================= */}
          {activeSecurityTab === 'Meeting permissions' && (
            <div>
              {/* Header row */}
              <div className="flex justify-between items-center gap-4 mb-6">
                <div>
                  <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                    Meeting &amp; Voice Note Permissions
                  </h1>
                  <p className="text-[14px] text-valis-secondary mt-1 leading-[1.5]">
                    By default, all employees only see calls they attended, and personal Second Brains are always private to the author.
                  </p>
                </div>

                <div
                  data-testid="sso-directory-sync-badge-meetings"
                  className="bg-valis-canvas border border-valis-chromeborder rounded-full px-3 py-1 text-[12px] text-valis-secondary inline-flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-valis-green shrink-0"
                    aria-hidden="true"
                  />
                  <span>Google Workspace SSO · 80 users</span>
                </div>
              </div>

              {/* Unified Full-Bleed 4-Column Table: Department | Team Lead | Lead Call Access | Action */}
              <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] overflow-hidden p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-valis-divider text-[12.5px] font-semibold text-valis-text">
                      <th className="w-[26%] py-3.5 pl-6 pr-4 font-semibold">
                        Department
                      </th>
                      <th className="w-[28%] py-3.5 px-4 font-semibold">
                        Team Lead
                      </th>
                      <th className="w-[32%] py-3.5 px-4 font-semibold">
                        Lead Call Access
                      </th>
                      <th className="w-[14%] py-3.5 pl-4 pr-6 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-valis-divider text-[13.5px]">
                    {meetingRows.map((row) => {
                      const isSelected = sandboxSubjectId === row.subjectId;
                      const isContractLocked = row.teamCallsMode === 'blocked';
                      const scopeLabel =
                        row.deptCallScopeLabel ?? 'All team calls';

                      return (
                        <tr
                          key={row.id}
                          onClick={() => handleOpenSandbox(row.subjectId, 'chat')}
                          className={`group transition-colors cursor-pointer ${
                            isSelected ? 'bg-valis-bg' : 'hover:bg-valis-bg'
                          }`}
                        >
                          {/* Column 1: Department */}
                          <td className="py-3.5 pl-6 pr-4 align-middle">
                            <div className="text-[14px] font-medium text-valis-text">
                              {row.departmentName ?? row.personName}
                            </div>
                            <div className="text-[12.5px] text-valis-muted">
                              {row.departmentMembersSubtitle ?? row.roleSubtitle}
                            </div>
                          </td>

                          {/* Column 2: Team Lead */}
                          <td className="py-3.5 px-4 align-middle text-[13.5px] text-valis-text">
                            {row.personName}
                          </td>

                          {/* Column 3: Lead Call Access */}
                          <td
                            className="py-3.5 px-4 align-middle"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isContractLocked ? (
                              <span className="text-[13.5px] text-valis-subtle">
                                0% call content (Telemetry only)
                              </span>
                            ) : (
                              <ValisSegmentedSwitch
                                value={row.teamCallsAllowed ? 'all' : 'own'}
                                options={[
                                  {
                                    value: 'own',
                                    label: 'Own calls',
                                    activeTone: 'neutral',
                                  },
                                  {
                                    value: 'all',
                                    label: scopeLabel,
                                    activeTone: 'elevated',
                                  },
                                ]}
                                onChange={(nextVal) =>
                                  handleSetSubjectMeetingGrant(
                                    row.subjectId,
                                    nextVal === 'all'
                                  )
                                }
                                ariaLabel={`Lead Call Access switch for ${row.personName}`}
                                size="md"
                              />
                            )}
                          </td>

                          {/* Column 4: Action (Subtle monochrome Linear-style Test AI + ChevronRight) */}
                          <td className="py-3.5 pl-4 pr-6 text-right align-middle whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenSandbox(row.subjectId, 'chat');
                              }}
                              className="text-[13px] text-valis-navinactive group-hover:text-valis-text font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>Test AI</span>
                              <ChevronRight
                                className="w-[14px] h-[14px] transition-transform duration-150 group-hover:translate-x-0.5"
                                strokeWidth={1.75}
                                aria-hidden="true"
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 3: Sidebar Tab === 'Audit log' (FULL-WIDTH CLEAN TABLE WITH rounded-full PILLS)
          ========================================================= */}
          {activeSecurityTab === 'Audit log' && (
            <div>
              <div className="mb-5">
                <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                  Security &amp; AI Audit Log
                </h1>
                <p className="text-[14px] text-valis-secondary mt-1 leading-[1.5]">
                  Every permission change and AI chat boundary check is recorded in real time over a 365-day trail.
                </p>
              </div>

              {/* Filter Tabs (rounded-full matching Reports) */}
              <div
                role="tablist"
                aria-label="Audit log filter"
                className="flex flex-wrap items-center gap-2 mb-4"
              >
                {AUDIT_FILTER_CATEGORIES.map((category) => {
                  const isActive = auditFilter === category;
                  return (
                    <ValisButton
                      key={category}
                      variant="pill"
                      role="tab"
                      aria-selected={isActive}
                      active={isActive}
                      onClick={() => setAuditFilter(category)}
                    >
                      {category}
                    </ValisButton>
                  );
                })}
              </div>

              {/* Unified Full-Bleed 4-Column Table: Time | Person or AI | Event | Status */}
              <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] overflow-hidden p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-valis-divider text-[12.5px] font-semibold text-valis-text">
                      <th className="py-3.5 pl-6 pr-4 font-semibold">Time</th>
                      <th className="py-3.5 px-4 font-semibold">Person or AI</th>
                      <th className="py-3.5 px-4 font-semibold">Event</th>
                      <th className="py-3.5 pl-4 pr-6 text-right font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-valis-divider text-[13.5px]">
                    {filteredAuditTrail.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-valis-bg transition-colors"
                      >
                        <td className="py-3.5 pl-6 pr-4 text-[12.5px] text-valis-muted tabular-nums whitespace-nowrap">
                          {entry.timestamp}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-valis-text whitespace-nowrap">
                          {entry.actor}
                        </td>
                        <td className="py-3.5 px-4 text-[13.5px] text-valis-secondary">
                          {entry.actionScope}
                        </td>
                        <td className="py-3.5 pl-4 pr-6 text-right text-[12.5px] text-valis-muted whitespace-nowrap">
                          {entry.guardrailCheck}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          FLOATING SLIDE-OVER OVERLAY DRAWER (w-[420px])
          Never squishes the underlying tables; closes on backdrop click or 'X'
      ========================================================= */}
      {sandboxSubjectId &&
        activeSecurityTab !== 'Audit log' &&
        activeSubjectDisplay &&
        activeSubjectToolValues &&
        activeSubjectMeetingState && (
          <SecurityAiChatSandboxDrawer
            subjectName={activeSubjectDisplay.name}
            subjectSubtitle={activeSubjectDisplay.subtitle}
            leadName={activeSubjectMeetingState.leadName}
            memberCount={activeSubjectMeetingState.memberCount}
            activeDrawerTab={activeDrawerTab}
            onSelectDrawerTab={setActiveDrawerTab}
            teamCallsLabel={activeSubjectMeetingState.teamCallsLabel}
            teamCallsAllowed={activeSubjectMeetingState.allowed}
            teamCallsIneligibleIndividual={
              activeSubjectMeetingState.ineligibleIndividual
            }
            contractLockedZeroCustomerData={
              activeSubjectMeetingState.contractLocked
            }
            onSetTeamCallsAllowed={(allowed) =>
              handleSetSubjectMeetingGrant(sandboxSubjectId, allowed)
            }
            toolValues={activeSubjectToolValues}
            onChangeToolPermission={(field, nextOption, toolLabel) =>
              handleChangeSubjectToolPermission(
                sandboxSubjectId,
                field,
                nextOption,
                toolLabel
              )
            }
            messages={sandboxMessagesBySubject[sandboxSubjectId] ?? []}
            isVerifying={verifyingSubjectId === sandboxSubjectId}
            onSendMessage={handleSendSandboxMessage}
            onClearMessages={() =>
              handleClearSandboxMessages(sandboxSubjectId)
            }
            onClose={() => {
              cancelPendingVerification();
              setSandboxSubjectId(null);
            }}
          />
        )}
    </div>
  );
};

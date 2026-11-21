import {
  BriefTaskItem,
  ReportRow,
  ReportType,
  ManagementCommitItem,
  ConnectorCeilingPolicy,
  SystemConnectorCeiling,
  ManagerGrantRow,
  DepartmentScopeRow,
  SecurityAuditTrailEntry,
} from '../types/valis';

export function filterReports(
  reports: ReportRow[],
  options: {
    searchQuery: string;
    department: string;
    typeFilter: 'All' | ReportType;
  }
): ReportRow[] {
  const query = options.searchQuery.trim().toLowerCase();
  return reports.filter((row) => {
    const matchesDepartment =
      options.department === 'All departments' || row.department === options.department;

    // Note: in Screenshot 2, when 'All' is selected, the 5 main reports are shown (or all matching reports).
    const matchesType = options.typeFilter === 'All' || row.type === options.typeFilter;

    const matchesQuery =
      query.length === 0 ||
      row.title.toLowerCase().includes(query) ||
      row.department.toLowerCase().includes(query) ||
      row.type.toLowerCase().includes(query);

    return matchesDepartment && matchesType && matchesQuery;
  });
}

export function toggleBriefItemCompletion(
  items: BriefTaskItem[],
  itemId: string
): BriefTaskItem[] {
  return items.map((item) =>
    item.id === itemId ? { ...item, completed: !item.completed } : item
  );
}

export function getBriefProgressStats(items: BriefTaskItem[]): {
  total: number;
  completed: number;
  remaining: number;
} {
  const total = items.length;
  const completed = items.filter((i) => i.completed).length;
  return {
    total,
    completed,
    remaining: total - completed,
  };
}

export function cycleCommitmentStatus(
  commitments: ManagementCommitItem[],
  id: string
): ManagementCommitItem[] {
  const order: ManagementCommitItem['status'][] = [
    'On track',
    'At risk',
    'Overdue',
    'Completed',
  ];
  return commitments.map((item) => {
    if (item.id !== id) return item;
    const nextIndex = (order.indexOf(item.status) + 1) % order.length;
    return { ...item, status: order[nextIndex] };
  });
}

const CONNECTOR_POLICY_ORDER: ConnectorCeilingPolicy[] = [
  'Off',
  'Read-only',
  'Needs approval to edit',
];

export function updateConnectorPolicy(
  connectors: SystemConnectorCeiling[],
  connectorId: string,
  nextPolicy: ConnectorCeilingPolicy
): {
  updatedConnectors: SystemConnectorCeiling[];
  auditEntry: SecurityAuditTrailEntry | null;
} {
  let auditEntry: SecurityAuditTrailEntry | null = null;
  const updatedConnectors = connectors.map((conn) => {
    if (conn.id !== connectorId) return conn;
    auditEntry = {
      id: `aud-conn-${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Alex Morgan',
      actionScope: `Changed ${conn.name} access to "${nextPolicy}"`,
      guardrailCheck: 'Permission updated',
      guardrailTone: 'grant',
      filterCategory: 'Permission changes',
    };
    return { ...conn, policy: nextPolicy };
  });

  return { updatedConnectors, auditEntry };
}

export function cycleConnectorCeilingPolicy(
  connectors: SystemConnectorCeiling[],
  connectorId: string
): {
  updatedConnectors: SystemConnectorCeiling[];
  auditEntry: SecurityAuditTrailEntry | null;
} {
  const target = connectors.find((c) => c.id === connectorId);
  if (!target) {
    return { updatedConnectors: connectors, auditEntry: null };
  }
  const currentIdx = CONNECTOR_POLICY_ORDER.indexOf(target.policy);
  const nextPolicy =
    CONNECTOR_POLICY_ORDER[(currentIdx + 1) % CONNECTOR_POLICY_ORDER.length];
  return updateConnectorPolicy(connectors, connectorId, nextPolicy);
}

export function toggleManagerTeamGrant(
  grants: ManagerGrantRow[],
  managerId: string
): {
  updatedGrants: ManagerGrantRow[];
  auditEntry: SecurityAuditTrailEntry | null;
} {
  let auditEntry: SecurityAuditTrailEntry | null = null;
  const updatedGrants = grants.map((mgr) => {
    if (mgr.id !== managerId) return mgr;
    const nextActive = !mgr.grantActive;

    auditEntry = {
      id: `aud-mgr-${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Alex Morgan',
      actionScope: nextActive
        ? `Allowed ${mgr.managerName} (${mgr.role}) to view ${mgr.targetTeamScope} meetings`
        : `Removed ${mgr.managerName} (${mgr.role}) access to ${mgr.targetTeamScope} meetings`,
      guardrailCheck: 'Permission updated',
      guardrailTone: 'grant',
      filterCategory: 'Permission changes',
    };

    return {
      ...mgr,
      grantActive: nextActive,
    };
  });

  return { updatedGrants, auditEntry };
}

export function computeEffectiveAccessSimulation(
  subjectId: string,
  departments: DepartmentScopeRow[],
  managers: ManagerGrantRow[]
): {
  subjectTitle: string;
  summaryCanEdit: 'Only after human approval' | 'Read-only';
  linkedManagerGrant: ManagerGrantRow | null;
  allowedReads: string[];
  strictlyBlocked: string[];
} | null {
  const manager = managers.find((m) => m.id === subjectId);
  if (manager) {
    const teamAllowedLine = `${manager.targetTeamScope} meetings & transcripts`;
    const teamBlockedLine = `${manager.targetTeamScope} meetings (not granted)`;
    return {
      subjectTitle: manager.managerName,
      summaryCanEdit: manager.summaryCanEdit,
      linkedManagerGrant: manager,
      allowedReads: manager.grantActive
        ? [teamAllowedLine, ...manager.baseAllowedReads]
        : [...manager.baseAllowedReads],
      strictlyBlocked: manager.grantActive
        ? [...manager.baseBlockedReads]
        : [teamBlockedLine, ...manager.baseBlockedReads],
    };
  }

  const dept = departments.find((d) => d.id === subjectId);
  if (dept) {
    const linkedManager = dept.linkedManagerId
      ? managers.find((m) => m.id === dept.linkedManagerId) ?? null
      : null;

    const dynamicAllowed = [...dept.baseAllowedReads];
    const dynamicBlocked = [...dept.baseBlockedReads];

    if (linkedManager) {
      if (linkedManager.grantActive) {
        dynamicAllowed.push(
          `${linkedManager.targetTeamScope} meetings (visible to ${linkedManager.managerName})`
        );
      } else {
        dynamicBlocked.push(
          `${linkedManager.targetTeamScope} meetings user didn't join`
        );
      }
    }

    return {
      subjectTitle: dept.departmentRole,
      summaryCanEdit: dept.summaryCanEdit,
      linkedManagerGrant: linkedManager,
      allowedReads: dynamicAllowed,
      strictlyBlocked: dynamicBlocked,
    };
  }

  return null;
}

const TOOL_ACCESS_CYCLE: import('../types/valis').SecurityToolAccessOption[] = [
  'No access',
  'Read-only',
  'Edit (Approve)',
];

export function cycleSecurityToolAccessOption(
  current: import('../types/valis').SecurityToolAccessOption
): import('../types/valis').SecurityToolAccessOption {
  const idx = TOOL_ACCESS_CYCLE.indexOf(current);
  return TOOL_ACCESS_CYCLE[(idx + 1) % TOOL_ACCESS_CYCLE.length];
}

export function evaluateSecuritySandboxPrompt(
  promptText: string,
  subjectId: string,
  teamRules: import('../types/valis').SecurityTeamToolRule[],
  meetingRows: import('../types/valis').SecurityMeetingPermissionRow[]
): {
  actorLabel: string;
  statusLabel: string;
  statusTone: 'allowed' | 'blocked' | 'firewall';
  replyText: string;
  auditEntry: SecurityAuditTrailEntry;
} {
  const q = promptText.toLowerCase();
  const teamRule =
    teamRules.find(
      (r) =>
        r.subjectId === subjectId ||
        r.id === subjectId ||
        (subjectId === 'subj-ceo' && r.subjectId === 'subj-priya')
    ) ?? teamRules[0];
  const meetingRow = meetingRows.find(
    (m) => m.subjectId === subjectId || m.id === subjectId
  );

  const actorName =
    meetingRow?.personName ??
    teamRule?.personName ??
    'Tom Becker';

  // 1. Private Second Brain / Voice Notes check -> ALWAYS blocked by firewall
  if (
    q.includes('second brain') ||
    q.includes('private') ||
    q.includes('voice note') ||
    q.includes('coworker')
  ) {
    const statusLabel = 'Blocked by Second Brain Firewall';
    const replyText =
      'Private Second Brain notes are hardware-isolated to the author. Neither managers, CEO, nor AI can read them.';
    return {
      actorLabel: actorName,
      statusLabel,
      statusTone: 'firewall',
      replyText,
      auditEntry: {
        id: `aud-chat-${Date.now()}`,
        timestamp: 'Just now',
        actor: `${actorName} (Valis Chat)`,
        actionScope: `Blocked query: "${promptText}"`,
        guardrailCheck: 'Blocked by Second Brain Firewall',
        guardrailTone: 'blocked',
        filterCategory: 'Blocked AI prompts',
      },
    };
  }

  // 2. HR / Salaries / Payroll / Finance check -> checks hrFinance tool permission
  if (
    q.includes('hr') ||
    q.includes('salary') ||
    q.includes('salaries') ||
    q.includes('payroll') ||
    q.includes('pay') ||
    q.includes('compensation') ||
    q.includes('finance')
  ) {
    const hrAccess = teamRule?.hrFinance ?? 'No access';
    if (hrAccess === 'No access') {
      const statusLabel = 'Blocked · No access to HR & Finance';
      const replyText = `Access denied: ${teamRule?.teamName ?? actorName} has HR & Finance set to "Off". A prompt cannot widen tool permissions.`;
      return {
        actorLabel: actorName,
        statusLabel,
        statusTone: 'blocked',
        replyText,
        auditEntry: {
          id: `aud-chat-${Date.now()}`,
          timestamp: 'Just now',
          actor: `${actorName} (Valis Chat)`,
          actionScope: `Blocked HR & Finance query: "${promptText}"`,
          guardrailCheck: 'Blocked by Tool Permission',
          guardrailTone: 'blocked',
          filterCategory: 'Blocked AI prompts',
        },
      };
    }

    const statusLabel = `Allowed · ${hrAccess} in HR & Finance`;
    const replyText =
      'Loaded Q4 department headcount and payroll summary from HR & Finance ERP.';
    return {
      actorLabel: actorName,
      statusLabel,
      statusTone: 'allowed',
      replyText,
      auditEntry: {
        id: `aud-chat-${Date.now()}`,
        timestamp: 'Just now',
        actor: `${actorName} (Valis Chat)`,
        actionScope: `Answered HR & Finance query: "${promptText}"`,
        guardrailCheck: 'Allowed',
        guardrailTone: 'allowed',
        filterCategory: 'Permission changes',
      },
    };
  }

  // 3. Team Calls / Meetings check -> checks meetingRow.teamCallsAllowed
  if (
    q.includes('call') ||
    q.includes('meeting') ||
    q.includes('team') ||
    q.includes('discuss') ||
    q.includes('yesterday')
  ) {
    const canViewTeamCalls =
      meetingRow?.teamCallsAllowed ??
      (subjectId === 'subj-ceo' ? true : false);

    if (!canViewTeamCalls || subjectId === 'subj-valis') {
      const statusLabel = 'Blocked by Participants-Only Rule';
      const replyText =
        subjectId === 'subj-valis'
          ? 'Access denied: Valis Deployment Team has 0% access to call transcripts (mic health telemetry only).'
          : `Access denied: ${actorName} was not on this call invite and does not have an active Team Calls lead grant.`;
      return {
        actorLabel: actorName,
        statusLabel,
        statusTone: 'blocked',
        replyText,
        auditEntry: {
          id: `aud-chat-${Date.now()}`,
          timestamp: 'Just now',
          actor: `${actorName} (Valis Chat)`,
          actionScope: `Blocked team call transcript query: "${promptText}"`,
          guardrailCheck: 'Blocked by Participants-Only Rule',
          guardrailTone: 'blocked',
          filterCategory: 'Blocked AI prompts',
        },
      };
    }

    const statusLabel = 'Allowed · Team Lead Grant Active';
    const replyText =
      'Summary from yesterday’s team call: Agreed to align Q4 renewal terms with actual launch scope before Friday’s board review.';
    return {
      actorLabel: actorName,
      statusLabel,
      statusTone: 'allowed',
      replyText,
      auditEntry: {
        id: `aud-chat-${Date.now()}`,
        timestamp: 'Just now',
        actor: `${actorName} (Valis Chat)`,
        actionScope: `Answered team call query via Manager Grant: "${promptText}"`,
        guardrailCheck: 'Allowed',
        guardrailTone: 'allowed',
        filterCategory: 'Permission changes',
      },
    };
  }

  // 4. CRM / Sales / Deals check
  if (
    q.includes('crm') ||
    q.includes('sales') ||
    q.includes('deal') ||
    q.includes('contract')
  ) {
    const crmAccess = teamRule?.salesforce ?? 'No access';
    if (crmAccess === 'No access') {
      return {
        actorLabel: actorName,
        statusLabel: 'Blocked · No access to Salesforce CRM',
        statusTone: 'blocked',
        replyText: `Access denied: ${teamRule?.teamName ?? actorName} has Salesforce CRM set to "Off".`,
        auditEntry: {
          id: `aud-chat-${Date.now()}`,
          timestamp: 'Just now',
          actor: `${actorName} (Valis Chat)`,
          actionScope: `Blocked Salesforce CRM query: "${promptText}"`,
          guardrailCheck: 'Blocked by Tool Permission',
          guardrailTone: 'blocked',
          filterCategory: 'Blocked AI prompts',
        },
      };
    }
    return {
      actorLabel: actorName,
      statusLabel: `Allowed · ${crmAccess} in Salesforce CRM`,
      statusTone: 'allowed',
      replyText:
        'Salesforce CRM: Acme Corp Q4 renewal ($420k ARR) is in Legal Review.',
      auditEntry: {
        id: `aud-chat-${Date.now()}`,
        timestamp: 'Just now',
        actor: `${actorName} (Valis Chat)`,
        actionScope: `Answered Salesforce CRM query: "${promptText}"`,
        guardrailCheck: 'Allowed',
        guardrailTone: 'allowed',
        filterCategory: 'Permission changes',
      },
    };
  }

  // Default fallback checking Slack/Jira access
  if (subjectId === 'subj-valis' || teamRule?.slackCalendar === 'No access') {
    return {
      actorLabel: actorName,
      statusLabel: 'Blocked · No access to company tools',
      statusTone: 'blocked',
      replyText: `Access denied: ${teamRule?.teamName ?? actorName} does not have read access to company workspaces for this query.`,
      auditEntry: {
        id: `aud-chat-${Date.now()}`,
        timestamp: 'Just now',
        actor: `${actorName} (Valis Chat)`,
        actionScope: `Blocked workspace query: "${promptText}"`,
        guardrailCheck: 'Blocked by Tool Permission',
        guardrailTone: 'blocked',
        filterCategory: 'Blocked AI prompts',
      },
    };
  }

  return {
    actorLabel: actorName,
    statusLabel: `Allowed · ${teamRule?.slackCalendar ?? 'Read-only'} scope`,
    statusTone: 'allowed',
    replyText: `Verified answer for ${actorName} using permitted ${teamRule?.teamName ?? 'workspace'} sources (Slack & Jira).`,
    auditEntry: {
      id: `aud-chat-${Date.now()}`,
      timestamp: 'Just now',
      actor: `${actorName} (Valis Chat)`,
      actionScope: `Answered scoped workspace query: "${promptText}"`,
      guardrailCheck: 'Allowed',
      guardrailTone: 'allowed',
      filterCategory: 'Permission changes',
    },
  };
}




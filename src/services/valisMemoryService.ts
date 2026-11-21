import {
  BriefTaskItem,
  ReportRow,
  AttentionItem,
  PulseMetric,
  WeeklyWorkBar,
  ManagementCommitItem,
  RunbookItem,
  SecurityColumn,
  AuditLogEvent,
  MemoryScope,
} from '../types/valis';

export const INITIAL_BRIEF_ITEMS: BriefTaskItem[] = [
  {
    id: 'cal-1',
    section: 'Calendar',
    title: 'Quarterly planning with Sales',
    description: '10:00 with Tom Becker. Align renewal terms with the actual launch scope.',
    completed: false,
    memoryScope: 'org-brain',
    isNewSinceLastOpen: false,
    hasUnseenDelta: false,
    syncPolicy: 'read-only',
    resolutionState: 'open',
    sources: [
      {
        label: 'Google Calendar',
        type: 'calendar',
        previewTitle: 'Quarterly planning with Sales',
        previewMeta: 'Mon 16 Nov · 10:00–10:45 · Google Meet',
        previewBody:
          'Agenda: Lock Q4 enterprise renewal terms against confirmed product delivery dates for the $25M renewal cohort.',
      },
    ],
  },
  {
    id: 'cal-2',
    section: 'Calendar',
    title: 'Board call on Q4 plan',
    description: '15:30. Confirm the $25m renewal exposure first.',
    completed: false,
    memoryScope: 'org-brain',
    isNewSinceLastOpen: false,
    hasUnseenDelta: false,
    syncPolicy: 'read-only',
    resolutionState: 'open',
    sources: [
      {
        label: 'Calendar',
        type: 'calendar',
        previewTitle: 'Board Call — Q4 Operating Plan',
        previewMeta: 'Mon 16 Nov · 15:30–16:30 · Board Zoom Room',
        previewBody:
          'Quarterly board checkpoint reviewing net retention, $25m multi-year renewal cohort, and engineering headcount pace.',
      },
      {
        label: 'Board pack draft',
        type: 'doc',
        previewTitle: 'Q4_Board_Pack_Draft_v4.pdf',
        previewMeta: 'Updated Sun 15 Nov · 21:14 by Alex Morgan',
        previewBody:
          'Slide 14 highlights $25.4m in Q4 renewals contingent on single-tenant deployment sign-off and SLA addendum completion.',
      },
    ],
  },
  {
    id: 'dec-1',
    section: 'Decide',
    title: 'Merge contract reviews before new hiring',
    description: 'Maria Lopez, waiting since Wed 11 Nov. Two teams review the same contracts.',
    completed: false,
    memoryScope: 'org-brain',
    isNewSinceLastOpen: false,
    hasUnseenDelta: false,
    syncPolicy: 'read-only',
    resolutionState: 'open',
    sources: [
      {
        label: 'Slack #support-ops',
        type: 'slack',
        previewTitle: '#support-ops · Thread from Maria Lopez',
        previewMeta: 'Wed 11 Nov · 14:22',
        previewBody:
          '"Both Commercial Legal and Deal Desk are redlining the exact same MSA clauses on enterprise renewals—adds 6.4 days to close time."',
      },
      {
        label: 'Email from Daniel Kim',
        type: 'email',
        previewTitle: 'Re: Contract review bottleneck & Q4 Deal Desk reqs',
        previewMeta: 'Thu 12 Nov · From Daniel Kim (General Counsel)',
        previewBody:
          'Proposing a single unified intake checklist in Valis before approving the two additional Deal Desk headcount requests.',
      },
    ],
  },
  {
    id: 'dec-2',
    section: 'Decide',
    title: 'End obsolete renewals',
    description: 'Priya Nair, due Friday. Owners must confirm what stays.',
    completed: false,
    memoryScope: 'org-brain',
    isNewSinceLastOpen: true,
    deltaTimestamp: 'UPDATED · 18m ago',
    hasUnseenDelta: true,
    deltaBadgeLabel: 'UPDATED · 18m ago',
    deltaSummary: '↳ Change: New contract draft attached by Priya Nair',
    syncPolicy: 'read-only',
    resolutionState: 'open',
    sources: [
      {
        label: 'Email from Priya Nair',
        type: 'email',
        previewTitle: 'Vendor renewals due Nov 20 — 14 legacy tools flagged',
        previewMeta: 'Fri 13 Nov · From Priya Nair (VP Finance)',
        previewBody:
          'Identified $184k in overlapping SaaS seats with <12% active 30-day usage. Department owners must confirm retention by Friday 17:00.',
      },
      {
        label: 'Contract draft',
        type: 'doc',
        previewTitle: 'FY27_Enterprise_Renewal_Addendum_v4.docx',
        previewMeta: 'Shared by Procurement · Last edited 14 Nov',
        previewBody:
          'Schedule of 14 auto-renewing contracts with 30-day cancellation windows closing between 20 Nov and 28 Nov.',
      },
    ],
  },
  {
    id: 'owe-1',
    section: 'I owe',
    title: 'Decision on the launch scope',
    description: "to the board, promised at Friday's call.",
    completed: false,
    memoryScope: 'org-brain',
    isNewSinceLastOpen: true,
    deltaTimestamp: 'UPDATED · 14m ago',
    hasUnseenDelta: true,
    deltaBadgeLabel: 'UPDATED · 14m ago',
    deltaSummary: '↳ Change: Board call prep notes linked from Friday sync',
    syncPolicy: 'write-back',
    resolutionState: 'open',
    sources: [
      {
        label: 'Board call notes, Friday',
        type: 'notes',
        previewTitle: 'Pre-Board Sync Transcript & Commitments',
        previewMeta: 'Fri 13 Nov · 16:00 · Captured by Valis',
        previewBody:
          'Alex Morgan committed to circulating the final cut of Tier-1 launch features vs. Q1 fast-follows prior to Monday 15:30 board call.',
      },
    ],
  },
  {
    id: 'others-1',
    section: 'Others owe',
    title: 'Renewal risk view',
    description: 'Daniel Kim, since Tue 10 Nov.',
    completed: false,
    memoryScope: 'org-brain',
    isNewSinceLastOpen: false,
    hasUnseenDelta: false,
    syncPolicy: 'write-back',
    resolutionState: 'open',
    externalSystem: 'Jira',
    externalKey: 'OPS-142',
    externalSyncState: 'read-only-synced',
    sources: [
      {
        label: 'Jira OPS-142',
        type: 'jira',
        previewTitle: 'OPS-142 · Consolidated Q4 Renewal Risk Matrix',
        previewMeta: 'Assignee: Daniel Kim · Opened Tue 10 Nov',
        previewBody:
          'Cross-reference legal indemnity redlines against the 4 enterprise accounts ($25m ARR) renewing before 30 Nov.',
      },
      {
        label: 'Slack #finance',
        type: 'slack',
        previewTitle: '#finance · Renewal Exposure Check',
        previewMeta: 'Thu 12 Nov · Priya Nair & Daniel Kim',
        previewBody:
          'Waiting on Legal sign-off for custom SLA liability caps on two Tier-1 banking renewals.',
      },
    ],
  },
  {
    id: 'sig-1',
    section: 'Signals',
    title: 'Assign one owner to shared contract reviews',
    description: 'neither team receives the other result.',
    completed: false,
    memoryScope: 'org-brain',
    isNewSinceLastOpen: true,
    deltaTimestamp: 'NEW · 12m ago',
    hasUnseenDelta: true,
    deltaBadgeLabel: 'NEW · 12m ago',
    deltaSummary: '↳ Change: Duplicate contract review signal detected in Valis Pulse',
    syncPolicy: 'read-only',
    resolutionState: 'open',
    sources: [
      {
        label: 'Jira',
        type: 'jira',
        previewTitle: 'Jira Workflow Handoff Pattern · Legal & Deal Desk',
        previewMeta: '38 parallel issues analyzed (19 Oct – 15 Nov)',
        previewBody:
          'Tickets in LEGAL and DEAL queues reference identical customer agreements without linked status transitions.',
      },
      {
        label: 'Valis Pulse',
        type: 'pulse',
        previewTitle: 'Valis Pulse · Cross-Department Handoff Signal',
        previewMeta: 'Generated Mon 16 Nov · 07:00',
        previewBody:
          'Observed two teams reviewing the same contracts independently with zero shared completion webhook.',
      },
    ],
  },
  // Private Second Brain items revealed when user switches to Personal · 2nd Brain in v2.0 HCI mode
  {
    id: 'sb-1',
    section: 'I owe',
    title: 'Draft personal Q1 leadership re-org reflection',
    description: 'Private voice note captured Sunday evening. Not shared with OrgBrain.',
    completed: false,
    memoryScope: 'second-brain',
    isNewSinceLastOpen: true,
    deltaTimestamp: 'NEW · 18m ago',
    hasUnseenDelta: true,
    deltaBadgeLabel: 'NEW · 18m ago',
    deltaSummary: '↳ Change: Transcribed from private Sunday evening voice note',
    syncPolicy: 'write-back',
    resolutionState: 'open',
    sources: [
      {
        label: 'Private Voice Note',
        type: 'notes',
        previewTitle: 'Personal Memo — VP Engineering & Deal Desk reporting lines',
        previewMeta: 'Sun 15 Nov · 22:10 · Encrypted Second Brain (Only You)',
        previewBody:
          'Keep Support Ops contract intake under Maria Lopez once unified checklist is live; hold off on external VP Ops search until Q1.',
      },
    ],
  },
  {
    id: 'sb-2',
    section: 'Decide',
    title: 'Prepare 1:1 compensation calibration notes for Tom Becker',
    description: 'Private prep before 10:00 Sales quarterly planning.',
    completed: false,
    memoryScope: 'second-brain',
    isNewSinceLastOpen: false,
    hasUnseenDelta: false,
    syncPolicy: 'write-back',
    resolutionState: 'open',
    sources: [
      {
        label: 'Second Brain Scratchpad',
        type: 'notes',
        previewTitle: 'Private Executive Notes · Q4 Commission Accelerator',
        previewMeta: 'Sat 14 Nov · Private / Only You',
        previewBody:
          'Review multi-year renewal weighting vs new logo quota before finalizing FY27 VP Sales plan.',
      },
    ],
  },
];

export const INITIAL_REPORTS: ReportRow[] = [
  {
    id: 'rep-1',
    title: 'Workflow Diagnostics: Customer Support',
    department: 'Customer Support',
    type: 'Summary',
    updated: '13 Nov',
    isPrimaryLink: true,
    owner: 'Maria Lopez',
    executiveSummary:
      'Observed 412 support escalations and 38 Slack huddles between 16 Oct and 13 Nov. Duplicate contract and SLA verification across Support Ops and Deal Desk accounts for 34% of resolution delay.',
    findings: [
      {
        label: 'Tier-2 to Engineering hand-off',
        detail:
          '64 of 188 escalated tickets lacked environment logs on first transfer, requiring 2.3 back-and-forth cycles.',
        metric: '41h median wait',
      },
      {
        label: 'Enterprise SLA exception approvals',
        detail:
          'Two teams review identical custom SLA terms sequentially in Slack #support-ops and email.',
        metric: '6.4d cycle time',
      },
      {
        label: 'Repeat onboarding questions',
        detail:
          'SSO and SCIM provisioning steps triggered 79 tickets across 24 new enterprise accounts.',
        metric: '19% of volume',
      },
    ],
  },
  {
    id: 'rep-2',
    title: 'Engineering: who builds what',
    department: 'Engineering',
    type: 'Profile',
    updated: '13 Nov',
    isPrimaryLink: false,
    owner: 'Marcus Vance',
    executiveSummary:
      'Ownership map generated from PR reviews, incident huddles, and design docs across 48 engineers in Core Platform, Runtime, and Enterprise Security.',
    findings: [
      {
        label: 'Single-owner critical modules',
        detail: '3 ingestion connectors rely on a single reviewer for 88% of production merges.',
        metric: '3 bottlenecks',
      },
      {
        label: 'Unplanned interrupt load',
        detail: 'Platform team spends 29% of sprint capacity resolving ad-hoc data schema queries.',
        metric: '29% capacity',
      },
    ],
  },
  {
    id: 'rep-3',
    title: 'Hiring checks: working guidelines',
    department: 'HR',
    type: 'Guidelines',
    updated: '6 Nov',
    isPrimaryLink: false,
    owner: 'Elena Rostova',
    executiveSummary:
      'Standardized interview debrief and reference verification rules synthesized from 31 recent engineering and GTM hiring loops.',
    findings: [
      {
        label: 'Work-sample calibration',
        detail:
          'Loops with written scorecard submission prior to group debrief reached decision 3.1 days faster.',
        metric: '-3.1d time-to-offer',
      },
      {
        label: 'Backchannel vs formal references',
        detail: 'Documented rubric checks completed on 100% of senior hires in Q4.',
        metric: '100% compliance',
      },
    ],
  },
  {
    id: 'rep-4',
    title: 'Workflow Diagnostics: Finance',
    department: 'Finance',
    type: 'Summary',
    updated: '30 Oct',
    isPrimaryLink: false,
    owner: 'Priya Nair',
    executiveSummary:
      'Month-end close and vendor renewal tracking across Procurement, FP&A, and Department Heads.',
    findings: [
      {
        label: 'Obsolete SaaS auto-renewals',
        detail: '14 contracts flagged prior to 30-day notice window with <12% seat utilization.',
        metric: '$184k identified',
      },
      {
        label: 'Invoice PO matching',
        detail:
          '22% of contractor invoices required manual Slack follow-up for cost-center tagging.',
        metric: '22% manual touch',
      },
    ],
  },
  {
    id: 'rep-5',
    title: 'Workflow Diagnostics: Sales',
    department: 'Sales',
    type: 'Summary',
    updated: '23 Oct',
    isPrimaryLink: false,
    owner: 'Tom Becker',
    executiveSummary:
      'Pipeline progression, technical security review cycles, and renewal risk analysis across 64 active enterprise opportunities.',
    findings: [
      {
        label: 'Security questionnaire turnaround',
        detail:
          'Standard Trust Center NDA packets reduced custom questionnaire completion from 9 days to 2.5 days.',
        metric: '2.5d turnaround',
      },
      {
        label: 'Q4 Renewal cohort alignment',
        detail:
          '4 accounts representing $25m ARR require launch scope confirmation before 30 Nov.',
        metric: '$25m exposure',
      },
    ],
  },
  {
    id: 'rep-6',
    title: 'Enterprise renewal pipeline & risk gates',
    department: 'Sales',
    type: 'Pipeline',
    updated: '19 Oct',
    isPrimaryLink: false,
    owner: 'Tom Becker',
    executiveSummary:
      'Stage-by-stage breakdown of Q4 expansion and renewal gates linked to product readiness commitments.',
    findings: [
      {
        label: 'Legal redline queue',
        detail: '11 enterprise agreements awaiting consolidated MSA approval.',
        metric: '11 active deals',
      },
    ],
  },
];

export const INITIAL_ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: 'att-1',
    headline: '38 more tasks opened than closed',
    subline: '212 created and 174 completed in the last 28 days.',
    actionLabel: 'See work flow',
    drilldownKey: 'workflow',
  },
  {
    id: 'att-2',
    headline: '31.4% of active open tasks are over 90 days old',
    subline: '96 of 306 open tasks updated in the last 90 days.',
    actionLabel: 'See open work by age',
    drilldownKey: 'age',
  },
  {
    id: 'att-3',
    headline: '4 eligible calls have no usable transcript',
    subline: '58 of 62 eligible Google Meet calls captured in the last 28 days.',
    actionLabel: 'See capture',
    drilldownKey: 'capture',
  },
];

export const PULSE_METRICS: PulseMetric[] = [
  { id: 'm-1', label: 'Tasks completed', value: '174' },
  { id: 'm-2', label: 'Open tasks over 90 days old', value: '96' },
  { id: 'm-3', label: 'Meeting people-hours', value: '412' },
  { id: 'm-4', label: 'Eligible calls captured', value: '93.5%' },
];

export const WEEKLY_WORK_BARS: WeeklyWorkBar[] = [
  { week: '19 Oct', created: 46, completed: 44 },
  { week: '26 Oct', created: 54, completed: 41 },
  { week: '2 Nov', created: 52, completed: 45 },
  { week: '9 Nov', created: 60, completed: 44 },
];

/**
 * 4-6-2 Management Loop Queue:
 * - 4 Human-in-the-loop items awaiting explicit review/approval
 * - 6 Autopilot items executing via approved low-risk runbooks
 * - 2 Escalated / At-risk items requiring executive intervention
 */
export const INITIAL_MANAGEMENT_COMMITMENTS: ManagementCommitItem[] = [
  {
    id: 'mc-1',
    owner: 'Alex Morgan',
    role: 'CEO',
    commitment: 'Confirm Q4 launch scope cut vs Q1 fast-follows for Board packet',
    dueDate: '16 Nov',
    status: 'On track',
    source: 'Board call notes, Friday',
    loopMode: 'Human-in-the-loop',
    targetSystem: 'Jira EXEC-89',
    approvedByHuman: false,
  },
  {
    id: 'mc-2',
    owner: 'Maria Lopez',
    role: 'Head of Support Ops',
    commitment: 'Unify Commercial Legal and Deal Desk contract review intake',
    dueDate: '18 Nov',
    status: 'At risk',
    source: 'Slack #support-ops',
    loopMode: 'Human-in-the-loop',
    targetSystem: 'Jira OPS-118',
    approvedByHuman: false,
  },
  {
    id: 'mc-3',
    owner: 'Priya Nair',
    role: 'VP Finance',
    commitment: 'Finalize cancellation list for 14 obsolete SaaS renewals ($184k)',
    dueDate: '20 Nov',
    status: 'On track',
    source: 'Email from Priya Nair',
    loopMode: 'Human-in-the-loop',
    targetSystem: 'Jira FIN-204',
    approvedByHuman: false,
  },
  {
    id: 'mc-4',
    owner: 'Tom Becker',
    role: 'VP Sales',
    commitment: 'Lock renewal terms on $25m Q4 enterprise cohort',
    dueDate: '24 Nov',
    status: 'At risk',
    source: 'Quarterly planning with Sales',
    loopMode: 'Human-in-the-loop',
    targetSystem: 'Salesforce Q4-Cohort',
    approvedByHuman: false,
  },
  {
    id: 'mc-5',
    owner: 'Daniel Kim',
    role: 'General Counsel',
    commitment: 'Deliver Renewal risk view across 4 Tier-1 contracts',
    dueDate: '17 Nov',
    status: 'Overdue',
    source: 'Jira OPS-142 · Slack #finance',
    loopMode: 'Escalated',
    targetSystem: 'Jira OPS-142',
    approvedByHuman: false,
  },
  {
    id: 'mc-6',
    owner: 'Marcus Vance',
    role: 'VP Engineering',
    commitment: 'Assign secondary code-owners to 3 single-reviewer ingestion modules',
    dueDate: '19 Nov',
    status: 'At risk',
    source: 'Engineering: who builds what',
    loopMode: 'Escalated',
    targetSystem: 'GitHub CODEOWNERS',
    approvedByHuman: false,
  },
  {
    id: 'mc-7',
    owner: 'Valis Autopilot',
    role: 'Runbook Engine',
    commitment: 'Route post-call transcript summaries to meeting participants',
    dueDate: 'Daily',
    status: 'Completed',
    source: 'Google Meet · 58 calls',
    loopMode: 'Autopilot',
    targetSystem: 'Slack DM',
    approvedByHuman: true,
  },
];

export const INITIAL_RUNBOOKS: RunbookItem[] = [
  {
    id: 'rb-1',
    title: 'Plaintext credential & PAN scan across Slack and Drive',
    schedule: 'Daily · 02:00 UTC',
    department: 'Security',
    lastRun: '16 Nov · 02:00',
    status: 'Passed',
  },
  {
    id: 'rb-2',
    title: 'External sharing & stale guest account audit',
    schedule: 'Weekly · Mondays',
    department: 'Security',
    lastRun: '16 Nov · 04:00',
    status: '2 findings',
  },
  {
    id: 'rb-3',
    title: 'Unassigned post-meeting commitments (>48h)',
    schedule: 'Daily · 06:30 UTC',
    department: 'Operations',
    lastRun: '16 Nov · 06:30',
    status: 'Passed',
  },
];

export const SECURITY_COLUMNS: SecurityColumn[] = [
  {
    id: 'sec-col-1',
    title: 'Access and control',
    headerBadge: { label: 'Live', color: 'green' },
    bullets: [
      {
        id: 'b-1-1',
        text: 'One place to set what every person and every AI assistant can read across company email, calendars, meetings, docs and chat.',
      },
      {
        id: 'b-1-2',
        text: 'Employees sign in with the work credentials they already use (Google Workspace, Microsoft Entra ID, Okta).',
      },
      {
        id: 'b-1-3',
        text: "A manager sees their team's meetings and chats only with an explicit grant, logged and visible to the employee.",
      },
      {
        id: 'b-1-4',
        text: 'Valis reads your systems and changes nothing in them by default.',
      },
    ],
  },
  {
    id: 'sec-col-2',
    title: 'Detection and monitoring',
    bullets: [
      {
        id: 'b-2-1',
        text: "Your security team sees the company's data in one place, for investigations and audits.",
        badge: { label: 'Live', color: 'green' },
      },
      {
        id: 'b-2-2',
        text: 'Ongoing checks across company data for leaked passwords and card numbers, suspicious activity, and shadow AI tools.',
        badge: { label: 'Early access', color: 'amber' },
      },
      {
        id: 'b-2-3',
        text: 'Security and compliance checks run on a schedule, written as Runbooks.',
        badge: { label: 'Early access', color: 'amber' },
      },
    ],
  },
  {
    id: 'sec-col-3',
    title: 'Protected by design',
    headerBadge: { label: 'Live', color: 'green' },
    bullets: [
      {
        id: 'b-3-1',
        text: 'Cloud or on-premise. In the cloud, each customer gets a dedicated server with no open ports to the internet.',
      },
      {
        id: 'b-3-2',
        text: 'Anthropic, Google and OpenAI models, or open-source models such as Qwen running on your own hardware. Zero data retention with cloud providers.',
      },
      {
        id: 'b-3-3',
        text: 'Encrypted in transit and on disk.',
      },
    ],
  },
  {
    id: 'sec-col-4',
    title: 'Assurance',
    headerBadge: { label: 'Live', color: 'green' },
    bullets: [
      {
        id: 'b-4-1',
        text: 'Every sign-in, access change, share, meeting change and AI query is logged, in an append-only log kept for a year.',
      },
      {
        id: 'b-4-2',
        text: 'Regular independent security audits and penetration testing.',
      },
      {
        id: 'b-4-3',
        text: 'SOC 2 and ISO/IEC 27001 in progress.',
      },
      {
        id: 'b-4-4',
        text: 'Security policies are available in our Trust Center under NDA.',
      },
    ],
  },
];

export const INITIAL_AUDIT_EVENTS: AuditLogEvent[] = [
  {
    id: 'aud-1',
    timestamp: '16 Nov · 07:00:12 UTC',
    actor: 'alex@demo.valis.so',
    action: 'Daily Brief generated (read-only connector sync)',
    scope: 'Google Calendar, Slack #support-ops, Gmail, Jira',
    category: 'Audit log',
  },
  {
    id: 'aud-2',
    timestamp: '16 Nov · 04:00:00 UTC',
    actor: 'system:runbook',
    action: 'Scheduled Runbook: External sharing & stale guest account audit',
    scope: 'Google Drive, Okta Directory (2 findings logged)',
    category: 'AI access',
  },
  {
    id: 'aud-3',
    timestamp: '15 Nov · 18:42:09 UTC',
    actor: 'maria@demo.valis.so',
    action: 'Explicit team grant verified for Support Ops diagnostic',
    scope: 'Workflow Diagnostics: Customer Support',
    category: 'Meeting permissions',
  },
  {
    id: 'aud-4',
    timestamp: '15 Nov · 14:19:51 UTC',
    actor: 'priya@demo.valis.so',
    action: 'AI query executed with Zero Data Retention policy',
    scope: 'FY27_Vendor_Consolidation_Schedule.xlsx',
    category: 'AI access',
  },
];

/**
 * Pure Service Layer Helpers for OrgBrain, SecondBrain, Reports, and External Sync Mutations
 */
export const ValisMemoryService = {
  filterBriefByMemoryScope(
    items: BriefTaskItem[],
    scope: MemoryScope,
    isV2Mode: boolean
  ): BriefTaskItem[] {
    if (!isV2Mode) {
      // In v1.0 baseline, only show standard company items (no Second Brain items, no snoozed filtering UI)
      return items.filter(
        (item) =>
          (item.memoryScope ?? 'org-brain') === 'org-brain' &&
          item.externalSyncState !== 'snoozed-locally'
      );
    }
    return items.filter(
      (item) =>
        (item.memoryScope ?? 'org-brain') === scope &&
        item.externalSyncState !== 'snoozed-locally'
    );
  },

  proposeCloseInExternalSystem(items: BriefTaskItem[], id: string): BriefTaskItem[] {
    return items.map((item) =>
      item.id === id
        ? {
            ...item,
            completed: true,
            externalSyncState: 'closed-in-external',
          }
        : item
    );
  },

  snoozeItemFromBrief(items: BriefTaskItem[], id: string): BriefTaskItem[] {
    return items.map((item) =>
      item.id === id
        ? {
            ...item,
            externalSyncState: 'snoozed-locally',
          }
        : item
    );
  },

  countNewUpdatesSinceLastOpen(items: BriefTaskItem[], scope: MemoryScope): number {
    return items.filter(
      (i) =>
        (i.memoryScope ?? 'org-brain') === scope &&
        i.isNewSinceLastOpen &&
        i.externalSyncState !== 'snoozed-locally'
    ).length;
  },
};

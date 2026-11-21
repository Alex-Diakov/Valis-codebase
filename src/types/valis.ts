export type ProductSurface = 'employee-app' | 'admin-console';
export type UxVersionMode = 'v1-baseline' | 'v2-improvements';
export type MemoryScope = 'org-brain' | 'second-brain';

export type EmployeeNavId =
  | 'Home'
  | 'Calendar'
  | 'Library'
  | 'Chat'
  | 'Dictation'
  | 'Groups'
  | 'Settings';

export type AdminNavId =
  | 'Overview'
  | 'Valis Pulse'
  | 'Management Loop'
  | 'Reports'
  | 'Runbooks'
  | 'AI access'
  | 'Audit log'
  | 'Meeting permissions';

export interface SourceLink {
  label: string;
  type: 'calendar' | 'doc' | 'slack' | 'email' | 'notes' | 'jira' | 'pulse';
  previewTitle: string;
  previewMeta: string;
  previewBody: string;
}

export type BriefSectionName =
  | 'Calendar'
  | 'Decide'
  | 'I owe'
  | 'Others owe'
  | 'Signals';

export type ExternalSyncState =
  | 'none'
  | 'read-only-synced'
  | 'proposed-close-pending'
  | 'closed-in-external'
  | 'snoozed-locally';

export type SourceSyncPolicy = 'read-only' | 'write-back';

export type TaskResolutionState =
  | 'open'
  | 'writeback-queued'
  | 'propose-close-helper'
  | 'admin-writeback-requested'
  | 'dismissed-from-brief';

export interface BriefTaskItem {
  id: string;
  section: BriefSectionName;
  title: string;
  description: string;
  completed: boolean;
  sources: SourceLink[];
  memoryScope?: MemoryScope;
  isNewSinceLastOpen?: boolean;
  deltaTimestamp?: string;
  hasUnseenDelta?: boolean;
  deltaBadgeLabel?: string;
  deltaSummary?: string;
  syncPolicy?: SourceSyncPolicy;
  resolutionState?: TaskResolutionState;
  externalSystem?: 'Jira' | 'Google Calendar' | 'Salesforce' | 'Slack';
  externalKey?: string;
  externalSyncState?: ExternalSyncState;
}

export type ReportType = 'Summary' | 'Profile' | 'Guidelines' | 'Pipeline';

export interface ReportRow {
  id: string;
  title: string;
  department: 'Customer Support' | 'Engineering' | 'HR' | 'Finance' | 'Sales';
  type: ReportType;
  updated: string;
  isPrimaryLink?: boolean;
  executiveSummary: string;
  findings: {
    label: string;
    detail: string;
    metric: string;
  }[];
  owner: string;
}

export interface AttentionItem {
  id: string;
  headline: string;
  subline: string;
  actionLabel: string;
  drilldownKey: 'workflow' | 'age' | 'capture';
}

export interface PulseMetric {
  id: string;
  label: string;
  value: string;
}

export interface WeeklyWorkBar {
  week: string;
  created: number;
  completed: number;
}

export type LoopExecutionMode = 'Human-in-the-loop' | 'Autopilot' | 'Escalated';

export interface ManagementCommitItem {
  id: string;
  owner: string;
  role: string;
  commitment: string;
  dueDate: string;
  status: 'On track' | 'At risk' | 'Overdue' | 'Completed';
  source: string;
  loopMode?: LoopExecutionMode;
  targetSystem?: string;
  approvedByHuman?: boolean;
}

export interface RunbookItem {
  id: string;
  title: string;
  schedule: string;
  department: string;
  lastRun: string;
  status: 'Passed' | '2 findings' | 'Scheduled';
}

export interface SecurityBullet {
  id: string;
  text: string;
  badge?: {
    label: 'Live' | 'Early access';
    color: 'green' | 'amber';
  };
}

export interface SecurityColumn {
  id: string;
  title: string;
  headerBadge?: {
    label: 'Live' | 'Early access';
    color: 'green' | 'amber';
  };
  bullets: SecurityBullet[];
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  scope: string;
  category: 'AI access' | 'Audit log' | 'Meeting permissions';
}

export type ConnectorCeilingPolicy =
  | 'Read-only'
  | 'Needs approval to edit'
  | 'Off';

export interface SystemConnectorCeiling {
  id: string;
  name: string;
  policy: ConnectorCeilingPolicy;
  detail: string;
}

export interface DepartmentScopeRow {
  id: string;
  departmentRole: string;
  whatAiCanRead: string;
  blockedData: string;
  editingInExternalTools: string;
  summaryCanEdit: 'Only after human approval' | 'Read-only';
  linkedManagerId?: string;
  baseAllowedReads: string[];
  baseBlockedReads: string[];
}

export interface ManagerGrantRow {
  id: string;
  managerName: string;
  role: string;
  targetTeamScope: string;
  grantActive: boolean;
  summaryCanEdit: 'Only after human approval' | 'Read-only';
  baseAllowedReads: string[];
  baseBlockedReads: string[];
}

export type SecurityAuditFilterCategory =
  | 'All'
  | 'Permission changes'
  | 'Blocked AI prompts'
  | 'Approved edits';

export interface SecurityAuditTrailEntry {
  id: string;
  timestamp: string;
  actor: string;
  actionScope: string;
  guardrailCheck: string;
  guardrailTone: 'allowed' | 'blocked' | 'grant';
  filterCategory: Exclude<SecurityAuditFilterCategory, 'All'>;
}

export type SecurityPersonaId =
  | 'employee'
  | 'manager'
  | 'ceo'
  | 'deployment';

export type ToolAccessLevel =
  | 'No access'
  | 'Read-only'
  | 'Edit with approval';

export type SecurityToolAccessOption =
  | 'No access'
  | 'Read-only'
  | 'Edit (Approve)';

export type SecurityToolKey =
  | 'salesforce'
  | 'slackCalendar'
  | 'jira'
  | 'hrFinance';

export interface PersonaSecurityConfig {
  id: SecurityPersonaId;
  roleTitle: string;
  personSubtitle: string;
  personName: string;
  canToggleTeamMeetings: boolean;
  teamMeetingsAllowed: boolean;
  tools: Record<SecurityToolKey, ToolAccessLevel>;
}

export interface SecurityTeamToolRule {
  id: string;
  subjectId: string;
  teamName: string;
  personName: string;
  testButtonLabel: string;
  salesforce: SecurityToolAccessOption;
  slackCalendar: SecurityToolAccessOption;
  jira: SecurityToolAccessOption;
  github?: SecurityToolAccessOption;
  gdrive?: SecurityToolAccessOption;
  zendesk?: SecurityToolAccessOption;
  netsuite?: SecurityToolAccessOption;
  hrFinance: SecurityToolAccessOption;
}

export interface SecurityMeetingPermissionRow {
  id: string;
  subjectId: string;
  personName: string;
  roleSubtitle: string;
  testButtonLabel: string;
  ownCallsStatus:
    | 'Always visible'
    | '0% call content (Mic health only)'
    | '✓ Always visible'
    | '🚫 0% call content (Mic health only)';
  teamCallsMode: 'toggle' | 'not-manager' | 'blocked';
  teamCallsAllowed: boolean;
  departmentName?: string;
  departmentMembersSubtitle?: string;
  regularMembersTitle?: string;
  regularMembersBadge?: string;
  deptCallScopeLabel?: string;
}

export interface SecuritySandboxChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  text: string;
  statusLabel?: string;
  statusTone?: 'allowed' | 'blocked' | 'firewall';
}





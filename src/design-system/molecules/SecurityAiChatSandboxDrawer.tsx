import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import {
  SecuritySandboxChatMessage,
  SecurityToolAccessOption,
} from '../../types/valis';
import { SecurityToolStatusDropdown } from '../atoms/SecurityToolAccessPill';
import { ValisSegmentedSwitch } from '../atoms/ValisSegmentedSwitch';
import { ValisChatComposer, ValisKnotMark } from './ValisChatComposer';
import { ValisDrawer } from './ValisDrawer';

export type SecurityToolFieldKey =
  | 'salesforce'
  | 'slackCalendar'
  | 'jira'
  | 'github'
  | 'gdrive'
  | 'zendesk'
  | 'netsuite'
  | 'hrFinance';

export type SecurityDrawerTabId = 'configure' | 'chat';

export interface SecurityDrawerToolValues {
  salesforce: SecurityToolAccessOption;
  slackCalendar: SecurityToolAccessOption;
  jira: SecurityToolAccessOption;
  github: SecurityToolAccessOption;
  gdrive: SecurityToolAccessOption;
  zendesk: SecurityToolAccessOption;
  netsuite: SecurityToolAccessOption;
  hrFinance: SecurityToolAccessOption;
}

interface SecurityAiChatSandboxDrawerProps {
  subjectName: string;
  subjectSubtitle?: string;
  leadName?: string;
  memberCount?: number | null;
  activeDrawerTab: SecurityDrawerTabId;
  onSelectDrawerTab: (tab: SecurityDrawerTabId) => void;
  teamCallsLabel?: string;
  teamCallsAllowed: boolean;
  teamCallsIneligibleIndividual?: boolean;
  contractLockedZeroCustomerData?: boolean;
  onSetTeamCallsAllowed: (allowed: boolean) => void;
  toolValues: SecurityDrawerToolValues;
  onChangeToolPermission: (
    field: SecurityToolFieldKey,
    nextOption: SecurityToolAccessOption,
    toolLabel: string
  ) => void;
  messages: SecuritySandboxChatMessage[];
  isVerifying?: boolean;
  onSendMessage: (text: string) => void;
  onClearMessages?: () => void;
  onClose: () => void;
}

export const DRAWER_EIGHT_TOOLS: {
  field: SecurityToolFieldKey;
  label: string;
  shortLabel: string;
}[] = [
  { field: 'salesforce', label: 'Salesforce CRM', shortLabel: 'Salesforce' },
  { field: 'slackCalendar', label: 'Slack & Calendar', shortLabel: 'Slack' },
  { field: 'jira', label: 'Jira Tasks', shortLabel: 'Jira' },
  { field: 'github', label: 'GitHub Repos', shortLabel: 'GitHub' },
  {
    field: 'gdrive',
    label: 'Google Drive Docs',
    shortLabel: 'Google Drive',
  },
  { field: 'zendesk', label: 'Zendesk Support', shortLabel: 'Zendesk' },
  {
    field: 'netsuite',
    label: 'NetSuite Finance ERP',
    shortLabel: 'NetSuite',
  },
  { field: 'hrFinance', label: 'Workday HR Payroll', shortLabel: 'Workday HR' },
];

const QUICK_TEST_PROMPTS: string[] = [
  "What did my team discuss on yesterday's call?",
  'Show HR executive salaries',
  "Read coworker's private Second Brain",
];

export const SecurityAiChatSandboxDrawer: React.FC<
  SecurityAiChatSandboxDrawerProps
> = ({
  subjectName,
  subjectSubtitle,
  leadName,
  memberCount,
  activeDrawerTab,
  onSelectDrawerTab,
  teamCallsLabel = 'Lead Grant',
  teamCallsAllowed,
  teamCallsIneligibleIndividual = false,
  contractLockedZeroCustomerData = false,
  onSetTeamCallsAllowed,
  toolValues,
  onChangeToolPermission,
  messages,
  isVerifying = false,
  onSendMessage,
  onClearMessages,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [toolFilterQuery, setToolFilterQuery] = useState('');
  const chatThreadRef = useRef<HTMLDivElement | null>(null);

  const conversationMessages = messages.filter((msg) => msg.role !== 'system');

  useEffect(() => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [conversationMessages.length, isVerifying, activeDrawerTab]);

  const handleSubmitPrompt = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isVerifying) return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  const trimmedQuery = toolFilterQuery.trim().toLowerCase();
  const filteredTools = DRAWER_EIGHT_TOOLS.filter((tool) =>
    tool.label.toLowerCase().includes(trimmedQuery)
  );

  const getToolSortRank = (option: SecurityToolAccessOption): number => {
    if (option === 'Edit (Approve)') return 0;
    if (option === 'Read-only') return 1;
    return 2;
  };

  const sortedActiveTools = DRAWER_EIGHT_TOOLS.filter(
    (tool) => toolValues[tool.field] !== 'No access'
  ).sort(
    (a, b) =>
      getToolSortRank(toolValues[a.field]) - getToolSortRank(toolValues[b.field])
  );

  const offTools = DRAWER_EIGHT_TOOLS.filter(
    (tool) => toolValues[tool.field] === 'No access'
  );

  const sortedFilteredTools = [...filteredTools].sort(
    (a, b) =>
      getToolSortRank(toolValues[a.field]) - getToolSortRank(toolValues[b.field])
  );

  const activeToolCount = contractLockedZeroCustomerData
    ? 0
    : sortedActiveTools.length;

  const resolvedLeadName =
    leadName?.trim() ||
    (contractLockedZeroCustomerData ? 'Rollout Engineers' : 'Team Lead');

  const callGrantEyebrow = `TEAM LEAD CALL GRANT · ${resolvedLeadName.toUpperCase()} ONLY`;
  const toolAccessEyebrow = contractLockedZeroCustomerData
    ? 'DEPARTMENT TOOL ACCESS · EXTERNAL DEPLOYMENT'
    : typeof memberCount === 'number' && memberCount > 0
    ? `DEPARTMENT TOOL ACCESS · ALL ${memberCount} MEMBERS`
    : 'DEPARTMENT TOOL ACCESS · ALL MEMBERS';

  const tabSwitcher = (
    <div
      role="tablist"
      aria-label="Drawer mode switcher"
      className="grid grid-cols-2 gap-1 bg-valis-divider border border-valis-chromeborder rounded-[var(--valis-button-radius)] p-1 my-4"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeDrawerTab === 'configure'}
        data-testid="drawer-tab-configure"
        onClick={() => onSelectDrawerTab('configure')}
        className={`text-[12.5px] py-1.5 px-3 rounded-[var(--valis-checkbox-radius)] transition-colors cursor-pointer text-center whitespace-nowrap ${
          activeDrawerTab === 'configure'
            ? 'bg-valis-canvas text-valis-text font-semibold border border-valis-controlborder'
            : 'text-valis-navinactive hover:text-valis-text border border-transparent font-medium'
        }`}
      >
        Permissions
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeDrawerTab === 'chat'}
        data-testid="drawer-tab-chat"
        onClick={() => onSelectDrawerTab('chat')}
        className={`text-[12.5px] py-1.5 px-3 rounded-[var(--valis-checkbox-radius)] transition-colors cursor-pointer text-center whitespace-nowrap ${
          activeDrawerTab === 'chat'
            ? 'bg-valis-canvas text-valis-text font-semibold border border-valis-controlborder'
            : 'text-valis-navinactive hover:text-valis-text border border-transparent font-medium'
        }`}
      >
        Test AI Chat
      </button>
    </div>
  );

  return (
    <ValisDrawer
      isOpen={true}
      onClose={onClose}
      eyebrow="AI Security Scope"
      title={subjectName}
      subtitle={subjectSubtitle}
      ariaLabel="Permissions and AI Chat Drawer"
      headerExtra={tabSwitcher}
      bodyClassName={
        activeDrawerTab === 'chat'
          ? 'flex-1 overflow-hidden px-5 pb-5 flex flex-col justify-between min-h-0'
          : 'flex-1 overflow-y-auto px-5 pb-8 min-h-0'
      }
    >
      {/* =========================================================
          TAB 1: Permissions (Explicit Lead vs. Department Ownership)
      ========================================================= */}
      {activeDrawerTab === 'configure' && (
        <div>
          {/* Section 1: Team Lead Call Grant (Single Lead Only) */}
          <div className="pb-5 border-b border-valis-sidebarborder">
            <div className="text-[11px] uppercase tracking-[0.06em] font-medium text-valis-subtle mb-3">
              {callGrantEyebrow}
            </div>

            {contractLockedZeroCustomerData ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-valis-text leading-[1.35] whitespace-nowrap">
                    {teamCallsLabel}
                  </span>
                  <span
                    data-testid="drawer-team-calls-contract-locked"
                    className="text-[11.5px] text-valis-subtle font-medium whitespace-nowrap shrink-0"
                  >
                    0% call content
                  </span>
                </div>
                <div className="text-[12px] text-valis-muted font-medium">
                  Contract-locked · Zero customer data access
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium text-valis-text leading-[1.35] whitespace-nowrap">
                  {teamCallsLabel}
                </span>

                {teamCallsIneligibleIndividual ? (
                  <span
                    data-testid="drawer-team-calls-ineligible"
                    className="text-[12px] text-valis-subtle font-medium whitespace-nowrap shrink-0"
                  >
                    Own calls only
                  </span>
                ) : (
                  <ValisSegmentedSwitch
                    value={teamCallsAllowed ? 'all' : 'own'}
                    options={[
                      { value: 'own', label: 'Own calls', activeTone: 'neutral' },
                      {
                        value: 'all',
                        label: 'All team calls',
                        activeTone: 'elevated',
                      },
                    ]}
                    onChange={(nextVal) =>
                      onSetTeamCallsAllowed(nextVal === 'all')
                    }
                    ariaLabel={`${teamCallsLabel} switch for ${subjectName}`}
                    testId="drawer-toggle-team-calls"
                    size="sm"
                  />
                )}
              </div>
            )}

            <p className="text-[12.5px] text-valis-subtle mt-2.5 leading-[1.45]">
              Regular members: own calls only · Personal Second Brain: always private
            </p>
          </div>

          {/* Section 2: Department Tool Access (All N Members) */}
          <div className="pt-5">
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <div className="text-[11px] uppercase tracking-[0.06em] font-medium text-valis-subtle">
                {toolAccessEyebrow}
              </div>
              <span className="text-[11.5px] text-valis-muted tabular-nums shrink-0">
                {activeToolCount}/{DRAWER_EIGHT_TOOLS.length} enabled
              </span>
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={toolFilterQuery}
              onChange={(e) => setToolFilterQuery(e.target.value)}
              placeholder="Search tools..."
              aria-label="Search connected tools"
              className="w-full bg-valis-canvas border border-valis-chromeborder focus:border-valis-text rounded-[var(--valis-button-radius)] px-3 py-1.5 text-[12.5px] text-valis-text placeholder:text-valis-subtle focus:outline-none mb-2"
            />

            {contractLockedZeroCustomerData ? (
              <div>
                <div className="py-2 px-2.5 mb-1.5 bg-valis-sidebar border border-valis-sidebarborder rounded-[var(--valis-button-radius)] text-[12.5px] text-valis-muted font-medium">
                  Contract-locked · Zero customer data access
                </div>
                <div className="divide-y divide-valis-divider">
                  {filteredTools.length === 0 ? (
                    <div className="py-4 text-[12.5px] text-valis-subtle text-center">
                      No matching tools
                    </div>
                  ) : (
                    filteredTools.map((tool) => (
                      <div
                        key={tool.field}
                        className="py-2.5 flex items-center justify-between gap-3 opacity-60 select-none"
                      >
                        <span className="text-[13.5px] text-valis-muted truncate">
                          {tool.label}
                        </span>
                        <SecurityToolStatusDropdown
                          value="No access"
                          toolName={tool.label}
                          subjectName={subjectName}
                          disabled={true}
                          disabledReason="Contract-locked · Zero customer data access"
                          onChange={() => {}}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : trimmedQuery.length > 0 ? (
              <div className="divide-y divide-valis-divider">
                {sortedFilteredTools.length === 0 ? (
                  <div className="py-4 text-[12.5px] text-valis-subtle text-center">
                    No matching tools
                  </div>
                ) : (
                  sortedFilteredTools.map((tool) => {
                    const isOff = toolValues[tool.field] === 'No access';
                    return (
                      <div
                        key={tool.field}
                        className="py-2.5 flex items-center justify-between gap-3"
                      >
                        <span
                          className={`text-[13.5px] truncate ${
                            isOff
                              ? 'text-valis-muted font-normal'
                              : 'text-valis-text font-medium'
                          }`}
                        >
                          {tool.label}
                        </span>
                        <SecurityToolStatusDropdown
                          value={toolValues[tool.field]}
                          toolName={tool.label}
                          subjectName={subjectName}
                          onChange={(nextOption) =>
                            onChangeToolPermission(
                              tool.field,
                              nextOption,
                              tool.label
                            )
                          }
                        />
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div>
                {sortedActiveTools.length > 0 && (
                  <div className="divide-y divide-valis-divider">
                    {sortedActiveTools.map((tool) => (
                      <div
                        key={tool.field}
                        className="py-2.5 flex items-center justify-between gap-3"
                      >
                        <span className="text-[13.5px] text-valis-text font-medium truncate">
                          {tool.label}
                        </span>
                        <SecurityToolStatusDropdown
                          value={toolValues[tool.field]}
                          toolName={tool.label}
                          subjectName={subjectName}
                          onChange={(nextOption) =>
                            onChangeToolPermission(
                              tool.field,
                              nextOption,
                              tool.label
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}

                {offTools.length > 0 && (
                  <div
                    className={
                      sortedActiveTools.length > 0
                        ? 'mt-2 pt-3 border-t border-valis-sidebarborder'
                        : 'pt-1'
                    }
                  >
                    <div className="text-[11px] uppercase tracking-[0.06em] font-medium text-valis-subtle mb-1">
                      Switched off
                    </div>
                    <div className="divide-y divide-valis-divider">
                      {offTools.map((tool) => (
                        <div
                          key={tool.field}
                          className="py-2.5 flex items-center justify-between gap-3"
                        >
                          <span className="text-[13.5px] text-valis-muted font-normal truncate">
                            {tool.label}
                          </span>
                          <SecurityToolStatusDropdown
                            value={toolValues[tool.field]}
                            toolName={tool.label}
                            subjectName={subjectName}
                            onChange={(nextOption) =>
                              onChangeToolPermission(
                                tool.field,
                                nextOption,
                                tool.label
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: Test AI Chat (Centered Zero-State + Glass-Box Editorial Thread)
      ========================================================= */}
      {activeDrawerTab === 'chat' && (
        <>
          {conversationMessages.length === 0 ? (
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-2 py-4 text-center min-h-0">
              <div className="w-10 h-10 rounded-[var(--valis-panel-radius)] bg-valis-divider flex items-center justify-center text-valis-text shrink-0">
                <ValisKnotMark className="w-6 h-6" />
              </div>

              <h3 className="text-[15px] font-semibold text-valis-text tracking-[-0.015em] mt-3">
                Test {subjectName} boundary
              </h3>

              <div className="mt-1.5 text-[11.5px] text-valis-navinactive bg-valis-divider/80 px-2.5 py-0.5 rounded-full tabular-nums">
                {contractLockedZeroCustomerData
                  ? `0/${DRAWER_EIGHT_TOOLS.length} tools enabled · 0% call content`
                  : `${activeToolCount}/${DRAWER_EIGHT_TOOLS.length} tools enabled · ${
                      teamCallsAllowed ? 'Lead Calls: Active' : 'Own calls only'
                    }`}
              </div>

              <div className="w-full mt-5 space-y-2 text-left">
                {QUICK_TEST_PROMPTS.map((prompt, idx) => (
                  <button
                    key={prompt}
                    type="button"
                    data-testid={`sandbox-quick-prompt-${idx}`}
                    disabled={isVerifying}
                    onClick={() => onSendMessage(prompt)}
                    className="w-full bg-valis-canvas border border-valis-sidebarborder hover:border-valis-text rounded-[var(--valis-card-radius)] px-3.5 py-2.5 flex items-center justify-between gap-2 text-[13px] text-valis-text transition-colors group cursor-pointer text-left disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="leading-[1.35]">{prompt}</span>
                    <ArrowUpRight
                      className="w-[13px] h-[13px] text-valis-subtle group-hover:text-valis-text shrink-0 transition-colors"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              ref={chatThreadRef}
              className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1 min-h-0"
            >
              {conversationMessages.map((msg) => {
                if (msg.role === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="bg-valis-divider text-valis-text text-[13.5px] leading-[1.5] px-3.5 py-2.5 rounded-[12px] rounded-tr-[4px] max-w-[85%] ml-auto">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                const isAllowed = msg.statusTone === 'allowed';
                const isFirewall = msg.statusTone === 'firewall';
                const isBlocked = msg.statusTone === 'blocked';

                return (
                  <div key={msg.id} className="space-y-1.5 py-1">
                    <div className="flex items-center gap-1.5 text-[11.5px] font-medium">
                      {isAllowed ? (
                        <>
                          <CheckCircle2
                            className="w-[13px] h-[13px] text-valis-green shrink-0"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          <span className="text-valis-green">
                            Allowed · Verified against scope
                          </span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert
                            className="w-[13px] h-[13px] text-valis-blockedred shrink-0"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          <span className="text-valis-blockedred">
                            {isFirewall
                              ? 'Blocked · Second Brain Firewall'
                              : 'Blocked · Restricted by policy'}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-[13.5px] leading-[1.55] text-valis-text">
                      {msg.text}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11.5px]">
                      {isAllowed ? (
                        <span className="text-valis-subtle underline decoration-valis-underline underline-offset-2">
                          Source: {msg.sourceCitation ?? 'Workspace OrgBrain'}
                        </span>
                      ) : isBlocked ? (
                        <button
                          type="button"
                          onClick={() => onSelectDrawerTab('configure')}
                          className="text-valis-blue hover:underline font-medium cursor-pointer transition-colors"
                        >
                          Adjust in Permissions →
                        </button>
                      ) : (
                        <span className="text-valis-subtle">
                          Hardware-isolated · Cannot be overridden
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {isVerifying && (
                <div
                  role="status"
                  aria-live="polite"
                  className="py-1 text-[12px] text-valis-subtle animate-pulse"
                >
                  Checking {subjectName} policy &amp; connectors...
                </div>
              )}
            </div>
          )}

          {/* Unified Floating Composer */}
          <div className="pt-2 shrink-0">
            <ValisChatComposer
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmitPrompt}
              placeholder={`Ask Valis Chat as ${subjectName}...`}
              ariaLabel={`Ask Valis Chat as ${subjectName}`}
              scopeLabel={subjectName}
              showClear={conversationMessages.length > 0}
              onClear={onClearMessages}
              isSubmitting={isVerifying}
              submitAriaLabel="Send test prompt"
            />
          </div>
        </>
      )}
    </ValisDrawer>
  );
};

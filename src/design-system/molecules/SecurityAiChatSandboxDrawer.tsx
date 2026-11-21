import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import {
  SecuritySandboxChatMessage,
  SecurityToolAccessOption,
} from '../../types/valis';
import { SecurityToolSegmentedSwitch } from '../atoms/SecurityToolAccessPill';

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
  onSendMessage: (text: string) => void;
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
  'Team call yesterday?',
  'Show HR salaries',
  "Coworker's private Second Brain?",
];

export const SecurityAiChatSandboxDrawer: React.FC<
  SecurityAiChatSandboxDrawerProps
> = ({
  subjectName,
  subjectSubtitle,
  activeDrawerTab,
  onSelectDrawerTab,
  teamCallsLabel = 'Team Lead Grant',
  teamCallsAllowed,
  teamCallsIneligibleIndividual = false,
  contractLockedZeroCustomerData = false,
  onSetTeamCallsAllowed,
  toolValues,
  onChangeToolPermission,
  messages,
  onSendMessage,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [toolFilterQuery, setToolFilterQuery] = useState('');
  const chatThreadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [messages, activeDrawerTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  const filteredTools = DRAWER_EIGHT_TOOLS.filter((tool) =>
    tool.label.toLowerCase().includes(toolFilterQuery.trim().toLowerCase())
  );

  const activeToolCount = contractLockedZeroCustomerData
    ? 0
    : DRAWER_EIGHT_TOOLS.filter((t) => toolValues[t.field] !== 'No access')
        .length;

  return (
    <>
      {/* Full-Viewport Dimmed & Blurred Backdrop — covers entire viewport including left sidebar */}
      <div
        aria-hidden="true"
        data-testid="drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-valis-text/20 backdrop-blur-[1.5px] transition-opacity"
      />

      {/* Slide-Over Overlay Drawer (w-[420px] z-50) */}
      <aside
        aria-label="Permissions and AI Chat Drawer"
        className="fixed inset-y-0 right-0 w-[420px] z-50 bg-valis-bg border-l border-valis-sidebarborder shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Sticky Top Header & 2-Tab Switcher */}
        <div className="px-5 pt-5 shrink-0 bg-valis-bg">
          {/* 1. Drawer Header */}
          <div className="pb-4 border-b border-valis-sidebarborder flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[17px] font-semibold text-valis-text leading-[1.3] truncate">
                {subjectName}
              </h3>
              {subjectSubtitle && (
                <div className="text-[12.5px] text-valis-muted mt-0.5 truncate">
                  {subjectSubtitle}
                </div>
              )}
            </div>
            <button
              type="button"
              aria-label="Close drawer"
              onClick={onClose}
              className="text-valis-muted hover:text-valis-text p-1 rounded-[4px] transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Clean 2-Tab Segmented Switch (Zero Emojis/Icons): Permissions | Test AI Chat */}
          <div
            role="tablist"
            aria-label="Drawer mode switcher"
            className="grid grid-cols-2 gap-1 bg-valis-divider border border-valis-chromeborder rounded-[6px] p-1 my-4"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeDrawerTab === 'configure'}
              data-testid="drawer-tab-configure"
              onClick={() => onSelectDrawerTab('configure')}
              className={`text-[12.5px] py-1.5 px-3 rounded-[4px] transition-colors cursor-pointer text-center whitespace-nowrap ${
                activeDrawerTab === 'configure'
                  ? 'bg-valis-canvas text-valis-text font-semibold border border-valis-controlborder'
                  : 'text-valis-muted hover:text-valis-text border border-transparent font-medium'
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
              className={`text-[12.5px] py-1.5 px-3 rounded-[4px] transition-colors cursor-pointer text-center whitespace-nowrap ${
                activeDrawerTab === 'chat'
                  ? 'bg-valis-canvas text-valis-text font-semibold border border-valis-controlborder'
                  : 'text-valis-muted hover:text-valis-text border border-transparent font-medium'
              }`}
            >
              Test AI Chat
            </button>
          </div>
        </div>

        {/* =========================================================
            TAB 1: Permissions (Independently Scrollable Body)
        ========================================================= */}
        {activeDrawerTab === 'configure' && (
          <div className="flex-1 overflow-y-auto px-5 pb-8 min-h-0">
            {/* Section 1: Meeting Access */}
            <div className="pb-5 border-b border-valis-sidebarborder">
              <div className="text-[11.5px] font-semibold uppercase tracking-[0.04em] text-valis-muted mb-3">
                Meeting Access
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
                    <div
                      role="group"
                      aria-label={`${teamCallsLabel} switch for ${subjectName}`}
                      data-testid="drawer-toggle-team-calls"
                      className="inline-flex items-center bg-valis-divider border border-valis-chromeborder rounded-[5px] p-0.5 shrink-0"
                    >
                      <button
                        type="button"
                        aria-pressed={!teamCallsAllowed}
                        onClick={() => {
                          if (teamCallsAllowed) {
                            onSetTeamCallsAllowed(false);
                          }
                        }}
                        className={`text-[11.5px] px-2.5 py-0.5 rounded-[4px] border transition-colors cursor-pointer whitespace-nowrap ${
                          !teamCallsAllowed
                            ? 'bg-valis-canvas border-valis-controlborder text-valis-text font-medium'
                            : 'border-transparent text-valis-muted hover:text-valis-text'
                        }`}
                      >
                        Own calls
                      </button>
                      <button
                        type="button"
                        aria-pressed={teamCallsAllowed}
                        onClick={() => {
                          if (!teamCallsAllowed) {
                            onSetTeamCallsAllowed(true);
                          }
                        }}
                        className={`text-[11.5px] px-2.5 py-0.5 rounded-[4px] border transition-colors cursor-pointer whitespace-nowrap ${
                          teamCallsAllowed
                            ? 'bg-valis-text border-valis-text text-valis-canvas font-medium'
                            : 'border-transparent text-valis-muted hover:text-valis-text'
                        }`}
                      >
                        All team calls
                      </button>
                    </div>
                  )}
                </div>
              )}

              <p className="text-[12px] text-valis-subtle mt-2.5 leading-[1.45]">
                Regular members: own calls only · Personal Second Brain: always private
              </p>
            </div>

            {/* Section 2: Connected Tools */}
            <div className="pt-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="text-[11.5px] font-semibold uppercase tracking-[0.04em] text-valis-muted">
                  Connected Tools · {activeToolCount}/{DRAWER_EIGHT_TOOLS.length} enabled
                </div>
              </div>

              {/* Search Input */}
              <input
                type="text"
                value={toolFilterQuery}
                onChange={(e) => setToolFilterQuery(e.target.value)}
                placeholder="Search tools..."
                aria-label="Search connected tools"
                className="w-full bg-valis-canvas border border-valis-chromeborder focus:border-valis-text rounded-[6px] px-3 py-1.5 text-[12.5px] text-valis-text placeholder:text-valis-subtle focus:outline-none mb-2"
              />

              {contractLockedZeroCustomerData ? (
                <div>
                  <div className="py-2 px-2.5 mb-1.5 bg-valis-sidebar border border-valis-sidebarborder rounded-[6px] text-[12px] text-valis-muted font-medium">
                    Contract-locked · Zero customer data access
                  </div>
                  <div className="divide-y divide-valis-divider">
                    {filteredTools.map((tool) => (
                      <div
                        key={tool.field}
                        className="py-2.5 flex items-center justify-between gap-3 opacity-60 select-none"
                      >
                        <span className="text-[13.5px] text-valis-muted truncate">
                          {tool.label}
                        </span>
                        <SecurityToolSegmentedSwitch
                          value="No access"
                          toolName={tool.label}
                          subjectName={subjectName}
                          disabled={true}
                          disabledReason="Contract-locked · Zero customer data access"
                          onChange={() => {}}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-valis-divider">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.field}
                      className="py-2.5 flex items-center justify-between gap-3"
                    >
                      <span className="text-[13.5px] text-valis-text font-medium truncate">
                        {tool.label}
                      </span>
                      <SecurityToolSegmentedSwitch
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
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: Test AI Chat (Independently Scrollable Body)
        ========================================================= */}
        {activeDrawerTab === 'chat' && (
          <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col justify-between min-h-0">
            {/* Full-Height Scrollable Chat Thread */}
            <div
              ref={chatThreadRef}
              className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 min-h-0"
            >
              {messages.map((msg) => {
                if (msg.role === 'system') {
                  return (
                    <div
                      key={msg.id}
                      className="py-2 border-b border-valis-sidebarborder text-[12.5px] text-valis-muted leading-[1.5]"
                    >
                      {msg.text}
                    </div>
                  );
                }

                if (msg.role === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[85%] bg-valis-text text-valis-canvas rounded-[var(--valis-card-radius)] px-3.5 py-2 text-[13px] leading-[1.45]">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-card-radius)] p-3.5 space-y-1.5"
                  >
                    {msg.statusLabel && (
                      <div className="text-[11.5px] font-semibold text-valis-secondary">
                        {msg.statusLabel}
                      </div>
                    )}
                    <p className="text-[13px] text-valis-text leading-[1.5]">
                      {msg.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* 3 Rounded-Full Prompt Chips + Live Chat Input */}
            <div className="pt-3 border-t border-valis-sidebarborder shrink-0">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {QUICK_TEST_PROMPTS.map((chip, idx) => (
                  <button
                    key={chip}
                    type="button"
                    data-testid={`sandbox-quick-prompt-${idx}`}
                    onClick={() => onSendMessage(chip)}
                    className="text-left text-[12px] bg-valis-canvas border border-valis-chromeborder hover:border-valis-text text-valis-secondary hover:text-valis-text rounded-full px-3 py-1 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask Valis Chat as ${subjectName}...`}
                  aria-label={`Ask Valis Chat as ${subjectName}`}
                  className="flex-1 min-w-0 bg-valis-canvas border border-valis-chromeborder focus:border-valis-text rounded-[6px] px-3 py-2 text-[13px] text-valis-text placeholder:text-valis-subtle focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send test prompt"
                  className="bg-valis-text hover:bg-valis-texthover text-valis-canvas text-[13px] font-medium px-3 py-2 rounded-[6px] shrink-0 transition-colors cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

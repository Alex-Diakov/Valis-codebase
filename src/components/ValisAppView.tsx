import React, { useState } from 'react';
import {
  Home,
  Calendar,
  Inbox,
  MessageSquare,
  Mic,
  Users,
  Settings,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  BriefTaskItem as BriefTaskItemType,
  BriefSectionName,
  EmployeeNavId,
  MemoryScope,
  ProductSurface,
  SourceLink,
  TaskResolutionState,
  UxVersionMode,
} from '../types/valis';
import { VALIS_TOKENS } from '../design-system/tokens';
import { CallListenerBanner } from '../design-system/molecules/CallListenerBanner';
import { BriefTaskItem } from '../design-system/molecules/BriefTaskItem';
import { ScopeSegmentedControl } from '../design-system/molecules/ScopeSegmentedControl';
import { TemporalDeltaBar } from '../design-system/molecules/TemporalDeltaBar';
import { ProfileSwitcherFooter } from '../design-system/molecules/ProfileSwitcherFooter';

interface ValisAppViewProps {
  activeNav: EmployeeNavId;
  onSelectNav: (nav: EmployeeNavId) => void;
  uxMode: UxVersionMode;
  onSelectSurface: (surface: ProductSurface) => void;
  onSelectUxMode: (mode: UxVersionMode) => void;
  memoryScope: MemoryScope;
  onChangeMemoryScope: (scope: MemoryScope) => void;
  items: BriefTaskItemType[];
  unseenChangesCount: number;
  showOnlyChanges: boolean;
  onToggleShowOnlyChanges: () => void;
  onMarkSeen: () => void;
  onResetDemoDelta: () => void;
  selectedSource: SourceLink | null;
  onSelectSource: (source: SourceLink | null) => void;
  isListeningCall: boolean;
  onToggleListeningCall: () => void;
  onToggleItem: (id: string) => void;
  onSetResolutionState: (id: string, state: TaskResolutionState) => void;
  onAddVoiceNoteTask: (
    title: string,
    description: string,
    section: BriefSectionName
  ) => void;
  onSwitchToAdminConsole: () => void;
}

const BRIEF_SECTIONS: BriefSectionName[] = [
  'Calendar',
  'Decide',
  'I owe',
  'Others owe',
  'Signals',
];

const ValisToggleSwitch: React.FC<{
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}> = ({ checked, onChange, ariaLabel }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    onClick={onChange}
    className={`w-[36px] h-[20px] rounded-full p-[2px] transition-colors flex items-center cursor-pointer shrink-0 ${
      checked ? 'bg-valis-text justify-end' : 'bg-valis-dots justify-start'
    }`}
  >
    <span className="w-[16px] h-[16px] rounded-full bg-valis-canvas shadow-2xs block" />
  </button>
);

const AvatarStack: React.FC<{
  avatars: { initials: string; bg: string; text?: string }[];
}> = ({ avatars }) => (
  <div className="flex items-center -space-x-1.5 shrink-0">
    {avatars.map((av, idx) => (
      <span
        key={idx}
        style={{
          backgroundColor: av.bg,
          color: av.text ?? VALIS_TOKENS.colors.canvasBg,
        }}
        className="w-[24px] h-[24px] rounded-full text-[10px] font-semibold flex items-center justify-center ring-2 ring-valis-canvas shrink-0"
      >
        {av.initials}
      </span>
    ))}
  </div>
);

export const ValisAppView: React.FC<ValisAppViewProps> = ({
  activeNav,
  onSelectNav,
  uxMode,
  onSelectSurface,
  onSelectUxMode,
  memoryScope,
  onChangeMemoryScope,
  items,
  unseenChangesCount,
  showOnlyChanges,
  onToggleShowOnlyChanges,
  onMarkSeen,
  onResetDemoDelta,
  selectedSource,
  onSelectSource,
  isListeningCall,
  onToggleListeningCall,
  onToggleItem,
  onSetResolutionState,
  onAddVoiceNoteTask,
  onSwitchToAdminConsole,
}) => {
  // Mutual exclusivity & state isolation: close Source Context Drawer and Voice Capture on scope or sidebar view switch
  const [isVoiceCapturing, setIsVoiceCapturing] = useState(false);

  const handleVoiceCapturingChange = (capturing: boolean) => {
    setIsVoiceCapturing(capturing);
    if (capturing && selectedSource) {
      onSelectSource(null);
    }
  };

  const handleSelectSourceExclusive = (source: SourceLink | null) => {
    if (source && isVoiceCapturing) {
      setIsVoiceCapturing(false);
    }
    onSelectSource(source);
  };

  const handleChangeMemoryScopeIsolated = (scope: MemoryScope) => {
    onSelectSource(null);
    onChangeMemoryScope(scope);
  };

  const handleSelectNavIsolated = (nav: EmployeeNavId) => {
    onSelectSource(null);
    onSelectNav(nav);
  };

  // Calendar state
  const [inviteAllBots, setInviteAllBots] = useState(true);
  const [meetingToggles, setMeetingToggles] = useState<Record<string, boolean>>({
    'm-1': true,
    'm-2': true,
    'm-3': true,
    'm-4': true,
  });

  // Library state
  const [libraryTab, setLibraryTab] = useState<
    'All' | 'Meetings' | 'Voice Notes' | 'Documents'
  >('All');

  // Chat state
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'valis'; text: string; citation?: string }[]
  >([]);

  const isV2 = uxMode === 'v2-improvements';

  const navItems: { id: EmployeeNavId; icon: React.ReactNode; muted?: boolean }[] = [
    { id: 'Home', icon: <Home className="w-[15px] h-[15px]" strokeWidth={1.6} /> },
    { id: 'Calendar', icon: <Calendar className="w-[15px] h-[15px]" strokeWidth={1.6} /> },
    { id: 'Library', icon: <Inbox className="w-[15px] h-[15px]" strokeWidth={1.6} /> },
    { id: 'Chat', icon: <MessageSquare className="w-[15px] h-[15px]" strokeWidth={1.6} /> },
    {
      id: 'Dictation',
      icon: <Mic className="w-[15px] h-[15px]" strokeWidth={1.6} />,
      muted: true,
    },
    {
      id: 'Groups',
      icon: <Users className="w-[15px] h-[15px]" strokeWidth={1.6} />,
      muted: true,
    },
    {
      id: 'Settings',
      icon: <Settings className="w-[15px] h-[15px]" strokeWidth={1.6} />,
      muted: true,
    },
  ];

  const askQuestionInChat = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    let answer =
      'Searched across your meetings, messages, and documents in the demo company.';
    let citation = 'Workspace index · Mon 16 Nov';
    if (trimmed.toLowerCase().includes('pricing')) {
      answer =
        'In the Thursday 12 Nov Pricing review (11:00 · 50min), the team decided the annual discount will be tested with new customers only. Tom Becker is drafting the price page changes.';
      citation = 'Pricing review · Thursday, 12 November';
    } else if (trimmed.toLowerCase().includes('support hiring')) {
      answer =
        'In Wednesday 11 Nov Support hiring plan (14:30 · 30min), Maria Lopez proposed two new support roles to bring the backlog down. The plan is waiting for contract review merge approval first.';
      citation = 'Support hiring plan · Wednesday, 11 November';
    } else if (trimmed.toLowerCase().includes('others owe')) {
      answer =
        'Daniel Kim owes the Renewal risk view (waiting since Tue 10 Nov, tracked in Jira OPS-142 and Slack #finance).';
      citation = 'Jira OPS-142 · Slack #finance';
    }
    setChatHistory((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      { role: 'valis', text: answer, citation },
    ]);
    setChatQuery('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    askQuestionInChat(chatQuery);
  };

  // Track which section's multi-hidden tray is expanded
  const [expandedHiddenSections, setExpandedHiddenSections] = useState<
    Record<string, boolean>
  >({});

  const toggleHiddenSectionTray = (sectionName: BriefSectionName) => {
    setExpandedHiddenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const truncateHiddenTitle = (title: string, maxLen = 28) =>
    title.length > maxLen ? `${title.slice(0, maxLen).trimEnd()}...` : title;

  const renderSection = (sectionName: BriefSectionName) => {
    const sectionItems = items.filter((item) => item.section === sectionName);
    if (sectionItems.length === 0) return null;

    const hiddenItemsInSection = isV2
      ? sectionItems.filter(
          (item) => item.resolutionState === 'dismissed-from-brief'
        )
      : [];
    const visibleItemsInSection = isV2
      ? sectionItems.filter(
          (item) => item.resolutionState !== 'dismissed-from-brief'
        )
      : sectionItems;

    const hiddenCount = hiddenItemsInSection.length;
    const isTrayExpanded = Boolean(expandedHiddenSections[sectionName]);
    const hiddenTitlesTooltip = hiddenItemsInSection
      .map((h) => h.title)
      .join(' · ');

    return (
      <div className="mb-5 last:mb-2" key={sectionName}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-[14px] font-semibold text-valis-text tracking-[-0.01em]">
            {sectionName}
          </h3>
          {isV2 && hiddenCount === 1 && (
            <div className="inline-flex items-center text-[12.5px] text-valis-subtle">
              <span title={hiddenItemsInSection[0].title}>
                1 hidden ({truncateHiddenTitle(hiddenItemsInSection[0].title)}) ·
              </span>
              <button
                type="button"
                onClick={() =>
                  onSetResolutionState(hiddenItemsInSection[0].id, 'open')
                }
                className="text-valis-text font-medium underline decoration-valis-underline hover:decoration-valis-text ml-1.5 cursor-pointer"
              >
                Restore
              </button>
            </div>
          )}
          {isV2 && hiddenCount >= 2 && (
            <button
              type="button"
              title={`Hidden: ${hiddenTitlesTooltip}`}
              onClick={() => toggleHiddenSectionTray(sectionName)}
              className="text-[12.5px] text-valis-muted hover:text-valis-text font-medium transition-colors cursor-pointer"
            >
              {hiddenCount} hidden {isTrayExpanded ? '▴' : '▾'}
            </button>
          )}
        </div>
        {visibleItemsInSection.length > 0 && (
          <div className="space-y-1.5">
            {visibleItemsInSection.map((item) => (
              <BriefTaskItem
                key={item.id}
                item={item}
                uxMode={uxMode}
                unseenChangesCount={unseenChangesCount}
                showOnlyChanges={showOnlyChanges}
                onToggle={onToggleItem}
                onSelectSource={handleSelectSourceExclusive}
                onSetResolutionState={onSetResolutionState}
              />
            ))}
          </div>
        )}
        {isV2 && hiddenCount >= 2 && isTrayExpanded && (
          <div className="mt-1.5 pt-1.5 border-t border-valis-divider space-y-1">
            {hiddenItemsInSection.map((hiddenItem) => (
              <div
                key={hiddenItem.id}
                className="flex items-center justify-between gap-3 py-1 text-[13.5px] leading-[1.5]"
              >
                <span className="truncate">
                  <span className="font-medium text-valis-completed">
                    {hiddenItem.title}
                  </span>{' '}
                  <span className="text-valis-subtle">
                    · {hiddenItem.description}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onSetResolutionState(hiddenItem.id, 'open')}
                  className="text-[12.5px] text-valis-text font-medium underline decoration-valis-underline hover:decoration-valis-text ml-1.5 shrink-0 cursor-pointer"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const {
    avatarSlate,
    avatarBronze,
    avatarSage,
    avatarPlum,
    avatarSteel,
    rowDivider,
    textSecondary,
    brandZoom,
    brandMeet,
    brandTeams,
    canvasBg,
  } = VALIS_TOKENS.colors;

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {/* Left Sidebar (w-[var(--valis-sidebar-width)] h-full) */}
      <aside className="w-[var(--valis-sidebar-width)] h-full flex flex-col justify-between bg-valis-sidebar border-r border-valis-sidebarborder shrink-0 select-none">
        <div className="p-3.5 flex-1 min-h-0 overflow-y-auto">
          {/* Logo: https://valis.so/assets/brand-2026-11/lockup-ink.svg */}
          <div className="flex items-center px-2 pt-1 pb-4">
            <img
              src="https://valis.so/assets/brand-2026-11/lockup-ink.svg"
              alt="valis"
              className="h-[22px] w-auto block select-none"
            />
          </div>

          {/* PATTERN 1: Mode Error Prevention — Segmented Scope Switcher */}
          {isV2 && (
            <ScopeSegmentedControl
              memoryScope={memoryScope}
              onChangeMemoryScope={handleChangeMemoryScopeIsolated}
            />
          )}

          {/* Menu */}
          <nav className="space-y-0.5" aria-label="Valis App Sidebar">
            {navItems.map((nav) => {
              const isActive = activeNav === nav.id;
              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => handleSelectNavIsolated(nav.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-[7.5px] text-[13.5px] rounded-[var(--valis-control-radius)] transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-valis-activeitem text-valis-text font-medium'
                      : 'text-valis-navinactive hover:text-valis-text hover:bg-valis-sidebarhover/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-valis-text' : 'text-valis-navinactive'}>
                      {nav.icon}
                    </span>
                    <span>{nav.id}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer: Interactive Profile Card with Popover Switcher */}
        <ProfileSwitcherFooter
          surface="employee-app"
          uxMode={uxMode}
          subtitle="Demo company"
          showAvatar={true}
          onSelectSurface={onSelectSurface}
          onSelectUxMode={onSelectUxMode}
        />
      </aside>

      {/* Right Main Scrollable Container */}
      <div className="flex-1 h-full overflow-y-auto bg-valis-canvas flex flex-col">
        <div className="max-w-[var(--valis-app-workspace-max-width)] w-full mx-auto px-10 py-8 flex-1 flex flex-col">
        {activeNav === 'Home' && (
          <div className="w-full flex flex-col">
            {/* PATTERN 1: Morphing Top Call Listener & Voice Capture Bar */}
            <div className="mb-5">
              <CallListenerBanner
                isListening={isListeningCall}
                uxMode={uxMode}
                memoryScope={memoryScope}
                isCapturing={isVoiceCapturing}
                onCapturingChange={handleVoiceCapturingChange}
                onToggleListening={onToggleListeningCall}
                onSaveCapture={(title, description, section) => {
                  onAddVoiceNoteTask(title, description, section);
                  handleSelectNavIsolated('Home');
                }}
              />
            </div>

            {/* Daily Brief Main Canvas */}
            <div className="flex-1">
              {/* Title Row + PATTERN 3: Header Temporal Delta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-5 border-b border-valis-divider">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                    Daily Brief
                  </h2>
                  {(!isV2 || memoryScope === 'org-brain') && (
                    <span className="bg-valis-tagbg text-valis-text text-[12.5px] font-medium px-2.5 py-0.5 rounded-[var(--valis-control-radius)]">
                      Demo company
                    </span>
                  )}

                  {/* PATTERN 3: Header Temporal Delta Bar */}
                  {isV2 && (
                    <TemporalDeltaBar
                      unseenChangesCount={unseenChangesCount}
                      showOnlyChanges={showOnlyChanges}
                      onToggleShowOnlyChanges={onToggleShowOnlyChanges}
                      onMarkSeen={onMarkSeen}
                      onResetDemoDelta={onResetDemoDelta}
                    />
                  )}
                </div>
                <div className="text-[12.5px] text-valis-muted tabular-nums">
                  Mon 16 Nov · 07:00
                </div>
              </div>

              {/* Exact 5 Original Sections: Calendar, Decide, I owe, Others owe, Signals */}
              {BRIEF_SECTIONS.map((sec) => renderSection(sec))}
            </div>
          </div>
        )}

      {/* VIEW: CALENDAR */}
      {activeNav === 'Calendar' && (
        <div className="w-full flex flex-col">
          {/* Top Header Area */}
          <div className="pb-4 border-b border-valis-sidebarborder flex items-start justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-valis-text tracking-[-0.02em]">
                Calendar
              </h2>
              <p className="text-[13.5px] text-valis-muted mt-0.5">
                View and refresh your upcoming meetings
              </p>
            </div>
            <button
              type="button"
              className="bg-valis-canvas border border-valis-chromeborder hover:border-valis-controlhover text-valis-text text-[13px] font-medium px-3.5 py-1.5 rounded-[var(--valis-control-radius)] transition-colors cursor-pointer"
            >
              Sync
            </button>
          </div>

          <div className="py-4 space-y-4">
            {/* Master Bot Toggle Card */}
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] px-4 py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="text-[14px] font-semibold text-valis-text">
                  Invite bots to all my meetings
                </div>
                <div className="text-[12.5px] text-valis-muted mt-0.5">
                  Valis automatically sends a bot to your upcoming meetings, even when the app is closed.
                </div>
              </div>
              <ValisToggleSwitch
                checked={inviteAllBots}
                onChange={() => setInviteAllBots((v) => !v)}
                ariaLabel="Invite bots to all my meetings"
              />
            </div>

            {/* Monday, 16 November */}
            <div>
              <h3 className="text-[13px] font-semibold text-valis-navinactive mb-2.5">
                Monday, 16 November
              </h3>
              <div className="space-y-2.5">
                {/* Meeting 1 */}
                <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] px-4 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[13.5px] tabular-nums">
                      <span className="font-semibold text-valis-text">10:00</span>
                      <span className="text-valis-muted">- 11:00</span>
                      <span className="text-valis-muted ml-1 text-[12.5px]">● Next</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[14px] font-semibold text-valis-text">
                      <span className="truncate">Quarterly planning with Sales</span>
                      <ExternalLink className="w-3.5 h-3.5 text-valis-subtle shrink-0" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[12.5px] text-valis-muted">Invitees</span>
                    <AvatarStack
                      avatars={[
                        { initials: 'AM', bg: avatarSlate },
                        { initials: 'TB', bg: avatarBronze },
                        { initials: 'ML', bg: avatarSage },
                        { initials: 'DK', bg: avatarPlum },
                        { initials: '+2', bg: rowDivider, text: textSecondary },
                      ]}
                    />
                    <span className="bg-valis-divider text-valis-secondary text-[12px] font-medium px-2.5 py-1 rounded-[5px]">
                      Bot invited
                    </span>
                    <span className="text-[12.5px] text-valis-muted">
                      Joins automatically
                    </span>
                    <ValisToggleSwitch
                      checked={meetingToggles['m-1']}
                      onChange={() =>
                        setMeetingToggles((p) => ({ ...p, 'm-1': !p['m-1'] }))
                      }
                      ariaLabel="Joins automatically for Quarterly planning with Sales"
                    />
                  </div>
                </div>

                {/* Meeting 2 */}
                <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] px-4 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[13.5px] tabular-nums">
                      <span className="font-semibold text-valis-text">12:30</span>
                      <span className="text-valis-muted">- 13:00</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[14px] font-semibold text-valis-text">
                      <span className="truncate">1:1 with Maria Lopez</span>
                      <ExternalLink className="w-3.5 h-3.5 text-valis-subtle shrink-0" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[12.5px] text-valis-muted">Invitees</span>
                    <AvatarStack
                      avatars={[
                        { initials: 'AM', bg: avatarSlate },
                        { initials: 'ML', bg: avatarSage },
                      ]}
                    />
                    <span className="bg-valis-divider text-valis-secondary text-[12px] font-medium px-2.5 py-1 rounded-[5px]">
                      Bot invited
                    </span>
                    <span className="text-[12.5px] text-valis-muted">
                      Joins automatically
                    </span>
                    <ValisToggleSwitch
                      checked={meetingToggles['m-2']}
                      onChange={() =>
                        setMeetingToggles((p) => ({ ...p, 'm-2': !p['m-2'] }))
                      }
                      ariaLabel="Joins automatically for 1:1 with Maria Lopez"
                    />
                  </div>
                </div>

                {/* Meeting 3 */}
                <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] px-4 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[13.5px] tabular-nums">
                      <span className="font-semibold text-valis-text">15:30</span>
                      <span className="text-valis-muted">- 16:15</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[14px] font-semibold text-valis-text">
                      <span className="truncate">Board call on Q4 plan</span>
                      <ExternalLink className="w-3.5 h-3.5 text-valis-subtle shrink-0" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[12.5px] text-valis-muted">Invitees</span>
                    <AvatarStack
                      avatars={[
                        { initials: 'AM', bg: avatarSlate },
                        { initials: 'ML', bg: avatarSage },
                        { initials: 'DK', bg: avatarPlum },
                        { initials: 'SR', bg: avatarSteel },
                        { initials: '+3', bg: rowDivider, text: textSecondary },
                      ]}
                    />
                    <span className="bg-valis-divider text-valis-secondary text-[12px] font-medium px-2.5 py-1 rounded-[5px]">
                      Bot invited
                    </span>
                    <span className="text-[12.5px] text-valis-muted">
                      Joins automatically
                    </span>
                    <ValisToggleSwitch
                      checked={meetingToggles['m-3']}
                      onChange={() =>
                        setMeetingToggles((p) => ({ ...p, 'm-3': !p['m-3'] }))
                      }
                      ariaLabel="Joins automatically for Board call on Q4 plan"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tuesday, 17 November */}
            <div>
              <h3 className="text-[13px] font-semibold text-valis-navinactive mb-2.5">
                Tuesday, 17 November
              </h3>
              <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] px-4 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[13.5px] tabular-nums">
                    <span className="font-semibold text-valis-text">11:00</span>
                    <span className="text-valis-muted">- 11:30</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <AvatarStack
                    avatars={[
                      { initials: 'AM', bg: avatarSlate },
                      { initials: 'TB', bg: avatarBronze },
                      { initials: 'DK', bg: avatarPlum },
                    ]}
                  />
                  <span className="bg-valis-divider text-valis-secondary text-[12px] font-medium px-2.5 py-1 rounded-[5px]">
                    Bot invited
                  </span>
                  <ValisToggleSwitch
                    checked={meetingToggles['m-4']}
                    onChange={() =>
                      setMeetingToggles((p) => ({ ...p, 'm-4': !p['m-4'] }))
                    }
                    ariaLabel="Joins automatically for Tuesday 11:00 meeting"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: LIBRARY */}
      {activeNav === 'Library' && (
        <div className="w-full flex flex-col">
          {/* Header & Segmented Pill Control */}
          <div className="pb-4 border-b border-valis-sidebarborder">
            <h2 className="text-[20px] font-bold text-valis-text tracking-[-0.02em] mb-3">
              My Library
            </h2>
            <div className="inline-flex items-center bg-valis-sidebar border border-valis-sidebarborder rounded-[var(--valis-control-radius)] p-1 gap-1">
              {(['All', 'Meetings', 'Voice Notes', 'Documents'] as const).map(
                (tab) => {
                  const active = libraryTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setLibraryTab(tab)}
                      className={`px-3 py-1 rounded-[var(--valis-checkbox-radius)] text-[12.5px] transition-colors cursor-pointer ${
                        active
                          ? 'bg-valis-canvas border border-valis-chromeborder text-valis-text font-semibold'
                          : 'text-valis-secondary hover:text-valis-text'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Library Date Groups */}
          <div className="divide-y divide-valis-sidebarborder">
            {/* Friday, 13 November */}
            {(libraryTab === 'All' || libraryTab === 'Meetings') && (
              <div className="py-4">
                <div className="text-[12.5px] font-semibold text-valis-navinactive mb-3">
                  Friday, 13 November
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Blue Zoom-style video camera icon */}
                    <span className="mt-3 w-[20px] h-[14px] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 20 14" className="w-[20px] h-[14px]" fill="none">
                        <rect x="0.5" y="1" width="14" height="12" rx="3" fill={brandZoom} />
                        <rect x="3" y="4" width="7.5" height="6" rx="1.2" fill={canvasBg} />
                        <path d="M15.5 5L19.5 2.5V11.5L15.5 9V5Z" fill={brandZoom} />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14.5px] font-semibold text-valis-text">
                        Sales plan review
                      </div>
                      <div className="text-[12.5px] text-valis-muted tabular-nums mt-0.5">
                        16:00 · 45min
                      </div>
                      <div className="text-[13px] text-valis-navinactive truncate mt-0.5">
                        Tom presented the Q4 sales plan and asked for feedback by Monday. Two pricing options were agreed...
                      </div>
                    </div>
                  </div>
                  <AvatarStack
                    avatars={[
                      { initials: 'AM', bg: avatarSlate },
                      { initials: 'TB', bg: avatarBronze },
                      { initials: 'SR', bg: avatarSteel },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Thursday, 12 November */}
            {(libraryTab === 'All' || libraryTab === 'Meetings') && (
              <div className="py-4">
                <div className="text-[12.5px] font-semibold text-valis-navinactive mb-3">
                  Thursday, 12 November
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Green Google Meet camera icon */}
                    <span className="mt-3 w-[20px] h-[14px] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 20 14" className="w-[20px] h-[14px]" fill="none">
                        <rect x="0.5" y="1" width="13.5" height="12" rx="2.5" fill={brandMeet} />
                        <path d="M14 5L19 2V12L14 9V5Z" fill={brandMeet} />
                        <path d="M5.2 4.8L9.2 9.2M9.2 4.8L5.2 9.2" stroke={canvasBg} strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14.5px] font-semibold text-valis-text">
                        Pricing review
                      </div>
                      <div className="text-[12.5px] text-valis-muted tabular-nums mt-0.5">
                        11:00 · 50min
                      </div>
                      <div className="text-[13px] text-valis-navinactive truncate mt-0.5">
                        The annual discount will be tested with new customers only. Tom drafts the price page changes by ...
                      </div>
                    </div>
                  </div>
                  <AvatarStack
                    avatars={[
                      { initials: 'AM', bg: avatarSlate },
                      { initials: 'TB', bg: avatarBronze },
                      { initials: 'ML', bg: avatarSage },
                      { initials: '+1', bg: rowDivider, text: textSecondary },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Wednesday, 11 November */}
            {(libraryTab === 'All' || libraryTab === 'Meetings') && (
              <div className="py-4">
                <div className="text-[12.5px] font-semibold text-valis-navinactive mb-3">
                  Wednesday, 11 November
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Indigo Microsoft Teams people badge */}
                    <span className="mt-3 w-[20px] h-[14px] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 20 14" className="w-[20px] h-[14px]" fill="none">
                        <rect x="1" y="1" width="18" height="12" rx="2.5" fill={brandTeams} />
                        <circle cx="8" cy="5.2" r="1.7" fill={canvasBg} />
                        <path d="M5 10.5C5 8.9 6.3 8 8 8C9.7 8 11 8.9 11 10.5" fill={canvasBg} />
                        <circle cx="13.2" cy="5.6" r="1.3" fill={canvasBg} fillOpacity="0.85" />
                        <path d="M11.5 10.5C11.5 9.3 12.3 8.6 13.5 8.6C14.7 8.6 15.5 9.3 15.5 10.5" fill={canvasBg} fillOpacity="0.85" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14.5px] font-semibold text-valis-text">
                        Support hiring plan
                      </div>
                      <div className="text-[12.5px] text-valis-muted tabular-nums mt-0.5">
                        14:30 · 30min
                      </div>
                      <div className="text-[13px] text-valis-navinactive truncate mt-0.5">
                        Maria proposed two new support roles to bring the backlog down. The plan is waiting for approval.
                      </div>
                    </div>
                  </div>
                  <AvatarStack
                    avatars={[
                      { initials: 'AM', bg: avatarSlate },
                      { initials: 'ML', bg: avatarSage },
                      { initials: 'DK', bg: avatarPlum },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Tuesday, 10 November */}
            {(libraryTab === 'All' ||
              libraryTab === 'Voice Notes' ||
              libraryTab === 'Documents') && (
              <div className="py-4">
                <div className="text-[12.5px] font-semibold text-valis-navinactive mb-3">
                  Tuesday, 10 November
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <span className="mt-2.5 w-[20px] h-[20px] flex items-center justify-center text-valis-navinactive shrink-0">
                      <Mic className="w-[17px] h-[17px]" strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14.5px] font-semibold text-valis-text">
                        Notes after the board prep
                      </div>
                      <div className="text-[12.5px] text-valis-muted tabular-nums mt-0.5">
                        18:10 · 4min
                      </div>
                      <div className="text-[13px] text-valis-navinactive truncate mt-0.5">
                        Three questions to prepare for the next board meeting.
                      </div>
                    </div>
                  </div>
                  <AvatarStack
                    avatars={[{ initials: 'AM', bg: avatarSlate }]}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: CHAT */}
      {activeNav === 'Chat' && (
        <div className="w-full flex-1 flex flex-col justify-end">
          {chatHistory.length > 0 && (
            <div className="mb-auto space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-[var(--valis-panel-radius)] text-[13.5px] ${
                    msg.role === 'user'
                      ? 'bg-valis-activeitem text-valis-text font-medium'
                      : 'bg-valis-bg border border-valis-sidebarborder text-valis-text'
                  }`}
                >
                  <div>{msg.text}</div>
                  {msg.citation && (
                    <div className="mt-1.5 text-[11.5px] text-valis-subtle underline">
                      Source: {msg.citation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Centered Prompt Area above bottom input */}
          <div className="text-center mb-5">
            <p className="text-[15px] text-valis-navinactive mb-5">
              Ask about meetings, messages and documents in the demo company.
            </p>

            {/* 2 + 1 Suggestion Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-[640px] mx-auto">
              <button
                type="button"
                onClick={() =>
                  askQuestionInChat('What did we decide in the pricing review?')
                }
                className="bg-valis-bg border border-valis-chromeborder hover:border-valis-controlhover text-valis-secondary text-[13px] px-4 py-2 rounded-[var(--valis-control-radius)] transition-colors cursor-pointer"
              >
                What did we decide in the pricing review?
              </button>
              <button
                type="button"
                onClick={() =>
                  askQuestionInChat('Why is the support hiring plan still waiting?')
                }
                className="bg-valis-bg border border-valis-chromeborder hover:border-valis-controlhover text-valis-secondary text-[13px] px-4 py-2 rounded-[var(--valis-control-radius)] transition-colors cursor-pointer"
              >
                Why is the support hiring plan still waiting?
              </button>
              <button
                type="button"
                onClick={() =>
                  askQuestionInChat('What do others owe me this week?')
                }
                className="bg-valis-bg border border-valis-chromeborder hover:border-valis-controlhover text-valis-secondary text-[13px] px-4 py-2 rounded-[var(--valis-control-radius)] transition-colors cursor-pointer"
              >
                What do others owe me this week?
              </button>
            </div>
          </div>

          {/* Bottom Full-Width Input Box */}
          <form onSubmit={handleSendChat}>
            <input
              type="text"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              placeholder="Ask about your meetings and notes..."
              className="w-full bg-valis-bg border border-valis-chromeborder rounded-[var(--valis-control-radius)] px-4 py-3.5 text-[14px] text-valis-text placeholder:text-valis-subtle focus:outline-none focus:border-valis-controlhover"
            />
          </form>
        </div>
      )}

      {(activeNav === 'Dictation' ||
        activeNav === 'Groups' ||
        activeNav === 'Settings') && (
        <div className="w-full flex-1">
          <div className="pb-3.5 mb-4 border-b border-valis-sidebarborder flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-valis-text">{activeNav}</h2>
              <p className="text-[13px] text-valis-muted">
                {activeNav === 'Dictation' &&
                  'System-wide voice dictation shortcut and custom company vocabulary.'}
                {activeNav === 'Groups' &&
                  'Shared context spaces with explicit team access grants.'}
                {activeNav === 'Settings' &&
                  'Connected work credentials, calendar auto-join preferences, and local device audio.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectNav('Home')}
              className="text-[12.5px] text-valis-blue underline underline-offset-2 cursor-pointer"
            >
              Return to Daily Brief
            </button>
          </div>

          {activeNav === 'Dictation' && (
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] p-4 flex items-center justify-between text-[13.5px]">
              <div>
                <div className="font-semibold text-valis-text">
                  Push-to-talk hotkey
                </div>
                <div className="text-[12.5px] text-valis-muted">
                  Hold Fn or Right Option anywhere on macOS to dictate with company terminology
                </div>
              </div>
              <span className="bg-valis-divider text-valis-text text-[12px] font-mono px-2.5 py-1 rounded-[5px]">
                Fn (Hold)
              </span>
            </div>
          )}

          {activeNav === 'Groups' && (
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] divide-y divide-valis-divider px-4 text-[13.5px]">
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-valis-text">Executive Staff</div>
                  <div className="text-[12.5px] text-valis-muted">
                    Alex Morgan, Priya Nair, Tom Becker, Daniel Kim · Explicit grant active
                  </div>
                </div>
                <span className="text-[12px] text-valis-green font-medium">4 members</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-valis-text">Support & Deal Desk Ops</div>
                  <div className="text-[12.5px] text-valis-muted">
                    Maria Lopez, Commercial Legal · Contract intake alignment
                  </div>
                </div>
                <span className="text-[12px] text-valis-green font-medium">7 members</span>
              </div>
            </div>
          )}

          {activeNav === 'Settings' && (
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] divide-y divide-valis-divider px-4 text-[13.5px]">
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-valis-text">
                    Google Workspace & Slack SSO
                  </div>
                  <div className="text-[12.5px] text-valis-muted">
                    Signed in as alex@demo.valis.so · Read-only default
                  </div>
                </div>
                <span className="text-[12px] text-valis-green font-medium">Connected</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-valis-text">
                    Valis Admin Console (demo-admin.valis.so)
                  </div>
                  <div className="text-[12.5px] text-valis-muted">
                    Open Workflow Diagnostics, Valis Pulse, Management Loop, and AI Security
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onSwitchToAdminConsole}
                  className="text-[12.5px] text-valis-blue font-medium underline cursor-pointer"
                >
                  Open Admin Console
                </button>
              </div>
            </div>
          )}
        </div>
      )}
        </div>
      </div>

      {/* Right-Hand Source Context Inspector Drawer */}
      {selectedSource && (() => {
        const parentItem = items.find((it) =>
          it.sources.some((s) => s.label === selectedSource.label)
        );
        const isNativeValisSource =
          selectedSource.type === 'notes' && !parentItem?.externalSystem;
        const isWriteBackSource =
          !isNativeValisSource && parentItem?.syncPolicy === 'write-back';
        const isPrivateScope = parentItem?.memoryScope === 'second-brain';

        const sourceSystemName =
          selectedSource.type === 'slack'
            ? 'Slack'
            : selectedSource.type === 'jira'
            ? 'Jira'
            : selectedSource.type === 'calendar'
            ? 'Google Calendar'
            : selectedSource.type === 'email'
            ? 'Gmail'
            : selectedSource.type === 'doc'
            ? 'Google Docs'
            : selectedSource.type === 'pulse'
            ? 'Valis Pulse'
            : 'Valis Notes';

        const contextualFieldLine =
          selectedSource.type === 'jira'
            ? 'Account Scope: $25M ARR cohort · Status: Pending review'
            : selectedSource.type === 'doc'
            ? 'Account Scope: 14 enterprise contracts · Status: Draft v4'
            : selectedSource.type === 'slack'
            ? 'Participants: Maria Lopez, Daniel Kim · Channel: #support-ops'
            : selectedSource.type === 'email'
            ? 'Participants: Priya Nair, Alex Morgan, Daniel Kim'
            : selectedSource.type === 'calendar'
            ? 'Participants: Alex Morgan, Tom Becker, Priya Nair'
            : isPrivateScope
            ? 'Author: Alex Morgan · Visibility: Private Second Brain'
            : 'Participants: Alex Morgan, Board Operating Committee';

        const leadingContextSnippet =
          selectedSource.type === 'jira'
            ? 'Daniel Kim updated issue description (10 Nov · 16:40): Reviewed initial renewal schedule across Q4 enterprise accounts.'
            : selectedSource.type === 'slack'
            ? 'Maria Lopez [14:19]: Escalating contract review queue delay ahead of Q4 Deal Desk hiring review.'
            : selectedSource.type === 'email'
            ? 'From Priya Nair (Fri 13 Nov · 09:15): Attached the consolidated procurement audit for Q4 vendor renewals.'
            : selectedSource.type === 'calendar'
            ? 'Meeting brief synced from Google Calendar invite and attached Q4 operating deck.'
            : selectedSource.type === 'doc'
            ? 'Section 3.2 — Renewal Exposure & Legal Sign-Off Gates:'
            : 'Transcript segment [00:14:22] captured during pre-meeting review:';

        return (
          <aside
            aria-label="Source context inspector drawer"
            className="w-[var(--valis-context-drawer-width)] h-full border-l border-valis-sidebarborder bg-valis-bg p-5 shrink-0 flex flex-col overflow-y-auto"
          >
            {/* Drawer Header (Single Top-Right X Close Button) */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-valis-sidebarborder">
              <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-valis-muted">
                Verified Primary Source
              </span>
              <button
                type="button"
                onClick={() => onSelectSource(null)}
                aria-label="Close source context drawer"
                className="text-valis-subtle hover:text-valis-text p-1 -mr-1 rounded-[var(--valis-checkbox-radius)] hover:bg-valis-sidebarborder/60 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Source System Badge + Sync Policy Badge */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="bg-valis-activeitem text-valis-text text-[11px] font-medium px-2 py-0.5 rounded-[var(--valis-checkbox-radius)]">
                {selectedSource.label}
              </span>
              <span
                className={`text-[10.5px] font-medium px-2 py-0.5 rounded-[var(--valis-checkbox-radius)] border ${
                  isWriteBackSource
                    ? 'bg-valis-greenbg text-valis-green border-valis-greenborder'
                    : 'bg-valis-sidebar text-valis-muted border-valis-chromeborder'
                }`}
              >
                {isNativeValisSource
                  ? 'Native memory'
                  : isWriteBackSource
                  ? 'Write-back'
                  : 'Read-only'}
              </span>
            </div>

            {/* Document / Thread Title & Rich Source Metadata */}
            <h3 className="text-[14px] font-semibold text-valis-text leading-snug mb-1">
              {selectedSource.previewTitle}
            </h3>
            <div className="text-[11.5px] text-valis-muted mb-1">
              {selectedSource.previewMeta}
            </div>
            <div className="text-[11.5px] text-valis-subtle pb-3.5 mb-3.5 border-b border-valis-sidebarborder">
              {contextualFieldLine}
            </div>

            {/* Verifiable 2-Part Excerpt Card with Highlighted Trigger Sentence */}
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-control-radius)] p-3.5 mb-3.5">
              <div className="text-[10px] uppercase tracking-[0.08em] text-valis-subtle font-semibold mb-2">
                Source Excerpt
              </div>
              <div className="space-y-2 text-[12.5px] leading-[1.55]">
                <p className="text-valis-muted">{leadingContextSnippet}</p>
                <p className="text-valis-text">
                  <span className="bg-valis-deltabg px-1 rounded-[2px] text-valis-text">
                    {selectedSource.previewBody}
                  </span>
                </p>
              </div>
            </div>

            {/* Provenance Trace & External Action Footer */}
            <div>
              <div className="text-[11px] text-valis-subtle">
                {isPrivateScope
                  ? 'Extracted to Private Second Brain · Linked to Daily Brief'
                  : 'Extracted to OrgBrain · Linked to Daily Brief'}
              </div>
              <button
                type="button"
                onClick={() => onSelectSource(null)}
                className="w-full mt-3 bg-valis-canvas border border-valis-controlborder hover:border-valis-text text-valis-text text-[12px] font-medium py-1.5 px-3 rounded-[var(--valis-control-radius)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open original in {sourceSystemName} ↗</span>
              </button>
            </div>
          </aside>
        );
      })()}
    </div>
  );
};

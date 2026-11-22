import React, { useEffect, useRef, useState } from 'react';
import {
  Home,
  Calendar,
  Inbox,
  MessageSquare,
  Mic,
  Users,
  Settings,
  ExternalLink,
  ArrowUpRight,
  CheckCircle2,
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
import {
  VALIS_TOKENS,
  ValisButton,
  ValisToggle,
  SourceCitationLink,
  CallListenerBanner,
  BriefTaskItem,
  ScopeSegmentedControl,
  TemporalDeltaBar,
  ProfileSwitcherFooter,
  ValisChatComposer,
  ValisKnotMark,
  ValisDrawer,
} from '../design-system';

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
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [calendarSyncedAt, setCalendarSyncedAt] = useState('Synced 09:40');
  const [meetingToggles, setMeetingToggles] = useState<Record<string, boolean>>({
    'm-1': true,
    'm-2': true,
    'm-3': true,
    'm-4': true,
  });

  const handleSyncCalendar = () => {
    if (isSyncingCalendar) return;
    setIsSyncingCalendar(true);
    window.setTimeout(() => {
      setIsSyncingCalendar(false);
      setCalendarSyncedAt('Synced just now');
    }, 350);
  };

  const handleToggleMasterBots = () => {
    const nextVal = !inviteAllBots;
    setInviteAllBots(nextVal);
    setMeetingToggles({
      'm-1': nextVal,
      'm-2': nextVal,
      'm-3': nextVal,
      'm-4': nextVal,
    });
  };

  // Library state
  const [libraryTab, setLibraryTab] = useState<
    'All' | 'Meetings' | 'Voice Notes' | 'Documents'
  >('All');

  // Chat state
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'valis'; text: string; source?: SourceLink }[]
  >([]);
  const [isVerifyingChat, setIsVerifyingChat] = useState(false);
  const chatVerifyTimerRef = useRef<number | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (chatVerifyTimerRef.current !== null) {
        window.clearTimeout(chatVerifyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory.length, isVerifyingChat]);

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
    let source: SourceLink = {
      label: 'Workspace index · Mon 16 Nov',
      type: 'notes',
      previewTitle: 'Workspace Memory Index · Demo company',
      previewMeta: 'OrgBrain · Mon 16 Nov · 07:00',
      previewBody:
        'Verified across attended meetings, Slack channels, and Jira issues within your SSO scope.',
    };
    if (trimmed.toLowerCase().includes('pricing')) {
      answer =
        'In the Thursday 12 Nov Pricing review (11:00 · 50min), the team decided the annual discount will be tested with new customers only. Tom Becker is drafting the price page changes.';
      source = {
        label: 'Pricing review · Thu 12 Nov',
        type: 'notes',
        previewTitle: 'Pricing review (Google Meet)',
        previewMeta: 'Thursday, 12 November · 11:00 · 50min',
        previewBody:
          'Decision: Annual discount will be tested with new customers only. Tom Becker drafts the price page changes before Tuesday.',
      };
    } else if (trimmed.toLowerCase().includes('support hiring')) {
      answer =
        'In Wednesday 11 Nov Support hiring plan (14:30 · 30min), Maria Lopez proposed two new support roles to bring the backlog down. The plan is waiting for contract review merge approval first.';
      source = {
        label: 'Support hiring plan · Wed 11 Nov',
        type: 'notes',
        previewTitle: 'Support hiring plan (Microsoft Teams)',
        previewMeta: 'Wednesday, 11 November · 14:30 · 30min',
        previewBody:
          'Maria Lopez proposed two new support roles to reduce queue age. Dependent on merging duplicate contract review intake.',
      };
    } else if (trimmed.toLowerCase().includes('others owe')) {
      answer =
        'Daniel Kim owes the Renewal risk view (waiting since Tue 10 Nov, tracked in Jira OPS-142 and Slack #finance).';
      source = {
        label: 'Jira OPS-142 · Slack #finance',
        type: 'jira',
        previewTitle: 'OPS-142 · Consolidated Q4 Renewal Risk View',
        previewMeta: 'Jira · Assigned to Daniel Kim · Overdue since Tue 10 Nov',
        previewBody:
          'Consolidate enterprise renewal exposure and custom SLA indemnity flags ahead of the Q4 board pack.',
      };
    }
    if (chatVerifyTimerRef.current !== null) {
      window.clearTimeout(chatVerifyTimerRef.current);
      chatVerifyTimerRef.current = null;
    }
    setChatHistory((prev) => [...prev, { role: 'user', text: trimmed }]);
    setChatQuery('');
    setIsVerifyingChat(true);
    chatVerifyTimerRef.current = window.setTimeout(() => {
      chatVerifyTimerRef.current = null;
      setChatHistory((prev) => [
        ...prev,
        { role: 'valis', text: answer, source },
      ]);
      setIsVerifyingChat(false);
    }, 350);
  };

  const handleClearChat = () => {
    if (chatVerifyTimerRef.current !== null) {
      window.clearTimeout(chatVerifyTimerRef.current);
      chatVerifyTimerRef.current = null;
    }
    setIsVerifyingChat(false);
    setChatHistory([]);
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

      {/* Right Main Scrollable Container (Unified Warm-Paper Canvas) */}
      <div className="flex-1 h-full overflow-y-auto bg-valis-bg flex flex-col">
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

            {/* Daily Brief Crisp Editorial Sheet */}
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] p-6">
              {/* Title Row + PATTERN 3: Header Temporal Delta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-5 border-b border-valis-divider">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                    Daily Brief
                  </h1>
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
          <div className="pb-4 border-b border-valis-sidebarborder flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                Calendar
              </h1>
              <p className="text-[14px] text-valis-secondary mt-0.5">
                View and refresh your upcoming meetings
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[12.5px] text-valis-subtle tabular-nums">
                {calendarSyncedAt}
              </span>
              <ValisButton
                variant="secondary"
                size="md"
                onClick={handleSyncCalendar}
                disabled={isSyncingCalendar}
              >
                {isSyncingCalendar ? 'Syncing...' : 'Sync'}
              </ValisButton>
            </div>
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
              <ValisToggle
                checked={inviteAllBots}
                onChange={handleToggleMasterBots}
                ariaLabel="Invite bots to all my meetings"
              />
            </div>

            {/* Monday, 16 November */}
            <div>
              <h3 className="text-[14px] font-semibold text-valis-text mb-2.5">
                Monday, 16 November
              </h3>
              <div className="space-y-2.5">
                {/* Meeting 1 */}
                <div
                  onClick={() =>
                    handleSelectSourceExclusive({
                      label: 'Calendar · Mon 10:00',
                      type: 'calendar',
                      previewTitle: 'Quarterly planning with Sales',
                      previewMeta: 'Monday, 16 November · 10:00–11:00 · Google Calendar',
                      previewBody:
                        'Review Q4 renewal pricing options, annual discount test scope, and Sales pipeline forecast with Tom Becker, Maria Lopez, and Daniel Kim.',
                    })
                  }
                  className="bg-valis-canvas border border-valis-sidebarborder hover:border-valis-controlhover rounded-[var(--valis-panel-radius)] px-4 py-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[13.5px] tabular-nums">
                      <span className="font-semibold text-valis-text">10:00</span>
                      <span className="text-valis-muted">- 11:00</span>
                      <span className="text-valis-muted ml-1 text-[12.5px]">· Next</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[14px] font-semibold text-valis-text">
                      <span className="truncate">Quarterly planning with Sales</span>
                      <ExternalLink className="w-3.5 h-3.5 text-valis-subtle shrink-0" />
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                    <span className="bg-valis-divider text-valis-secondary text-[12px] font-medium px-2.5 py-1 rounded-[var(--valis-checkbox-radius)]">
                      {meetingToggles['m-1'] ? 'Bot invited' : 'Bot paused'}
                    </span>
                    <span className="text-[12.5px] text-valis-muted">
                      Joins automatically
                    </span>
                    <ValisToggle
                      checked={meetingToggles['m-1']}
                      onChange={() =>
                        setMeetingToggles((p) => ({ ...p, 'm-1': !p['m-1'] }))
                      }
                      ariaLabel="Joins automatically for Quarterly planning with Sales"
                    />
                  </div>
                </div>

                {/* Meeting 2 */}
                <div
                  onClick={() =>
                    handleSelectSourceExclusive({
                      label: 'Calendar · Mon 12:30',
                      type: 'calendar',
                      previewTitle: '1:1 with Maria Lopez',
                      previewMeta: 'Monday, 16 November · 12:30–13:00 · Google Calendar',
                      previewBody:
                        'Align on Support Ops backlog reduction, Deal Desk contract intake merge, and two proposed support hiring requisitions.',
                    })
                  }
                  className="bg-valis-canvas border border-valis-sidebarborder hover:border-valis-controlhover rounded-[var(--valis-panel-radius)] px-4 py-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                >
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

                  <div
                    className="flex items-center gap-2.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[12.5px] text-valis-muted">Invitees</span>
                    <AvatarStack
                      avatars={[
                        { initials: 'AM', bg: avatarSlate },
                        { initials: 'ML', bg: avatarSage },
                      ]}
                    />
                    <span className="bg-valis-divider text-valis-secondary text-[12px] font-medium px-2.5 py-1 rounded-[var(--valis-checkbox-radius)]">
                      {meetingToggles['m-2'] ? 'Bot invited' : 'Bot paused'}
                    </span>
                    <span className="text-[12.5px] text-valis-muted">
                      Joins automatically
                    </span>
                    <ValisToggle
                      checked={meetingToggles['m-2']}
                      onChange={() =>
                        setMeetingToggles((p) => ({ ...p, 'm-2': !p['m-2'] }))
                      }
                      ariaLabel="Joins automatically for 1:1 with Maria Lopez"
                    />
                  </div>
                </div>

                {/* Meeting 3 */}
                <div
                  onClick={() =>
                    handleSelectSourceExclusive({
                      label: 'Calendar · Mon 15:30',
                      type: 'calendar',
                      previewTitle: 'Board call on Q4 plan',
                      previewMeta: 'Monday, 16 November · 15:30–16:15 · Google Calendar',
                      previewBody:
                        'Present Q4 renewal exposure, retired-project cost reductions, and consolidated customer delivery metrics to the Board Operating Committee.',
                    })
                  }
                  className="bg-valis-canvas border border-valis-sidebarborder hover:border-valis-controlhover rounded-[var(--valis-panel-radius)] px-4 py-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                >
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

                  <div
                    className="flex items-center gap-2.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                    <span className="bg-valis-divider text-valis-secondary text-[12px] font-medium px-2.5 py-1 rounded-[var(--valis-checkbox-radius)]">
                      {meetingToggles['m-3'] ? 'Bot invited' : 'Bot paused'}
                    </span>
                    <span className="text-[12.5px] text-valis-muted">
                      Joins automatically
                    </span>
                    <ValisToggle
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
              <h3 className="text-[14px] font-semibold text-valis-text mb-2.5">
                Tuesday, 17 November
              </h3>
              <div
                onClick={() =>
                  handleSelectSourceExclusive({
                    label: 'Calendar · Tue 11:00',
                    type: 'calendar',
                    previewTitle: 'Q4 Pipeline & Renewal Sync',
                    previewMeta: 'Tuesday, 17 November · 11:00–11:30 · Google Calendar',
                    previewBody:
                      'Finalize Q4 enterprise renewal risk schedule and confirm pricing page updates with Tom Becker and Daniel Kim.',
                  })
                }
                className="bg-valis-canvas border border-valis-sidebarborder hover:border-valis-controlhover rounded-[var(--valis-panel-radius)] px-4 py-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[13.5px] tabular-nums">
                    <span className="font-semibold text-valis-text">11:00</span>
                    <span className="text-valis-muted">- 11:30</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[14px] font-semibold text-valis-text">
                    <span className="truncate">Q4 Pipeline &amp; Renewal Sync</span>
                    <ExternalLink className="w-3.5 h-3.5 text-valis-subtle shrink-0" />
                  </div>
                </div>
                <div
                  className="flex items-center gap-2.5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AvatarStack
                    avatars={[
                      { initials: 'AM', bg: avatarSlate },
                      { initials: 'TB', bg: avatarBronze },
                      { initials: 'DK', bg: avatarPlum },
                    ]}
                  />
                  <span className="bg-valis-divider text-valis-secondary text-[12px] font-medium px-2.5 py-1 rounded-[var(--valis-checkbox-radius)]">
                    {meetingToggles['m-4'] ? 'Bot invited' : 'Bot paused'}
                  </span>
                  <ValisToggle
                    checked={meetingToggles['m-4']}
                    onChange={() =>
                      setMeetingToggles((p) => ({ ...p, 'm-4': !p['m-4'] }))
                    }
                    ariaLabel="Joins automatically for Q4 Pipeline and Renewal Sync"
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
          {/* Header & Canonical Rounded-Full Filter Pills */}
          <div className="pb-4 border-b border-valis-sidebarborder">
            <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em] mb-3">
              My Library
            </h1>
            <div
              role="tablist"
              aria-label="Library type filter"
              className="flex flex-wrap items-center gap-2"
            >
              {(['All', 'Meetings', 'Voice Notes', 'Documents'] as const).map(
                (tab) => {
                  const active = libraryTab === tab;
                  return (
                    <ValisButton
                      key={tab}
                      variant="pill"
                      role="tab"
                      aria-selected={active}
                      active={active}
                      onClick={() => setLibraryTab(tab)}
                    >
                      {tab}
                    </ValisButton>
                  );
                }
              )}
            </div>
          </div>

          {/* Library Date Groups */}
          <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] mt-4 px-5 divide-y divide-valis-divider">
            {/* Friday, 13 November */}
            {(libraryTab === 'All' || libraryTab === 'Meetings') && (
              <div
                onClick={() =>
                  handleSelectSourceExclusive({
                    label: 'Zoom · Fri 13 Nov',
                    type: 'notes',
                    previewTitle: 'Sales plan review',
                    previewMeta: 'Friday, 13 November · 16:00 · 45min · Zoom',
                    previewBody:
                      'Tom presented the Q4 sales plan and asked for feedback by Monday. Two pricing options were agreed for renewal accounts.',
                  })
                }
                className="py-4 -mx-5 px-5 hover:bg-valis-bg transition-colors cursor-pointer"
              >
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
                      <div className="text-[14px] font-semibold text-valis-text">
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
              <div
                onClick={() =>
                  handleSelectSourceExclusive({
                    label: 'Google Meet · Thu 12 Nov',
                    type: 'notes',
                    previewTitle: 'Pricing review',
                    previewMeta: 'Thursday, 12 November · 11:00 · 50min · Google Meet',
                    previewBody:
                      'The annual discount will be tested with new customers only. Tom Becker drafts the price page changes before Tuesday.',
                  })
                }
                className="py-4 -mx-5 px-5 hover:bg-valis-bg transition-colors cursor-pointer"
              >
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
                      <div className="text-[14px] font-semibold text-valis-text">
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
              <div
                onClick={() =>
                  handleSelectSourceExclusive({
                    label: 'Teams · Wed 11 Nov',
                    type: 'notes',
                    previewTitle: 'Support hiring plan',
                    previewMeta: 'Wednesday, 11 November · 14:30 · 30min · Microsoft Teams',
                    previewBody:
                      'Maria proposed two new support roles to bring the backlog down. The plan is waiting for contract review merge approval.',
                  })
                }
                className="py-4 -mx-5 px-5 hover:bg-valis-bg transition-colors cursor-pointer"
              >
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
                      <div className="text-[14px] font-semibold text-valis-text">
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
              <div
                onClick={() =>
                  handleSelectSourceExclusive({
                    label: 'Voice Note · Tue 10 Nov',
                    type: 'notes',
                    previewTitle: 'Notes after the board prep',
                    previewMeta: 'Tuesday, 10 November · 18:10 · 4min · Valis Voice Note',
                    previewBody:
                      'Three questions to prepare for the next board meeting: Q4 renewal exposure, retired-project spend cutoff, and Support hiring timing.',
                  })
                }
                className="py-4 -mx-5 px-5 hover:bg-valis-bg transition-colors cursor-pointer"
              >
                <div className="text-[12.5px] font-semibold text-valis-navinactive mb-3">
                  Tuesday, 10 November
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <span className="mt-2.5 w-[20px] h-[20px] flex items-center justify-center text-valis-navinactive shrink-0">
                      <Mic className="w-[17px] h-[17px]" strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold text-valis-text">
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
        <div className="max-w-[720px] w-full mx-auto flex-1 flex flex-col justify-between min-h-0">
          {chatHistory.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-6">
              <div className="w-10 h-10 rounded-[var(--valis-panel-radius)] bg-valis-divider flex items-center justify-center text-valis-text shrink-0">
                <ValisKnotMark className="w-6 h-6" />
              </div>

              <h1 className="text-[18px] font-semibold text-valis-text tracking-[-0.015em] mt-3">
                Ask Valis
              </h1>

              <div className="mt-1.5 text-[11.5px] text-valis-navinactive bg-valis-divider/80 px-2.5 py-0.5 rounded-full">
                {memoryScope === 'second-brain'
                  ? 'Personal Second Brain · Private to you'
                  : 'Demo company · Meetings, Slack & Jira'}
              </div>

              <div className="w-full max-w-[520px] mt-6 space-y-2 text-left">
                {[
                  'What did we decide in the pricing review?',
                  'Why is the support hiring plan still waiting?',
                  'What do others owe me this week?',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={isVerifyingChat}
                    onClick={() => askQuestionInChat(prompt)}
                    className="w-full bg-valis-canvas border border-valis-sidebarborder hover:border-valis-text rounded-[var(--valis-card-radius)] px-3.5 py-2.5 flex items-center justify-between gap-2 text-[13.5px] text-valis-text transition-colors group cursor-pointer text-left disabled:opacity-60 disabled:cursor-not-allowed"
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
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto space-y-5 pb-6 pr-1 min-h-0"
            >
              {chatHistory.map((msg, i) =>
                msg.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="bg-valis-divider text-valis-text text-[13.5px] leading-[1.5] px-3.5 py-2.5 rounded-[12px] rounded-tr-[4px] max-w-[80%] ml-auto">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="space-y-1.5 py-1">
                    <div className="flex items-center gap-1.5 text-[11.5px] font-medium">
                      <CheckCircle2
                        className="w-[13px] h-[13px] text-valis-green shrink-0"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span className="text-valis-green">
                        Allowed · Verified against scope
                      </span>
                    </div>
                    <p className="text-[14px] leading-[1.55] text-valis-text">
                      {msg.text}
                    </p>
                    {msg.source && (
                      <div className="pt-1 flex items-center gap-1.5 text-[12px] text-valis-subtle">
                        <span>Source:</span>
                        <SourceCitationLink
                          source={msg.source}
                          onSelect={handleSelectSourceExclusive}
                        />
                      </div>
                    )}
                  </div>
                )
              )}

              {isVerifyingChat && (
                <div
                  role="status"
                  aria-live="polite"
                  className="py-1 text-[12px] text-valis-subtle animate-pulse"
                >
                  Checking{' '}
                  {memoryScope === 'second-brain'
                    ? 'Personal Second Brain'
                    : 'Demo company'}{' '}
                  sources...
                </div>
              )}
            </div>
          )}

          {/* Unified Floating Composer */}
          <div className="pt-2 shrink-0">
            <ValisChatComposer
              value={chatQuery}
              onChange={setChatQuery}
              onSubmit={() => askQuestionInChat(chatQuery)}
              placeholder={
                memoryScope === 'second-brain'
                  ? 'Ask about your private notes and voice memos...'
                  : 'Ask about meetings, messages and documents...'
              }
              ariaLabel="Ask about your meetings and notes"
              scopeLabel={
                memoryScope === 'second-brain'
                  ? 'Personal Second Brain'
                  : 'Demo company'
              }
              showClear={chatHistory.length > 0}
              onClear={handleClearChat}
              isSubmitting={isVerifyingChat}
              submitAriaLabel="Send chat message"
            />
          </div>
        </div>
      )}

      {(activeNav === 'Dictation' ||
        activeNav === 'Groups' ||
        activeNav === 'Settings') && (
        <div className="w-full flex-1">
          <div className="pb-3.5 mb-4 border-b border-valis-sidebarborder flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-semibold text-valis-text tracking-[-0.02em]">
                {activeNav}
              </h1>
              <p className="text-[14px] text-valis-secondary mt-0.5">
                {activeNav === 'Dictation' &&
                  'System-wide voice dictation shortcut and custom company vocabulary.'}
                {activeNav === 'Groups' &&
                  'Shared context spaces with explicit team access grants.'}
                {activeNav === 'Settings' &&
                  'Connected work credentials, calendar auto-join preferences, and local device audio.'}
              </p>
            </div>
            <ValisButton
              variant="link"
              onClick={() => handleSelectNavIsolated('Home')}
            >
              Return to Daily Brief
            </ValisButton>
          </div>

          {activeNav === 'Dictation' && (
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] p-4 flex items-center justify-between text-[14px]">
              <div>
                <div className="font-semibold text-valis-text">
                  Push-to-talk hotkey
                </div>
                <div className="text-[12.5px] text-valis-muted">
                  Hold Fn or Right Option anywhere on macOS to dictate with company terminology
                </div>
              </div>
              <span className="bg-valis-divider text-valis-text text-[12px] font-mono px-2.5 py-1 rounded-[var(--valis-checkbox-radius)]">
                Fn (Hold)
              </span>
            </div>
          )}

          {activeNav === 'Groups' && (
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] divide-y divide-valis-divider px-4 text-[14px]">
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-valis-text">Executive Staff</div>
                  <div className="text-[12.5px] text-valis-muted">
                    Alex Morgan, Priya Nair, Tom Becker, Daniel Kim · Explicit grant active
                  </div>
                </div>
                <span className="text-[12.5px] text-valis-green font-medium tabular-nums">
                  4 members
                </span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-valis-text">Support &amp; Deal Desk Ops</div>
                  <div className="text-[12.5px] text-valis-muted">
                    Maria Lopez, Commercial Legal · Contract intake alignment
                  </div>
                </div>
                <span className="text-[12.5px] text-valis-green font-medium tabular-nums">
                  7 members
                </span>
              </div>
            </div>
          )}

          {activeNav === 'Settings' && (
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-panel-radius)] divide-y divide-valis-divider px-4 text-[14px]">
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-valis-text">
                    Google Workspace &amp; Slack SSO
                  </div>
                  <div className="text-[12.5px] text-valis-muted">
                    Signed in as alex@demo.valis.so · Read-only default
                  </div>
                </div>
                <span className="text-[12.5px] text-valis-green font-medium">
                  Connected
                </span>
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
                <ValisButton
                  variant="link"
                  onClick={onSwitchToAdminConsole}
                >
                  Open Admin Console
                </ValisButton>
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
          <ValisDrawer
            isOpen={true}
            onClose={() => onSelectSource(null)}
            eyebrow="Verified Primary Source"
            title={selectedSource.previewTitle}
            subtitle={selectedSource.previewMeta}
            ariaLabel="Source context inspector drawer"
          >
            {/* Source System Badge + Sync Policy Badge */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="bg-valis-activeitem text-valis-text text-[12px] font-medium px-2.5 py-0.5 rounded-[var(--valis-checkbox-radius)]">
                {selectedSource.label}
              </span>
              <span
                className={`text-[12px] font-medium px-2.5 py-0.5 rounded-[var(--valis-checkbox-radius)] border ${
                  isWriteBackSource
                    ? 'bg-valis-greenbg text-valis-green border-valis-greenborder'
                    : 'bg-valis-sidebar text-valis-navinactive border-valis-chromeborder'
                }`}
              >
                {isNativeValisSource
                  ? 'Native memory'
                  : isWriteBackSource
                  ? 'Write-back'
                  : 'Read-only'}
              </span>
            </div>

            {/* Contextual Metadata Line */}
            <div className="text-[12.5px] text-valis-subtle pb-4 mb-4 border-b border-valis-sidebarborder">
              {contextualFieldLine}
            </div>

            {/* Verifiable 2-Part Excerpt Card with Highlighted Trigger Sentence */}
            <div className="bg-valis-canvas border border-valis-sidebarborder rounded-[var(--valis-card-radius)] p-4 mb-4">
              <div className="text-[11px] uppercase tracking-[0.06em] text-valis-subtle font-medium mb-2">
                Source Excerpt
              </div>
              <div className="space-y-2 text-[13.5px] leading-[1.55]">
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
              <div className="text-[12.5px] text-valis-subtle">
                {isPrivateScope
                  ? 'Extracted to Private Second Brain · Linked to Daily Brief'
                  : 'Extracted to OrgBrain · Linked to Daily Brief'}
              </div>
              <button
                type="button"
                onClick={() => onSelectSource(null)}
                className="w-full mt-3.5 bg-valis-canvas border border-valis-controlborder hover:border-valis-text hover:bg-valis-bg text-valis-text text-[12.5px] font-medium py-2 px-3 rounded-[var(--valis-button-radius)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open original in {sourceSystemName} ↗</span>
              </button>
            </div>
          </ValisDrawer>
        );
      })()}
    </div>
  );
};

# CLAUDE.md — Valis Engineering & AI Agent Constitution

This file defines mandatory architectural, visual, and product rules for engineers and AI coding agents (Claude Code, Cursor, Windsurf) working in the Valis repository. Following these rules guarantees PRs pass design review without manual iteration.

---

## 1. Quick Commands

- **Start Dev Server**: `npm run dev` (Vite SPA on port `3000`)
- **Typecheck & Lint**: `npm run lint` (`tsc --noEmit`)
- **Run Unit Tests**: `npm test` (`tsx --test src/utils/valisLogic.test.ts`)
- **Production Build**: `npm run build`

---

## 2. Core Product Invariants (`src/design-system/AGENT_UI_RULES.ts`)

Before creating or modifying any feature, inspect `src/design-system/AGENT_UI_RULES.ts` and read all feature specifications in `specs/*.md`. Every UI view and data flow **must** enforce these 9 rules:

1. **`VALIS-RULE-01` — Mandatory Primary Source Citations**: Every synthesized brief item, diagnostic finding, or management loop commitment must render at least one clickable `SourceCitationLink` (`Jira OPS-142`, `Slack #support-ops`, `Board call notes, Friday`, etc.). Clicking a citation opens the right-hand Source Context Inspector Drawer (`340px`).
2. **`VALIS-RULE-02` — Zero Causal Hallucination in Valis Pulse**: Pulse attention rows state *what changed and where* (`"38 more tasks opened than closed"`). Never generate speculative root-cause copy.
3. **`VALIS-RULE-03` — Read-Only Connector Default & Split-Intent Triage**: Valis reads company systems and mutates nothing silently. Actionable tasks (`Decide`, `I owe`, `Others owe`, `Signals`) render a solid `15px × 15px` `rounded-[4px]` checkbox; read-only `Calendar` events render a dashed `15px × 15px` `rounded-[4px]` hide box (`EyeOff` on hover). Only external two-way connectors (`Jira`) display `Write-back`; native Valis items display `Native memory`.
4. **`VALIS-RULE-04` — Memory Scope Isolation (`OrgBrain` vs `Second Brain`)**: Every captured item is tagged with `memoryScope: 'org-brain' | 'second-brain'`. Items in `second-brain` are strictly private to the user and never leak into shared `org-brain` views.
5. **`VALIS-RULE-05` — Warm-Paper Editorial Geometry**: No purple/indigo AI gradients, no heavy drop shadows, no `rounded-2xl` cards, and no native OS color emojis inside UI controls (always use 13px–15px monochrome Lucide SVGs with `strokeWidth={1.75}`).
6. **`VALIS-RULE-06` — Zero-Travel 3-Stage Voice Capture**: Voice dictation must morph in place inside `CallListenerBanner` across 3 states (`Idle` -> `Live Recording` with 4-bar waveform & timer -> `Review & Save`) keeping the primary CTA (`Voice Note` -> `Stop` -> `Save to Brief`) anchored on the right edge (Fitts's Law). Never render a second stacked capture card or fake manual dropdowns during live recording.
7. **`VALIS-RULE-07` — Recognition-Based Section Hiding & Focus Isolation**: Hidden items cleanly leave the active list (never leaving bulky gray placeholder banners). Render `1 hidden ([Task title]) · Restore` for 1 item, or a collapsible `N hidden ▾` disclosure tray with individual `Restore` actions for 2+ items. Never use ambiguous slash labels like `Show / Undo`. Opening Voice Capture closes the Right Source Inspector Drawer, and switching `Company ↔ Personal` immediately closes/resets the Right Source Inspector Drawer.
8. **`VALIS-RULE-08` — Desktop WCAG AA Readability & Low-Noise Status Hierarchy**: Main task & section typography must be `14px` (`Daily Brief` heading `22px`), metadata/actions `12.5px` minimum. Completed (`☑`) and hidden items stay legible (`text-[#78736A]` at `100%` opacity—never `opacity-45`), and interactive `Restore`/`Undo` links use `#1A1917` underlined styling. In-list update indicators use a minimal `5px` amber dot + plain text (`● Updated 18m ago`), auto-hidden on completed items.
9. **`VALIS-RULE-09` — Scoped Permission Inheritance & Effective Access Simulation**: Connected AI assistants (Valis Chat, Claude, Runbooks) strictly inherit the authenticated user's department scope and global connector ceiling; a prompt can never widen a user's scope. Meetings default to `Participants-Only` visibility unless an explicit administrator grant is active, and Personal Second Brains remain hardware-isolated even from managers and admins. Clicking any department or manager row in `AiSecurityView` opens the `340px` right-hand **Effective Access Simulator Drawer** ("Blast Radius Preview") to inspect live `Allowed Read Scope`, `Mutation & Write-Back`, and `Strictly Blocked (Zero Access)`.

---

## 3. Directory Architecture (Specs, Headless Logic & Atomic UI)

> **Agent Rule**: Always read `specs/*.md` (e.g., `specs/daily-brief-v2-hci.md`) before implementing or modifying product features so state transitions, edge cases, and TTFV targets stay aligned.

Keep state management strictly separated from presentation:

```text
.
├── specs/
│   └── daily-brief-v2-hci.md          # Feature specs, state matrices, edge cases & TTFV metrics
└── src/
    ├── App.tsx                        # Root application wiring headless controllers to views
    ├── index.css                      # Tailwind v4 + CSS custom properties (--valis-*) & keyframes
    ├── main.tsx                       # React DOM entry point
    ├── components/                    # Top-level surface containers
    │   ├── AdminSidebar.tsx           # Left 230px navigation for Valis Admin Console
    │   ├── AiSecurityView.tsx         # AI access, Audit log & Meeting permissions views
    │   ├── ValisAdminConsoleView.tsx  # Admin Console shell (Reports, Pulse, 4-6-2 Loop, Runbooks)
    │   └── ValisAppView.tsx           # Employee App shell (Daily Brief, Source Inspector, Subviews)
    ├── data/
    │   └── valisData.ts               # Seed datasets for Brief, Reports, Pulse & Security
    ├── design-system/
    │   ├── tokens.ts                  # Central TS semantic tokens (VALIS_TOKENS)
    │   ├── AGENT_UI_RULES.ts          # Machine-readable product & UI guardrails (VALIS-RULE-01..08)
    │   ├── atoms/                     # Pure primitive UI building blocks
    │   │   ├── MetricCard.tsx         # Tabular KPI card (Pulse & Diagnostics)
    │   │   ├── SourceCitationLink.tsx # 12.5px underlined primary source citation trigger
    │   │   ├── ValisBadge.tsx         # Status, scope, and sync-policy badges
    │   │   └── ValisCheckbox.tsx      # 15px rounded-[4px] solid (complete) or dashed (hide) control
    │   └── molecules/                 # Composed domain molecules
    │       ├── BriefTaskItem.tsx      # Daily Brief row with Split-Intent hover & low-noise delta dot
    │       ├── CallListenerBanner.tsx # 3-stage morphing Voice Note state machine (Idle/Record/Review)
    │       ├── ProfileSwitcherFooter.tsx # Sidebar AM profile footer + Surface/UX popover
    │       ├── PulseAttentionRow.tsx  # Non-causal observation row with drilldown link
    │       ├── ScopeSegmentedControl.tsx # Company (OrgBrain) | Personal (Second Brain) switch
    │       └── TemporalDeltaBar.tsx   # Header "N changes since 09:40" interactive filter chip
    ├── headless/                      # Zero-JSX state controllers
    │   ├── useValisWorkspace.ts       # Active surface, nav route, memoryScope, uxMode
    │   ├── useDailyBriefController.ts # Scoped brief filtering, delta counts, task resolution, drawer reset
    │   └── useAdminConsoleState.ts    # Reports filtering, Pulse drilldowns, 4-6-2 Loop state
    ├── services/
    │   └── valisMemoryService.ts      # Scope firewall filtering & connector mutation helpers
    ├── types/
    │   └── valis.ts                   # Strict TypeScript domain interfaces & state unions
    └── utils/
        ├── valisLogic.ts              # Pure deterministic functions
        └── valisLogic.test.ts         # Node test runner unit tests
```

---

## 4. Semantic Tokens & CSS Custom Properties (`src/index.css` & `tokens.ts`)

**Strict Zero-Raw-Hex Rule**: UI components (`src/App.tsx`, `src/components/*.tsx`, `src/design-system/atoms/*.tsx`, `src/design-system/molecules/*.tsx`) must **never** contain raw hex literals (`#[0-9A-Fa-f]{6}`). Always use the semantic Tailwind token utilities (`bg-valis-*`, `text-valis-*`, `border-valis-*`, `decoration-valis-*`, `divide-valis-*`, `ring-valis-*`), CSS geometry custom properties (`var(--valis-*)`), or import `VALIS_TOKENS` from `src/design-system/tokens.ts` for programmatic SVG/canvas props. This is enforced automatically by `npm test`.

| Semantic Token (`VALIS_TOKENS`) | CSS Custom Property | Tailwind Token Name | Hex Value | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `colors.pageBg` | `--valis-bg` | `valis-bg` | `#FAF8F3` | App shell, voice bar & right context drawer background |
| `colors.canvasBg` | `--valis-canvas` | `valis-canvas` | `#FFFFFF` | Main scrollable workspace canvas & elevated inputs |
| `colors.sidebarBg` | `--valis-sidebar` | `valis-sidebar` | `#F6F3EB` | Left `230px` navigation sidebar |
| `colors.sidebarHoverBg` | `--valis-sidebar-hover` | `valis-sidebarhover` | `#EDE9DF` | Inactive sidebar nav item hover fill |
| `colors.activeNavBg` | `--valis-active-nav` | `valis-activeitem` | `#E6E1D6` | Active sidebar navigation item fill |
| `colors.chromeBg` | `--valis-chrome` | `valis-chrome` | `#F2EDE4` | Interactive pill fill & filter hover |
| `colors.tagBg` | `--valis-tag-bg` | `valis-tagbg` | `#E8E4DC` | Neutral scope & metadata tags (`Demo company`) |
| `colors.privateBannerBg` | `--valis-private-bg` | `valis-privatebg` | `#F5EFE4` | Personal Second Brain idle status banner fill |
| `colors.sidebarBorder` | `--valis-sidebar-border` | `valis-sidebarborder`| `#EAE5D9` | 1px structural hairlines, cards & table borders |
| `colors.rowDivider` | `--valis-row-divider` | `valis-divider` | `#EFECE4` | Table dividers, section underlines & subtle pills |
| `colors.chromeBorder` | `--valis-chrome-border` | `valis-chromeborder` | `#E3DDD1` | Secondary button & popover borders |
| `colors.controlBorder` | `--valis-control-border` | `valis-controlborder`| `#DCD7CD` | Interactive inputs, voice card & action buttons |
| `colors.controlBorderHover`| `--valis-control-border-hover`| `valis-controlhover` | `#B8B2A6` | Hover border state & dashed read-only checkbox |
| `colors.underlineRule` | `--valis-underline` | `valis-underline` | `#C8C3B8` | Default underline decoration on citations & `Restore`/`Undo` |
| `colors.textPrimary` | `--valis-text-primary` | `valis-text` | `#1A1917` | Primary headings, task titles, active nav & primary buttons |
| `colors.textPrimaryHover`| `--valis-text-primary-hover`| `valis-texthover` | `#33312E` | Primary dark CTA button hover fill |
| `colors.textSecondary` | `--valis-text-secondary` | `valis-secondary` | `#4A4742` | Task descriptions & subheadings |
| `colors.textNavInactive` | `--valis-text-nav-inactive`| `valis-navinactive` | `#5C5852` | Inactive sidebar nav links & section subcaptions |
| `colors.textMuted` | `--valis-text-muted` | `valis-muted` | `#6E6A63` | Secondary metadata, timestamps & quiet actions |
| `colors.textCompleted` | `--valis-text-completed` | `valis-completed` | `#78736A` | WCAG AA completed (`☑`) & hidden task titles at 100% opacity |
| `colors.textSubtle` | `--valis-text-subtle` | `valis-subtle` | `#8A857C` | Source citations, placeholders & completed descriptions |
| `colors.privateBannerText`| `--valis-private-text` | `valis-privatetext` | `#6E5634` | Personal Second Brain banner text & shield icon |
| `colors.liveGreen` | `--valis-live-green` | `valis-green` | `#1E7E45` | Active listener dot, completed checkbox & write-back badge |
| `colors.liveGreenBannerBg`| `--valis-live-green-bg` | `valis-greenbg` | `#E6F2EA` | Active OrgBrain call listener banner & green badge fill |
| `colors.earlyAccessOrange`| `--valis-early-access-orange`| `valis-orange` | `#C87A28` | 4-bar voice waveform, `5px` delta dot & early-access label |
| `colors.deltaAmberBg` | `--valis-delta-amber-bg` | `valis-deltabg` | `#FDF3E7` | Source excerpt highlight & amber badge fill |
| `colors.deltaAmberText` | `--valis-delta-amber-text` | `valis-deltatext` | `#8F561A` | Live voice recording timer (`0:01`) |
| `colors.ochreBar` | `--valis-ochre-bar` | `valis-ochre` | `#B56B27` | Valis Pulse completed work bars & delta diff summary |
| `colors.linkBlue` | `--valis-link-blue` | `valis-blue` | `#1D63B8` | Report links & drilldown actions |
| `colors.securityDarkBg` | `--valis-security-dark-bg` | `valis-darkcard` | `#0D0E12` | Obsidian dark cards in AI Security views |
| `colors.securityDarkSurface`| `--valis-security-dark-surface`| `valis-darksurface`| `#13151C` | Inner panels in AI Security views |
| `colors.securityDarkBorder`| `--valis-security-dark-border`| `valis-darkborder` | `#22242C` | 1px hairlines inside dark obsidian security panels |

---

## 5. Layout & Component Checklist for New PRs

1. **Full-Screen Desktop Shell (Using Semantic Tokens & `--valis-*` Geometry Properties)**:
   - Outer shell: `h-screen w-screen overflow-hidden flex bg-valis-bg text-valis-text`.
   - Left Sidebar: `w-[var(--valis-sidebar-width)] h-full flex flex-col justify-between bg-valis-sidebar border-r border-valis-sidebarborder shrink-0 select-none`.
   - Main Scrollable Workspace: `flex-1 h-full overflow-y-auto bg-valis-canvas`, with inner content centered via `max-w-[var(--valis-app-workspace-max-width)] w-full mx-auto px-10 py-8` (Employee App) or `max-w-[var(--valis-admin-workspace-max-width)] w-full mx-auto px-10 py-8` (Admin Console).
   - Right Source Context Drawer: `w-[var(--valis-context-drawer-width)] h-full border-l border-valis-sidebarborder bg-valis-bg p-5 shrink-0`.
2. **Metadata & Typography Alignment**:
   - Keep task rows clean (`14px` title/description line + `12.5px` source citation & metadata line).
   - Place `● Updated Xm ago` (`5px` amber dot `bg-valis-orange` + plain `12.5px` `text-valis-subtle` text) on the bottom metadata row immediately after the source citation links (`[Source links] · ● Updated 18m ago`), and automatically hide the delta indicator once a task is completed.
3. **Testing Requirement**:
   - Any new filtering, sorting, or resolution state logic must be extracted as a pure function in `src/utils/valisLogic.ts` or `src/services/valisMemoryService.ts` and covered by unit tests in `src/utils/valisLogic.test.ts` (`npm test`).
   - All `.tsx` UI components are automatically scanned by `src/utils/valisLogic.test.ts` to verify **zero hardcoded raw hex values** (`#[0-9A-Fa-f]{6}`) and 1:1 parity between `VALIS_TOKENS` and `src/index.css`.

---

## 6. Reusable UI Patterns & Interaction State Machines (Import — Do Not Rebuild)

Engineers and AI coding agents **must import and compose** these 6 canonical patterns rather than creating ad-hoc variants:

### Pattern A — Workspace Scope Switcher (`ScopeSegmentedControl`)
- **Component**: `src/design-system/molecules/ScopeSegmentedControl.tsx`
- **Affordance**: Two-option segmented pill (`Company` with `13px` `Building2` icon | `Personal` with `13px` `User` icon) located in the left sidebar directly below the Valis lockup.
- **Iconography Rule**: Never use a `Lock` icon on active capture controls (a lock signifies a disabled/paywalled feature in enterprise SaaS). Use `User` in the switcher and `ShieldCheck` (`14px`) inside the `Personal` top listener banner.
- **Multi-Company & Navigation Scaling**:
  - When a user belongs to multiple organizations (`companies > 1`), the `Company` segment supports a contextual `Company ⌄` workspace selector while keeping `Personal` (`Second Brain`) 1-click adjacent.
  - When `memoryScope === 'second-brain'` (`Personal`), company-only navigation items (`Groups`) dynamically hide from the left sidebar.

### Pattern B — Split-Intent Task Affordance (`ValisCheckbox` + `BriefTaskItem`)
- **Components**: `src/design-system/atoms/ValisCheckbox.tsx`, `src/design-system/molecules/BriefTaskItem.tsx`
- **Uniform Left Column (`15px × 15px` `rounded-[4px]`)**:
  - **Solid `☐` Square (`variant="complete"`)**: Used on all actionable/completable tasks across `Decide`, `I owe`, `Others owe`, and `Signals`.
    - Clicking marks the item completed (`☑` green check `#1E7E45` + strikethrough `text-[#78736A]` at `100%` row opacity, with zero green/gray background box fill).
    - Right-side status on completed items shows `Closed in Jira · Undo` (for external two-way `write-back` connectors) or `Completed · Undo` (for read-only/native items), with `Undo` styled as `text-[#1A1917] font-medium underline decoration-[#C8C3B8] hover:decoration-[#1A1917]`.
    - Hovering an open actionable row reveals `Hide` + `Open in source ↗` on the right.
  - **Dashed `⬚` Square (`variant="hide-readonly"`)**: Used exclusively on non-completable external `Calendar` events.
    - Hovering reveals a subtle `EyeOff` icon inside the dashed square (`title="Hide from brief (Read-only source)"`). Clicking hides the event from today's brief without mutating Google Calendar.
- **Sync Policy Provenance Labels**:
  - Only external two-way connectors (e.g., `Jira OPS-142`) display `· Write-back`.
  - Native Valis items (`Voice Note`, `Board call notes`, `Second Brain`) display `Native memory` in the Source Context Inspector Drawer (never `Write-back`).

### Pattern C — Recognition-Based Section Hiding (`HiddenDisclosure`)
- **Implementation**: Section headers in `src/components/ValisAppView.tsx`
- **Zero-Placeholder List Rule**: Clicking `Hide` removes the task row from the active section list immediately—never leave bulky gray placeholder banners in the task stream.
- **Recognition & Individual Restore**:
  - **1 Hidden Item**: Render `1 hidden ([Truncated Task Title]) · Restore` inline on the right side of the section header (`text-[12.5px] text-[#6E6A63]`, with `Restore` in `text-[#1A1917] font-medium underline decoration-[#C8C3B8] hover:decoration-[#1A1917]`). Clicking `Restore` un-hides that item.
  - **2+ Hidden Items**: Render a disclosure toggle `N hidden ▾` in the section header (with a native `title` tooltip listing hidden task titles). Clicking expands a quiet bottom section tray where each hidden task can be restored individually via its own `Restore` link. Never use ambiguous slash labels like `Show / Undo`.

### Pattern D — 3-Stage Morphing Voice Note (`CallListenerBanner`)
- **Component**: `src/design-system/molecules/CallListenerBanner.tsx`
- **Single-Container State Machine (`'idle' | 'recording' | 'review'`)**:
  - **Stage 1 (`idle`)**: Single-line status bar (`#E6F2EA` in `Company` mode; `#F5EFE4` with `ShieldCheck` in `Personal` mode) with `[ 🎙 Voice Note ]` anchored on the right edge.
  - **Stage 2 (`recording`)**: Triggered immediately on clicking `Voice Note`. Morphs in place (`bg-[#FAF8F3] border border-[#DCD7CD] rounded-[8px] px-3.5 py-2.5 flex items-center justify-between gap-4`) showing an animated 4-bar `#C87A28` audio waveform (`@keyframes valisWavePulse`), live ticking timer (`0:01`, `0:02` in `tabular-nums text-[12.5px] text-[#8F561A] font-medium`), and word-by-word streaming transcript (`text-[14px] text-[#1A1917]`), with `Cancel` + `[ ■ Stop ]` anchored on the right edge. Automatically transitions to Stage 3 when the ~2.2s stream finishes or immediately when `Stop` is clicked.
  - **Stage 3 (`review`)**: Waveform and timer disappear. The transcript becomes a focused editable `<input>` (`text-[14px] bg-white border border-[#DCD7CD] focus:border-[#1A1917] rounded-[6px] px-3 py-2 w-full`). Directly below (`mt-2.5 flex items-center justify-between`, no `border-t` divider): left shows `Add to: [Decide / I owe] · Company Brief` (or `· Private Second Brain`), right shows `Discard` + `[ Save to Brief ]`.
- **Fitts's Law & Timestamp Invariant**:
  - The primary action button (`Voice Note` -> `Stop` -> `Save to Brief`) remains anchored at the exact same right-hand coordinates across all 3 stages.
  - Newly saved voice notes always receive `deltaTimestamp: 'Added just now'` (`● Added just now`).

### Pattern E — Master-Detail Primary Source Inspector (`SourceContextDrawer`)
- **Implementation**: Right-hand `340px` drawer in `src/components/ValisAppView.tsx`
- **Trigger**: Clicking any `SourceCitationLink` or `Open in source ↗` on a brief row.
- **Information Architecture**:
  1. Single top header (`VERIFIED PRIMARY SOURCE` + top-right `X` close button).
  2. Source system badge (`Jira`, `Slack`, `Google Docs`, `Voice Note`) + sync policy badge (`Write-back enabled`, `Read-only connector`, or `Native memory`).
  3. Primary document/thread title, participants, and timestamp.
  4. Highlighted `SOURCE EXCERPT` callout card with ochre left accent bar (`border-l-[3px] border-[#C87A28]`).
  5. Compact 1-line provenance trace (`Extracted to OrgBrain · Linked to: [Task Title]` or `Saved to Private Second Brain · Linked to: [Task Title]`) + single full-width primary CTA (`Open original in [Source] ↗`, or `Edit note in Second Brain` for native voice notes).
- **Strict Bans & State Isolation**:
  - Never display `Zero data retention` inside the drawer (contradicts persistent OrgBrain/Second Brain memory).
  - Never render a second footer `Close` button.
  - Automatically close/reset the drawer (`setSelectedSource(null)`) whenever the user switches `memoryScope` (`Company ↔ Personal`), changes sidebar routes, hides the currently inspected task, or opens Voice Note capture.

### Pattern F — Temporal Delta Filter (`TemporalDeltaBar`)
- **Component**: `src/design-system/molecules/TemporalDeltaBar.tsx`
- **States**:
  - **Default Unfiltered (`showOnlyChanges === false`)**: Neutral warm-stone interactive filter button (`bg-[#F6F3EB] hover:bg-[#ECE7DC] border border-[#DCD7CD] text-[#1A1917] text-[12.5px] font-medium`) with a `12px` `ListFilter` icon + dynamic scoped count (`3 changes since 09:40` in Company mode; `1 change since 09:40` in Personal mode), paired with an adjacent `Mark seen` action.
  - **Active Filter (`showOnlyChanges === true`)**: High-contrast dark chip (`bg-[#1A1917] text-white text-[12.5px] font-medium`) reading `Filtering N updates` with an inline `×` clear button.
  - **Caught Up (`unseenChangesCount === 0`)**: Quiet confirmation `All caught up · Reset demo updates`. Clicking `Mark seen` while actively filtering (`showOnlyChanges === true`) automatically resets `showOnlyChanges = false` so the user is never stranded on an empty brief screen.

### Pattern G — 3-Tab AI Security Governance & Effective Access Simulator (`AiSecurityView`)
- **Component**: `src/components/AiSecurityView.tsx`
- **3 Synchronized Security Routes (`AdminSidebar` -> `AiSecurityView`)**:
  1. **`AI access` (`AI Access & System Connectors`)**:
     - 4-card `SYSTEM CONNECTORS (GLOBAL MUTATION CEILING)` grid where each connector (`Slack & Google Meet`, `Jira (OPS / ENG)`, `Salesforce CRM`, `Workday HR & NetSuite ERP`) cycles across `Restricted (Default-Off)` -> `Read-Only Ingestion` -> `Write-Back (Approve)` and logs changes to the Audit Trail.
     - Interactive `DEPARTMENT & AI ASSISTANT SCOPES` table (`Leadership`, `Sales Team`, `Engineering`, `Customer Support`, `Valis Deployment Team` with `0% Customer Data`). Clicking any row opens the right-hand **Effective Access Simulator Drawer**.
  2. **`Meeting permissions` (`Meeting & Memory Permissions`)**:
     - 2 `IMMUTABLE PRIVACY RULES` cards (`Default Meeting Visibility: Participants-Only` and `Personal Second Brain Firewall`).
     - Interactive `EXPLICIT MANAGER GRANTS (TEAM MEETINGS & CHATS)` table (`Tom Becker`, `Priya Nair`, `Daniel Kim`, `Marcus Vance`). Clicking `Revoke Grant` or `+ Grant Team Access` toggles the manager's explicit team grant in real time, prepends a `Just now` entry to `Audit log`, and updates the right-hand Simulator Drawer live.
  3. **`Audit log` (`Security & AI Audit Log`)**:
     - Filterable 365-day append-only audit table (`All Events`, `Permission Grants`, `AI Assistant Queries`, `Write-Back Approvals`) showing live `Just now` mutations alongside the 4-column dark obsidian `AI Security Architecture` matrix.
- **Right-Hand `340px` Effective Access Simulator Drawer ("Blast Radius Preview")**:
  - Triggered by clicking any department or manager row. Displays `EFFECTIVE ACCESS SIMULATOR`, subject title + identity badge (`SSO Verified · Claude Assistant Linked`), `Prompt Boundary Enforced` banner, and 3 live sections: `1. ALLOWED READ SCOPE` (green checks), `2. MUTATION & WRITE-BACK`, and `3. STRICTLY BLOCKED (ZERO ACCESS)`. Revoking or granting a manager's team access dynamically moves their team meeting scope between `ALLOWED READ SCOPE` and `STRICTLY BLOCKED` in real time.


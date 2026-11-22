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

Before creating or modifying any feature, inspect `src/design-system/AGENT_UI_RULES.ts` and read all feature specifications in `specs/*.md`. Every UI view and data flow **must** enforce these 10 rules:

1. **`VALIS-RULE-01` — Mandatory Primary Source Citations**: Every synthesized brief item, diagnostic finding, or management loop commitment must render at least one clickable `SourceCitationLink` (`Jira OPS-142`, `Slack #support-ops`, `Board call notes, Friday`, etc.). Clicking a citation opens the unified right-hand `<ValisDrawer />` (`420px`) Source Context Inspector.
2. **`VALIS-RULE-02` — Zero Causal Hallucination in Valis Pulse**: Pulse attention rows state *what changed and where* (`"38 more tasks opened than closed"`). Never generate speculative root-cause copy.
3. **`VALIS-RULE-03` — Read-Only Connector Default & Split-Intent Triage**: Valis reads company systems and mutates nothing silently. Actionable tasks (`Decide`, `I owe`, `Others owe`, `Signals`) render a solid `15px × 15px` `rounded-[4px]` checkbox; read-only `Calendar` events render a dashed `15px × 15px` `rounded-[4px]` hide box (`11px` monochrome `EyeOff` on hover) plus a quiet `Hide` button next to `Open in source ↗`. Only external two-way connectors (`Jira`) display `Write-back`; native Valis items display `Native memory`.
4. **`VALIS-RULE-04` — Memory Scope Isolation (`OrgBrain` vs `Second Brain`)**: Every captured item is tagged with `memoryScope: 'org-brain' | 'second-brain'`. Items in `second-brain` are strictly private to the user and never leak into shared `org-brain` views.
5. **`VALIS-RULE-05` — Warm-Paper Editorial Geometry & Full-Screen Shell**: No purple/indigo AI gradients, no nested cards-in-cards, and zero OS color emojis inside UI controls (always use 13px–15px monochrome Lucide SVGs with `strokeWidth={1.75}` or pure editorial typography). Both Employee App and Admin Console use `h-screen w-screen overflow-hidden flex`, a permanently pinned `230px` left sidebar (`#F6F3EB`), and a unified warm-paper `#FAF8F3` workspace canvas (`--valis-bg`) hosting crisp `#FFFFFF` sheets/tables (`border-[#EAE5D9]`).
6. **`VALIS-RULE-06` — Zero-Travel 3-Stage Voice Capture**: Voice dictation must morph in place inside `CallListenerBanner` across 3 states (`Idle` -> `Live Recording` with 4-bar waveform & timer -> `Review & Save`) keeping the primary CTA (`Voice Note` -> `Stop` -> `Save to Brief`) anchored on the right edge (Fitts's Law). Never render a second stacked capture card or fake manual dropdowns during live recording.
7. **`VALIS-RULE-07` — Recognition-Based Section Hiding & Focus Isolation**: Hidden items cleanly leave the active list (never leaving bulky gray placeholder banners). Render `1 hidden ([Task title]) · Restore` for 1 item, or a collapsible `N hidden ▾` disclosure tray with individual `Restore` actions for 2+ items. Never use ambiguous slash labels like `Show / Undo`. Opening Voice Capture closes `<ValisDrawer />`, and switching `Company ↔ Personal` immediately resets/closes `<ValisDrawer />`.
8. **`VALIS-RULE-08` — Desktop WCAG AA Readability & Low-Noise Status Hierarchy**: Enforce the unified Typography Scale (`H1 22px`, `H2 18px`, `H3 14px`, `Eyebrow 11px`, `Body 14px`, `Meta 12.5px`). Completed (`☑`) and hidden items stay legible (`text-valis-completed` `#78736A` at `100%` opacity—never `opacity-45`), and interactive `Restore`/`Undo` links use `#1A1917` underlined styling. In-list update indicators use a minimal `5px` amber dot + plain text (`● Updated 18m ago`), auto-hidden on completed items.
9. **`VALIS-RULE-09` — Scoped Permission Inheritance & Live AI Boundary Testing**: Connected AI assistants (Valis Chat, Claude, Runbooks) strictly inherit the authenticated user's SSO department scope and explicit Team Lead call grant; a prompt can never widen a user's scope. Meetings default to `Participants-Only` visibility and Personal Second Brains remain hardware-isolated even from managers and admins. Inside the Admin Security drawer, explicitly separate `TEAM LEAD CALL GRANT · [LEAD NAME] ONLY` from `DEPARTMENT TOOL ACCESS · ALL [N] MEMBERS`, contract-lock `Valis Deployment Team` (`0% customer data`), and verify boundaries live via the `Test AI Chat` tab.
10. **`VALIS-RULE-10` — Global Visual Consistency & Unified Slide-Over Drawer (`<ValisDrawer />`)**: Both `Valis Employee App` and `Valis Admin Console` share the unified warm-paper `#FAF8F3` canvas (`bg-valis-bg`) with crisp `#FFFFFF` sheets/cards (`bg-valis-canvas border-valis-sidebarborder`). All right-hand drawers MUST reuse `<ValisDrawer />` (`w-[420px] fixed inset-y-0 right-0 z-50` over full-viewport `bg-valis-text/15 backdrop-blur-[1.5px]`, closing on backdrop click or `Escape`). Strictly enforce the 4-Button Taxonomy and WCAG AA contrast (`#5C5852` inactive segmented switch text; `#1E7E45` Allowed and `#9E3B2B` Blocked AI chat verdict headers).

---

## 3. Directory Architecture (Specs, Headless Logic & Atomic UI)

> **Agent Rule**: Always read `specs/*.md` (`specs/daily-brief-v2-hci.md` and `specs/security-permissions-v2.md`) before implementing or modifying product features so state transitions, edge cases, and accessibility contracts stay aligned.

```text
.
├── specs/
│   ├── daily-brief-v2-hci.md                 # Daily Brief v2 HCI patterns, state matrices & TTFV metrics
│   └── security-permissions-v2.md            # 3-tab AI Security governance, SSO directory & Live AI Chat spec
└── src/
    ├── App.tsx                               # Root application wiring headless controllers to views
    ├── index.css                             # Tailwind v4 + CSS custom properties (--valis-*) & keyframes
    ├── main.tsx                              # React DOM entry point
    ├── components/                           # Top-level surface containers
    │   ├── AdminSidebar.tsx                  # Left 230px navigation for Valis Admin Console
    │   ├── AiSecurityView.tsx                # 3-tab Security console (AI access, Meeting permissions, Audit log)
    │   ├── ValisAdminConsoleView.tsx         # Admin Console shell (Reports, Pulse, Management Loop, Runbooks)
    │   └── ValisAppView.tsx                  # Employee App shell (Daily Brief sheet, Calendar, Library, Chat)
    ├── data/
    │   └── valisData.ts                      # Seed datasets for Brief, Reports, Pulse & Security
    ├── design-system/
    │   ├── tokens.ts                         # Central TS semantic tokens (VALIS_TOKENS)
    │   ├── AGENT_UI_RULES.ts                 # Machine-readable product & UI guardrails (VALIS-RULE-01..10)
    │   ├── atoms/                            # Pure primitive UI building blocks
    │   │   ├── MetricCard.tsx                # Tabular KPI card (Pulse & Diagnostics)
    │   │   ├── SecurityToolAccessPill.tsx    # Neutral [Off | Read | Edit] segmented permission switch
    │   │   ├── SourceCitationLink.tsx        # 12.5px underlined primary source citation trigger
    │   │   ├── ValisBadge.tsx                # Status, scope, and sync-policy badges
    │   │   └── ValisCheckbox.tsx             # 15px rounded-[4px] solid (complete) or dashed (hide + EyeOff)
    │   └── molecules/                        # Composed domain molecules
    │       ├── BriefTaskItem.tsx             # Daily Brief row with Split-Intent hover & low-noise delta dot
    │       ├── CallListenerBanner.tsx        # 3-stage morphing Voice Note state machine (Idle/Record/Review)
    │       ├── ProfileSwitcherFooter.tsx     # Pinned sidebar AM profile footer + Surface/UX popover
    │       ├── PulseAttentionRow.tsx         # Non-causal observation row with inline blue drilldown link
    │       ├── ScopeSegmentedControl.tsx     # Company (OrgBrain) | Personal (Second Brain) switch
    │       ├── SecurityAiChatSandboxDrawer.tsx # 2-tab (Permissions | Test AI Chat) drawer composing <ValisDrawer />
    │       ├── TemporalDeltaBar.tsx          # Header "N changes since 09:40" interactive filter chip
    │       └── ValisDrawer.tsx               # SINGLE unified 420px Slide-Over Drawer (backdrop blur + Esc close)
    ├── headless/                             # Zero-JSX state controllers
    │   ├── useValisWorkspace.ts              # Active surface, nav route, memoryScope, uxMode
    │   ├── useDailyBriefController.ts        # Scoped brief filtering, delta counts, task resolution, drawer reset
    │   └── useAdminConsoleState.ts           # Reports filtering, Pulse drilldowns, Management Loop state
    ├── services/
    │   └── valisMemoryService.ts             # Scope firewall filtering & connector mutation helpers
    ├── types/
    │   └── valis.ts                          # Strict TypeScript domain interfaces & state unions
    └── utils/
        ├── valisLogic.ts                     # Pure deterministic functions (Reports, Brief, Security Sandbox)
        └── valisLogic.test.ts                # Node test runner unit tests + zero-raw-hex AST/token audit
```

---

## 4. Unified Typography Scale (`VALIS_TOKENS.typography.scale`)

Every view across `Valis Employee App` and `Valis Admin Console` strictly adheres to these 6 levels (never invent arbitrary sizes or weights; never drop below `11px` for readable labels):

| Level | Token (`tokens.ts`) | Exact Tailwind Classes | Usage |
| :--- | :--- | :--- | :--- |
| **H1 Page Title** | `scale.h1` (`22px`) | `text-[22px] font-semibold tracking-[-0.02em] text-valis-text` | `Daily Brief`, `Valis Pulse`, `Reports`, `Management Loop`, `AI & Tool Access`, `Meeting & Voice Note Permissions`, `Security & AI Audit Log` |
| **H2 Drawer Title** | `scale.h2` (`18px`) | `text-[18px] font-semibold tracking-[-0.015em] text-valis-text` | Unified `<ValisDrawer />` title (`Engineering`, `Sales Department`, Source Document title) |
| **H3 Section Header** | `scale.h3` (`14px`) | `text-[14px] font-semibold text-valis-text` | `Calendar`, `Decide`, `I owe`, `Others owe`, `Signals`, `Needs attention`, Pulse chart titles |
| **Eyebrow Label** | `scale.eyebrow` (`11px`) | `text-[11px] uppercase tracking-[0.06em] font-medium text-valis-subtle` | `VERIFIED PRIMARY SOURCE`, `AI SECURITY SCOPE`, `TEAM LEAD CALL GRANT · [LEAD] ONLY`, `DEPARTMENT TOOL ACCESS · ALL [N] MEMBERS`, `WORK`, `MEETINGS` |
| **Body Primary** | `scale.body` (`14px`) | `text-[14px] leading-[1.5] text-valis-text` | Task titles/descriptions, page subtitles, table rows |
| **Metadata / Controls**| `scale.meta` (`12.5px`) | `text-[12.5px] text-valis-muted` | Source citations, timestamps (`tabular-nums`), SSO sync badge, quiet helper notes |

---

## 5. Unified 4-Button Taxonomy & Hover Matrix

Only **4 canonical button patterns** are permitted across the entire product (no ad-hoc button styles):

| Variant | Radius Token | Exact Tailwind Classes | Examples |
| :--- | :--- | :--- | :--- |
| **1. Primary CTA** | `6px` (`--valis-button-radius`) | `bg-valis-text hover:bg-valis-texthover text-valis-canvas rounded-[var(--valis-button-radius)] text-[13px] font-medium transition-colors cursor-pointer` | `Save to Brief`, `Stop`, `Send`, `Approve` |
| **2. Secondary CTA** | `6px` (`--valis-button-radius`) | `bg-valis-canvas border border-valis-controlborder hover:border-valis-text hover:bg-valis-bg text-valis-text rounded-[var(--valis-button-radius)] text-[12.5px] font-medium transition-colors cursor-pointer` | `Voice Note`, `Open in source ↗`, `Open original in [Tool] ↗`, `Sync`, `Skip`, `Run now` |
| **3. Inline Table Link** | none | `text-valis-blue hover:underline text-[13px] font-medium cursor-pointer` | `Manage`, `Test AI`, `See work flow`, primary Report links |
| **4. Filter / Prompt Pill** | `9999px` (`--valis-pill-radius`) | Active: `rounded-full px-3.5 py-1 text-[12.5px] bg-valis-text text-valis-canvas font-medium` · Inactive: `rounded-full px-3.5 py-1 text-[12.5px] bg-valis-canvas border border-valis-chromeborder text-valis-muted hover:text-valis-text` | `Reports` filter tabs, `Audit log` filter tabs, `Management Loop` mode switches, `Test AI Chat` quick prompts |

### WCAG AA Contrast Rules on Segmented Controls & AI Verdicts
- **Segmented Switches** (`[Company | Personal]`, `[Own calls | All Sales calls]`, `[Off | Read | Edit]`, `[Permissions | Test AI Chat]`):
  - Inactive labels MUST use `text-valis-navinactive` (`#5C5852`, WCAG AA $\ge 4.5:1$ on `#EFECE4` / `#EAE5D9`) — never pale `#8A857C`.
  - Elevated Manager Grants (`All Sales calls`, `All Finance calls`, `All team calls`) use high-contrast dark active state (`bg-valis-text border-valis-text text-valis-canvas font-medium`), while restricted default `Own calls` stays neutral white (`bg-valis-canvas border-valis-controlborder text-valis-text font-medium`).
- **AI Chat Sandbox Verdicts**:
  - `Allowed` headers use `text-valis-green` (`#1E7E45`).
  - `Blocked` / `Firewall` headers use `text-valis-blockedred` (`#9E3B2B`).

---

## 6. Semantic Tokens & CSS Custom Properties (`src/index.css` & `tokens.ts`)

**Strict Zero-Raw-Hex Rule**: UI components (`src/App.tsx`, `src/components/*.tsx`, `src/design-system/atoms/*.tsx`, `src/design-system/molecules/*.tsx`) must **never** contain raw hex literals (`#[0-9A-Fa-f]{6}`). Always use the semantic Tailwind token utilities (`bg-valis-*`, `text-valis-*`, `border-valis-*`, `decoration-valis-*`, `divide-valis-*`, `ring-valis-*`), CSS geometry custom properties (`var(--valis-*)`), or import `VALIS_TOKENS` from `src/design-system/tokens.ts`. Enforced automatically by `npm test`.

| Semantic Token (`VALIS_TOKENS`) | CSS Custom Property | Tailwind Token Name | Hex / Value | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `colors.pageBg` | `--valis-bg` | `valis-bg` | `#FAF8F3` | Unified warm-paper workspace canvas (Employee App & Admin Console) + `<ValisDrawer />` background |
| `colors.canvasBg` | `--valis-canvas` | `valis-canvas` | `#FFFFFF` | Elevated editorial sheets (`Daily Brief`), tables, cards & inputs |
| `colors.sidebarBg` | `--valis-sidebar` | `valis-sidebar` | `#F6F3EB` | Left `230px` navigation sidebar |
| `colors.sidebarHoverBg` | `--valis-sidebar-hover` | `valis-sidebarhover` | `#EDE9DF` | Inactive sidebar nav item hover fill |
| `colors.activeNavBg` | `--valis-active-nav` | `valis-activeitem` | `#E6E1D6` | Active sidebar navigation item fill |
| `colors.sidebarBorder` | `--valis-sidebar-border` | `valis-sidebarborder` | `#EAE5D9` | 1px structural hairlines, sheet borders & drawer dividers |
| `colors.rowDivider` | `--valis-row-divider` | `valis-divider` | `#EFECE4` | Table dividers & segmented switch tracks |
| `colors.chromeBorder` | `--valis-chrome-border` | `valis-chromeborder` | `#E3DDD1` | Filter pills, inputs & segmented track borders |
| `colors.controlBorder` | `--valis-control-border` | `valis-controlborder` | `#DCD7CD` | Secondary CTA buttons & active neutral switch borders |
| `colors.textPrimary` | `--valis-text-primary` | `valis-text` | `#1A1917` | Primary headings, active dark switches & Primary CTA buttons |
| `colors.textPrimaryHover` | `--valis-text-primary-hover` | `valis-texthover` | `#33312E` | Primary CTA button hover fill |
| `colors.textSecondary` | `--valis-text-secondary` | `valis-secondary` | `#4A4742` | Subtitles, task descriptions & audit event copy |
| `colors.textNavInactive` | `--valis-text-nav-inactive` | `valis-navinactive` | `#5C5852` | Inactive nav links & WCAG AA inactive segmented switch labels |
| `colors.textMuted` | `--valis-text-muted` | `valis-muted` | `#6E6A63` | Secondary metadata, timestamps & drawer subtitles |
| `colors.textCompleted` | `--valis-text-completed` | `valis-completed` | `#78736A` | WCAG AA completed (`☑`) & hidden task titles at 100% opacity |
| `colors.textSubtle` | `--valis-text-subtle` | `valis-subtle` | `#8A857C` | Eyebrows, source citations, SSO sync badge & locked notes |
| `colors.liveGreen` | `--valis-live-green` | `valis-green` | `#1E7E45` | Active listener dot, completed checkbox & AI chat `Allowed` verdict |
| `colors.blockedRed` | `--valis-blocked-red` | `valis-blockedred` | `#9E3B2B` | AI chat `Blocked` & `Second Brain Firewall` verdict headers |
| `colors.earlyAccessOrange` | `--valis-early-access-orange` | `valis-orange` | `#C87A28` | 4-bar voice waveform, `5px` delta dot & early-access label |
| `colors.linkBlue` | `--valis-link-blue` | `valis-blue` | `#1D63B8` | Inline table action links (`Manage`, `Test AI`, `See work flow`) |
| `geometry.drawerWidth` | `--valis-drawer-width` | — | `420px` | Unified width of `<ValisDrawer />` across all surfaces |

---

## 7. Reusable Component Registry & Canonical Patterns (Import — Do Not Rebuild)

### Pattern A — Unified Slide-Over Drawer (`ValisDrawer`)
- **Component**: `src/design-system/molecules/ValisDrawer.tsx`
- **Used by**:
  1. `ValisAppView.tsx` (`Verified Primary Source` inspector for Daily Brief citations)
  2. `SecurityAiChatSandboxDrawer.tsx` (`AI Security Scope` — `Permissions` & `Test AI Chat` tabs)
- **Contract**:
  - Full-viewport dimmed & blurred backdrop (`fixed inset-0 z-40 bg-valis-text/15 backdrop-blur-[1.5px]`) covering the left sidebar and workspace alike.
  - Fixed right overlay (`fixed inset-y-0 right-0 w-[var(--valis-drawer-width)] z-50 bg-valis-bg border-l border-valis-sidebarborder shadow-2xl flex flex-col`).
  - Closes on backdrop click, top-right `X` button, or pressing `Escape`.
  - Sticky header (`Eyebrow` + `18px H2` + `12.5px Subtitle` + `X` + optional `headerExtra` tab bar) over an independently scrollable body (`flex-1 overflow-y-auto px-5 pb-8`).

### Pattern B — Workspace Scope Switcher (`ScopeSegmentedControl`)
- **Component**: `src/design-system/molecules/ScopeSegmentedControl.tsx`
- Two-option segmented control (`Company` with `Building2` | `Personal` with `User`) using `#5C5852` (`text-valis-navinactive`) for inactive readability. Switching scope immediately closes `<ValisDrawer />` and resets Voice Capture.

### Pattern C — Split-Intent Task Affordance (`ValisCheckbox` + `BriefTaskItem`)
- **Components**: `src/design-system/atoms/ValisCheckbox.tsx`, `src/design-system/molecules/BriefTaskItem.tsx`
- Solid `15px × 15px` `rounded-[4px]` checkbox for actionable tasks (`Decide`, `I owe`, `Others owe`, `Signals`); dashed `15px × 15px` `rounded-[4px]` hide box revealing an `11px` monochrome `EyeOff` icon on row hover for read-only `Calendar` events, paired with `Hide` + Secondary CTA `Open in source ↗` on the right.

### Pattern D — Recognition-Based Section Hiding (`HiddenDisclosure`)
- Implemented in `ValisAppView.tsx`: removes hidden rows cleanly from the active stream and shows `1 hidden ([Title]) · Restore` or collapsible `N hidden ▾` disclosure tray.

### Pattern E — 3-Stage Morphing Voice Note (`CallListenerBanner`)
- **Component**: `src/design-system/molecules/CallListenerBanner.tsx`
- Single-container state machine (`idle` -> `recording` -> `review`) with right-anchored Primary/Secondary CTA stability (Fitts's Law).

### Pattern F — Temporal Delta Filter (`TemporalDeltaBar`)
- **Component**: `src/design-system/molecules/TemporalDeltaBar.tsx`
- Scoped header chip (`3 changes since 09:40` / `Filtering N updates` / `All caught up · Reset demo updates`).

### Pattern G — 3-Tab AI Security Governance & Live AI Chat Sandbox (`AiSecurityView`)
- **Components**: `src/components/AiSecurityView.tsx`, `src/design-system/molecules/SecurityAiChatSandboxDrawer.tsx`, `src/design-system/atoms/SecurityToolAccessPill.tsx`
- **Full specification**: See `specs/security-permissions-v2.md`.
- **3 Single-Purpose Views** on unified warm-paper `#FAF8F3` canvas with crisp `#FFFFFF` editorial tables:
  1. `AI access` (`AI & Tool Access`): 3-column table (`Department` | `Enabled Tools` plain text summary | blue `Manage` link) + right SSO directory sync metadata (`Synced via Google Workspace SSO · 4 Departments · 80 Employees`).
  2. `Meeting permissions` (`Meeting & Voice Note Permissions`): 4-column table (`Department` | `Team Lead` | `Lead Call Access` high-contrast `[ Own calls | All [Dept] calls ]` switch | blue `Test AI` link).
  3. `Audit log` (`Security & AI Audit Log`): `rounded-full` filter pills (`All`, `Permission changes`, `Blocked AI prompts`, `Approved edits`) + full-width 4-column table (`Time` | `Person or AI` | `Event` | `Status`), auto-closing `<ValisDrawer />` on entry.

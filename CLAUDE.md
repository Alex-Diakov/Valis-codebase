# CLAUDE.md — Valis Engineering & AI Agent Constitution

This file defines mandatory architectural, visual, and product rules for engineers and AI coding agents (Claude Code, Cursor, Codex, Windsurf) working in the Valis repository. Following these rules guarantees PRs pass design review and automated CI gates on the first pass.

---

## 1. Quick Commands

- **Start Dev Server**: `npm run dev` (Vite SPA on port `3000`)
- **Typecheck & Lint**: `npm run lint` (`tsc --noEmit`)
- **Run Unit Tests & Design System Gates**: `npm test` (`tsx --test src/utils/valisLogic.test.ts`)
- **Production Build**: `npm run build`

---

## 2. Core Product Invariants (`src/design-system/AGENT_UI_RULES.ts`)

Before creating or modifying any feature, inspect `src/design-system/AGENT_UI_RULES.ts`, `src/design-system/index.ts`, and all feature specifications in `specs/*.md`. Every UI view and data flow **must** enforce these 11 rules:

1. **`VALIS-RULE-01` — Mandatory Primary Source Citations**: Every synthesized brief item, diagnostic finding, Valis Chat reply, or management loop commitment must render at least one clickable `SourceCitationLink` (`Jira OPS-142`, `Slack #support-ops`, `Email from Priya Nair`, etc.). Clicking a citation opens the unified right-hand `<ValisDrawer />` (`420px`) Source Context Inspector.
2. **`VALIS-RULE-02` — Zero Causal Hallucination in Valis Pulse**: Pulse attention rows state *what changed and where* (`"38 more tasks opened than closed"`). Never generate speculative root-cause copy.
3. **`VALIS-RULE-03` — Read-Only Connector Default & Split-Intent Triage**: Valis reads company systems and mutates nothing silently. Actionable tasks (`Decide`, `I owe`, `Others owe`, `Signals`) render a solid `15px × 15px` `rounded-[var(--valis-checkbox-radius)]` checkbox; read-only `Calendar` events render a dashed `15px × 15px` hide box (`11px` monochrome `EyeOff` on hover) plus a quiet `Hide` button next to `Open in source ↗`. Only external two-way connectors (`Jira`) display `Write-back`; native Valis items display `Native memory`.
4. **`VALIS-RULE-04` — Memory Scope Isolation (`OrgBrain` vs `Second Brain`)**: Every captured item is tagged with `memoryScope: 'org-brain' | 'second-brain'`. Items in `second-brain` are strictly private to the user and never leak into shared `org-brain` views.
5. **`VALIS-RULE-05` — Warm-Paper Editorial Geometry & Full-Screen Shell**: No purple/indigo AI gradients, no nested cards-in-cards, and **zero OS color emojis** inside UI controls (always use `13px–15px` monochrome Lucide SVGs with `strokeWidth={1.75}` or pure editorial typography). Both Employee App and Admin Console use `h-screen w-screen overflow-hidden flex`, a permanently pinned `230px` left sidebar (`--valis-surface-sidebar`), and a unified warm-paper workspace canvas (`--valis-surface-page`) hosting crisp single-elevation editorial sheets/tables (`--valis-surface-canvas`).
6. **`VALIS-RULE-06` — Zero-Travel 3-Stage Voice Capture**: Voice dictation must morph in place inside `CallListenerBanner` across 3 states (`Idle` -> `Live Recording` with 4-bar waveform & timer -> `Review & Save`) keeping the primary CTA (`Voice Note` -> `Stop` -> `Save to Brief`) anchored on the right edge (Fitts's Law). Never render a second stacked capture card or fake manual dropdowns during live recording.
7. **`VALIS-RULE-07` — Recognition-Based Section Hiding & Focus Isolation**: Hidden items cleanly leave the active list (never leaving bulky gray placeholder banners). Render `1 hidden ([Task title]) · Restore` for 1 item, or a collapsible `N hidden ▾` disclosure tray with individual `Restore` actions for 2+ items. Never use ambiguous slash labels like `Show / Undo`. Opening Voice Capture closes `<ValisDrawer />`, and switching `Company ↔ Personal` immediately resets/closes `<ValisDrawer />`.
8. **`VALIS-RULE-08` — Desktop WCAG AA Readability & Low-Noise Status Hierarchy**: Enforce the unified Typography Scale (`H1 22px`, `H2 18px`, `H3 14px`, `Eyebrow 11px`, `Body 14px`, `Meta 12.5px`). Completed and hidden items stay legible (`text-valis-completed` at `100%` opacity—never `opacity-45`), and interactive `Restore`/`Undo` links use `text-valis-text` underlined styling. In-list update indicators use a minimal `5px` amber dot + plain text (`Updated 18m ago`), auto-hidden on completed items.
9. **`VALIS-RULE-09` — Scoped Permission Inheritance & Live AI Boundary Testing**: Connected AI assistants (Valis Chat, Claude, Runbooks) strictly inherit the authenticated user's SSO department scope and explicit Team Lead call grant; a prompt can never widen a user's scope. Meetings default to `Participants-Only` visibility and Personal Second Brains remain hardware-isolated even from managers and admins. Inside the Admin Security drawer, explicitly separate `TEAM LEAD CALL GRANT · [LEAD NAME] ONLY` from `DEPARTMENT TOOL ACCESS · ALL [N] MEMBERS`, contract-lock `Valis Deployment Team` (`0% customer data`), and verify boundaries live via the `Test AI Chat` tab.
10. **`VALIS-RULE-10` — Global Visual Consistency & Unified Slide-Over Drawer (`<ValisDrawer />`)**: Both `Valis Employee App` and `Valis Admin Console` share the unified warm-paper canvas (`bg-valis-bg`) with crisp single-elevation cards (`bg-valis-canvas border-valis-sidebarborder`). All right-hand drawers MUST reuse `<ValisDrawer />` (`420px` fixed slide-over over full-viewport blurred backdrop, closing on backdrop click or `Escape`). Strictly enforce the 4-Button Taxonomy via `<ValisButton />` and WCAG AA contrast (`text-valis-navinactive` inactive segmented switch text; `text-valis-green` Allowed and `text-valis-blockedred` Blocked AI chat verdict headers).
11. **`VALIS-RULE-11` — 3-Tier Token Pipeline, Barrel Reuse & Zero-Dead-Click HCI Contract**: Raw hex literals exist ONLY in Tier 1 Primitives (`tokens.ts`, `tokens.json`, `src/index.css`). All UI views import primitives from `src/design-system`, avoid arbitrary radii (`rounded-[5px]`), support keyboard `focus-visible` + `Escape` + `prefers-reduced-motion`, and implement working handlers on every control.

---

## 3. Directory Architecture (Specs, 3-Tier Tokens, Headless Logic & Atomic UI)

> **Agent Rule**: Always read `specs/*.md` (`specs/design-system-lifecycle.md`, `specs/daily-brief-v2-hci.md`, `specs/security-permissions-v2.md`) before modifying features.

```text
.
├── README.md                                 # Developer onboarding, barrel API & 5-step lifecycle
├── AGENTS.md                                 # Universal AI coding agent quick-start protocol
├── CLAUDE.md                                 # Full engineering & AI agent constitution
├── specs/
│   ├── design-system-lifecycle.md            # 3-tier tokens, WCAG AA contrast matrix & PR lifecycle
│   ├── daily-brief-v2-hci.md                 # Daily Brief v2 HCI patterns, state matrices & TTFV metrics
│   └── security-permissions-v2.md            # 3-tab AI Security governance, SSO directory & Live AI Chat spec
└── src/
    ├── App.tsx                               # Root application wiring headless controllers to views
    ├── index.css                             # Tailwind v4 + 3-tier CSS custom properties + focus-visible + reduced-motion
    ├── main.tsx                              # React DOM entry point
    ├── components/                           # Top-level surface containers
    │   ├── AdminSidebar.tsx                  # Left 230px navigation for Valis Admin Console
    │   ├── AiSecurityView.tsx                # 3-tab Security console (AI access, Meeting permissions, Audit log)
    │   ├── ValisAdminConsoleView.tsx         # Admin Console shell (Overview, Pulse, Management Loop, Reports, Runbooks)
    │   └── ValisAppView.tsx                  # Employee App shell (Daily Brief, Calendar, Library, Chat, Dictation, Groups, Settings)
    ├── data/
    │   └── valisData.ts                      # Seed datasets for Brief, Reports, Pulse & Security
    ├── design-system/
    │   ├── index.ts                          # SINGLE public barrel export for tokens, rules, atoms & molecules
    │   ├── tokens.ts                         # 3-tier TS tokens (VALIS_PRIMITIVES -> VALIS_ALIAS_TOKENS -> VALIS_COMPONENT_TOKENS)
    │   ├── tokens.json                       # W3C DTCG 3-tier JSON tokens for Figma / Style Dictionary
    │   ├── AGENT_UI_RULES.ts                 # Machine-readable guardrails (VALIS-RULE-01..11)
    │   ├── atoms/                            # Pure primitive UI building blocks
    │   │   ├── MetricCard.tsx                # Tabular KPI card (Pulse & Diagnostics)
    │   │   ├── SecurityToolAccessPill.tsx    # Tool access switch composing <ValisSegmentedSwitch />
    │   │   ├── SourceCitationLink.tsx        # 12.5px underlined primary source citation trigger
    │   │   ├── ValisBadge.tsx                # Status, scope, and sync-policy badges
    │   │   ├── ValisButton.tsx               # Canonical 4-Button Taxonomy (primary, secondary, link, pill)
    │   │   ├── ValisCard.tsx                 # Single-elevation editorial sheet container
    │   │   ├── ValisCheckbox.tsx             # 15px solid (complete) or dashed (hide + EyeOff) checkbox
    │   │   ├── ValisPageHeader.tsx           # Canonical 22px H1 page header with subtitle & right slot
    │   │   ├── ValisSectionEyebrow.tsx       # 11px uppercase eyebrow divider (optional em-dash)
    │   │   ├── ValisSegmentedSwitch.tsx      # Reusable WCAG AA neutral / elevated segmented switch
    │   │   └── ValisToggle.tsx               # Accessible role="switch" binary toggle
    │   └── molecules/                        # Composed domain molecules
    │       ├── BriefTaskItem.tsx             # Daily Brief row with Split-Intent hover & low-noise delta dot
    │       ├── CallListenerBanner.tsx        # 3-stage morphing Voice Note state machine (Idle/Record/Review)
    │       ├── ProfileSwitcherFooter.tsx     # Pinned sidebar AM profile footer + monochrome icon popover (Esc close)
    │       ├── PulseAttentionRow.tsx         # Non-causal observation row with inline blue drilldown link
    │       ├── ScopeSegmentedControl.tsx     # Company (OrgBrain) | Personal (Second Brain) switch
    │       ├── SecurityAiChatSandboxDrawer.tsx # 2-tab (Permissions | Test AI Chat) drawer composing <ValisDrawer />
    │       ├── TemporalDeltaBar.tsx          # Header "N changes since 09:40" interactive filter chip
    │       ├── ValisChatComposer.tsx         # Unified Floating Composer + ValisKnotMark for AI Chat surfaces
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
        └── valisLogic.test.ts                # Automated unit tests + CI Design System gates (Hex/Emoji/Parity/WCAG)
```

---

## 4. Unified Typography Scale (`VALIS_TOKENS.typography.scale`)

Every view across `Valis Employee App` and `Valis Admin Console` strictly adheres to these 6 levels (never drop below `11px` for readable labels):

| Level | Token (`tokens.ts`) | Exact Tailwind Classes | Usage |
| :--- | :--- | :--- | :--- |
| **H1 Page Title** | `scale.h1` (`22px`) | `text-[22px] font-semibold tracking-[-0.02em] text-valis-text` | `Daily Brief`, `Calendar`, `My Library`, `Valis Pulse`, `Reports`, `Management Loop`, `AI & Tool Access`, `Meeting & Voice Note Permissions`, `Security & AI Audit Log` |
| **H2 Drawer Title** | `scale.h2` (`18px`) | `text-[18px] font-semibold tracking-[-0.015em] text-valis-text` | Unified `<ValisDrawer />` title (`Engineering`, `Sales Department`, Source Document title) |
| **H3 Section Header** | `scale.h3` (`14px`) | `text-[14px] font-semibold text-valis-text` | `Calendar`, `Decide`, `I owe`, `Others owe`, `Signals`, `Needs attention`, Pulse chart titles |
| **Eyebrow Label** | `scale.eyebrow` (`11px`) | `text-[11px] uppercase tracking-[0.06em] font-medium text-valis-subtle` | `VERIFIED PRIMARY SOURCE`, `AI SECURITY SCOPE`, `TEAM LEAD CALL GRANT · [LEAD] ONLY`, `DEPARTMENT TOOL ACCESS · ALL [N] MEMBERS`, `WORK`, `MEETINGS` |
| **Body Primary** | `scale.body` (`14px`) | `text-[14px] leading-[1.5] text-valis-text` | Task titles/descriptions, page subtitles, table rows |
| **Metadata / Controls**| `scale.meta` (`12.5px`) | `text-[12.5px] text-valis-muted` | Source citations, timestamps (`tabular-nums`), SSO sync badge, quiet helper notes |

---

## 5. Unified 4-Button Taxonomy (`<ValisButton />`)

Always import `<ValisButton />` from `src/design-system`. Only **4 canonical variants** are permitted across the product:

| Variant | `<ValisButton />` Prop | Radius Token | Examples |
| :--- | :--- | :--- | :--- |
| **1. Primary CTA** | `variant="primary"` | `6px` (`--valis-button-radius`) | `Save to Brief`, `Stop`, `Send`, `Approve` |
| **2. Secondary CTA** | `variant="secondary"` | `6px` (`--valis-button-radius`) | `Voice Note`, `Sync`, `Open in source ↗`, `Override`, `Skip`, `Run now` |
| **3. Inline Link** | `variant="link"` | none | `Manage`, `Test AI`, `Return to Daily Brief`, `Open Admin Console` |
| **4. Filter / Prompt Pill** | `variant="pill"` (`active`) | `9999px` (`--valis-pill-radius`) | `Reports`, `Library`, `Audit log`, `Management Loop`, `Chat` & `Test AI Chat` quick prompts |

---

## 6. 3-Tier Semantic Token Architecture (`tokens.ts`, `tokens.json`, `src/index.css`)

**Strict Zero-Raw-Hex & Zero-Emoji Rule**: UI `.tsx` files must **never** contain raw hex literals (`#[0-9A-Fa-f]{3,8}`), OS color emojis, or arbitrary `rounded-[5px]`. Enforced automatically by `npm test`.

| Semantic Alias (`VALIS_ALIAS_TOKENS`) | Tier 2 CSS Property | Tailwind Utility | Tier 1 Primitive | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `surface.page` | `--valis-surface-page` | `bg-valis-bg` | `#FAF8F3` | Unified warm-paper workspace canvas & `<ValisDrawer />` background |
| `surface.canvas` | `--valis-surface-canvas` | `bg-valis-canvas` | `#FFFFFF` | Single-elevation editorial sheets, tables, cards & inputs |
| `surface.sidebar` | `--valis-surface-sidebar` | `bg-valis-sidebar` | `#F6F3EB` | Left `230px` navigation sidebar |
| `surface.activeNav` | `--valis-surface-active-nav` | `bg-valis-activeitem` | `#E6E1D6` | Active sidebar navigation item fill |
| `border.default` | `--valis-border-default` | `border-valis-sidebarborder` | `#EAE5D9` | 1px structural hairlines, sheet borders & drawer dividers |
| `border.divider` | `--valis-border-divider` | `border-valis-divider` | `#EFECE4` | Table dividers & segmented switch tracks |
| `border.control` | `--valis-border-control` | `border-valis-controlborder` | `#DCD7CD` | Secondary CTA buttons & active neutral switch borders |
| `ink.primary` | `--valis-ink-primary` | `text-valis-text` | `#1A1917` | Primary headings, active dark switches & Primary CTA buttons |
| `ink.secondary` | `--valis-ink-secondary` | `text-valis-secondary` | `#4A4742` | Subtitles, task descriptions & audit event copy |
| `ink.navInactive` | `--valis-ink-nav-inactive` | `text-valis-navinactive` | `#5C5852` | Inactive nav links & WCAG AA inactive segmented switch labels |
| `ink.muted` | `--valis-ink-muted` | `text-valis-muted` | `#6E6A63` | Secondary metadata, timestamps & drawer subtitles |
| `ink.completed` | `--valis-ink-completed` | `text-valis-completed` | `#78736A` | WCAG AA completed & hidden task titles at 100% opacity |
| `ink.subtle` | `--valis-ink-subtle` | `text-valis-subtle` | `#8A857C` | Eyebrows, source citations, SSO sync badge & locked notes |
| `status.allowed` | `--valis-status-allowed` | `text-valis-green` | `#1E7E45` | Active listener dot, completed checkbox & AI chat `Allowed` verdict |
| `status.blocked` | `--valis-status-blocked` | `text-valis-blockedred` | `#9E3B2B` | AI chat `Blocked` & `Second Brain Firewall` verdict headers |
| `status.warning` | `--valis-status-warning` | `text-valis-orange` | `#C87A28` | 4-bar voice waveform, `5px` delta dot & early-access label |
| `ink.link` | `--valis-ink-link` | `text-valis-blue` | `#1D63B8` | Inline action links & global `:focus-visible` ring |
| `component.layout.drawerWidth` | `--valis-drawer-width` | — | `420px` | Unified width of `<ValisDrawer />` across all surfaces |

### Unified Floating Composer & Glass-Box AI Chat Pattern (`<ValisChatComposer />`)

All conversational AI surfaces (`Test AI Chat` in the Security `<ValisDrawer />` and `Valis Employee App → Chat`) MUST follow the Valis Glass-Box Editorial Chat standard (no harsh dark user blocks, no legacy split `[ Input ] [ Send ]` bars, no empty vertical voids):

- **Centered Zero-State (`messages.length === 0`)**: Vertically center a `40×40px` `bg-valis-divider` badge containing `<ValisKnotMark />` (`24px`), heading (`15px–18px font-semibold text-valis-text`), a dynamic live-scope context pill (`bg-valis-divider/80 text-valis-navinactive text-[11.5px] rounded-full`), and 3 full-width clickable starter prompt rows (`bg-valis-canvas border border-valis-sidebarborder hover:border-valis-text rounded-[var(--valis-card-radius)]`) with monochrome `13px` `ArrowUpRight` icons. Disappears immediately upon first submit.
- **Calm Figure-Ground User Bubble**: Right-aligned warm stone bubble (`bg-valis-divider text-valis-text text-[13.5px] leading-[1.5] px-3.5 py-2.5 rounded-[12px] rounded-tr-[4px] max-w-[85%] ml-auto`).
- **350ms Glass-Box Verification Pulse**: Before revealing an AI verdict, render a `350ms` animated status line (`text-[12px] text-valis-subtle animate-pulse`, honoring `prefers-reduced-motion`): `Checking [Scope] policy & connectors...`, with clean timer cancellation on subject switch, `Clear`, or drawer unmount.
- **Unboxed Editorial AI Response**: Left-aligned, full-width layout (`space-y-1.5 py-1`) with a semantic verdict eyebrow (`CheckCircle2` `text-valis-green` `Allowed · Verified against scope` or `ShieldAlert` `text-valis-blockedred` `Blocked · Restricted by policy`), crisp body prose (`leading-[1.55]`), and a contextual micro-footer (underlined primary `Source:` citation when Allowed, or interactive `Adjust in Permissions →` link in `text-valis-blue` when Blocked by a configurable policy).
- **Unified Floating Composer (`<ValisChatComposer />`)**: Single elevated container (`bg-valis-canvas border border-valis-controlborder focus-within:border-valis-text rounded-[12px] p-2.5 shadow-sm`) combining a borderless input on top with an integrated bottom micro-toolbar (`Scope: [Subject]` + inline `Clear` link when messages exist on the left; `28×28px` `ArrowUp` icon-only submit button on the right).

---

## 7. Automated PR Quality Gates (`npm test`)

Before opening a PR or completing an agent turn, run `npm test && npm run lint && npm run build`:

1. **Zero Raw Hex Audit**: Scans every `.tsx` file in `src/App.tsx`, `src/components/`, `src/design-system/atoms/`, and `src/design-system/molecules/` for raw hex literals.
2. **Zero OS Emoji Audit**: Verifies zero color emoji pictographs exist in any UI `.tsx` component.
3. **Zero Arbitrary Radius Drift**: Bans `rounded-[5px]` in favor of semantic `--valis-*-radius` tokens.
4. **3-Tier Token 1:1 Parity**: Validates every primitive and semantic color across `tokens.ts`, `src/index.css`, and W3C `tokens.json`.
5. **WCAG 2.1 AA Contrast Math**: Computes luminance contrast ratios and asserts `>= 4.5:1` across all core ink/surface pairs.
6. **Barrel Export Integrity & Domain Tests**: Verifies `src/design-system/index.ts` exports and all Daily Brief, Reports, Pulse, and AI Security boundary behaviors.

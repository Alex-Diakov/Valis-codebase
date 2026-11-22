# Valis Design System Lifecycle & HCI Compliance Specification

**Status**: Active Standard (`v2.0`)  
**Applies to**: Both `Valis Employee App` (7 routes) and `Valis Admin Console` (8 routes)

---

## 1. 3-Tier Token Architecture

To prevent Design System Drift and support both CSS/Tailwind engineers and external design tools (Figma Tokens Studio / Style Dictionary), Valis strictly separates tokens into 3 tiers:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ TIER 1 · PRIMITIVES (Raw Values Only)                                      │
│  paper0..paper900 · ink950..ink400 · forest600 · crimson600 · ochre500..800│
│  cobalt600 · radius.xs..full · motion.durationFast/Normal/easingStandard   │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     │ referenced via alias (never duplicated)
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ TIER 2 · SEMANTIC ALIASES (UI Intent & Accessibility Role)                 │
│  surface.{page, canvas, sidebar, sidebarHover, activeNav, chrome, tag}     │
│  border.{default, divider, chrome, control, controlHover, underline}       │
│  ink.{primary, secondary, navInactive, muted, completed, subtle, link}     │
│  status.{allowed, blocked, warning, deltaBg, chartAccent} · focus.ring     │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     │ consumed by atoms & Tailwind @theme
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ TIER 3 · COMPONENT & LAYOUT TOKENS                                         │
│  layout.{sidebarWidth: 230px, drawerWidth: 420px, maxWidths: 1020/1100px}  │
│  radius.{panel: 10px, card: 8px, control/button: 6px, checkbox: 4px, pill} │
│  typography.scale.{h1: 22px, h2: 18px, h3: 14px, eyebrow: 11px, body, meta}│
└────────────────────────────────────────────────────────────────────────────┘
```

### Synchronization Contract
All three token sources MUST remain synchronized 1:1 (enforced automatically by `npm test`):
1. `src/design-system/tokens.ts` — Strongly typed runtime/TS access (`VALIS_PRIMITIVES`, `VALIS_ALIAS_TOKENS`, `VALIS_COMPONENT_TOKENS`, `VALIS_TOKENS`).
2. `src/index.css` — CSS Custom Properties (`--valis-primitive-*`, `--valis-surface-*`, `--valis-border-*`, `--valis-ink-*`, `--valis-status-*`, `--valis-*`) + Tailwind v4 `@theme` bindings.
3. `src/design-system/tokens.json` — Standard W3C Design Tokens Community Group (DTCG) JSON format using `{primitive.*}` alias references.

---

## 2. WCAG 2.1 AA Contrast Verification Matrix

All core foreground/background pairs are mathematically verified in `npm test` using relative luminance contrast ratio:

| Foreground Token | Background Token | Minimum Target | Verified Role |
| :--- | :--- | :--- | :--- |
| `ink.primary` (`#1A1917`) | `surface.page` (`#FAF8F3`) & `surface.canvas` (`#FFFFFF`) | `>= 4.5:1` | Headings, body copy, active dark CTAs |
| `ink.secondary` (`#4A4742`) | `surface.page` & `surface.canvas` | `>= 4.5:1` | Page subtitles, task descriptions, audit events |
| `ink.navInactive` (`#5C5852`) | `surface.sidebar` (`#F6F3EB`) & `border.divider` (`#EFECE4`) | `>= 4.5:1` | Inactive sidebar links & segmented switch labels |
| `ink.muted` (`#6E6A63`) | `surface.canvas` (`#FFFFFF`) | `>= 4.5:1` | Metadata, timestamps, drawer subtitles |
| `ink.completed` (`#78736A`) | `surface.canvas` (`#FFFFFF`) | `>= 4.5:1` | Completed tasks at `100%` opacity (never dimmed opacity) |
| `status.allowed` (`#1E7E45`) | `surface.canvas` (`#FFFFFF`) | `>= 4.5:1` | Allowed AI chat verdicts, connected states |
| `status.blocked` (`#9E3B2B`) | `surface.canvas` (`#FFFFFF`) | `>= 4.5:1` | Blocked & Second Brain Firewall verdicts |
| `ink.link` (`#1D63B8`) | `surface.canvas` (`#FFFFFF`) | `>= 4.5:1` | Inline table action links (`Manage`, `Test AI`) |

---

## 3. HCI & Accessibility Compliance Checklist

1. **Visibility of System Status (Nielsen #1)**: Every action yields immediate deterministic UI feedback (`Calendar` Sync transitions `Syncing...` → `Synced just now`, `Management Loop` records `Approved`/`Skipped`/`Paused`, `AI Security` logs every switch/prompt live in `Audit log`).
2. **Error Prevention & Scope Isolation (Poka-Yoke)**:
   - Switching `Company ↔ Personal` immediately closes `<ValisDrawer />` and resets active voice capture.
   - Switching to `Audit log` auto-closes `<ValisDrawer />` so audit rows never wrap or clip.
   - `Valis Deployment Team` toggles are permanently disabled (`Contract-locked · Zero customer data access`).
3. **Keyboard & Reduced Motion Accessibility**:
   - Global `:focus-visible` outline (`2px solid var(--valis-focus-ring)`, `2px` offset) across all buttons, links, inputs, and switches.
   - `Escape` dismisses `<ValisDrawer />` and `<ProfileSwitcherFooter />`.
   - `@media (prefers-reduced-motion: reduce)` disables waveform pulse animations and transitions.
4. **Verifiable Provenance (`VALIS-RULE-01`)**:
   - Synthesized items in `Daily Brief`, `Valis Chat`, `Library`, `Calendar`, and `Management Loop` open the unified `420px` `<ValisDrawer />` showing primary source metadata and excerpt.

---

## 4. Component Promotion & PR Contribution Cycle

```text
[1. Spec Check] ──▶ [2. Token Sync] ──▶ [3. Atom/Molecule Reuse] ──▶ [4. View Wiring] ──▶ [5. CI Gate]
  CLAUDE.md           tokens.ts           src/design-system/index.ts   Zero dead clicks     npm test
  AGENTS.md           tokens.json         Promote if reused >= 2x      Tabular nums         npm run lint
  specs/*.md          src/index.css       No raw hex / no emojis       Escape + focus       npm run build
```

### Component Promotion Rule
- **Atom** (`src/design-system/atoms/`): Stateless or single-control primitive with zero domain copy (`ValisButton`, `ValisToggle`, `ValisSegmentedSwitch`, `ValisCard`, `ValisCheckbox`, `ValisBadge`, `ValisPageHeader`, `ValisSectionEyebrow`, `MetricCard`, `SourceCitationLink`).
- **Molecule** (`src/design-system/molecules/`): Composed domain unit combining atoms (`ValisDrawer`, `BriefTaskItem`, `CallListenerBanner`, `ScopeSegmentedControl`, `TemporalDeltaBar`, `PulseAttentionRow`, `ProfileSwitcherFooter`, `SecurityAiChatSandboxDrawer`).
- Every new Atom or Molecule MUST be re-exported from `src/design-system/index.ts` and documented in `CLAUDE.md`.

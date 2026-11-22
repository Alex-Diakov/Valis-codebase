# Valis — Warm-Paper Editorial Workspace & Design System

Valis is an enterprise operating memory system comprising two unified surfaces built on a single zero-drift atomic design system:

- **Valis Employee App** — `Daily Brief` (`Company` OrgBrain / `Personal` Second Brain), `Calendar`, `My Library`, `Valis Chat`, `Dictation`, `Groups`, and `Settings`.
- **Valis Admin Console** — `Overview`, `Valis Pulse`, `Management Loop` (`Human in the loop` / `Autopilot`), `Reports`, `Runbooks`, and 3-tab **AI Security** (`AI access`, `Meeting permissions`, `Audit log`).

---

## Quick Start

```bash
npm install
npm run dev       # Start Vite dev server on http://localhost:3000
npm run lint      # Strict TypeScript check (tsc --noEmit)
npm test          # Domain logic + Design System CI guardrails (Zero-Hex, Zero-Emoji, Token Parity, WCAG AA)
npm run build     # Production Vite bundle
```

---

## Design System Architecture (3-Tier Token Pipeline)

Valis uses a strict **3-tier token architecture** synchronized 1:1 across CSS, TypeScript, and W3C DTCG JSON:

```text
Tier 1: Primitives         (Raw hex palette, radii, spacing, motion — ONLY place raw hex values exist)
   │   src/design-system/tokens.ts  ·  src/index.css (--valis-primitive-*)  ·  src/design-system/tokens.json
   ▼
Tier 2: Semantic Aliases   (Intent roles: surface.page, surface.canvas, border.default, ink.primary, status.allowed/blocked, focus.ring)
   │   Mapped to Tailwind v4 @theme utilities (bg-valis-*, text-valis-*, border-valis-*)
   ▼
Tier 3: Component Tokens   (drawerWidth: 420px, sidebarWidth: 230px, buttonRadius: 6px, typography.scale.h1..meta)
```

### Importing Design System Primitives (Single Barrel Entry Point)

Developers and AI coding agents should always import tokens, rules, atoms, and molecules from `src/design-system`:

```tsx
import {
  VALIS_TOKENS,
  VALIS_ALIAS_TOKENS,
  AGENT_UI_RULES,
  ValisButton,
  ValisToggle,
  ValisSegmentedSwitch,
  ValisCard,
  ValisCheckbox,
  ValisBadge,
  ValisDrawer,
  ValisPageHeader,
  ValisSectionEyebrow,
  SourceCitationLink,
  MetricCard,
} from './design-system';
```

### Canonical 4-Button Taxonomy (`<ValisButton />`)

| Variant | Prop | Visual Contract | Usage |
| :--- | :--- | :--- | :--- |
| **Primary CTA** | `variant="primary"` | Dark ink `#1A1917`, `6px` radius | `Save to Brief`, `Stop`, `Send`, `Approve` |
| **Secondary CTA** | `variant="secondary"` | White `#FFFFFF` + `#DCD7CD` border, `6px` radius | `Voice Note`, `Sync`, `Open in source ↗`, `Override`, `Run now` |
| **Inline Link** | `variant="link"` | Cobalt `#1D63B8` hover underline | `Manage`, `Test AI`, `Return to Daily Brief`, `Open Admin Console` |
| **Filter / Prompt Pill** | `variant="pill"` | `rounded-full` (`active={true\|false}`) | `Reports`, `Library`, `Management Loop`, `Audit log`, Quick Chat Prompts |

---

## Development & Design System Lifecycle

Every PR (authored by a human engineer or AI agent) follows this 5-step cycle:

1. **Read the Constitution & Specs**: Inspect `CLAUDE.md` (or `AGENTS.md`), `src/design-system/AGENT_UI_RULES.ts`, and the relevant spec in `specs/`.
2. **Token First**: Never write raw hex values (`#XXXXXX`) or arbitrary radii (`rounded-[5px]`) in `.tsx` files. Add or reference tokens across `tokens.ts`, `tokens.json`, and `src/index.css`.
3. **Reuse or Elevate**: Import existing atoms and molecules from `src/design-system`. If a pattern repeats twice, promote it into `src/design-system/atoms/` and export it from `src/design-system/index.ts`.
4. **HCI & Accessibility Discipline**: Every interactive control must have a working handler (zero dead clicks), keyboard `focus-visible` ring, `Escape` dismissal for overlays/popovers, `tabular-nums` on numeric values, and clickable `<SourceCitationLink />` provenance for synthesized facts.
5. **Run Automated PR Gates**:
   ```bash
   npm test && npm run lint && npm run build
   ```
   The test suite automatically enforces:
   - **Zero raw hex literals** across all `.tsx` UI files.
   - **Zero OS color emojis** across all `.tsx` UI files.
   - **Zero arbitrary `rounded-[5px]`** radius drift.
   - **1:1 Token Parity** across `tokens.ts`, `src/index.css`, and `tokens.json`.
   - **WCAG 2.1 AA Contrast Math** ($\ge 4.5:1$) for all primary/secondary/muted/completed/status ink-on-surface pairs.

---

## Documentation Map

- `CLAUDE.md` — Primary engineering & AI agent constitution (11 rules, token table, component registry).
- `AGENTS.md` — Universal quick-start protocol for AI coding agents (Claude Code, Cursor, Codex, Windsurf).
- `src/design-system/AGENT_UI_RULES.ts` — Machine-readable guardrails (`VALIS-RULE-01` .. `VALIS-RULE-11`).
- `src/design-system/tokens.json` — W3C DTCG 3-tier design tokens export for Figma / Style Dictionary.
- `specs/design-system-lifecycle.md` — Full token pipeline, HCI compliance matrix, and PR lifecycle specification.
- `specs/daily-brief-v2-hci.md` — Daily Brief v2 HCI patterns & voice capture state machine.
- `specs/security-permissions-v2.md` — 3-tab AI Security console & Live AI Chat boundary sandbox spec.

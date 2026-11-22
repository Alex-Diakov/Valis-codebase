# AGENTS.md — AI Coding Agent Operating Protocol for Valis

This repository is engineered for zero-drift collaboration between human frontend engineers and AI coding agents (Claude Code, Cursor, Codex, Windsurf).

## Mandatory Read Order Before Any Edit

1. Read `CLAUDE.md` (architecture, typography scale, 4-button taxonomy, token tables).
2. Read `src/design-system/AGENT_UI_RULES.ts` (`VALIS-RULE-01` through `VALIS-RULE-11`).
3. Inspect `src/design-system/index.ts` and `src/index.css` to see every existing atom, molecule, and CSS custom property.
4. Read the relevant feature spec in `specs/`:
   - `specs/design-system-lifecycle.md`
   - `specs/daily-brief-v2-hci.md`
   - `specs/security-permissions-v2.md`

## Hard Invariants (Automatically Blocked by `npm test`)

- **Zero Raw Hex Literals**: Never write `#XXX` or `#XXXXXX` anywhere in `.tsx` files (including JSX comments). Raw hex values belong strictly in Tier 1 Primitives (`src/design-system/tokens.ts`, `src/design-system/tokens.json`, and `:root` primitives in `src/index.css`).
- **Zero OS Color Emojis**: Never place color emojis inside UI components or buttons. Use `13px–15px` monochrome `lucide-react` icons (`strokeWidth={1.75}`) or clean typography.
- **Zero Arbitrary Radii**: Always use `--valis-panel-radius` (`10px`), `--valis-card-radius` (`8px`), `--valis-control-radius` / `--valis-button-radius` (`6px`), `--valis-checkbox-radius` (`4px`), or `--valis-pill-radius` (`9999px`). Never write `rounded-[5px]`.
- **Reuse — Do Not Rebuild**: Always import `<ValisButton />`, `<ValisToggle />`, `<ValisSegmentedSwitch />`, `<ValisCard />`, `<ValisCheckbox />`, `<ValisBadge />`, `<ValisDrawer />`, `<ValisPageHeader />`, `<ValisSectionEyebrow />`, and `<SourceCitationLink />` from `src/design-system`.
- **Single Unified Drawer**: All right-hand inspection or configuration overlays MUST compose `<ValisDrawer />` (`420px`, full-viewport blurred backdrop, backdrop click + `Escape` close).
- **Zero Dead Clicks**: Every rendered button, table row, filter tab, or source citation must trigger a real, deterministic state transition.

## 5-Step Agent Delivery Cycle

1. **Audit Scope**: Identify the exact view/molecule affected; leave unrelated views untouched.
2. **Update Tokens First** (if a new color/radius/layout token is needed): Sync `tokens.ts`, `tokens.json`, and `src/index.css` 1:1.
3. **Compose Atoms**: Build UI using barrel imports from `src/design-system`.
4. **Sync Docs**: Update `CLAUDE.md`, `AGENT_UI_RULES.ts`, or `specs/*.md` if a pattern or rule evolved.
5. **Run Full Gate**: Execute `npm test && npm run lint && npm run build` and verify zero errors before finishing.

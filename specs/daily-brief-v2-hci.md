# Feature Spec: Daily Brief v2.0 — Core HCI Patterns & State Machines

**Owner:** Design & Frontend Architecture  
**Status:** Implemented (`uxMode === 'v2-improvements'`)  
**Guardrails:** `src/design-system/AGENT_UI_RULES.ts` (`VALIS-RULE-01` through `VALIS-RULE-08`)  
**Controllers & Components:** `src/headless/useDailyBriefController.ts`, `src/services/valisMemoryService.ts`, `src/design-system/molecules/ScopeSegmentedControl.tsx`, `src/design-system/molecules/CallListenerBanner.tsx`, `src/design-system/molecules/TemporalDeltaBar.tsx`, `src/design-system/molecules/BriefTaskItem.tsx`, `src/design-system/atoms/ValisCheckbox.tsx`, `src/components/ValisAppView.tsx`, `src/components/ValisAdminConsoleView.tsx`

---

## 1. Problem Statement

User research and job-to-be-done (JTBD) diagnostics on the v1.0 Daily Brief baseline surfaced four high-friction cognitive bottlenecks for executives and team leads:

1. **Privacy & Memory Anxiety (`OrgBrain` vs. `Second Brain` collision):** Users hesitated to use voice notes, dictation, or meeting capture for sensitive prep (e.g., compensation calibration or 1:1 feedback) because it was unclear whether captures were indexed into shared company memory (`OrgBrain`) or kept strictly private (`Second Brain`).
2. **Read-Only vs. Write-Back Checkbox Ambiguity:** Checking off a brief item synthesized from Google Calendar, Jira, Slack, or Email gave no clear signal whether Valis was mutating an upstream record (`Close in Jira`), completing a commitment locally, or hiding a read-only calendar reminder.
3. **High-Friction Manual Capture & Visual Clutter:** Opening voice capture stacked multiple boxes and fake manual forms over the brief, while dismissing or completing items left noisy gray placeholder banners and competing orange badges.
4. **Re-Read Fatigue on Return Visits:** Opening the Daily Brief multiple times a day forced users to re-scan every static morning item to spot what changed since their last check-in.

---

## 2. Finalized HCI Pattern Catalog (Patterns A–F)

### Pattern A — Workspace Scope Firewall (`ScopeSegmentedControl`)

A tactile two-state segmented control in the left sidebar directly below the Valis wordmark, paired with a synchronized top capture bar (`CallListenerBanner`) and strict state isolation.

- **Control:** `ScopeSegmentedControl` (`Company` | `Personal`) using `13px` monochrome Lucide icons (`Building2` and `User`, `strokeWidth={1.75}`). Never use a `Lock` icon on active capture controls (avoids the disabled/paywalled signifier error).
- **Multi-Company & Navigation Scaling:**
  - Supports multi-company workspaces (`Company ⌄` dropdown when `companies > 1`) while keeping `Personal` (`Second Brain`) 1-click adjacent.
  - Dynamically hides company-only navigation items (`Groups`) when `memoryScope === 'second-brain'`.

| State (`memoryScope`) | Top Capture Bar (`CallListenerBanner` Stage 1) | Header Scope Badge | Visible Brief Items | Sidebar Nav Items |
| :--- | :--- | :--- | :--- | :--- |
| `'org-brain'` (`Company`) | Green status bar (`#E6F2EA`): *"Listening for Zoom, Teams, Google Meet, Slack Huddles"* | `Demo company` (`#F2EDE4`) | Only items where `item.memoryScope === 'org-brain'` | Full company nav (including `Groups`) |
| `'second-brain'` (`Personal`) | Warm stone bar (`#F5EFE4`) with `ShieldCheck` (`14px`): *"Private mode · Saved only to your Second Brain"* | *(None — avoids copy repetition)* | Only items where `item.memoryScope === 'second-brain'` | Personal nav (`Groups` hidden) |

---

### Pattern B — Split-Intent Task Affordance (`ValisCheckbox` + `BriefTaskItem`)

Maintains a uniform `15px × 15px` `rounded-[4px]` left control column while distinguishing actionable commitments from read-only calendar events:

- **Actionable / Completable Tasks (`Decide`, `I owe`, `Others owe`, `Signals` — `variant="complete"`):**
  - **Left Control:** Solid border square (`border border-[#8A857C] bg-white hover:border-[#1A1917]`). Clicking marks the task completed (`☑` green check `#1E7E45` + strikethrough title in `text-[#78736A]` at `100%` row opacity, with zero background box fill).
  - **Right Status on Completion:** External two-way connectors (`Jira OPS-142`) display `Closed in Jira · Undo`; read-only or native commitments display `Completed · Undo`. All `Undo` links use high-contrast `text-[#1A1917] font-medium underline decoration-[#C8C3B8] hover:decoration-[#1A1917]`.
  - **Row Hover (Open State):** Reveals `Hide` and `Open in source ↗` (`12.5px`).
- **Read-Only External Events (`Calendar` — `variant="hide-readonly"`):**
  - **Left Control:** Soft dashed border square (`border border-dashed border-[#B8B2A6] bg-transparent hover:border-[#6E6A63]`), revealing a subtle `EyeOff` icon on hover (`title="Hide from brief (Read-only source)"`). Clicking immediately hides the event from the active section list.
  - **Row Hover:** Reveals `Open in source ↗`.
- **Provenance Badge Discipline:**
  - Only external two-way connectors (e.g., `Jira OPS-142`) display `· Write-back`.
  - Native Valis items (`Voice Note`, `Board call notes`, `Second Brain`) display `Native memory` in the Source Context Inspector Drawer.

---

### Pattern C — Recognition-Based Section Hiding (`HiddenDisclosure`)

Follows Edward Tufte's Data-Ink Ratio and Jakob Nielsen's Recognition-over-Recall heuristic:

- **Real Hide Behavior:** Clicking `Hide` (or the dashed `EyeOff` box on Calendar events) removes the row from the active task list immediately—never leaving bulky gray placeholder banners in the task stream.
- **1 Hidden Item in Section:** Displays `1 hidden ([Truncated Task Title]) · Restore` inline on the right side of the section header (`text-[12.5px] text-[#6E6A63]`, with `Restore` styled in `text-[#1A1917] font-medium underline decoration-[#C8C3B8] hover:decoration-[#1A1917]`). Clicking `Restore` immediately un-hides that item.
- **2+ Hidden Items in Section:** Displays a disclosure toggle `N hidden ▾` in the section header (with a native `title` tooltip listing all hidden task titles). Clicking `N hidden ▾` toggles a quiet bottom section tray where each hidden task (`14px`, `100%` opacity, `text-[#78736A]`) can be restored individually via its own `Restore` link. Never render ambiguous slash text like `Show / Undo`.

---

### Pattern D — 3-Stage Morphing Voice Note (`CallListenerBanner`)

Eliminates stacked capture boxes and fake demo buttons in favor of a single container that morphs in place while keeping the primary button (`Voice Note` -> `Stop` -> `Save to Brief`) anchored at the right edge (Fitts's Law):

| Stage | Visual Container & Left Content | Right-Edge Anchored Controls | Transition Trigger |
| :--- | :--- | :--- | :--- |
| **Stage 1: Idle** | Single-line status banner (`Listening for Zoom...` or `Private mode · Saved only to your Second Brain`) | `[ 🎙 Voice Note ]` (`12.5px`, `Mic` icon) | Clicking `Voice Note` transitions immediately to Stage 2 (`recording`) and closes the right Source Inspector Drawer |
| **Stage 2: Live Recording** | Morphs in place (`bg-[#FAF8F3] border border-[#DCD7CD] rounded-[8px] px-3.5 py-2.5`): animated 4-bar `#C87A28` waveform + live timer (`0:01`, `0:02` in `tabular-nums`) + word-by-word streaming transcript (`14px`) rotating across 3 scope-specific samples | `Cancel` + `[ ■ Stop ]` (`bg-[#1A1917] text-white`) | Auto-transitions to Stage 3 after ~2.2s speech stream completes, or immediately on clicking `[ ■ Stop ]` (populating full transcript) |
| **Stage 3: Review & Save** | Editable `<input>` (`14px bg-white border-[#DCD7CD] rounded-[6px] px-3 py-2 w-full`) + bottom row (`mt-2.5`, no `border-t`): `Add to: [Decide / I owe] · Company Brief` (or `· Private Second Brain`) | `Discard` + `[ Save to Brief ]` (`bg-[#1A1917] text-white`) | Clicking `Save to Brief` appends the item to the selected section with `● Added just now` and collapses back to Stage 1 |

---

### Pattern E — Master-Detail Primary Source Inspector (`SourceContextDrawer`)

A `340px` right-hand drawer triggered by clicking any `SourceCitationLink` or `Open in source ↗`:

1. **Header:** `VERIFIED PRIMARY SOURCE` + single top-right `X` close button (no duplicate bottom `Close` button).
2. **Metadata Badges:** Source system pill (`Jira`, `Slack`, `Google Docs`, `Voice Note`) + sync policy badge (`Write-back enabled`, `Read-only connector`, or `Native memory`).
3. **Document Context:** Verifiable primary title (e.g., `FY27_Enterprise_Renewal_Addendum_v4.docx` for `Contract draft`), participants, and timestamp.
4. **Source Excerpt:** Callout card with ochre left accent bar (`border-l-[3px] border-[#C87A28]`).
5. **Provenance & Primary CTA:** 1-line provenance trace (`Extracted to OrgBrain · Linked to: [Task Title]` or `Saved to Private Second Brain · Linked to: [Task Title]`) + full-width primary button (`Open original in [Source] ↗` or `Edit note in Second Brain`). Never display `Zero data retention` inside the drawer.

---

### Pattern F — Temporal Delta Filter (`TemporalDeltaBar`) & Low-Noise In-List Dots

1. **Header Filter Button (`showOnlyChanges === false`):** Neutral interactive button (`bg-[#F6F3EB] hover:bg-[#ECE7DC] border border-[#DCD7CD] text-[#1A1917] text-[12.5px] font-medium`) with `ListFilter` icon + dynamic scoped count (`3 changes since 09:40` in Company mode; `1 change since 09:40` in Personal mode) + `Mark seen` action link.
2. **Active Filter Chip (`showOnlyChanges === true`):** Dark pill (`bg-[#1A1917] text-white text-[12.5px] font-medium`) reading `Filtering N updates ×`.
3. **Low-Noise In-List Delta Indicator:** Unseen updates on open rows render as a minimal `5px` amber dot (`bg-[#C87A28]`) + plain `12.5px` muted text (`● Updated 18m ago` or `● Added just now`) inline after the source citations—never bordered orange boxes. Completed rows automatically hide their update dot.

---

## 3. Edge Cases & Cross-Surface Invariants

- **Cross-Scope Drawer Isolation (`Company ↔ Personal`):** Switching `memoryScope` in the sidebar or changing navigation routes immediately executes `setSelectedSource(null)`, closing the Right Source Context Drawer so a `Personal (Second Brain)` note can never remain open inside `Company` mode.
- **Mutual Exclusivity (Voice Capture vs. Source Inspector):** Starting a `Voice Note` (`Stage 2` or `Stage 3`) automatically closes the Right Source Context Drawer (`setSelectedSource(null)`), and clicking a source citation link to open the drawer automatically cancels active voice capture.
- **Hiding an Inspected Task:** If the user clicks `Hide` on the task currently inspected in the Right Source Context Drawer, the drawer automatically closes.
- **`Mark seen` While Filtering Updates:** Clicking `Mark seen` while `showOnlyChanges === true` clears unseen delta flags *and* resets `showOnlyChanges = false`, preventing an empty brief screen and showing `All caught up · Reset demo updates`.
- **Admin Console 4-6-2 Management Loop & Autopilot Mode:** In `ValisAdminConsoleView` (`Management Loop`), commitments support status cycling (`In progress` -> `At risk` -> `Closed`) and a segmented execution policy toggle (`Human-in-the-loop` vs. `Autopilot` runbook automation) with full primary source traceability.
- **Desktop WCAG AA Typography Scale:** `Daily Brief` heading is `22px` (`font-semibold`), section headers are `14px` (`font-semibold text-[#1A1917]`), task titles and descriptions are `14px` (`leading-[1.5]`), and source citations/timestamps/actions are `12.5px` minimum. Completed and hidden rows maintain `100%` opacity with `text-[#78736A]` titles.

---

## 4. Target Success & TTFV (Time-to-First-Value) Metrics

| Metric | v1.0 Baseline | v2.0 Target | Measurement Mechanism |
| :--- | :--- | :--- | :--- |
| **Return-Visit Triage Time (TTFV)** | ~42s (full top-to-bottom re-read) | **< 8s** | Time from brief open to clicking the first actionable delta item using `TemporalDeltaBar`. |
| **Voice Note Capture Completion Time** | ~19s (manual form + dropdowns) | **< 4s** | 2-click zero-travel completion (`Voice Note` -> auto-stream / `Stop` -> `Save to Brief`). |
| **Connector Trust & Triage Completion Rate** | 38% (users feared accidental external edits) | **> 85%** | Ratio of task interactions resulting in explicit completion (`☑`) or recognition-based hiding (`Hide` / `Restore`). |
| **Second Brain Capture Adoption** | 12% of executive voice notes | **> 60%** | Daily private voice notes created while `memoryScope === 'second-brain'`. |
| **Zero Cross-Scope Data Leakage** | N/A | **100% deterministic** | Enforced by `ValisMemoryService.filterBriefByMemoryScope` unit tests and drawer auto-reset on scope switch. |

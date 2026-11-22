/**
 * Machine-Readable Design & Architecture Guardrails for Engineers and AI Agents (Claude Code / Cursor / Codex)
 *
 * Enforces Valis product & HCI invariants across Daily Brief, Second Brain, Valis Pulse, Management Loop, and AI Security:
 *  1. VALIS-RULE-01: Mandatory Primary Source Citations
 *  2. VALIS-RULE-02: Zero Causal Hallucination in Valis Pulse
 *  3. VALIS-RULE-03: Read-Only Connector Default & Split-Intent Triage
 *  4. VALIS-RULE-04: Memory Scope Isolation (OrgBrain vs Second Brain)
 *  5. VALIS-RULE-05: Warm-Paper Editorial Geometry & Full-Screen Workspace Layout
 *  6. VALIS-RULE-06: Zero-Travel 3-Stage Voice Capture
 *  7. VALIS-RULE-07: Recognition-Based Section Hiding & Focus Isolation
 *  8. VALIS-RULE-08: Desktop WCAG AA Readability & Low-Noise Status Hierarchy
 *  9. VALIS-RULE-09: Scoped Permission Inheritance & Live AI Boundary Testing
 * 10. VALIS-RULE-10: Global Visual Consistency & Unified Slide-Over Drawer (<ValisDrawer />)
 * 11. VALIS-RULE-11: 3-Tier Token Pipeline, Barrel Reuse & Zero-Dead-Click HCI Contract
 */

export interface AgentUiGuardrailRule {
  id: string;
  principle: string;
  enforcement: 'MANDATORY' | 'STRICT_BAN';
  validationRule: string;
}

export const AGENT_UI_RULES: readonly AgentUiGuardrailRule[] = [
  {
    id: 'VALIS-RULE-01',
    principle: 'Mandatory Primary Source Citations',
    enforcement: 'MANDATORY',
    validationRule:
      'Every BriefTaskItem, DiagnosticFinding, Valis Chat reply, and ManagementLoopAction must carry at least one clickable SourceCitationLink with a verifiable system origin (Calendar, Slack, Email, Jira, Document, or Transcript) opening <ValisDrawer />.',
  },
  {
    id: 'VALIS-RULE-02',
    principle: 'Zero Causal Hallucination in Valis Pulse',
    enforcement: 'STRICT_BAN',
    validationRule:
      'PulseAttentionRow items must state observed deltas and locations only ("Each item states what changed and where. It does not establish a cause."). Never generate speculative root-cause text.',
  },
  {
    id: 'VALIS-RULE-03',
    principle: 'Read-Only Connector Default & Split-Intent Triage',
    enforcement: 'MANDATORY',
    validationRule:
      'Valis reads company systems and changes nothing in them by default. Actionable brief tasks (Decide, I owe, Others owe, Signals) use a solid 15x15 rounded-[4px] checkbox for completion; read-only Calendar events use a dashed 15x15 rounded-[4px] hide box revealing an 11px monochrome EyeOff icon on hover plus a quiet Hide action next to Open in source ↗. Only external two-way connectors (e.g., Jira) display Write-back; native Valis items display Native memory.',
  },
  {
    id: 'VALIS-RULE-04',
    principle: 'Memory Scope Isolation (OrgBrain vs Second Brain)',
    enforcement: 'MANDATORY',
    validationRule:
      'Every voice note, dictation, and brief item is tagged with memoryScope ("org-brain" | "second-brain"). Second Brain items remain strictly private to the author and never cross-leak into shared OrgBrain views.',
  },
  {
    id: 'VALIS-RULE-05',
    principle: 'Warm-Paper Editorial Geometry & Full-Screen Workspace Layout',
    enforcement: 'MANDATORY',
    validationRule:
      'No indigo/purple AI gradients, no OS color emojis anywhere in UI controls, no nested cards-in-cards. Use the full-screen 230px left sidebar (--valis-surface-sidebar) with a permanently pinned bottom profile footer paired with a unified warm-paper main workspace (--valis-surface-page) hosting crisp single-elevation editorial sheets/tables (--valis-surface-canvas).',
  },
  {
    id: 'VALIS-RULE-06',
    principle: 'Zero-Travel 3-Stage Voice Capture',
    enforcement: 'MANDATORY',
    validationRule:
      'Voice dictation MUST morph in place inside CallListenerBanner across 3 states (Idle -> Live Recording with 4-bar waveform and live timer -> Review & Save) keeping the primary CTA (Voice Note -> Stop -> Save to Brief) anchored on the right edge (Fitts\'s Law). Never render a second stacked capture card or fake manual dropdowns during live recording.',
  },
  {
    id: 'VALIS-RULE-07',
    principle: 'Recognition-Based Section Hiding & Focus Isolation',
    enforcement: 'MANDATORY',
    validationRule:
      'Dismissed/hidden items must cleanly leave the active list (never leaving bulky gray placeholder banners). Render "1 hidden ([Task title]) · Restore" for 1 item, or a collapsible "N hidden ▾" disclosure tray with individual Restore actions for 2+ items. Never use ambiguous slash labels like "Show / Undo". Opening Voice Capture MUST close the Right Source Inspector Drawer, and switching Company <-> Personal MUST immediately reset/close the Right Source Inspector Drawer to prevent cross-scope leakage.',
  },
  {
    id: 'VALIS-RULE-08',
    principle: 'Desktop WCAG AA Readability & Low-Noise Status Hierarchy',
    enforcement: 'MANDATORY',
    validationRule:
      'Enforce unified typography: H1 22px font-semibold, H2 Drawer 18px font-semibold, H3 Section 14px font-semibold, Eyebrow 11px uppercase tracking-[0.06em], Body 14px, Meta 12.5px minimum. Completed and hidden items MUST stay legible (text-valis-completed at 100% opacity—NEVER opacity-45), and interactive Restore/Undo links MUST use high-contrast text-valis-text underlined styling. In-list update indicators MUST use a minimal 5px amber dot + plain text ("Updated 18m ago"), auto-hidden on completed items.',
  },
  {
    id: 'VALIS-RULE-09',
    principle: 'Scoped Permission Inheritance & Live AI Boundary Testing',
    enforcement: 'MANDATORY',
    validationRule:
      'Every AI assistant (Valis Chat, Claude, Runbooks) strictly inherits the authenticated user\'s SSO department scope and explicit Team Lead call grant; a prompt can never widen a user\'s scope. Meetings default to Participants-Only visibility and Personal Second Brains remain hardware-isolated even from managers and admins. Inside the Admin Security drawer, explicitly separate "TEAM LEAD CALL GRANT · [LEAD NAME] ONLY" from "DEPARTMENT TOOL ACCESS · ALL [N] MEMBERS", lock external Valis Deployment Team toggles ("Contract-locked · Zero customer data access"), and verify boundaries live via the Test AI Chat tab.',
  },
  {
    id: 'VALIS-RULE-10',
    principle: 'Global Visual Consistency & Unified Slide-Over Drawer',
    enforcement: 'MANDATORY',
    validationRule:
      'Both Valis Employee App and Valis Admin Console MUST share the unified warm-paper canvas (--valis-surface-page) with crisp single-elevation cards (--valis-surface-canvas). ALL right-hand inspection and configuration drawers MUST reuse <ValisDrawer /> (420px fixed slide-over over full-viewport blurred backdrop, closing on backdrop click or Escape). Strictly enforce the 4-button taxonomy via <ValisButton /> and WCAG AA contrast on segmented switches and AI chat verdict headers.',
  },
  {
    id: 'VALIS-RULE-11',
    principle: '3-Tier Token Pipeline, Barrel Reuse & Zero-Dead-Click HCI Contract',
    enforcement: 'MANDATORY',
    validationRule:
      'Raw hex values may exist ONLY in Tier 1 Primitives (tokens.ts, tokens.json, src/index.css :root primitives). All UI views MUST import shared primitives (<ValisButton />, <ValisToggle />, <ValisSegmentedSwitch />, <ValisCard />, <ValisDrawer />, <SourceCitationLink />, <ValisSectionEyebrow />) from src/design-system, use semantic radius tokens (never arbitrary rounded-[5px]), enforce keyboard focus-visible + Escape + prefers-reduced-motion, and provide working interactive handlers on every rendered button, link, and list row.',
  },
] as const;

export function validateFactHasCitations(sources: { label: string }[]): boolean {
  return Array.isArray(sources) && sources.length > 0 && sources.every((s) => s.label.trim().length > 0);
}

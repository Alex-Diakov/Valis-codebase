/**
 * Machine-Readable Design & Architecture Guardrails for Engineers and AI Agents (Claude Code / Cursor)
 *
 * Enforces Valis product invariants across Daily Brief, Second Brain, Valis Pulse, and Management Loop:
 * 1. VALIS-RULE-01: Mandatory Primary Source Citations
 * 2. VALIS-RULE-02: Zero Causal Hallucination in Valis Pulse
 * 3. VALIS-RULE-03: Read-Only Connector Default & Split-Intent Triage
 * 4. VALIS-RULE-04: Memory Scope Isolation (OrgBrain vs Second Brain)
 * 5. VALIS-RULE-05: Warm-Paper Editorial Geometry & Full-Screen Workspace Layout
 * 6. VALIS-RULE-06: Zero-Travel 3-Stage Voice Capture
 * 7. VALIS-RULE-07: Recognition-Based Section Hiding & Focus Isolation
 * 8. VALIS-RULE-08: Desktop WCAG AA Readability & Low-Noise Status Hierarchy
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
      'Every BriefTaskItem, DiagnosticFinding, and ManagementLoopAction must carry at least one non-empty SourceLink with a verifiable system origin (Calendar, Slack, Email, Jira, Document, or Transcript).',
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
      'Valis reads company systems and changes nothing in them by default. Actionable brief tasks (Decide, I owe, Others owe, Signals) use a solid 15x15 rounded-[4px] checkbox for completion; read-only Calendar events use a dashed 15x15 rounded-[4px] hide box revealing EyeOff on hover. Only external two-way connectors (e.g., Jira) display Write-back; native Valis items display Native memory.',
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
      'No indigo/purple AI gradients, no OS color emojis in controls, no floating cards-in-cards. Use the full-screen 230px left sidebar (--valis-sidebar) paired with a white main workspace (--valis-canvas) centered at max-w-[1020px] (App) or max-w-[1100px] (Admin) and a 340px right-hand Source Context Drawer.',
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
      'Main task & section typography MUST be 14px, metadata/actions 12.5px minimum. Completed (☑) and hidden items MUST stay legible (text-[#78736A] at 100% opacity—NEVER opacity-45 washing out contrast), and interactive Restore/Undo links MUST use high-contrast #1A1917 underlined styling. In-list update indicators MUST use a minimal 5px amber dot + plain text ("● Updated 18m ago"), NEVER bordered orange boxes that visually compete with the header filter chip. Auto-hide update dots on completed items.',
  },
  {
    id: 'VALIS-RULE-09',
    principle: 'Scoped Permission Inheritance & Effective Access Simulation',
    enforcement: 'MANDATORY',
    validationRule:
      'Every AI assistant (Valis Chat, Claude, Runbooks) strictly inherits the authenticated user\'s department scope and connector ceiling; a prompt can never widen a user\'s scope. Meetings default to Participants-Only visibility unless an explicit administrator grant is logged, and Personal Second Brains remain hardware-isolated even from managers and admins. Clicking any department or manager row in AI Security opens the 340px right-hand Effective Access Simulator Drawer to preview live Allowed Read Scope, Mutation Policy, and Strictly Blocked data.',
  },
] as const;

export function validateFactHasCitations(sources: { label: string }[]): boolean {
  return Array.isArray(sources) && sources.length > 0 && sources.every((s) => s.label.trim().length > 0);
}

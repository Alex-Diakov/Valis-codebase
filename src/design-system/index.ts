/**
 * Valis Design System — Public Barrel Entry Point
 *
 * Engineers and AI agents should import design tokens, guardrails, atoms,
 * and molecules from this single entry point rather than rebuilding UI primitives.
 */

// 1. 3-Tier Design Tokens (Primitive -> Semantic Alias -> Component)
export {
  VALIS_PRIMITIVES,
  VALIS_ALIAS_TOKENS,
  VALIS_COMPONENT_TOKENS,
  VALIS_TOKENS,
  type ValisTokens,
} from './tokens';

// 2. Machine-Readable Product & HCI Guardrails
export {
  AGENT_UI_RULES,
  validateFactHasCitations,
  type AgentUiGuardrailRule,
} from './AGENT_UI_RULES';

// 3. Atomic Primitives
export { MetricCard } from './atoms/MetricCard';
export {
  SecurityToolAccessPill,
  SecurityToolSegmentedSwitch,
  SecurityToolStatusDropdown,
  type SecurityToolStatusDropdownProps,
} from './atoms/SecurityToolAccessPill';
export { SourceCitationLink } from './atoms/SourceCitationLink';
export { ValisBadge } from './atoms/ValisBadge';
export {
  ValisButton,
  type ValisButtonProps,
  type ValisButtonVariant,
  type ValisButtonSize,
} from './atoms/ValisButton';
export { ValisCard, type ValisCardProps } from './atoms/ValisCard';
export { ValisCheckbox } from './atoms/ValisCheckbox';
export {
  ValisPageHeader,
  type ValisPageHeaderProps,
} from './atoms/ValisPageHeader';
export {
  ValisSectionEyebrow,
  type ValisSectionEyebrowProps,
} from './atoms/ValisSectionEyebrow';
export {
  ValisSegmentedSwitch,
  type ValisSegmentedOption,
  type ValisSegmentedSwitchProps,
} from './atoms/ValisSegmentedSwitch';
export { ValisToggle, type ValisToggleProps } from './atoms/ValisToggle';

// 4. Composed Domain Molecules
export { BriefTaskItem } from './molecules/BriefTaskItem';
export { CallListenerBanner } from './molecules/CallListenerBanner';
export { ProfileSwitcherFooter } from './molecules/ProfileSwitcherFooter';
export { PulseAttentionRow } from './molecules/PulseAttentionRow';
export { ScopeSegmentedControl } from './molecules/ScopeSegmentedControl';
export {
  DRAWER_EIGHT_TOOLS,
  SecurityAiChatSandboxDrawer,
  type SecurityDrawerTabId,
  type SecurityDrawerToolValues,
  type SecurityToolFieldKey,
} from './molecules/SecurityAiChatSandboxDrawer';
export { TemporalDeltaBar } from './molecules/TemporalDeltaBar';
export {
  ValisChatComposer,
  ValisKnotMark,
  type ValisChatComposerProps,
  type ValisKnotMarkProps,
} from './molecules/ValisChatComposer';
export { ValisDrawer, type ValisDrawerProps } from './molecules/ValisDrawer';

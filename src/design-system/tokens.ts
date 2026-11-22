/**
 * Valis Design System — 3-Tier Semantic Token Architecture
 *
 * Tier 1: VALIS_PRIMITIVES       Raw palette, spacing, radii, typography, motion (ONLY place raw hex values live)
 * Tier 2: VALIS_ALIAS_TOKENS     Role-based semantic aliases (surface, border, ink, status, focus)
 * Tier 3: VALIS_COMPONENT_TOKENS Component-level geometry, sizing, and typographic contracts
 *
 * Synchronized 1:1 with:
 * - src/index.css (CSS Custom Properties & Tailwind v4 @theme)
 * - src/design-system/tokens.json (W3C DTCG Design Tokens format for Figma / Style Dictionary)
 *
 * Architectural Rule (VALIS-RULE-05 & VALIS-RULE-10):
 * UI components (.tsx) must NEVER contain raw hex literals (#XXX / #XXXXXX) or arbitrary radii.
 * Always consume semantic Tailwind utilities (bg-valis-*, text-valis-*, border-valis-*)
 * or import tokens/primitives from src/design-system.
 */

/* ============================================================================
   TIER 1: PRIMITIVE TOKENS (Raw values live strictly here)
============================================================================ */
export const VALIS_PRIMITIVES = {
  color: {
    // Warm Paper Neutrals
    paper0: '#FFFFFF',
    paper50: '#FAF8F3',
    paper100: '#F6F3EB',
    paper150: '#F5EFE4',
    paper200: '#F2EDE4',
    paper250: '#EFECE4',
    paper300: '#EDE9DF',
    paper350: '#EAE5D9',
    paper400: '#E8E4DC',
    paper450: '#E6E1D6',
    paper500: '#E5DEC9',
    paper550: '#E3DDD1',
    paper600: '#DCD7CD',
    paper650: '#D8D2C5',
    paper700: '#C8C3B8',
    paper800: '#B8B2A6',
    paper900: '#9E998E',

    // Warm Ink Neutrals (WCAG 2.1 AA Calibrated)
    ink950: '#1A1917',
    ink850: '#33312E',
    ink700: '#4A4742',
    ink600: '#5C5852',
    ink500: '#6E6A63',
    ink450: '#78736A',
    ink400: '#8A857C',
    amberInk700: '#6E5634',

    // Forest Green (Allowed / Live / Verified)
    forest600: '#1E7E45',
    forest100: '#E6F2EA',
    forest200: '#CFE5D6',
    forest300: '#B8DFC6',

    // Crimson (Blocked / Firewall)
    crimson600: '#9E3B2B',

    // Ochre & Amber (Delta / Early Access / Charts)
    ochre500: '#C87A28',
    ochre600: '#B56B27',
    ochre700: '#8F561A',
    ochre800: '#9E4718',
    ochre100: '#FDF3E7',
    ochre150: '#F3E5D8',
    ochre200: '#EAD2B5',

    // Cobalt Blue (Inline Action Links)
    cobalt600: '#1D63B8',
    cobalt300: '#98B9E2',

    // Muted Editorial Avatars
    avatarSlate: '#5B6B82',
    avatarBronze: '#8C6239',
    avatarSage: '#4E7A5B',
    avatarPlum: '#7B4B6A',
    avatarSteel: '#386890',

    // External Meeting Provider Marks
    brandZoom: '#2D8CFF',
    brandMeet: '#00897B',
    brandTeams: '#5C6BC0',
  },
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '10px',
    full: '9999px',
  },
  spacing: {
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '8': '32px',
    '10': '40px',
  },
  motion: {
    durationFast: '150ms',
    durationNormal: '200ms',
    easingStandard: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  font: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
} as const;

/* ============================================================================
   TIER 2: SEMANTIC ALIAS TOKENS (Intent-driven UI roles)
============================================================================ */
export const VALIS_ALIAS_TOKENS = {
  surface: {
    page: VALIS_PRIMITIVES.color.paper50,
    canvas: VALIS_PRIMITIVES.color.paper0,
    sidebar: VALIS_PRIMITIVES.color.paper100,
    sidebarHover: VALIS_PRIMITIVES.color.paper300,
    activeNav: VALIS_PRIMITIVES.color.paper450,
    chrome: VALIS_PRIMITIVES.color.paper200,
    tag: VALIS_PRIMITIVES.color.paper400,
    privateBanner: VALIS_PRIMITIVES.color.paper150,
  },
  border: {
    default: VALIS_PRIMITIVES.color.paper350,
    divider: VALIS_PRIMITIVES.color.paper250,
    chrome: VALIS_PRIMITIVES.color.paper550,
    control: VALIS_PRIMITIVES.color.paper600,
    controlHover: VALIS_PRIMITIVES.color.paper800,
    privateBanner: VALIS_PRIMITIVES.color.paper500,
    underline: VALIS_PRIMITIVES.color.paper700,
    chartMuted: VALIS_PRIMITIVES.color.paper650,
    sectionDash: VALIS_PRIMITIVES.color.paper900,
  },
  ink: {
    primary: VALIS_PRIMITIVES.color.ink950,
    primaryHover: VALIS_PRIMITIVES.color.ink850,
    secondary: VALIS_PRIMITIVES.color.ink700,
    navInactive: VALIS_PRIMITIVES.color.ink600,
    muted: VALIS_PRIMITIVES.color.ink500,
    completed: VALIS_PRIMITIVES.color.ink450,
    subtle: VALIS_PRIMITIVES.color.ink400,
    privateBanner: VALIS_PRIMITIVES.color.amberInk700,
    link: VALIS_PRIMITIVES.color.cobalt600,
    linkUnderline: VALIS_PRIMITIVES.color.cobalt300,
  },
  status: {
    allowed: VALIS_PRIMITIVES.color.forest600,
    allowedBg: VALIS_PRIMITIVES.color.forest100,
    allowedBorder: VALIS_PRIMITIVES.color.forest200,
    allowedRing: VALIS_PRIMITIVES.color.forest300,
    blocked: VALIS_PRIMITIVES.color.crimson600,
    warning: VALIS_PRIMITIVES.color.ochre500,
    earlyAccessBg: VALIS_PRIMITIVES.color.ochre150,
    earlyAccessText: VALIS_PRIMITIVES.color.ochre800,
    deltaBg: VALIS_PRIMITIVES.color.ochre100,
    deltaBorder: VALIS_PRIMITIVES.color.ochre200,
    deltaText: VALIS_PRIMITIVES.color.ochre700,
    chartAccent: VALIS_PRIMITIVES.color.ochre600,
  },
  focus: {
    ring: VALIS_PRIMITIVES.color.cobalt600,
  },
} as const;

/* ============================================================================
   TIER 3: COMPONENT & LAYOUT TOKENS
============================================================================ */
export const VALIS_COMPONENT_TOKENS = {
  layout: {
    sidebarWidth: '230px',
    appWorkspaceMaxWidth: '1020px',
    adminWorkspaceMaxWidth: '1100px',
    drawerWidth: '420px',
  },
  radius: {
    panel: VALIS_PRIMITIVES.radius.lg,
    card: VALIS_PRIMITIVES.radius.md,
    control: VALIS_PRIMITIVES.radius.sm,
    button: VALIS_PRIMITIVES.radius.sm,
    checkbox: VALIS_PRIMITIVES.radius.xs,
    pill: VALIS_PRIMITIVES.radius.full,
  },
  typography: {
    fontFamily: VALIS_PRIMITIVES.font.sans,
    monoFamily: VALIS_PRIMITIVES.font.mono,
    trackingTight: '-0.015em',
    headingTracking: '-0.02em',
    scale: {
      h1: '22px',
      h2: '18px',
      h3: '14px',
      eyebrow: '11px',
      body: '14px',
      meta: '12.5px',
      // Backwards-compatible aliases
      pageHeading: '22px',
      subviewHeading: '20px',
      sectionHeading: '14px',
      bodyPrimary: '14px',
      metadata: '12.5px',
      badge: '11px',
    },
  },
} as const;

/* ============================================================================
   UNIFIED PUBLIC EXPORT (Backwards-compatible + 3-Tier Structured Access)
============================================================================ */
export const VALIS_TOKENS = {
  primitives: VALIS_PRIMITIVES,
  alias: VALIS_ALIAS_TOKENS,
  component: VALIS_COMPONENT_TOKENS,

  // Flat semantic lookup mirroring CSS custom properties 1:1
  colors: {
    // 1. Surfaces & Chrome
    pageBg: VALIS_ALIAS_TOKENS.surface.page,
    canvasBg: VALIS_ALIAS_TOKENS.surface.canvas,
    sidebarBg: VALIS_ALIAS_TOKENS.surface.sidebar,
    sidebarHoverBg: VALIS_ALIAS_TOKENS.surface.sidebarHover,
    activeNavBg: VALIS_ALIAS_TOKENS.surface.activeNav,
    chromeBg: VALIS_ALIAS_TOKENS.surface.chrome,
    tagBg: VALIS_ALIAS_TOKENS.surface.tag,
    privateBannerBg: VALIS_ALIAS_TOKENS.surface.privateBanner,

    // 2. Borders, Hairlines & Dividers
    sidebarBorder: VALIS_ALIAS_TOKENS.border.default,
    rowDivider: VALIS_ALIAS_TOKENS.border.divider,
    chromeBorder: VALIS_ALIAS_TOKENS.border.chrome,
    controlBorder: VALIS_ALIAS_TOKENS.border.control,
    controlBorderHover: VALIS_ALIAS_TOKENS.border.controlHover,
    privateBannerBorder: VALIS_ALIAS_TOKENS.border.privateBanner,
    underlineRule: VALIS_ALIAS_TOKENS.border.underline,
    trafficDots: VALIS_ALIAS_TOKENS.border.chartMuted,
    sectionDash: VALIS_ALIAS_TOKENS.border.sectionDash,

    // 3. Typography & Ink Hierarchy (WCAG 2.1 AA Verified)
    textPrimary: VALIS_ALIAS_TOKENS.ink.primary,
    textPrimaryHover: VALIS_ALIAS_TOKENS.ink.primaryHover,
    textSecondary: VALIS_ALIAS_TOKENS.ink.secondary,
    textNavInactive: VALIS_ALIAS_TOKENS.ink.navInactive,
    textMuted: VALIS_ALIAS_TOKENS.ink.muted,
    textCompleted: VALIS_ALIAS_TOKENS.ink.completed,
    textSubtle: VALIS_ALIAS_TOKENS.ink.subtle,
    privateBannerText: VALIS_ALIAS_TOKENS.ink.privateBanner,

    // 4. Semantic Status & Editorial Accents
    liveGreen: VALIS_ALIAS_TOKENS.status.allowed,
    liveGreenBannerBg: VALIS_ALIAS_TOKENS.status.allowedBg,
    liveGreenBannerBorder: VALIS_ALIAS_TOKENS.status.allowedBorder,
    liveGreenRing: VALIS_ALIAS_TOKENS.status.allowedRing,
    earlyAccessOrange: VALIS_ALIAS_TOKENS.status.warning,
    earlyAccessBadgeBg: VALIS_ALIAS_TOKENS.status.earlyAccessBg,
    earlyAccessBadgeText: VALIS_ALIAS_TOKENS.status.earlyAccessText,
    deltaAmberBg: VALIS_ALIAS_TOKENS.status.deltaBg,
    deltaAmberBorder: VALIS_ALIAS_TOKENS.status.deltaBorder,
    deltaAmberText: VALIS_ALIAS_TOKENS.status.deltaText,
    ochreBar: VALIS_ALIAS_TOKENS.status.chartAccent,
    linkBlue: VALIS_ALIAS_TOKENS.ink.link,
    linkBlueUnderline: VALIS_ALIAS_TOKENS.ink.linkUnderline,
    blockedRed: VALIS_ALIAS_TOKENS.status.blocked,

    // 5. Avatar Palette & External Provider Glyphs
    avatarSlate: VALIS_PRIMITIVES.color.avatarSlate,
    avatarBronze: VALIS_PRIMITIVES.color.avatarBronze,
    avatarSage: VALIS_PRIMITIVES.color.avatarSage,
    avatarPlum: VALIS_PRIMITIVES.color.avatarPlum,
    avatarSteel: VALIS_PRIMITIVES.color.avatarSteel,
    brandZoom: VALIS_PRIMITIVES.color.brandZoom,
    brandMeet: VALIS_PRIMITIVES.color.brandMeet,
    brandTeams: VALIS_PRIMITIVES.color.brandTeams,
  },
  typography: VALIS_COMPONENT_TOKENS.typography,
  geometry: {
    sidebarWidth: VALIS_COMPONENT_TOKENS.layout.sidebarWidth,
    appWorkspaceMaxWidth: VALIS_COMPONENT_TOKENS.layout.appWorkspaceMaxWidth,
    adminWorkspaceMaxWidth: VALIS_COMPONENT_TOKENS.layout.adminWorkspaceMaxWidth,
    drawerWidth: VALIS_COMPONENT_TOKENS.layout.drawerWidth,
    contextDrawerWidth: VALIS_COMPONENT_TOKENS.layout.drawerWidth,
    panelRadius: VALIS_COMPONENT_TOKENS.radius.panel,
    cardRadius: VALIS_COMPONENT_TOKENS.radius.card,
    controlRadius: VALIS_COMPONENT_TOKENS.radius.control,
    buttonRadius: VALIS_COMPONENT_TOKENS.radius.button,
    checkboxRadius: VALIS_COMPONENT_TOKENS.radius.checkbox,
    pillRadius: VALIS_COMPONENT_TOKENS.radius.pill,
  },
  motion: VALIS_PRIMITIVES.motion,
} as const;

export type ValisTokens = typeof VALIS_TOKENS;

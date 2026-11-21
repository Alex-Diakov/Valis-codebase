/**
 * Central Semantic Design Tokens for Valis
 * Strictly warm-paper editorial palette + dark obsidian security surface.
 * Synchronized 1:1 with CSS custom properties (--valis-*) and @theme tokens in src/index.css.
 *
 * Architectural Rule (VALIS-RULE-05):
 * UI components (.tsx) must NEVER use raw hex literals (#XXXXXX).
 * Always use semantic Tailwind token classes (e.g., bg-valis-bg, text-valis-text, border-valis-sidebarborder)
 * or import VALIS_TOKENS for programmatic SVG/canvas props.
 */

export const VALIS_TOKENS = {
  colors: {
    // 1. Surfaces & Chrome
    pageBg: '#FAF8F3',
    canvasBg: '#FFFFFF',
    sidebarBg: '#F6F3EB',
    sidebarHoverBg: '#EDE9DF',
    activeNavBg: '#E6E1D6',
    chromeBg: '#F2EDE4',
    tagBg: '#E8E4DC',
    privateBannerBg: '#F5EFE4',

    // 2. Borders, Hairlines & Dividers
    sidebarBorder: '#EAE5D9',
    rowDivider: '#EFECE4',
    chromeBorder: '#E3DDD1',
    controlBorder: '#DCD7CD',
    controlBorderHover: '#B8B2A6',
    privateBannerBorder: '#E5DEC9',
    underlineRule: '#C8C3B8',
    trafficDots: '#D8D2C5',
    sectionDash: '#9E998E',

    // 3. Typography & Ink Hierarchy (WCAG AA Checked)
    textPrimary: '#1A1917',
    textPrimaryHover: '#33312E',
    textSecondary: '#4A4742',
    textNavInactive: '#5C5852',
    textMuted: '#6E6A63',
    textCompleted: '#78736A',
    textSubtle: '#8A857C',
    privateBannerText: '#6E5634',

    // 4. Semantic Status & Editorial Accents
    liveGreen: '#1E7E45',
    liveGreenBannerBg: '#E6F2EA',
    liveGreenBannerBorder: '#CFE5D6',
    liveGreenRing: '#B8DFC6',
    earlyAccessOrange: '#C87A28',
    earlyAccessBadgeBg: '#F3E5D8',
    earlyAccessBadgeText: '#9E4718',
    deltaAmberBg: '#FDF3E7',
    deltaAmberBorder: '#EAD2B5',
    deltaAmberText: '#8F561A',
    ochreBar: '#B56B27',
    linkBlue: '#1D63B8',
    linkBlueUnderline: '#98B9E2',

    // 5. Obsidian Dark Security Surface (AiSecurityView)
    securityDarkBg: '#0D0E12',
    securityDarkSurface: '#13151C',
    securityDarkElevated: '#1C1F2A',
    securityDarkElevatedHover: '#282C3B',
    securityDarkBorder: '#22242C',
    securityDarkBorderActive: '#383C4E',
    securityDarkText: '#C9CDD8',
    securityDarkMuted: '#8E93A4',
    securityDarkSubtle: '#565A68',
    securityDarkGreen: '#28A75B',
    securityDarkAmber: '#D9822B',
    securityDarkLink: '#6CA2EA',

    // 6. Avatar Palette & External Provider Glyphs
    avatarSlate: '#5B6B82',
    avatarBronze: '#8C6239',
    avatarSage: '#4E7A5B',
    avatarPlum: '#7B4B6A',
    avatarSteel: '#386890',
    brandZoom: '#2D8CFF',
    brandMeet: '#00897B',
    brandTeams: '#5C6BC0',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    trackingTight: '-0.015em',
    headingTracking: '-0.02em',
    scale: {
      pageHeading: '22px',
      subviewHeading: '20px',
      sectionHeading: '14px',
      bodyPrimary: '14px',
      metadata: '12.5px',
      badge: '11px',
      microCap: '10px',
    },
  },
  geometry: {
    sidebarWidth: '230px',
    appWorkspaceMaxWidth: '1020px',
    adminWorkspaceMaxWidth: '1100px',
    contextDrawerWidth: '340px',
    panelRadius: '10px',
    cardRadius: '8px',
    controlRadius: '6px',
    checkboxRadius: '4px',
  },
} as const;

export type ValisTokens = typeof VALIS_TOKENS;

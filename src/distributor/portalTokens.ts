/**
 * BeiterOS Distributor Portal — Shared Design Tokens
 * Single source of truth for typography, spacing, and sizing.
 * Accessibility target: WCAG AA (4.5:1 contrast for normal text)
 */

// ── Font sizes (px) ──────────────────────────────────────────────────────────
export const FS = {
  micro:    11,   // timestamps, badge text, very secondary info
  xs:       12,   // tertiary labels, small chips
  sm:       13,   // secondary body, table secondary
  base:     14,   // primary body text, table cells, input text
  md:       15,   // card sub-headers, list titles
  lg:       17,   // card headers, section titles
  xl:       20,   // sub-page titles, chart values
  '2xl':    24,   // page sub-titles
  '3xl':    28,   // page titles, hero numbers
  '4xl':    36,   // major KPI values
} as const;

// ── Font weights ─────────────────────────────────────────────────────────────
export const FW = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
  extrabold:800,
  black:    900,
} as const;

// ── Spacing / sizing (px) ────────────────────────────────────────────────────
export const SZ = {
  // Touch targets (minimum 40px for accessibility)
  btn_sm:   38,   // small button height
  btn_md:   44,   // medium button height
  btn_lg:   50,   // large button height

  // Icon buttons
  icon_sm:  36,   // small icon button
  icon_md:  40,   // medium icon button (e.g. header)
  icon_lg:  46,   // large icon button

  // Nav
  nav_item: 48,   // sidebar nav item height
  nav_icon: 20,   // nav icon size

  // Header
  header_h: 68,   // top header height

  // Cards
  card_p:   22,   // card padding
  card_r:   18,   // card border-radius

  // Tables
  th_py:    12,   // table header vertical padding
  th_px:    18,   // table header horizontal padding
  td_py:    14,   // table row vertical padding
  td_px:    18,   // table row horizontal padding

  // Badges / pills
  badge_py:  4,
  badge_px: 12,
  badge_r:  99,

  // Avatar / logo
  avatar_sm: 36,
  avatar_md: 42,
  avatar_lg: 54,

  // Page
  page_p:   32,   // page content padding
} as const;

// ── Letter spacing ────────────────────────────────────────────────────────────
export const LS = {
  tight: '-0.03em',
  normal: '0',
  wide: '0.04em',
  wider: '0.08em',
} as const;

// ── Brand colours ─────────────────────────────────────────────────────────────
export const COLOR = {
  red:     '#E31E24',
  redDark: '#C8161C',
  green:   '#34C759',
  orange:  '#FF9500',
  blue:    '#007AFF',
  indigo:  '#6366F1',
  purple:  '#A855F7',
  muted:   '#8E8E93',
} as const;

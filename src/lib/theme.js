// Brand theming — applied ONLY when a single negocio is selected.
// Rules:
//   accent   → bar fills, area strokes, progress bar backgrounds, active button backgrounds.
//   NEVER use accent for text or thin decorative borders (yellow is illegible on white).
//   Text always stays dark (#111 / #333) regardless of theme.

export const NEGOCIO_THEMES = {
  'Trampoline Park': {
    accent: '#ffeb00',
    textOnAccent: '#111',   // dark text on yellow button
    // 7-shade palette from vivid yellow to dark gold — replaces CHART_COLORS for fills
    palette: ['#ffeb00', '#ffd000', '#e6b800', '#c49800', '#9a7600', '#6e5300', '#443200'],
  },
  'Cerogrado': {
    accent: '#00acc9',
    textOnAccent: '#fff',   // white text on teal button
    // 7-shade palette from bright teal to deep navy — replaces CHART_COLORS for fills
    palette: ['#00acc9', '#0094ae', '#007a91', '#006075', '#004858', '#002b54', '#1a3d6e'],
  },
};

/**
 * Returns the theme object for the given negocio, or null when 'todos' / unknown.
 * Components should call: const colors = theme?.palette ?? CHART_COLORS
 * and: const primary = theme?.accent ?? '#002b54'
 */
export function getTheme(negocio) {
  if (!negocio || negocio === 'todos') return null;
  return NEGOCIO_THEMES[negocio] ?? null;
}

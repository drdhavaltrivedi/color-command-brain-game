// src/constants/theme.js

export const CC_PALETTE = {
  RED:    '#EF4444',
  BLUE:   '#3B82F6',
  GREEN:  '#22C55E',
  YELLOW: '#EAB308',
  PURPLE: '#A855F7',
  ORANGE: '#F97316',
};

export const CC_THEME = {
  background: '#0F172A',
  backgroundDark: '#0a1224',
  text: '#FFFFFF',
  textDim: 'rgba(255,255,255,0.55)',
  textDimmer: 'rgba(255,255,255,0.32)',
  line: 'rgba(255,255,255,0.08)',
  card: 'rgba(255,255,255,0.04)',
};

export const alpha = (hex, a) => {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export const shade = (hex, amt) => {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 0xff) + amt, b = (n & 0xff) + amt;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
};

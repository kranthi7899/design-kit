// Lane B: sRGB colour parsing + WCAG 2.2 contrast. Pure, no I/O.
import { HarnessError, ERR } from './contracts-types.mjs';

const unsupported = (v, why) => new HarnessError(ERR.E_COLOR_UNSUPPORTED,
  `unsupported colour ${typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v)}: ${why}`);

/** '#rgb'|'#rgba'|'#rrggbb'|'#rrggbbaa' | DTCG {colorSpace:'srgb', components, alpha?, hex?} -> {r,g,b,a} in 0..1 */
export function parseColor(v) {
  if (typeof v === 'string') {
    const m = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(v.trim());
    if (!m) throw unsupported(v, 'only hex colours are supported in Phase 1');
    let h = m[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
  }
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    if (v.colorSpace !== 'srgb') throw unsupported(v, `colorSpace ${JSON.stringify(v.colorSpace)} is not srgb`);
    const c = v.components;
    if (!Array.isArray(c) || c.length !== 3 || c.some((x) => typeof x !== 'number' || !(x >= 0 && x <= 1))) {
      throw unsupported(v, 'components must be 3 numbers in 0..1');
    }
    const a = v.alpha === undefined ? 1 : v.alpha;
    if (typeof a !== 'number' || !(a >= 0 && a <= 1)) throw unsupported(v, 'alpha must be a number in 0..1');
    return { r: c[0], g: c[1], b: c[2], a };
  }
  throw unsupported(v, 'not a hex string or DTCG colour object');
}

const lin = (ch) => (ch <= 0.04045 ? ch / 12.92 : ((ch + 0.055) / 1.055) ** 2.4);

export function relativeLuminance(c) {
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
}

/** Alpha-composite fg onto an opaque bg; result is opaque. */
export function compositeOver(fg, bg) {
  const a = fg.a;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}

/** Unrounded WCAG ratio. Translucent fg is composited first; translucent bg throws. */
export function contrastRatio(fg, bg) {
  if (bg.a < 1) throw new HarnessError(ERR.E_COLOR_TRANSLUCENT_BG, 'background colour must be opaque to compute contrast');
  const f = fg.a < 1 ? compositeOver(fg, bg) : fg;
  const l1 = relativeLuminance(f);
  const l2 = relativeLuminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function toHex(c) {
  const h = (x) => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, '0');
  return '#' + h(c.r) + h(c.g) + h(c.b) + (c.a < 1 ? h(c.a) : '');
}

// converts "#rrggbb" (or "rgb") to [r, g, b] 0–255
const hexToRgb = (hex: string): [number, number, number] | null => {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

// WCAG relative luminance
const luminance = ([r, g, b]: [number, number, number]) => {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};

// returns the contrast ratio (1–21), or null if either hex is invalid
export const contrastRatio = (fg: string, bg: string): number | null => {
  const rgbFg = hexToRgb(fg);
  const rgbBg = hexToRgb(bg);
  if (!rgbFg || !rgbBg) return null;
  const l1 = luminance(rgbFg);
  const l2 = luminance(rgbBg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

// WCAG pass/fail thresholds
export const wcagResults = (ratio: number) => ({
  aaNormal: ratio >= 4.5,
  aaLarge: ratio >= 3,
  aaaNormal: ratio >= 7,
  aaaLarge: ratio >= 4.5,
});
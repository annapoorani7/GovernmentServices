// AshokaChakra — a precise, ornamental 24-spoke Ashoka Chakra rendered as SVG.
// Spokes are generated programmatically (exact 15° spacing) so they're perfectly
// even. Includes a double outer rim, spoke-tip dots, inner ring and hub for a
// refined, "royal" look. Purely decorative → aria-hidden.

export default function AshokaChakra({ className }) {
  const SPOKES = 24;
  const cx = 100;
  const cy = 100;
  const rInner = 22;   // where spokes begin (hub ring)
  const rOuter = 84;   // where spokes end (just inside the rim)
  const rTip = 84;     // spoke-tip dot radius position

  const spokes = Array.from({ length: SPOKES }, (_, i) => {
    const angle = (i * 360) / SPOKES; // exact even spacing
    const rad = (angle * Math.PI) / 180;
    const x1 = cx + rInner * Math.cos(rad);
    const y1 = cy + rInner * Math.sin(rad);
    const x2 = cx + rOuter * Math.cos(rad);
    const y2 = cy + rOuter * Math.sin(rad);
    const tx = cx + rTip * Math.cos(rad);
    const ty = cy + rTip * Math.sin(rad);
    return { x1, y1, x2, y2, tx, ty, key: i };
  });

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      >
        {/* Double outer rim — the royal detail */}
        <circle cx={cx} cy={cy} r="92" strokeWidth="1.4" />
        <circle cx={cx} cy={cy} r="86" strokeWidth="0.7" opacity="0.7" />

        {/* 24 evenly-spaced spokes */}
        {spokes.map((s) => (
          <line key={s.key} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
        ))}

        {/* Ornamental dots at each spoke tip */}
        {spokes.map((s) => (
          <circle key={`d${s.key}`} cx={s.tx} cy={s.ty} r="1.6" fill="currentColor" stroke="none" />
        ))}

        {/* Inner hub rings */}
        <circle cx={cx} cy={cy} r="22" strokeWidth="1.1" />
        <circle cx={cx} cy={cy} r="12" strokeWidth="0.8" opacity="0.8" />
        <circle cx={cx} cy={cy} r="4.5" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

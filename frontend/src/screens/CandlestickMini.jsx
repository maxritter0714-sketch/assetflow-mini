import { fmtPrice } from "../components.jsx";

export function CandlestickMini({ candles, width = 800, height = 300, mode = "Candle" }) {
  if (!candles || candles.length === 0) return null;
  const padL = 4, padR = 60, padT = 8, padB = 22;
  const volH = height * 0.18;
  const priceH = height - padT - padB - volH - 8;
  const iW = width - padL - padR;
  const n = candles.length;

  let pMin = Infinity, pMax = -Infinity, vMax = 0;
  candles.forEach(c => { pMin = Math.min(pMin, c.l); pMax = Math.max(pMax, c.h); vMax = Math.max(vMax, c.v); });
  const pad = (pMax - pMin) * 0.06; pMin -= pad; pMax += pad;

  // Edge-to-edge layout: candle i centered at padL + (i+0.5)*step.
  // step shrinks as n grows so density looks like a real chart.
  const step = iW / n;
  // Candle body fills the step minus a hairline gap (1px) so candles touch like a real chart.
  // For very dense charts (sub-pixel), drop to a single-pixel body; never leave visible whitespace.
  const cw = step <= 2 ? Math.max(1, step) : Math.max(2, step - 1);
  const wickW = step < 2 ? 0.6 : 1;
  const xAt = i => padL + (i + 0.5) * step;
  const yAt = p => padT + (1 - (p - pMin) / (pMax - pMin)) * priceH;
  const vY = padT + priceH + 8;
  const vyAt = v => vY + (1 - v / vMax) * volH;

  // 20-period MA — single continuous path, drawn only across the segment where MA exists
  const ma = []; let sum = 0;
  candles.forEach((c, i) => { sum += c.c; if (i >= 20) sum -= candles[i-20].c; ma.push(i >= 19 ? sum/20 : null); });
  const firstMA = ma.findIndex(v => v != null);
  const maPath = firstMA < 0 ? "" : ma.slice(firstMA).map((v, k) => (k === 0 ? "M" : "L") + xAt(firstMA + k) + " " + yAt(v)).join(" ");

  // Line / area path on close
  const closePath = candles.map((c, i) => (i === 0 ? "M" : "L") + xAt(i) + " " + yAt(c.c)).join(" ");
  const areaPath = closePath + ` L ${xAt(n-1)} ${padT + priceH} L ${xAt(0)} ${padT + priceH} Z`;

  // Time-axis tick formatting based on the actual span of the data, not the tf label.
  // Works for both candle (per-candle interval) and line (visible window) modes.
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const spanMs = candles[n - 1].t - candles[0].t;
  const fmtTick = (t) => {
    const d = new Date(t);
    if (spanMs <= 2 * 86400000)            // ≤ 2 days → HH:MM
      return d.getHours().toString().padStart(2,"0") + ":" + d.getMinutes().toString().padStart(2,"0");
    if (spanMs <= 60 * 86400000)            // ≤ 60 days → "Apr 21"
      return months[d.getMonth()] + " " + d.getDate();
    if (spanMs <= 3 * 365 * 86400000)       // ≤ 3 years → "Apr '24"
      return months[d.getMonth()] + " '" + (d.getFullYear() % 100);
    return d.getFullYear().toString();      // multi-year → "2018"
  };
  // Pick ~6 evenly-spaced ticks
  const tickCount = 6;
  const tickIdx = Array.from({length: tickCount}, (_, i) => Math.round((i / (tickCount - 1)) * (n - 1)));

  const lastClose = candles[n-1].c;
  const lastUp = lastClose >= candles[n-1].o;
  const accent = "#10b981";

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* horizontal grid + price axis labels — aligned to round "nice" prices */}
      {(() => {
        const range = pMax - pMin;
        const target = range / 5;
        const mag = Math.pow(10, Math.floor(Math.log10(target)));
        const norm = target / mag;
        const niceStep = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
        const first = Math.ceil(pMin / niceStep) * niceStep;
        const ticks = [];
        for (let p = first; p <= pMax; p += niceStep) ticks.push(p);
        return ticks.map((p, k) => (
          <g key={k}>
            <line x1={padL} y1={yAt(p)} x2={width - padR} y2={yAt(p)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={width - padR + 6} y={yAt(p) + 3} fill="#475569" fontSize="9" fontFamily="JetBrains Mono">{fmtPrice(p)}</text>
          </g>
        ));
      })()}

      {/* volume bars */}
      {candles.map((c, i) => {
        const up = c.c >= c.o;
        return <rect key={"v"+i} x={xAt(i) - cw/2} y={vyAt(c.v)} width={cw} height={vY + volH - vyAt(c.v)} fill={up ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)"} />;
      })}

      {/* main series */}
      {mode === "Candle" && candles.map((c, i) => {
        const up = c.c >= c.o; const color = up ? "#10b981" : "#ef4444";
        const top = yAt(Math.max(c.o, c.c)); const bot = yAt(Math.min(c.o, c.c));
        return (
          <g key={i}>
            <line x1={xAt(i)} y1={yAt(c.h)} x2={xAt(i)} y2={yAt(c.l)} stroke={color} strokeWidth={wickW} />
            <rect x={xAt(i) - cw/2} y={top} width={cw} height={Math.max(1, bot - top)} fill={color} />
          </g>
        );
      })}
      {mode === "Line" && (
        <path d={closePath} fill="none" stroke={accent} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      )}
      {mode === "Area" && (
        <g>
          <path d={areaPath} fill="url(#areaGrad)" stroke="none" />
          <path d={closePath} fill="none" stroke={accent} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      )}

      {/* MA20 (Candle mode, when enough bars) */}
      {mode === "Candle" && n >= 25 && (
        <path d={maPath} fill="none" stroke="#a78bfa" strokeWidth="1.2" opacity="0.65" />
      )}

      {/* time axis */}
      {tickIdx.map(i => (
        <text key={i} x={xAt(i)} y={height - 6} textAnchor="middle" fill="#475569" fontSize="9" fontFamily="JetBrains Mono">{fmtTick(candles[i].t)}</text>
      ))}

      {/* current price tag — slim, axis-aligned */}
      <line x1={padL} y1={yAt(lastClose)} x2={width - padR} y2={yAt(lastClose)} stroke={lastUp ? "#10b981" : "#ef4444"} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.55" />
      <rect x={width - padR + 2} y={yAt(lastClose) - 6} width={46} height={12} rx="2" fill={lastUp ? "#10b981" : "#ef4444"} />
      <text x={width - padR + 6} y={yAt(lastClose) + 3} fill="#fff" fontSize="9" fontWeight="600" fontFamily="JetBrains Mono">{fmtPrice(lastClose)}</text>
    </svg>
  );
}

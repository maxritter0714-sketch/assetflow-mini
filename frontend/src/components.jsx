// Shared UI components for AssetFlow MINI v2
import { cardStyles } from "./styles.js";

// --- Sidebar ---
export function Sidebar({ screen, setScreen }) {
  const nav = [
    { key: "dashboard", label: "Dashboard", icon: "grid" },
    { key: "portfolio", label: "Portfolios", icon: "briefcase" },
    { key: "watchlist", label: "Watchlist", icon: "eye" },
    { key: "screener", label: "Screener", icon: "search" },
    { key: "transactions", label: "Transactions", icon: "list" },
    { key: "settings", label: "Settings", icon: "gear" },
  ];

  const iconMap = {
    grid: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>,
    briefcase: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="6" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 6V4a2 2 0 012-2h2a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5"/></svg>,
    eye: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>,
    search: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5"/><line x1="12" y1="12" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    list: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><line x1="6" y1="4" x2="15" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="3" cy="4" r="1" fill="currentColor"/><circle cx="3" cy="9" r="1" fill="currentColor"/><circle cx="3" cy="14" r="1" fill="currentColor"/></svg>,
    gear: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M14.3 3.7l-1.4 1.4M5.1 12.9l-1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  };

  return (
    <div style={sidebarStyles.wrap}>
      <div style={sidebarStyles.logo}>
        <div style={sidebarStyles.logoMark}>AF</div>
        <div style={sidebarStyles.logoText}>
          <span style={sidebarStyles.logoName}>AssetFlow</span>
          <span style={sidebarStyles.logoBadge}>MINI</span>
        </div>
      </div>
      <nav style={sidebarStyles.nav}>
        {nav.map(n => {
          const active = screen === n.key || (n.key === "portfolio" && screen === "portfolio-detail") || (n.key === "watchlist" && screen === "ticker-detail");
          return (
            <button key={n.key} onClick={() => setScreen(n.key)} style={{
              ...sidebarStyles.navItem,
              ...(active ? sidebarStyles.navItemActive : {}),
            }}>
              <span style={{ opacity: active ? 1 : 0.5 }}>{iconMap[n.icon]}</span>
              <span>{n.label}</span>
            </button>
          );
        })}
      </nav>
      <div style={sidebarStyles.footer}>
        <div style={sidebarStyles.avatar}>JD</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={sidebarStyles.footerName}>John Doe</div>
          <div style={sidebarStyles.footerEmail}>john@example.com</div>
        </div>
      </div>
    </div>
  );
}

const sidebarStyles = {
  wrap: { width: 244, background: "linear-gradient(180deg, #0b1220 0%, #0a0f1c 100%)", display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0, color: "#e2e8f0", borderRight: "1px solid rgba(255,255,255,0.04)" },
  logo: { display: "flex", alignItems: "center", gap: 11, padding: "22px 22px 28px" },
  logoMark: { width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, color: "#0a0f1c", letterSpacing: "-0.02em", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 12px rgba(16,185,129,0.25)" },
  logoText: { display: "flex", alignItems: "baseline", gap: 6 },
  logoName: { fontWeight: 700, fontSize: 17, letterSpacing: "-0.035em", color: "#f1f5f9" },
  logoBadge: { fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "rgba(16,185,129,0.18)", color: "#34d399", letterSpacing: "0.08em" },
  nav: { display: "flex", flexDirection: "column", gap: 2, padding: "0 12px", flex: 1 },
  navItem: { display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 9, border: "none", background: "transparent", color: "#8a96aa", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s", letterSpacing: "-0.005em", position: "relative" },
  navItemActive: { background: "rgba(255,255,255,0.06)", color: "#f1f5f9", boxShadow: "inset 2px 0 0 #10b981" },
  footer: { display: "flex", alignItems: "center", gap: 11, padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" },
  avatar: { width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(16,185,129,0.4))", display: "grid", placeItems: "center", fontSize: 11.5, fontWeight: 700, color: "#f1f5f9" },
  footerName: { fontSize: 12.5, fontWeight: 600, color: "#e2e8f0" },
  footerEmail: { fontSize: 11, color: "#64748b" },
};

// --- KPI Card ---
export function KpiCard({ label, value, sub, positive, accent }) {
  const subColor = positive === true ? "var(--success)" : positive === false ? "var(--danger)" : "var(--muted)";
  const subBg = positive === true ? "var(--success-bg)" : positive === false ? "var(--danger-bg)" : "transparent";
  return (
    <div style={kpiStyles.card}>
      {accent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accent }}></div>}
      <div style={kpiStyles.label}>{label}</div>
      <div style={kpiStyles.value}>{value}</div>
      {sub != null && (
        <div style={{ ...kpiStyles.sub, color: subColor }}>
          {positive === true && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 6L5 3L8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          {positive === false && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          <span style={{ padding: subBg !== "transparent" ? "1px 6px" : 0, background: subBg, borderRadius: 4 }}>{sub}</span>
        </div>
      )}
    </div>
  );
}
const kpiStyles = {
  card: { background: "var(--card)", borderRadius: 14, padding: "18px 22px", border: "1px solid var(--border)", flex: 1, minWidth: 0, boxShadow: "var(--shadow-sm)", position: "relative", overflow: "hidden" },
  label: { fontSize: 12, color: "var(--muted)", fontWeight: 500, marginBottom: 8, letterSpacing: "0.005em" },
  value: { fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1 },
  sub: { fontSize: 12, fontWeight: 600, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4 },
};

// --- Mini Sparkline SVG ---
export function MiniSparkline({ data, width = 64, height = 24, color }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const r = max - min || 1;
  const isUp = data[data.length - 1] >= data[0];
  const c = color || (isUp ? "var(--success)" : "var(--danger)");
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - 2 - ((v - min) / r) * (height - 4);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={pts} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// --- Donut Chart ---
export function DonutChart({ data, size = 180 }) {
  const total = data.reduce((s, d) => s + d.pct, 0);
  const cx = size / 2, cy = size / 2, r = size * 0.38, sw = size * 0.14;
  const arcs = data.map((d, i) => {
    const cumAngle = -90 + data.slice(0, i).reduce((s, item) => s + (item.pct / total) * 360, 0);
    const angle = (d.pct / total) * 360;
    const startRad = (cumAngle * Math.PI) / 180;
    const endRad = ((cumAngle + angle) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const large = angle > 180 ? 1 : 0;
    return { ...d, path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}` };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((a, i) => (
          <path key={i} d={a.path} fill="none" stroke={a.color} strokeWidth={sw} strokeLinecap="butt" />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text)" fontSize="18" fontWeight="700" fontFamily="DM Sans">$786.9K</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--muted)" fontSize="11">Total Value</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }}></div>
            <span style={{ color: "var(--text-soft)", fontWeight: 500, minWidth: 80 }}>{d.label}</span>
            <span style={{ color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5 }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Performance Line Chart ---
export function PerfLineChart({ data, width = 500, height = 200, color = "var(--success)" }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data) * 0.98;
  const max = Math.max(...data) * 1.02;
  const r = max - min || 1;
  const padL = 0, padR = 0, padT = 4, padB = 4;
  const iW = width - padL - padR, iH = height - padT - padB;
  const pts = data.map((v, i) => {
    const x = padL + (i / (data.length - 1)) * iW;
    const y = padT + (1 - (v - min) / r) * iH;
    return `${x},${y}`;
  }).join(" ");
  const areaD = `M ${padL},${padT + iH} ` + data.map((v, i) => {
    const x = padL + (i / (data.length - 1)) * iW;
    const y = padT + (1 - (v - min) / r) * iH;
    return `L ${x},${y}`;
  }).join(" ") + ` L ${padL + iW},${padT + iH} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#perfGrad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// --- Badge ---
export function Badge({ children, variant = "default", dot }) {
  const colors = {
    default: { bg: "var(--neutral-bg)", color: "var(--neutral-text)" },
    green: { bg: "var(--success-bg)", color: "var(--success)" },
    red: { bg: "var(--danger-bg)", color: "var(--danger)" },
    blue: { bg: "var(--blue-bg)", color: "var(--blue)" },
    amber: { bg: "var(--amber-bg)", color: "var(--amber)" },
    purple: { bg: "var(--purple-bg)", color: "var(--purple)" },
  };
  const c = colors[variant] || colors.default;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 9px", borderRadius: 6, fontSize: 11.5, fontWeight: 600, background: c.bg, color: c.color, whiteSpace: "nowrap", letterSpacing: "-0.005em" }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color }}></span>}
      {children}
    </span>
  );
}

// --- Formatting ---
export function fmtMoney(n) {
  if (n == null) return "—";
  const v = Object.is(n, -0) || (n < 0 && n > -0.5) ? 0 : n; // avoid "$-0"
  return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
export function fmtPrice(n) {
  const num = Number(n);
  const v = Object.is(num, -0) || (num < 0 && num > -0.005) ? 0 : num; // avoid "$-0.00"
  return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function fmtPct(n) { return (n >= 0 ? "+" : "") + n.toFixed(2) + "%"; }
export function fmtNum(n, d = 2) { return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }

// --- v3: AI Summary Card ---
export function AiSummaryCard({ summary, compact }) {
  const toneColor = (t) => t === "good" ? "var(--success)" : t === "risk" ? "var(--danger)" : t === "watch" ? "var(--amber)" : "var(--blue)";
  return (
    <div style={{ ...cardStyles.base, padding: 0, overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#10b981,#06b6d4,#6366f1)" }}></div>
      <div style={{ padding: "18px 22px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#10b981,#06b6d4)", display: "grid", placeItems: "center", color: "#0a0f1c", fontWeight: 800, fontSize: 11, letterSpacing: "-0.02em" }}>AI</div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>Portfolio Summary</div>
            <div style={{ fontSize: 11, color: "var(--subtle)" }}>Updated {summary.generated}</div>
          </div>
        </div>
        <Badge variant="green" dot>Live</Badge>
      </div>
      <div style={{ padding: "10px 22px 8px", fontSize: 14, fontWeight: 600, color: "var(--text-soft)", letterSpacing: "-0.01em", lineHeight: 1.45 }}>
        {summary.headline}
      </div>
      <div style={{ padding: "4px 22px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        {summary.bullets.slice(0, compact ? 3 : 4).map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12.5, color: "var(--text-soft)", lineHeight: 1.5 }}>
            <span style={{ width: 6, height: 6, marginTop: 6, borderRadius: "50%", background: toneColor(b.tone), flexShrink: 0 }}></span>
            <span>{b.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- v3: Alerts list ---
export function AlertsCard({ alerts, title = "Risk & Insights" }) {
  const palette = (l) => l === "danger" ? { bg: "var(--danger-bg)", c: "var(--danger)", icon: "!" }
                     : l === "warning" ? { bg: "var(--amber-bg)",  c: "var(--amber)",  icon: "!" }
                     : { bg: "var(--blue-bg)", c: "var(--blue)", icon: "i" };
  return (
    <div style={cardStyles.base}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={cardStyles.cardTitle}>{title}</span>
        <span style={{ fontSize: 11, color: "var(--subtle)" }}>{alerts.length} active</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {alerts.map((a, i) => {
          const p = palette(a.level);
          return (
            <div key={a.id} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: i < alerts.length - 1 ? "1px solid var(--divider)" : "none" }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: p.bg, color: p.c, fontWeight: 800, fontSize: 12, display: "grid", placeItems: "center", flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>{p.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.005em" }}>{a.title}</span>
                  <button style={{ fontSize: 11, fontWeight: 600, color: p.c, background: "none", border: "none", cursor: "pointer", padding: 0 }}>{a.cta} →</button>
                </div>
                <div style={{ fontSize: 11.8, color: "var(--muted)", marginTop: 2, lineHeight: 1.45 }}>{a.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- v3: Target vs Actual bars ---
export function TargetVsActual({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
      {data.map(d => {
        const drift = d.actual - d.target;
        const max = Math.max(...data.map(x => Math.max(x.actual, x.target)));
        const aw = (d.actual / max) * 100;
        const tw = (d.target / max) * 100;
        const driftColor = Math.abs(drift) >= 5 ? "var(--amber)" : "var(--muted)";
        return (
          <div key={d.label}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
              <span style={{ color: "var(--text-soft)", fontWeight: 500 }}>{d.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--muted)" }}>
                <span style={{ color: "var(--text)", fontWeight: 600 }}>{d.actual}%</span>
                <span style={{ color: "var(--subtle)", margin: "0 4px" }}>/</span>
                <span>{d.target}%</span>
                <span style={{ color: driftColor, marginLeft: 8, fontWeight: 600 }}>{drift > 0 ? "+" : ""}{drift}</span>
              </span>
            </div>
            <div style={{ position: "relative", height: 10, background: "var(--neutral-bg)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, width: aw + "%", background: d.color, opacity: 0.92, borderRadius: 4 }}></div>
              <div style={{ position: "absolute", top: -2, bottom: -2, left: tw + "%", width: 2, background: "var(--text)", opacity: 0.55 }}></div>
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 14, marginTop: 4, fontSize: 11, color: "var(--subtle)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 4, background: "var(--text-soft)", borderRadius: 2 }}></span>Actual</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 2, height: 10, background: "var(--text)" }}></span>Target</span>
      </div>
    </div>
  );
}

// --- v3: Mini Bar Chart (cashflow / dividend forecast) ---
export function MiniBarChart({ data, height = 90, colorKey = "amount" }) {
  const max = Math.max(...data.map(d => d[colorKey] || (d.buys || 0) + (d.divs || 0)));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, paddingTop: 4 }}>
      {data.map((d, i) => {
        const v = d[colorKey] || 0;
        const h = Math.max(2, (v / max) * (height - 18));
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", height: h, background: "linear-gradient(180deg,var(--success),rgba(16,185,129,0.45))", borderRadius: 3 }} title={`${d.month}: $${v}`}></div>
            <div style={{ fontSize: 10, color: "var(--subtle)", fontFamily: "'JetBrains Mono', monospace" }}>{d.month}</div>
          </div>
        );
      })}
    </div>
  );
}

// --- v3: Cashflow stacked bars (buys/sells/divs) ---
export function CashflowBars({ data, height = 100 }) {
  const max = Math.max(...data.map(d => d.buys + d.sells + d.divs));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height, paddingTop: 4 }}>
      {data.map((d, i) => {
        const total = d.buys + d.sells + d.divs;
        const tH = (total / max) * (height - 20);
        const bH = (d.buys / total) * tH;
        const sH = (d.sells / total) * tH;
        const vH = (d.divs / total) * tH;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", borderRadius: 3, overflow: "hidden", height: tH }}>
              <div style={{ background: "var(--success)", height: bH }}></div>
              <div style={{ background: "var(--danger)", height: sH }}></div>
              <div style={{ background: "var(--blue)", height: vH }}></div>
            </div>
            <div style={{ fontSize: 10, color: "var(--subtle)", fontFamily: "'JetBrains Mono', monospace" }}>{d.month}</div>
          </div>
        );
      })}
    </div>
  );
}

// --- v3: Score Card (radial 0-100) ---
export function ScoreRing({ value, size = 64, label, color = "var(--success)" }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--neutral-bg)" strokeWidth="5" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="5" fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: size > 80 ? 22 : 16, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
          {label && <div style={{ fontSize: 9, color: "var(--subtle)", marginTop: 1 }}>{label}</div>}
        </div>
      </div>
    </div>
  );
}

// --- v3: Stat Bar (for analyst-style scorecard) ---
export function StatBar({ label, value, max = 100, color = "var(--success)" }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
        <span style={{ color: "var(--muted)" }}>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "var(--text)" }}>{value}</span>
      </div>
      <div style={{ height: 5, background: "var(--neutral-bg)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: (value/max)*100 + "%", background: color, borderRadius: 3 }}></div>
      </div>
    </div>
  );
}

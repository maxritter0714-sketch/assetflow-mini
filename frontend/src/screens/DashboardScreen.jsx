import { ThemeToggle } from "../theme-toggle.jsx";
import { AF_DATA } from "../data.jsx";
import {
  Badge,
  DonutChart,
  KpiCard,
  MiniBarChart,
  MiniSparkline,
  TargetVsActual,
  fmtMoney,
  fmtPct,
} from "../components.jsx";
import { cardStyles, mainStyles, tableStyles } from "../styles.js";

export function DashboardScreen({ setScreen, setSelectedTicker, setTickerBackScreen, theme, setTheme }) {
  const { PORTFOLIOS, TOP_HOLDINGS, ALLOCATION_DATA, TARGET_VS_ACTUAL, DIVIDEND_FORECAST } = AF_DATA;
  const totalValue = PORTFOLIOS.reduce((s, p) => s + p.value, 0);
  const totalCost = PORTFOLIOS.reduce((s, p) => s + p.cost, 0);
  const unrealizedPL = totalValue - totalCost;
  const dailyChange = totalValue * 0.0084;
  const projDivs = DIVIDEND_FORECAST.reduce((s, d) => s + d.amount, 0);

  return (
    <div style={mainStyles.page}>
      <div style={mainStyles.header}>
        <div>
          <h1 style={mainStyles.title}>Portfolios</h1>
          <p style={mainStyles.subtitle}>Track and analyze your investment portfolios</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button style={mainStyles.btnSecondary}>Refresh Prices</button>
          <button style={mainStyles.btnPrimary}>+ New Portfolio</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
        <KpiCard label="Total Value" value={fmtMoney(totalValue)} accent="linear-gradient(90deg,#0b1220,#334155)" />
        <KpiCard label="Cost Basis" value={fmtMoney(totalCost)} accent="linear-gradient(90deg,#94a3b8,#cbd5e1)" />
        <KpiCard label="Unrealized P&L" value={"+" + fmtMoney(unrealizedPL)} sub={fmtPct((unrealizedPL/totalCost)*100)} positive={true} accent="linear-gradient(90deg,#10b981,#34d399)" />
        <KpiCard label="Daily Change" value={"+" + fmtMoney(Math.round(dailyChange))} sub="+0.84% today" positive={true} accent="linear-gradient(90deg,#06b6d4,#67e8f9)" />
        <KpiCard label="12M Dividend Forecast" value={fmtMoney(projDivs)} sub="≈ $476/mo avg" accent="linear-gradient(90deg,#6366f1,#a5b4fc)" />
      </div>

      {/* Portfolio Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 14 }}>
        {PORTFOLIOS.map(p => {
          const pl = p.value - p.cost; const plPct = (pl/p.cost)*100; const isUp = pl >= 0;
          return (
            <div key={p.id} style={cardStyles.portfolio} onClick={() => setScreen("portfolio-detail")}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: p.color, opacity: 0.9 }}></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, marginTop: 4 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3, letterSpacing: "-0.01em" }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{p.holdings} holdings</div>
                </div>
                <Badge variant="default">{p.currency}</Badge>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.025em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{fmtMoney(p.value)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: isUp ? "var(--success)" : "var(--danger)" }}>{isUp ? "+" : ""}{fmtMoney(pl)}</span>
                <Badge variant={isUp ? "green" : "red"} dot>{fmtPct(plPct)}</Badge>
              </div>
              <MiniSparkline data={p.sparkline} width={200} height={32} color={p.color} />
            </div>
          );
        })}
      </div>

      {/* Allocation row */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr 360px", gap: 14, marginBottom: 14 }}>
        <div style={cardStyles.base}>
          <div style={cardStyles.cardTitle}>Current Allocation</div>
          <DonutChart data={ALLOCATION_DATA} size={170} />
        </div>
        <div style={cardStyles.base}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={cardStyles.cardTitle}>Target vs Actual Allocation</span>
            <Badge variant="amber" dot>3 sectors drifting</Badge>
          </div>
          <TargetVsActual data={TARGET_VS_ACTUAL} />
        </div>
        <div style={cardStyles.base}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={cardStyles.cardTitle}>Dividend Forecast (12M)</span>
            <span style={{ fontSize: 11, color: "var(--subtle)" }}>{fmtMoney(projDivs)}</span>
          </div>
          <MiniBarChart data={DIVIDEND_FORECAST} height={110} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--divider)", fontSize: 11.5, color: "var(--muted)" }}>
            <span>Avg / month <strong style={{ color: "var(--text)", fontFamily: "'JetBrains Mono', monospace" }}>${Math.round(projDivs/12)}</strong></span>
            <span>Yield <strong style={{ color: "var(--text)", fontFamily: "'JetBrains Mono', monospace" }}>0.73%</strong></span>
          </div>
        </div>
      </div>

      {/* Top Holdings */}
      <div style={cardStyles.base}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={cardStyles.cardTitle}>Top Holdings</span>
          <span style={{ fontSize: 11, color: "var(--subtle)" }}>Across all portfolios</span>
        </div>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              <th style={tableStyles.th}>Ticker</th>
              <th style={tableStyles.th}>Company</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Value</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Cost Basis</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Allocation</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Daily</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Unrealized</th>
            </tr>
          </thead>
          <tbody>
            {TOP_HOLDINGS.map((h, i) => {
              const cb = Math.round(h.value / (1 + h.gainPct/100));
              const daily = (i % 2 === 0 ? 1 : -1) * (0.4 + i * 0.18);
              return (
                <tr key={h.symbol} style={{ ...tableStyles.row, cursor: "pointer" }} onClick={() => { setSelectedTicker(h.symbol); setTickerBackScreen("portfolio"); setScreen("ticker-detail"); }}>
                  <td style={{ ...tableStyles.td, fontWeight: 600, color: "var(--text)" }}>{h.symbol}</td>
                  <td style={{ ...tableStyles.td, color: "var(--muted)" }}>{h.name}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5 }}>{fmtMoney(h.value)}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "var(--muted)" }}>{fmtMoney(cb)}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5 }}>{h.allocation}%</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontWeight: 600, color: daily >= 0 ? "var(--success)" : "var(--danger)" }}>{fmtPct(daily)}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontWeight: 600, color: h.gainPct >= 0 ? "var(--success)" : "var(--danger)" }}>{fmtPct(h.gainPct)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ========== 2. PORTFOLIO DETAIL ==========

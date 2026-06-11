import { ThemeToggle } from "../theme-toggle.jsx";
import { AF_DATA } from "../data.jsx";
import {
  AiSummaryCard,
  Badge,
  KpiCard,
  PerfLineChart,
  fmtMoney,
  fmtPct,
  fmtPrice,
} from "../components.jsx";
import { cardStyles, mainStyles, tableStyles } from "../styles.js";
import { linkBtn } from "./screenShared.js";

export function PortfolioDetailScreen({ setScreen, setSelectedTicker, setTickerBackScreen, theme, setTheme }) {
  const { TECH_HOLDINGS, TECH_TRANSACTIONS } = AF_DATA;
  const totalValue = TECH_HOLDINGS.reduce((s, h) => s + h.shares * h.currentPrice, 0);
  const totalCost = TECH_HOLDINGS.reduce((s, h) => s + h.shares * h.avgPrice, 0);
  const pl = totalValue - totalCost;
  const perfData = AF_DATA.PORTFOLIOS[1].perfLine;

  const sectors = {};
  TECH_HOLDINGS.forEach(h => { const v = h.shares * h.currentPrice; sectors[h.sector] = (sectors[h.sector] || 0) + v; });
  const sectorData = Object.entries(sectors).map(([k, v]) => ({ label: k, pct: Math.round((v / totalValue) * 100) }));
  const sectorColors = ["#6366f1", "#10b981", "#06b6d4", "#f59e0b", "#ef4444"];

  // local AI for this portfolio
  const localAI = {
    generated: "Apr 30, 2026 · 9:42 AM",
    headline: "Tech Growth: strong momentum, NVDA concentration is the chief risk",
    bullets: [
      { tone: "good",  text: "All 8 names are positive on cost basis. Median holding period 14 months." },
      { tone: "watch", text: "NVDA + ASML combined = 38% of book — semis exposure is heavy." },
      { tone: "good",  text: "Salesforce trim on Apr 25 locked in +8% gain; cash redeployed into NVDA." },
    ],
  };

  return (
    <div style={mainStyles.page}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <button onClick={() => setScreen("portfolio")} style={{ ...mainStyles.btnSecondary, padding: "6px 10px" }}>←</button>
        <div style={{ flex: 1 }}>
          <h1 style={mainStyles.title}>Tech Growth</h1>
          <p style={mainStyles.subtitle}>8 holdings · USD · Created Jan 2024</p>
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
        <KpiCard label="Total Value" value={fmtMoney(Math.round(totalValue))} />
        <KpiCard label="Cost Basis" value={fmtMoney(Math.round(totalCost))} />
        <KpiCard label="Unrealized P&L" value={"+" + fmtMoney(Math.round(pl))} sub={fmtPct((pl/totalCost)*100)} positive={true} />
        <KpiCard label="Realized YTD" value="+$1,842" sub="from CRM, AMZN, INTC" positive={true} />
        <KpiCard label="Est. Annual Dividends" value="$842" sub="0.34% yield" />
      </div>

      {/* Performance chart */}
      <div style={{ ...cardStyles.base, marginBottom: 14, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={cardStyles.cardTitle}>Performance</div>
            <div style={{ fontSize: 11, color: "var(--subtle)", marginTop: -10 }}>vs. cost basis · derived from transactions</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["1M","3M","6M","1Y","All"].map(t => (
              <button key={t} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: t === "1Y" ? "var(--text)" : "transparent", color: t === "1Y" ? "var(--card)" : "var(--muted)", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: "12px 20px 16px" }}>
          <PerfLineChart data={perfData} width={800} height={180} color="#6366f1" />
        </div>
      </div>

      {/* Holdings + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 14, marginBottom: 14 }}>
        <div style={cardStyles.base}>
          <div style={cardStyles.cardTitle}>Holdings</div>
          <table style={tableStyles.table}>
            <thead>
              <tr>
                <th style={tableStyles.th}>Ticker</th>
                <th style={tableStyles.th}>Company</th>
                <th style={{ ...tableStyles.th, textAlign: "right" }}>Shares</th>
                <th style={{ ...tableStyles.th, textAlign: "right" }}>Avg</th>
                <th style={{ ...tableStyles.th, textAlign: "right" }}>Current</th>
                <th style={{ ...tableStyles.th, textAlign: "right" }}>Mkt Value</th>
                <th style={{ ...tableStyles.th, textAlign: "right" }}>Daily</th>
                <th style={{ ...tableStyles.th, textAlign: "right" }}>Unrealized</th>
                <th style={{ ...tableStyles.th, textAlign: "right" }}>Alloc.</th>
              </tr>
            </thead>
            <tbody>
              {TECH_HOLDINGS.map((h, i) => {
                const mv = h.shares * h.currentPrice;
                const glPct = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
                const daily = (i % 2 === 0 ? 1 : -1) * (0.3 + i * 0.21);
                return (
                  <tr key={h.symbol} style={{ ...tableStyles.row, cursor: "pointer" }} onClick={() => { setSelectedTicker(h.symbol); setTickerBackScreen("portfolio-detail"); setScreen("ticker-detail"); }}>
                    <td style={{ ...tableStyles.td, fontWeight: 600, color: "var(--text)" }}>{h.symbol}</td>
                    <td style={{ ...tableStyles.td, color: "var(--muted)", fontSize: 12 }}>{h.name}</td>
                    <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{h.shares}</td>
                    <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: "var(--muted)" }}>{fmtPrice(h.avgPrice)}</td>
                    <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmtPrice(h.currentPrice)}</td>
                    <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(Math.round(mv))}</td>
                    <td style={{ ...tableStyles.td, textAlign: "right", fontWeight: 600, color: daily >= 0 ? "var(--success)" : "var(--danger)" }}>{fmtPct(daily)}</td>
                    <td style={{ ...tableStyles.td, textAlign: "right", fontWeight: 600, color: glPct >= 0 ? "var(--success)" : "var(--danger)" }}>{fmtPct(glPct)}</td>
                    <td style={{ ...tableStyles.td, textAlign: "right", color: "var(--muted)" }}>{((mv/totalValue)*100).toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <AiSummaryCard summary={localAI} compact />
          <div style={cardStyles.base}>
            <div style={cardStyles.cardTitle}>Allocation by Sector</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              {sectorData.map((s, i) => (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                    <span style={{ color: "var(--text-soft)", fontWeight: 500 }}>{s.label}</span>
                    <span style={{ color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: "var(--neutral-bg)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: s.pct + "%", background: sectorColors[i % sectorColors.length], borderRadius: 3 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={cardStyles.base}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={cardStyles.cardTitle}>Recent Transactions</span>
              <button style={linkBtn}>+ Add</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {TECH_TRANSACTIONS.slice(0, 4).map((tx, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--divider)" : "none" }}>
                  <Badge variant={tx.type === "Buy" ? "green" : tx.type === "Sell" ? "red" : "blue"}>{tx.type}</Badge>
                  <span style={{ fontWeight: 600, fontSize: 12.5, color: "var(--text)" }}>{tx.symbol}</span>
                  <span style={{ fontSize: 11.5, color: "var(--subtle)", flex: 1 }}>{tx.shares} @ {fmtPrice(tx.price)}</span>
                  <span style={{ fontSize: 11, color: "var(--subtle)", fontFamily: "'JetBrains Mono', monospace" }}>{tx.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

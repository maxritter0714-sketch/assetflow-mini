import { ThemeToggle } from "../theme-toggle.jsx";
import { AF_DATA } from "../data.jsx";
import {
  AiSummaryCard,
  AlertsCard,
  Badge,
  KpiCard,
  MiniSparkline,
  fmtMoney,
  fmtPct,
  fmtPrice,
} from "../components.jsx";
import { cardStyles, mainStyles } from "../styles.js";
import { linkBtn } from "./screenShared.js";

export function HomeScreen({ setScreen, theme, setTheme }) {
  const D = AF_DATA;
  const { PORTFOLIOS, INDICES, ALL_TRANSACTIONS, AI_PORTFOLIO_SUMMARY, RISK_ALERTS, TODAY_CONTRIBUTORS, PRICE_LEVELS } = D;
  const totalValue = PORTFOLIOS.reduce((s, p) => s + p.value, 0);
  const totalCost  = PORTFOLIOS.reduce((s, p) => s + p.cost, 0);
  const unrealizedPL = totalValue - totalCost;
  const dailyChange = totalValue * 0.0084;
  const recentTx = ALL_TRANSACTIONS.slice(0, 5);
  const ytdDivs = 4218;
  const cash = 12480;

  return (
    <div style={mainStyles.page}>
      <div style={mainStyles.header}>
        <div>
          <h1 style={{ ...mainStyles.title, fontSize: 24 }}>Good morning, John</h1>
          <p style={mainStyles.subtitle}>Markets opened 22 minutes ago · Portfolio updated 9:42 AM</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button style={mainStyles.btnSecondary}>Refresh Prices</button>
          <button style={mainStyles.btnPrimary} onClick={() => setScreen("portfolio")}>View Portfolios</button>
        </div>
      </div>

      {/* KPI Row — 6 cards: total, P&L, today, dividends, cash, portfolios */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 18 }}>
        <KpiCard label="Total Value" value={fmtMoney(totalValue)} accent="linear-gradient(90deg,#0b1220,#334155)" />
        <KpiCard label="Unrealized P&L" value={"+" + fmtMoney(unrealizedPL)} sub={fmtPct((unrealizedPL/totalCost)*100)} positive={true} accent="linear-gradient(90deg,#10b981,#34d399)" />
        <KpiCard label="Today" value={"+" + fmtMoney(Math.round(dailyChange))} sub="+0.84%" positive={true} accent="linear-gradient(90deg,#06b6d4,#67e8f9)" />
        <KpiCard label="Dividends YTD" value={fmtMoney(ytdDivs)} sub="12 payments" accent="linear-gradient(90deg,#6366f1,#a5b4fc)" />
        <KpiCard label="Cash" value={fmtMoney(cash)} sub="1.6% of portfolio" accent="linear-gradient(90deg,#f59e0b,#fcd34d)" />
        <KpiCard label="Portfolios" value={PORTFOLIOS.length.toString()} sub={PORTFOLIOS.reduce((s, p) => s + p.holdings, 0) + " holdings"} accent="linear-gradient(90deg,#a855f7,#c084fc)" />
      </div>

      {/* Market strip */}
      <div style={{ ...cardStyles.base, marginBottom: 16, padding: "14px 22px", display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingRight: 24, borderRight: "1px solid var(--border)" }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--subtle)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Markets</span>
          <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 600 }}>● Open · 1m delay</span>
        </div>
        <div style={{ display: "flex", gap: 36, flex: 1 }}>
          {INDICES.map(idx => (
            <div key={idx.name} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 10.5, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{idx.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 14.5, color: "var(--text)", letterSpacing: "-0.02em" }}>{idx.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 11.5, color: idx.change >= 0 ? "var(--success)" : "var(--danger)" }}>{fmtPct(idx.change)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary + Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 14 }}>
        <AiSummaryCard summary={AI_PORTFOLIO_SUMMARY} />
        <AlertsCard alerts={RISK_ALERTS} />
      </div>

      {/* Portfolios + Today's Contributors + Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
        {/* Your Portfolios */}
        <div style={cardStyles.base}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={cardStyles.cardTitle}>Your Portfolios</span>
            <button onClick={() => setScreen("portfolio")} style={linkBtn}>View all →</button>
          </div>
          {PORTFOLIOS.map((p, i) => {
            const pl = p.value - p.cost; const isUp = pl >= 0;
            return (
              <div key={p.id} onClick={() => setScreen("portfolio-detail")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < PORTFOLIOS.length - 1 ? "1px solid var(--divider)" : "none", cursor: "pointer" }}>
                <div style={{ width: 4, alignSelf: "stretch", borderRadius: 2, background: p.color, flexShrink: 0 }}></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{p.holdings} holdings · {p.currency}</div>
                </div>
                <MiniSparkline data={p.sparkline} width={56} height={22} color={p.color} />
                <div style={{ textAlign: "right", minWidth: 88 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: "var(--text)" }}>{fmtMoney(p.value)}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: isUp ? "var(--success)" : "var(--danger)" }}>{fmtPct((pl/p.cost)*100)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Today's Contributors */}
        <div style={cardStyles.base}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={cardStyles.cardTitle}>Today's Contributors</span>
            <span style={{ fontSize: 11, color: "var(--subtle)" }}>P&L</span>
          </div>
          {TODAY_CONTRIBUTORS.map((c, i) => {
            const isUp = c.contribution >= 0;
            const max = Math.max(...TODAY_CONTRIBUTORS.map(x => Math.abs(x.contribution)));
            const w = (Math.abs(c.contribution) / max) * 100;
            return (
              <div key={c.symbol} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < TODAY_CONTRIBUTORS.length - 1 ? "1px solid var(--divider)" : "none" }}>
                <span style={{ flex: "0 0 50px", fontSize: 12.5, fontWeight: 700, color: "var(--text)" }}>{c.symbol}</span>
                <div style={{ flex: 1, height: 6, background: "var(--neutral-bg)", borderRadius: 3, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", height: "100%", width: w + "%", background: isUp ? "var(--success)" : "var(--danger)", borderRadius: 3 }}></div>
                </div>
                <span style={{ flex: "0 0 80px", textAlign: "right", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: isUp ? "var(--success)" : "var(--danger)" }}>{isUp ? "+" : ""}{fmtMoney(c.contribution)}</span>
              </div>
            );
          })}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--divider)" }}>
            <div style={{ fontSize: 10.5, color: "var(--subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Near 52W extremes</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PRICE_LEVELS.map(p => (
                <span key={p.symbol} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 5, background: p.state.includes("high") ? "var(--success-bg)" : "var(--danger-bg)", color: p.state.includes("high") ? "var(--success)" : "var(--danger)", fontSize: 11, fontWeight: 600 }}>
                  {p.state.includes("high") ? "▲" : "▼"} {p.symbol} <span style={{ opacity: 0.65, fontFamily: "'JetBrains Mono', monospace" }}>{p.distance}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={cardStyles.base}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={cardStyles.cardTitle}>Recent Activity</span>
            <button onClick={() => setScreen("transactions")} style={linkBtn}>All →</button>
          </div>
          {recentTx.map((tx, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < recentTx.length - 1 ? "1px solid var(--divider)" : "none" }}>
              <Badge variant={tx.type === "Buy" ? "green" : tx.type === "Sell" ? "red" : "blue"}>{tx.type}</Badge>
              <span style={{ fontWeight: 600, fontSize: 12.5, color: "var(--text)" }}>{tx.symbol}</span>
              <span style={{ fontSize: 11.5, color: "var(--subtle)", flex: 1 }}>{tx.shares} @ {fmtPrice(tx.price)}</span>
              <span style={{ fontSize: 11, color: "var(--subtle)", fontFamily: "'JetBrains Mono', monospace" }}>{tx.date.slice(5)}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--divider)", fontSize: 11, color: "var(--subtle)", textAlign: "center" }}>
            Holdings · cost basis · realized gains all derive from your transactions.
          </div>
        </div>
      </div>
    </div>
  );
}

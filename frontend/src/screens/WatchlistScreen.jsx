import React from "react";
import { ThemeToggle } from "../theme-toggle.jsx";
import { AF_DATA } from "../data.jsx";
import {
  Badge,
  MiniSparkline,
  fmtPct,
  fmtPrice,
} from "../components.jsx";
import { cardStyles, mainStyles, tableStyles } from "../styles.js";
import { iconBtn, inputStyles } from "./secondaryShared.js";

export function WatchlistScreen({ setScreen, setSelectedTicker, setTickerBackScreen, theme, setTheme }) {
  const { WATCHLIST_TICKERS, INDICES, WATCHLIST_SIGNALS, WATCHLIST_ALERTS } = AF_DATA;
  const [search, setSearch] = React.useState("");
  const [sectorFilter, setSectorFilter] = React.useState("All");
  const sectors = ["All", "Technology", "Consumer", "Finance", "Healthcare", "Energy"];

  const filtered = WATCHLIST_TICKERS.filter(t => {
    if (sectorFilter !== "All" && t.sector !== sectorFilter) return false;
    if (search && !t.symbol.toLowerCase().includes(search.toLowerCase()) && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={mainStyles.page}>
      {/* Market overview strip */}
      <div style={{ display: "flex", gap: 24, marginBottom: 18, padding: "12px 16px", background: "var(--card)", borderRadius: 10, border: "1px solid var(--border)" }}>
        {INDICES.map(idx => (
          <div key={idx.name} style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 12.5 }}>
            <span style={{ color: "var(--muted)", fontWeight: 500 }}>{idx.name}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "var(--text)" }}>{idx.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: idx.change >= 0 ? "var(--success)" : "var(--danger)", fontSize: 11.5 }}>{fmtPct(idx.change)}</span>
          </div>
        ))}
      </div>

      <div style={mainStyles.header}>
        <div>
          <h1 style={mainStyles.title}>Watchlist</h1>
          <p style={mainStyles.subtitle}>Track favorites, AI signals, and price alerts</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button style={mainStyles.btnSecondary}>Manage Alerts</button>
          <button style={mainStyles.btnPrimary}>+ Add Ticker</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
        <div style={{ position: "relative", flex: "0 0 280px" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickers…" style={inputStyles.search} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {sectors.map(s => (
            <button key={s} onClick={() => setSectorFilter(s)} style={{
              padding: "6px 12px", borderRadius: 6, border: "1px solid " + (sectorFilter === s ? "var(--success)" : "var(--border)"),
              background: sectorFilter === s ? "var(--success-bg)" : "var(--card)", color: sectorFilter === s ? "var(--success)" : "var(--muted)",
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>{s}</button>
          ))}
        </div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--subtle)" }}>{filtered.length} stocks</span>
      </div>

      {/* Table + Alerts side-by-side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 14 }}>
        <div style={cardStyles.base}>
          <table style={tableStyles.table}>
            <thead>
              <tr>
                <th style={tableStyles.th}>Ticker</th>
                <th style={tableStyles.th}>Company</th>
                <th style={{ ...tableStyles.th, textAlign: "center" }}>Trend</th>
                <th style={{ ...tableStyles.th, textAlign: "right" }}>Price</th>
                <th style={{ ...tableStyles.th, textAlign: "right" }}>Change</th>
                <th style={{ ...tableStyles.th, textAlign: "center" }}>AI Signal</th>
                <th style={{ ...tableStyles.th, textAlign: "right" }}>Mkt Cap</th>
                <th style={{ ...tableStyles.th, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const sig = WATCHLIST_SIGNALS[t.symbol] || { signal: "—", note: "", variant: "default" };
                return (
                  <tr key={t.symbol} style={{ ...tableStyles.row, cursor: "pointer" }} onClick={() => { setSelectedTicker(t.symbol); setTickerBackScreen("watchlist"); setScreen("ticker-detail"); }}>
                    <td style={{ ...tableStyles.td, fontWeight: 600, color: "var(--text)" }}>
                      <span style={{ borderBottom: "1px dashed var(--border-strong)" }}>{t.symbol}</span>
                    </td>
                    <td style={{ ...tableStyles.td, color: "var(--muted)", fontSize: 12 }}>{t.name}</td>
                    <td style={{ ...tableStyles.td, textAlign: "center" }}><MiniSparkline data={t.sparkline} width={56} height={22} /></td>
                    <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>{fmtPrice(t.price)}</td>
                    <td style={{ ...tableStyles.td, textAlign: "right" }}>
                      <span style={{ fontWeight: 600, color: t.changePct >= 0 ? "var(--success)" : "var(--danger)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5 }}>{fmtPct(t.changePct)}</span>
                    </td>
                    <td style={{ ...tableStyles.td, textAlign: "center" }}>
                      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <Badge variant={sig.variant} dot={sig.variant !== "default"}>{sig.signal}</Badge>
                        <span style={{ fontSize: 10.5, color: "var(--subtle)" }}>{sig.note}</span>
                      </div>
                    </td>
                    <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: "var(--muted)" }}>{t.marketCap}</td>
                    <td style={{ ...tableStyles.td, textAlign: "center" }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: "inline-flex", gap: 4 }}>
                        <button style={iconBtn} title="Set alert">🔔</button>
                        <button style={iconBtn} title="Remove">×</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Alerts panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={cardStyles.base}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={cardStyles.cardTitle}>Recent Alerts</span>
              <Badge variant="amber" dot>{WATCHLIST_ALERTS.length}</Badge>
            </div>
            {WATCHLIST_ALERTS.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "11px 0", borderBottom: i < WATCHLIST_ALERTS.length - 1 ? "1px solid var(--divider)" : "none" }}>
                <Badge variant={a.kind === "Price" ? "blue" : a.kind === "News" ? "amber" : a.kind === "Earnings" ? "purple" : "green"}>{a.kind}</Badge>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{a.symbol}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.4, marginTop: 2 }}>{a.text}</div>
                  <div style={{ fontSize: 10.5, color: "var(--subtle)", marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={cardStyles.base}>
            <div style={cardStyles.cardTitle}>News Signals</div>
            <div style={{ fontSize: 12, color: "var(--text-soft)", lineHeight: 1.5, padding: "4px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--divider)" }}>
                <span>Bullish mentions</span><span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--success)", fontWeight: 600 }}>4</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--divider)" }}>
                <span>Bearish mentions</span><span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--danger)", fontWeight: 600 }}>2</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span>Watchlist sentiment</span><span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--success)", fontWeight: 600 }}>+0.32</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

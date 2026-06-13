import React from "react";
import { ThemeToggle } from "../theme-toggle.jsx";
import { AF_DATA } from "../data.jsx";
import {
  Badge,
  fmtPct,
  fmtPrice,
  fmtNum,
} from "../components.jsx";
import { cardStyles, mainStyles, tableStyles } from "../styles.js";
import { smallBtn, filterGroupStyle, filterLabelStyle, inputStyles } from "./secondaryShared.js";
import { fetchScreener } from "../lib/api.js";

function fmtMarketCap(num) {
  if (num == null) return "—";
  if (num >= 1e12) return (num / 1e12).toFixed(1) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  return "—";
}

function parseCap(capStr) {
  if (!capStr) return 0;
  if (capStr.endsWith("T")) return parseFloat(capStr) * 1e12;
  if (capStr.endsWith("B")) return parseFloat(capStr) * 1e9;
  return 0;
}

export function ScreenerScreen({ setScreen, setSelectedTicker, setTickerBackScreen, theme, setTheme }) {
  const { SCREENER_STOCKS, AI_SCORES } = AF_DATA;
  const [sector, setSector] = React.useState("All");
  const [capFilter, setCapFilter] = React.useState("All");
  const [liveStocks, setLiveStocks] = React.useState(null);
  const [liveStale, setLiveStale] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const sectors = ["All", "Technology", "Consumer", "Finance", "Healthcare", "Energy"];
  const caps = ["All", "Mega (>$200B)", "Large ($50-200B)"];

  React.useEffect(() => {
    fetchScreener({ limit: 100 })
      .then(r => {
        if (r.stocks && r.stocks.length > 0) {
          setLiveStocks(r.stocks);
          setLiveStale(r.stale);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayStocks = liveStocks
    ? liveStocks.map(s => ({
        symbol: s.symbol,
        name: s.name,
        sector: s.sector ?? "Unknown",
        marketCap: fmtMarketCap(s.marketCap),
        _rawCap: s.marketCap ?? 0,
        price: s.price ?? 0,
        pe: s.pe ?? null,
        revGrowth: s.revGrowth ?? null,
        divYield: s.divYield ?? 0,
        perf6m: s.perf6m ?? null,
      }))
    : SCREENER_STOCKS.map(s => ({ ...s, _rawCap: parseCap(s.marketCap) }));

  const filtered = displayStocks.filter(s => {
    if (sector !== "All" && s.sector !== sector) return false;
    if (capFilter === "Mega (>$200B)" && s._rawCap < 200e9) return false;
    if (capFilter === "Large ($50-200B)" && (s._rawCap < 50e9 || s._rawCap >= 200e9)) return false;
    return true;
  });

  return (
    <div style={mainStyles.page}>
      <div style={mainStyles.header}>
        <div>
          <h1 style={mainStyles.title}>Screener</h1>
          <p style={mainStyles.subtitle}>
            {liveStocks ? "Live data via FMP" : "Discover stocks with fundamentals + AI quality scoring"}
            {liveStale && <span style={{ marginLeft: 8, fontSize: 11, color: "var(--amber, #f59e0b)" }}>· cached</span>}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button style={mainStyles.btnSecondary}>Save Screen</button>
          <button style={mainStyles.btnPrimary}>+ Add Selected</button>
        </div>
      </div>

      <div style={{ ...cardStyles.base, marginBottom: 14, padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={filterGroupStyle}>
            <span style={filterLabelStyle}>Sector</span>
            <select value={sector} onChange={e => setSector(e.target.value)} style={inputStyles.select}>
              {sectors.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={filterGroupStyle}>
            <span style={filterLabelStyle}>Market Cap</span>
            <select value={capFilter} onChange={e => setCapFilter(e.target.value)} style={inputStyles.select}>
              {caps.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={filterGroupStyle}>
            <span style={filterLabelStyle}>P/E</span>
            <select style={inputStyles.select}><option>Any</option><option>&lt; 20</option><option>20-40</option><option>&gt; 40</option></select>
          </div>
          <div style={filterGroupStyle}>
            <span style={filterLabelStyle}>Rev Growth</span>
            <select style={inputStyles.select}><option>Any</option><option>&gt; 10%</option><option>&gt; 20%</option></select>
          </div>
          <div style={filterGroupStyle}>
            <span style={filterLabelStyle}>Div Yield</span>
            <select style={inputStyles.select}><option>Any</option><option>&gt; 1%</option><option>&gt; 2%</option></select>
          </div>
          <div style={filterGroupStyle}>
            <span style={filterLabelStyle}>AI Score</span>
            <select style={inputStyles.select}><option>Any</option><option>&gt; 70</option><option>&gt; 80</option></select>
          </div>
          <span style={{ fontSize: 12, color: "var(--subtle)", marginLeft: "auto" }}>
            {loading ? "Loading..." : `${filtered.length} results`}
          </span>
        </div>
      </div>

      <div style={cardStyles.base}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              <th style={tableStyles.th}>Ticker</th>
              <th style={tableStyles.th}>Company</th>
              <th style={{ ...tableStyles.th, textAlign: "center" }}>Sector</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Mkt Cap</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Price</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>P/E</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Rev Growth</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Div Yield</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>6M Perf</th>
              <th style={{ ...tableStyles.th, textAlign: "center" }}>AI Score</th>
              <th style={{ ...tableStyles.th, textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && !liveStocks && (
              <tr>
                <td colSpan={11} style={{ ...tableStyles.td, textAlign: "center", padding: "32px 0", color: "var(--muted)" }}>
                  Loading live data...
                </td>
              </tr>
            )}
            {filtered.map(s => {
              const ai = AI_SCORES[s.symbol] || { score: 70, tag: "—" };
              const aiColor = ai.score >= 85 ? "var(--success)" : ai.score >= 75 ? "var(--blue)" : "var(--amber)";
              return (
                <tr key={s.symbol} style={{ ...tableStyles.row, cursor: "pointer" }} onClick={() => { setSelectedTicker(s.symbol); setTickerBackScreen("screener"); setScreen("ticker-detail"); }}>
                  <td style={{ ...tableStyles.td, fontWeight: 600, color: "var(--text)" }}>{s.symbol}</td>
                  <td style={{ ...tableStyles.td, color: "var(--muted)" }}>{s.name}</td>
                  <td style={{ ...tableStyles.td, textAlign: "center" }}><Badge>{s.sector}</Badge></td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{s.marketCap}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmtPrice(s.price)}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{s.pe != null ? fmtNum(s.pe, 1) : "—"}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontWeight: 600, color: (s.revGrowth ?? 0) >= 0 ? "var(--success)" : "var(--danger)" }}>{s.revGrowth != null ? fmtPct(s.revGrowth) : "—"}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{s.divYield > 0 ? s.divYield.toFixed(2) + "%" : "—"}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontWeight: 600, color: (s.perf6m ?? 0) >= 0 ? "var(--success)" : "var(--danger)" }}>{s.perf6m != null ? fmtPct(s.perf6m) : "—"}</td>
                  <td style={{ ...tableStyles.td, textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: aiColor, fontFamily: "'JetBrains Mono', monospace", minWidth: 22, textAlign: "right" }}>{ai.score}</span>
                      <Badge variant={ai.tag === "Quality" ? "green" : ai.tag === "Growth" ? "blue" : "amber"}>{ai.tag}</Badge>
                    </div>
                  </td>
                  <td style={{ ...tableStyles.td, textAlign: "center" }}>
                    <button onClick={e => e.stopPropagation()} style={{ ...smallBtn, color: "var(--success)", borderColor: "var(--success)" }}>+ Watch</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

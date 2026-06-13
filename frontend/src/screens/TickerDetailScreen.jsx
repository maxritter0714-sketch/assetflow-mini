import React from "react";
import { ThemeToggle } from "../theme-toggle.jsx";
import { AF_DATA } from "../data.jsx";
import { fetchFundamentals, fetchTickerNews } from "../lib/api.js";
import {
  Badge,
  ScoreRing,
  StatBar,
  fmtPct,
  fmtPrice,
  fmtNum,
} from "../components.jsx";
import { cardStyles, mainStyles } from "../styles.js";
import { CandlestickMini } from "./CandlestickMini.jsx";

function relativeTime(publishedAt) {
  if (!publishedAt) return "—";
  const date = new Date(publishedAt.replace(" ", "T"));
  if (isNaN(date.getTime())) return publishedAt.slice(0, 10);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

export function TickerDetailScreen({ setScreen, selectedTicker = "NVDA", tickerBackScreen = "watchlist", theme, setTheme }) {
  const stock = [...AF_DATA.SCREENER_STOCKS, ...AF_DATA.WATCHLIST_TICKERS].find(x => x.symbol === selectedTicker) || AF_DATA.SCREENER_STOCKS[0];
  const ai = AF_DATA.AI_SCORES?.[stock.symbol] || { score: 88, tag: "Quality" };
  const chartData = AF_DATA.TICKER_CHARTS?.[stock.symbol] || {
    candles: AF_DATA.NVDA_CANDLES,
    candlesByTf: AF_DATA.NVDA_CANDLES_BY_TF,
    lineByTf: AF_DATA.NVDA_LINE_BY_TF,
  };
  const oneYearCandles = chartData.candles || AF_DATA.NVDA_CANDLES;
  const holding = AF_DATA.TECH_HOLDINGS.find(x => x.symbol === stock.symbol);
  const high52 = Math.max(...oneYearCandles.map(c => c.h));
  const low52 = Math.min(...oneYearCandles.map(c => c.l));
  const isNvda = stock.symbol === "NVDA";

  // --- hooks ---
  const [liveNews, setLiveNews] = React.useState(null);
  const [liveFundamentals, setLiveFundamentals] = React.useState(null);
  const [chartType, setChartType] = React.useState("Candle");
  const [candleTf, setCandleTf] = React.useState("1D");
  const [lineTf,   setLineTf]   = React.useState("1Y");

  React.useEffect(() => {
    setLiveNews(null);
    fetchTickerNews(selectedTicker)
      .then(r => setLiveNews(r.items?.length > 0 ? r.items : null))
      .catch(() => {});
  }, [selectedTicker]);

  React.useEffect(() => {
    setLiveFundamentals(null);
    fetchFundamentals(selectedTicker)
      .then(r => setLiveFundamentals(r))
      .catch(() => {});
  }, [selectedTicker]);

  // --- derived values ---
  const S_base = isNvda ? AF_DATA.NVDA_STATS : {
    ...AF_DATA.NVDA_STATS,
    price: stock.price,
    change: stock.change ?? 0,
    changePct: stock.changePct ?? stock.perf6m ?? 0,
    marketCap: stock.marketCap,
    pe: stock.pe,
    high52,
    low52,
    divYield: typeof stock.divYield === "number" ? stock.divYield.toFixed(2) + "%" : AF_DATA.NVDA_STATS.divYield,
    revGrowth: typeof stock.revGrowth === "number" ? stock.revGrowth.toFixed(1) + "%" : AF_DATA.NVDA_STATS.revGrowth,
    sector: stock.sector,
  };
  const S = liveFundamentals ? {
    ...S_base,
    marketCap: liveFundamentals.marketCap ?? S_base.marketCap,
    pe: liveFundamentals.pe ?? S_base.pe,
    eps: liveFundamentals.eps ?? S_base.eps,
    beta: liveFundamentals.beta ?? S_base.beta,
    high52: liveFundamentals.high52w ?? S_base.high52,
    low52: liveFundamentals.low52w ?? S_base.low52,
    divYield: liveFundamentals.divYield ?? S_base.divYield,
    revGrowth: liveFundamentals.revGrowth ?? S_base.revGrowth,
    revenue: liveFundamentals.revenue ?? S_base.revenue,
    netIncome: liveFundamentals.netIncome ?? S_base.netIncome,
    fcf: liveFundamentals.fcf ?? S_base.fcf,
    roe: liveFundamentals.roe ?? S_base.roe,
    grossMargin: liveFundamentals.grossMargin ?? S_base.grossMargin,
    opMargin: liveFundamentals.opMargin ?? S_base.opMargin,
    netMargin: liveFundamentals.netMargin ?? S_base.netMargin,
    debtEquity: liveFundamentals.debtEquity ?? S_base.debtEquity,
    sector: liveFundamentals.sector ?? S_base.sector,
    exchange: liveFundamentals.exchange ?? S_base.exchange,
  } : S_base;

  const news = liveNews ?? [];
  const sc = isNvda ? AF_DATA.NVDA_SCORECARD : {
    ...AF_DATA.NVDA_SCORECARD,
    overall: ai.score,
    consensus: ai.tag,
    priceTarget: Math.round(S.price * 1.12),
    upside: 12.0,
  };
  const ext = isNvda ? AF_DATA.NVDA_EXTREMES : {
    from52High: Number((((S.price - S.high52) / S.high52) * 100).toFixed(1)),
    from52Low: Number((((S.price - S.low52) / S.low52) * 100).toFixed(1)),
  };

  const isCandle = chartType === "Candle";
  const candleTfs = ["30m", "1h", "4h", "1D", "1W", "1M"];
  const lineTfs   = ["1W", "1M", "6M", "1Y", "5Y", "Max"];
  const tf = isCandle ? candleTf : lineTf;
  const setTf = isCandle ? setCandleTf : setLineTf;

  const visibleCandles = isCandle
    ? (chartData.candlesByTf[candleTf] || oneYearCandles)
    : (chartData.lineByTf[lineTf] || oneYearCandles);

  return (
    <div style={mainStyles.page}>
      {/* Header — refined */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <button onClick={() => setScreen(tickerBackScreen)} style={{ ...mainStyles.btnSecondary, padding: "6px 10px" }}>←</button>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: "linear-gradient(135deg,#10b981,#06b6d4)", display: "grid", placeItems: "center", color: "#0a0f1c", fontWeight: 800, fontSize: 14, letterSpacing: "-0.02em", boxShadow: "var(--shadow-sm)" }}>{stock.symbol.slice(0, 2)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.025em" }}>{stock.symbol}</span>
            <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{stock.name}</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <Badge variant="purple">{S.sector}</Badge>
            <Badge variant="default">{S.exchange}</Badge>
            <Badge variant={holding ? "green" : "default"} dot={Boolean(holding)}>{holding ? `Holding · ${holding.shares} sh` : "Not held"}</Badge>
            <Badge variant="amber">Earnings May 22</Badge>
          </div>
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <button style={mainStyles.btnSecondary}>Add to Watchlist</button>
        <button style={mainStyles.btnPrimary}>+ Transaction</button>
        <div style={{ textAlign: "right", paddingLeft: 12, borderLeft: "1px solid var(--border)" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{fmtPrice(S.price)}</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", alignItems: "center", marginTop: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: S.change >= 0 ? "var(--success)" : "var(--danger)" }}>{S.change >= 0 ? "+" : ""}{fmtPrice(S.change)}</span>
            <Badge variant={S.changePct >= 0 ? "green" : "red"} dot>{fmtPct(S.changePct)}</Badge>
          </div>
        </div>
      </div>

      {/* Chart panel */}
      <div style={{ background: "#0f172a", borderRadius: 14, padding: "16px 20px", marginBottom: 14, border: "1px solid #1e293b" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {(isCandle ? candleTfs : lineTfs).map(t => (
              <button key={t} onClick={() => setTf(t)} style={{
                minWidth: 38, padding: "5px 8px", borderRadius: 6, border: "none",
                background: tf === t ? "rgba(255,255,255,0.12)" : "transparent",
                color: tf === t ? "#f1f5f9" : "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace"
              }}>{t}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {["Candle","Line","Area"].map(t => (
                <button key={t} onClick={() => setChartType(t)} style={{
                  padding: "5px 10px", borderRadius: 6, border: "1px solid " + (chartType === t ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)"),
                  background: chartType === t ? "rgba(16,185,129,0.15)" : "transparent",
                  color: chartType === t ? "#34d399" : "#94a3b8", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
                }}>{t}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#94a3b8", alignItems: "center" }}>
              <span style={{ minWidth: 92, textAlign: "center", padding: "2px 7px", borderRadius: 4, background: "rgba(255,255,255,0.06)", fontFamily: "'JetBrains Mono', monospace", color: "#cbd5e1", fontSize: 10.5 }}>
                {isCandle ? `${candleTf} per candle` : `${lineTf} window`}
              </span>
              <span>52W: <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#cbd5e1" }}>{fmtPrice(S.low52)} – {fmtPrice(S.high52)}</span></span>
              <span style={{ color: "#34d399" }}>{ext.from52High}% from high</span>
            </div>
          </div>
        </div>
        <CandlestickMini candles={visibleCandles} width={860} height={320} mode={chartType} tf={tf} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 14, marginBottom: 14 }}>
        {/* Left: Stats + Fundamentals + News */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={cardStyles.base}>
            <div style={cardStyles.cardTitle}>Key Statistics</div>
            <div style={{ marginTop: 10, border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
              {[
                [["Market Cap", S.marketCap], ["P/E Ratio", fmtNum(S.pe, 1)], ["EPS", fmtPrice(S.eps)], ["Beta", fmtNum(S.beta, 2)]],
                [["52W High", fmtPrice(S.high52)], ["52W Low", fmtPrice(S.low52)], ["Div Yield", S.divYield], ["Rev Growth", S.revGrowth]],
              ].map((row, ri, rows) => (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: ri < rows.length - 1 ? "1px solid var(--border)" : "none" }}>
                  {row.map(([k, v], ci) => (
                    <div key={k} style={{ padding: "12px 14px", borderRight: ci < row.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, fontWeight: 500 }}>{k}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "'JetBrains Mono', monospace" }}>{v}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={cardStyles.base}>
            <div style={cardStyles.cardTitle}>Fundamentals</div>
            <div style={{ marginTop: 10, border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
              {[
                [["Revenue", S.revenue], ["Net Income", S.netIncome], ["Free Cash Flow", S.fcf], ["ROE", S.roe]],
                [["Gross Margin", S.grossMargin], ["Operating Margin", S.opMargin], ["Net Margin", S.netMargin], ["Debt / Equity", S.debtEquity]],
              ].map((row, ri, rows) => (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: ri < rows.length - 1 ? "1px solid var(--border)" : "none" }}>
                  {row.map(([k, v], ci) => (
                    <div key={k} style={{ padding: "12px 14px", borderRight: ci < row.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, fontWeight: 500 }}>{k}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "'JetBrains Mono', monospace" }}>{v}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={cardStyles.base}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={cardStyles.cardTitle}>Recent News</span>
              {news.length > 0 && <span style={{ fontSize: 11, color: "var(--subtle)" }}>{news.length} articles</span>}
            </div>
            {liveNews === null && (
              <div style={{ padding: "24px 0", textAlign: "center", color: "var(--muted)", fontSize: 12 }}>Loading news…</div>
            )}
            {liveNews !== null && news.length === 0 && (
              <div style={{ padding: "24px 0", textAlign: "center", color: "var(--muted)", fontSize: 12 }}>No news found for {selectedTicker}.</div>
            )}
            {news.map((n, i) => {
              const titleEl = n.url
                ? <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>{n.title}</a>
                : n.title;
              const time = n.publishedAt ? relativeTime(n.publishedAt) : "—";
              return (
                <div key={i} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: i < news.length - 1 ? "1px solid var(--divider)" : "none" }}>
                  <div style={{ width: 36, fontSize: 10, color: "var(--subtle)", fontFamily: "'JetBrains Mono', monospace", paddingTop: 2, flexShrink: 0 }}>{time}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.45, fontWeight: 500 }}>{titleEl}</div>
                    <div style={{ fontSize: 11, color: "var(--subtle)", marginTop: 4 }}>{n.source}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Your Position + Analyst Score + AI summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Your Position — pulled from TECH_HOLDINGS NVDA row */}
          {(() => {
            const h = holding || {
              symbol: stock.symbol,
              shares: 0,
              avgPrice: S.price,
              currentPrice: S.price,
            };
            const mv = h.shares * h.currentPrice;
            const cb = h.shares * h.avgPrice;
            const ug = mv - cb;
            const ugPct = cb ? (ug / cb) * 100 : 0;
            const totalMv = AF_DATA.TECH_HOLDINGS.reduce((s, x) => s + x.shares * x.currentPrice, 0);
            const weight = totalMv ? (mv / totalMv) * 100 : 0;
            const fmt = (n) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
            const fmt2 = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return (
              <div style={cardStyles.base}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={cardStyles.cardTitle}>Your Position</span>
                  <Badge variant="default">Tech Growth</Badge>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em" }}>{fmt(mv)}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>market value</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--success)", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>
                  +{fmt(ug)} <span style={{ fontWeight: 500 }}>(+{ugPct.toFixed(1)}%)</span>
                  <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginLeft: 6 }}>unrealized</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", paddingTop: 12, borderTop: "1px solid var(--divider)" }}>
                  {[
                    ["Shares",         h.shares.toString()],
                    ["Avg buy",        fmt2(h.avgPrice)],
                    ["Cost basis",     fmt(cb)],
                    ["Portfolio weight", weight.toFixed(1) + "%"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10.5, color: "var(--subtle)", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600 }}>{k}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)", fontFamily: "'JetBrains Mono', monospace", marginTop: 3 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <div style={cardStyles.base}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={cardStyles.cardTitle}>AI Score</span>
              <Badge variant="green" dot>{sc.consensus}</Badge>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, marginBottom: 14 }}>
              <ScoreRing value={sc.overall} size={84} label="of 100" color="var(--success)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>12M Price Target</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em" }}>${sc.priceTarget}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--success)", marginTop: 2 }}>+{sc.upside}% upside</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <StatBar label="Growth"        value={sc.growth}        color="var(--success)" />
              <StatBar label="Profitability" value={sc.profitability} color="var(--success)" />
              <StatBar label="Momentum"      value={sc.momentum}      color="var(--blue)" />
              <StatBar label="Value"         value={sc.value}         color="var(--amber)" />
              <StatBar label="Risk"          value={sc.risk}          color="var(--danger)" />
            </div>
          </div>
          <div style={cardStyles.base}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#10b981,#06b6d4)", display: "grid", placeItems: "center", color: "#0a0f1c", fontWeight: 800, fontSize: 9 }}>AI</div>
              <span style={cardStyles.cardTitle}>AI Portfolio Summary</span>
            </div>
            <div style={{ fontSize: 12.8, color: "var(--text-soft)", lineHeight: 1.55 }}>
              Strong growth driven by AI/data-center demand. Elevated valuation (P/E 64x) reflects premium pricing for market leadership. High beta (1.68) indicates above-market volatility. Revenue growth of 122% YoY is exceptional but historically moderates after multiple peak quarters.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              <Badge variant="green">Strong Growth</Badge>
              <Badge variant="green">AI Leader</Badge>
              <Badge variant="amber">High Valuation</Badge>
              <Badge variant="red">High Volatility</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

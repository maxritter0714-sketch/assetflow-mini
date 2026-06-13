import React, { useEffect, useState } from "react";
import { ThemeToggle } from "../theme-toggle.jsx";
import { mainStyles, cardStyles } from "../styles.js";
import { fetchMacroNews, fetchPortfolioNews, fetchTickerNews } from "../lib/api.js";
import { inputStyles } from "./secondaryShared.js";

const TABS = ["Macro", "Portfolio", "Ticker"];

function relativeTime(publishedAt) {
  if (!publishedAt) return "—";
  let str = publishedAt;
  if (/^\d{8}T\d{6}/.test(str)) {
    str = str.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?/, "$1-$2-$3T$4:$5:$6Z");
  } else {
    str = str.replace(" ", "T");
  }
  const date = new Date(str);
  if (isNaN(date.getTime())) return publishedAt.slice(0, 10);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

function NewsRow({ item }) {
  const content = (
    <div style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--divider)", textDecoration: "none", color: "inherit" }}>
      <div style={{ width: 52, fontSize: 10, color: "var(--subtle)", fontFamily: "'JetBrains Mono', monospace", paddingTop: 2, flexShrink: 0, lineHeight: 1.5 }}>
        {relativeTime(item.publishedAt)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text)", lineHeight: 1.45, marginBottom: item.summary ? 4 : 0 }}>
          {item.title}
        </div>
        {item.summary && (
          <div style={{ fontSize: 11.5, color: "var(--text-soft)", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {item.summary}
          </div>
        )}
        <div style={{ fontSize: 11, color: "var(--subtle)", marginTop: 4 }}>
          {item.source}{item.ticker ? ` · ${item.ticker}` : ""}
        </div>
      </div>
    </div>
  );

  return item.url
    ? <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>{content}</a>
    : content;
}

function NewsFeed({ items, loading, stale, emptyMsg }) {
  if (loading) {
    return <div style={{ padding: "40px 0", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Loading...</div>;
  }
  return (
    <div>
      {stale && (
        <div style={{ fontSize: 11, color: "var(--amber, #f59e0b)", marginBottom: 12, padding: "6px 10px", background: "rgba(245,158,11,0.08)", borderRadius: 6 }}>
          Showing cached data — live feed temporarily unavailable.
        </div>
      )}
      {items.length === 0
        ? <div style={{ padding: "40px 0", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>{emptyMsg}</div>
        : items.map((item, i) => <NewsRow key={i} item={item} />)
      }
    </div>
  );
}

export function NewsScreen({ theme, setTheme }) {
  const [tab, setTab] = useState("Macro");
  const [tickerInput, setTickerInput] = useState("NVDA");
  const [tickerQuery, setTickerQuery] = useState("NVDA");

  const [macroItems, setMacroItems] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [tickerItems, setTickerItems] = useState([]);

  const [macroStale, setMacroStale] = useState(false);
  const [portfolioStale, setPortfolioStale] = useState(false);
  const [tickerStale, setTickerStale] = useState(false);

  const [macroLoading, setMacroLoading] = useState(true);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [tickerLoading, setTickerLoading] = useState(true);

  useEffect(() => {
    fetchMacroNews()
      .then(r => { setMacroItems(r.items || []); setMacroStale(r.stale); })
      .catch(() => setMacroItems([]))
      .finally(() => setMacroLoading(false));
  }, []);

  useEffect(() => {
    fetchPortfolioNews()
      .then(r => { setPortfolioItems(r.items || []); setPortfolioStale(r.stale); })
      .catch(() => setPortfolioItems([]))
      .finally(() => setPortfolioLoading(false));
  }, []);

  useEffect(() => {
    setTickerLoading(true);
    fetchTickerNews(tickerQuery)
      .then(r => { setTickerItems(r.items || []); setTickerStale(r.stale); })
      .catch(() => setTickerItems([]))
      .finally(() => setTickerLoading(false));
  }, [tickerQuery]);

  const handleSearch = () => {
    const sym = tickerInput.trim().toUpperCase();
    if (sym) setTickerQuery(sym);
  };

  const tabContent = {
    Macro: { items: macroItems, loading: macroLoading, stale: macroStale, emptyMsg: "No macro news available." },
    Portfolio: {
      items: portfolioItems, loading: portfolioLoading, stale: portfolioStale,
      emptyMsg: "No portfolio news — add transactions to your portfolio first.",
    },
    Ticker: {
      items: tickerItems, loading: tickerLoading, stale: tickerStale,
      emptyMsg: `No news found for ${tickerQuery}.`,
    },
  };
  const current = tabContent[tab];

  return (
    <div style={mainStyles.page}>
      <div style={mainStyles.header}>
        <div>
          <h1 style={mainStyles.title}>News</h1>
          <p style={mainStyles.subtitle}>Market news from global sources</p>
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "1px solid var(--border)" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 20px",
            border: "1px solid var(--border)",
            borderBottom: tab === t ? "1px solid var(--card)" : "1px solid var(--border)",
            borderRadius: "8px 8px 0 0",
            background: tab === t ? "var(--card)" : "transparent",
            color: tab === t ? "var(--text)" : "var(--muted)",
            fontSize: 13,
            fontWeight: tab === t ? 600 : 500,
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: tab === t ? -1 : 0,
            position: "relative",
            zIndex: tab === t ? 1 : 0,
          }}>
            {t === "Macro" ? "Global Macro" : t === "Portfolio" ? "My Portfolio" : "Ticker"}
          </button>
        ))}
      </div>

      {tab === "Ticker" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            value={tickerInput}
            onChange={e => setTickerInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Ticker symbol (e.g. AAPL)"
            style={{ ...inputStyles.text, maxWidth: 220 }}
          />
          <button onClick={handleSearch} style={mainStyles.btnPrimary}>Search</button>
          {tickerQuery && (
            <span style={{ fontSize: 12, color: "var(--muted)", alignSelf: "center" }}>
              Showing: <strong style={{ color: "var(--text)" }}>{tickerQuery}</strong>
            </span>
          )}
        </div>
      )}

      <div style={cardStyles.base}>
        <NewsFeed {...current} />
      </div>
    </div>
  );
}

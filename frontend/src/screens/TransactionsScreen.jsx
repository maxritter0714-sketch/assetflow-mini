import React from "react";
import { ThemeToggle } from "../theme-toggle.jsx";
import { AF_DATA } from "../data.jsx";
import {
  Badge,
  KpiCard,
  CashflowBars,
  fmtMoney,
  fmtPct,
  fmtPrice,
} from "../components.jsx";
import { cardStyles, mainStyles, tableStyles } from "../styles.js";
import { filterGroupStyle, filterLabelStyle, inputStyles } from "./secondaryShared.js";

export function TransactionsScreen({ theme, setTheme }) {
  const { ALL_TRANSACTIONS, CASHFLOW_TIMELINE } = AF_DATA;
  const [typeFilter, setTypeFilter] = React.useState("All");
  const [portfolioFilter, setPortfolioFilter] = React.useState("All");
  const types = ["All", "Buy", "Sell", "Dividend"];
  const portfolios = ["All", "Tech Growth", "Dividend Growth", "ETF Core", "Crypto & Speculative"];

  const filtered = ALL_TRANSACTIONS.filter(tx => {
    if (typeFilter !== "All" && tx.type !== typeFilter) return false;
    if (portfolioFilter !== "All" && tx.portfolio !== portfolioFilter) return false;
    return true;
  });

  const totalInvested = ALL_TRANSACTIONS.filter(t => t.type === "Buy").reduce((s, t) => s + t.shares * t.price, 0);
  const realized = ALL_TRANSACTIONS.filter(t => t.type === "Sell").reduce((s, t) => s + t.shares * t.price * 0.12, 0);
  const divs = ALL_TRANSACTIONS.filter(t => t.type === "Dividend").reduce((s, t) => s + t.shares * t.price, 0);
  const fees = ALL_TRANSACTIONS.reduce((s, t) => s + t.fees, 0);

  const txColor = (t) => t === "Buy" ? "var(--success)" : t === "Sell" ? "var(--danger)" : "var(--blue)";

  return (
    <div style={mainStyles.page}>
      <div style={mainStyles.header}>
        <div>
          <h1 style={mainStyles.title}>Transactions</h1>
          <p style={mainStyles.subtitle}>Source of truth for holdings · cost basis · realized gains · dividends</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button style={mainStyles.btnSecondary}>Import CSV</button>
          <button style={{ ...mainStyles.btnPrimary, padding: "10px 22px", fontSize: 13.5 }}>+ Add Transaction</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
        <KpiCard label="Total Invested" value={fmtMoney(Math.round(totalInvested))} accent="linear-gradient(90deg,#10b981,#34d399)" />
        <KpiCard label="Realized Gains" value={"+" + fmtMoney(Math.round(realized))} sub={fmtPct(realized/totalInvested*100)} positive={true} accent="linear-gradient(90deg,#06b6d4,#67e8f9)" />
        <KpiCard label="Dividends Received" value={fmtMoney(Math.round(divs))} sub={ALL_TRANSACTIONS.filter(t=>t.type==="Dividend").length + " payments"} accent="linear-gradient(90deg,#6366f1,#a5b4fc)" />
        <KpiCard label="Fees Paid" value={fmtMoney(Math.round(fees))} sub="across 15 trades" accent="linear-gradient(90deg,#94a3b8,#cbd5e1)" />
      </div>

      {/* Cashflow timeline */}
      <div style={{ ...cardStyles.base, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={cardStyles.cardTitle}>6-Month Cashflow</span>
          <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, background: "var(--success)", borderRadius: 2 }}></span><span style={{ color: "var(--muted)" }}>Buys</span></span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, background: "var(--danger)", borderRadius: 2 }}></span><span style={{ color: "var(--muted)" }}>Sells</span></span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, background: "var(--blue)", borderRadius: 2 }}></span><span style={{ color: "var(--muted)" }}>Dividends</span></span>
          </div>
        </div>
        <CashflowBars data={CASHFLOW_TIMELINE} height={110} />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
        <div style={filterGroupStyle}>
          <span style={filterLabelStyle}>Type</span>
          <div style={{ display: "flex", gap: 4 }}>
            {types.map(t => {
              const active = typeFilter === t;
              const tone = t === "Buy" ? "success" : t === "Sell" ? "danger" : t === "Dividend" ? "blue" : "text";
              const activeColor = tone === "text" ? "var(--text)" : `var(--${tone})`;
              const activeBg = tone === "text" ? "var(--neutral-bg)" : `var(--${tone}-bg)`;
              return (
                <button key={t} onClick={() => setTypeFilter(t)} style={{
                  padding: "5px 10px", borderRadius: 6, border: "1px solid " + (active ? activeColor : "var(--border)"),
                  background: active ? activeBg : "var(--card)", color: active ? activeColor : "var(--muted)",
                  fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                }}>{t}</button>
              );
            })}
          </div>
        </div>
        <div style={filterGroupStyle}>
          <span style={filterLabelStyle}>Portfolio</span>
          <select value={portfolioFilter} onChange={e => setPortfolioFilter(e.target.value)} style={inputStyles.select}>
            {portfolios.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--subtle)" }}>{filtered.length} transactions</span>
      </div>

      <div style={cardStyles.base}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              <th style={tableStyles.th}>Date</th>
              <th style={{ ...tableStyles.th, textAlign: "center" }}>Type</th>
              <th style={tableStyles.th}>Ticker</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Shares</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Price</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Fees</th>
              <th style={{ ...tableStyles.th, textAlign: "right" }}>Total</th>
              <th style={tableStyles.th}>Portfolio</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx, i) => {
              const total = tx.shares * tx.price + tx.fees;
              return (
                <tr key={i} style={tableStyles.row}>
                  <td style={{ ...tableStyles.td, fontFamily: "'JetBrains Mono', monospace", color: "var(--muted)", fontSize: 12 }}>{tx.date}</td>
                  <td style={{ ...tableStyles.td, textAlign: "center" }}>
                    <Badge variant={tx.type === "Buy" ? "green" : tx.type === "Sell" ? "red" : "blue"} dot>{tx.type}</Badge>
                  </td>
                  <td style={{ ...tableStyles.td, fontWeight: 600, color: "var(--text)" }}>{tx.symbol}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{tx.shares}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{fmtPrice(tx.price)}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: "var(--subtle)" }}>{tx.fees > 0 ? fmtPrice(tx.fees) : "—"}</td>
                  <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: txColor(tx.type) }}>{tx.type === "Sell" ? "+" : tx.type === "Dividend" ? "+" : "−"}{fmtMoney(Math.round(total))}</td>
                  <td style={{ ...tableStyles.td, color: "var(--muted)", fontSize: 12 }}>{tx.portfolio}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ========== 7. SETTINGS ==========

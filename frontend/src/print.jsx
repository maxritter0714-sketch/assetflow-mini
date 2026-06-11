// Print entry — renders every screen stacked for visual review.
import { useEffect as usePrintEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./data.jsx";
import { Sidebar } from "./components.jsx";
import {
  DashboardScreen,
  HomeScreen,
  PortfolioDetailScreen,
  TickerDetailScreen,
} from "./screens-main.jsx";
import {
  ScreenerScreen,
  SettingsScreen,
  TransactionsScreen,
  WatchlistScreen,
} from "./screens-secondary.jsx";

const SCREENS = [
  { id: "dashboard",       label: "01 Home Dashboard",   Comp: () => <HomeScreen setScreen={() => {}} theme="light" setTheme={() => {}} /> },
  { id: "portfolio",       label: "02 Portfolios",       Comp: () => <DashboardScreen setScreen={() => {}} theme="light" setTheme={() => {}} /> },
  { id: "portfolio-detail",label: "03 Portfolio Detail", Comp: () => <PortfolioDetailScreen setScreen={() => {}} theme="light" setTheme={() => {}} /> },
  { id: "ticker-detail",   label: "04 Ticker Detail",    Comp: () => <TickerDetailScreen setScreen={() => {}} theme="light" setTheme={() => {}} /> },
  { id: "watchlist",       label: "05 Watchlist",        Comp: () => <WatchlistScreen setScreen={() => {}} theme="light" setTheme={() => {}} /> },
  { id: "screener",        label: "06 Screener",         Comp: () => <ScreenerScreen theme="light" setTheme={() => {}} /> },
  { id: "transactions",    label: "07 Transactions",     Comp: () => <TransactionsScreen theme="light" setTheme={() => {}} /> },
  { id: "settings",        label: "08 Settings",         Comp: () => <SettingsScreen theme="light" setTheme={() => {}} /> },
];

function PrintApp() {
  usePrintEffect(() => { document.documentElement.setAttribute("data-theme", "light"); }, []);
  return (
    <div className="print-root">
      {SCREENS.map(({ id, label, Comp }) => (
        <section key={id} className="print-page" data-screen-label={label}>
          <div className="print-page-label">{label}</div>
          <div className="print-app-shell">
            <Sidebar screen={id} setScreen={() => {}} />
            <div className="print-screen-content">
              <Comp />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PrintApp />);

// Auto-print after fonts load (disabled for verification)
(async () => {
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch {
    // Font readiness is best-effort before opening the print dialog.
  }
  await new Promise(r => setTimeout(r, 800));
  if (!location.hash.includes("noprint")) window.print();
})();

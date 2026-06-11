// App shell + shared styles
import { useEffect as useEffectApp, useState as useStateApp } from "react";
import ReactDOM from "react-dom/client";
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

function App() {
  const [route, setRoute] = useStateApp({
    screen: "dashboard",
    selectedTicker: "NVDA",
    tickerBackScreen: "watchlist",
  });
  const [theme, setTheme] = useStateApp(() => {
    try { return localStorage.getItem("af-theme") || "light"; } catch { return "light"; }
  });

  useEffectApp(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("af-theme", theme); } catch {
      // localStorage can be unavailable in privacy-restricted contexts.
    }
  }, [theme]);

  const themeProps = { theme, setTheme };
  const setScreen = screen => setRoute(current => ({ ...current, screen }));
  const setSelectedTicker = selectedTicker => setRoute(current => ({ ...current, selectedTicker }));
  const setTickerBackScreen = tickerBackScreen => setRoute(current => ({ ...current, tickerBackScreen }));
  const { screen, selectedTicker, tickerBackScreen } = route;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      <Sidebar screen={screen} setScreen={setScreen} />
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflow: "hidden" }}>
          {screen === "dashboard" && <HomeScreen setScreen={setScreen} {...themeProps} />}
          {screen === "portfolio" && <DashboardScreen setScreen={setScreen} setSelectedTicker={setSelectedTicker} setTickerBackScreen={setTickerBackScreen} {...themeProps} />}
          {screen === "portfolio-detail" && <PortfolioDetailScreen setScreen={setScreen} setSelectedTicker={setSelectedTicker} setTickerBackScreen={setTickerBackScreen} {...themeProps} />}
          {screen === "ticker-detail" && <TickerDetailScreen setScreen={setScreen} selectedTicker={selectedTicker} tickerBackScreen={tickerBackScreen} {...themeProps} />}
          {screen === "watchlist" && <WatchlistScreen setScreen={setScreen} setSelectedTicker={setSelectedTicker} setTickerBackScreen={setTickerBackScreen} {...themeProps} />}
          {screen === "screener" && <ScreenerScreen setScreen={setScreen} setSelectedTicker={setSelectedTicker} setTickerBackScreen={setTickerBackScreen} {...themeProps} />}
          {screen === "transactions" && <TransactionsScreen {...themeProps} />}
          {screen === "settings" && <SettingsScreen {...themeProps} />}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

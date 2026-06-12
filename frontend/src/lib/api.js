const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export const fetchPortfolioSummary = () => get("/api/portfolio/summary");

export const fetchTransactions = (portfolioId = null) =>
  get(portfolioId ? `/api/transactions?portfolio_id=${encodeURIComponent(portfolioId)}` : "/api/transactions");

export const fetchMarketQuote = (symbol) => get(`/api/market/quote/${encodeURIComponent(symbol)}`);

export const fetchMarketHistory = (symbol, period = "1y") =>
  get(`/api/market/history/${encodeURIComponent(symbol)}?period=${period}`);

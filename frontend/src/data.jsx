// AssetFlow MINI — Mock Data
// Seeded RNG
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const PORTFOLIOS = [
  { id: "div", name: "Dividend Growth", value: 184320, cost: 162400, holdings: 12, currency: "USD", color: "#10b981" },
  { id: "tech", name: "Tech Growth", value: 247850, cost: 198200, holdings: 8, currency: "USD", color: "#6366f1" },
  { id: "crypto", name: "Crypto & Speculative", value: 42180, cost: 58400, holdings: 5, currency: "USD", color: "#f59e0b" },
  { id: "etf", name: "ETF Core", value: 312640, cost: 285100, holdings: 6, currency: "USD", color: "#06b6d4" },
];

const WATCHLIST_TICKERS = [
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 924.79, change: 18.42, changePct: 2.03, marketCap: "2.28T", sector: "Technology" },
  { symbol: "AAPL", name: "Apple Inc.", price: 189.84, change: -1.23, changePct: -0.64, marketCap: "2.94T", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 428.52, change: 3.18, changePct: 0.75, marketCap: "3.18T", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 178.36, change: 2.84, changePct: 1.62, marketCap: "2.21T", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 186.49, change: -0.92, changePct: -0.49, marketCap: "1.94T", sector: "Consumer" },
  { symbol: "META", name: "Meta Platforms", price: 502.30, change: 8.14, changePct: 1.65, marketCap: "1.28T", sector: "Technology" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.42, change: -4.18, changePct: -1.65, marketCap: "790B", sector: "Consumer" },
  { symbol: "JPM", name: "JPMorgan Chase", price: 198.64, change: 1.42, changePct: 0.72, marketCap: "572B", sector: "Finance" },
  { symbol: "V", name: "Visa Inc.", price: 284.18, change: 0.84, changePct: 0.30, marketCap: "584B", sector: "Finance" },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 156.72, change: -0.48, changePct: -0.31, marketCap: "378B", sector: "Healthcare" },
  { symbol: "UNH", name: "UnitedHealth Group", price: 524.30, change: 6.12, changePct: 1.18, marketCap: "484B", sector: "Healthcare" },
  { symbol: "XOM", name: "Exxon Mobil Corp.", price: 112.84, change: 2.36, changePct: 2.14, marketCap: "452B", sector: "Energy" },
];

// Tech Growth holdings
const TECH_HOLDINGS = [
  { symbol: "NVDA", name: "NVIDIA Corporation", shares: 120, avgPrice: 680.40, currentPrice: 924.79, sector: "Semiconductors", country: "US" },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 85, avgPrice: 380.20, currentPrice: 428.52, sector: "Software", country: "US" },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 200, avgPrice: 142.80, currentPrice: 178.36, sector: "Internet", country: "US" },
  { symbol: "META", name: "Meta Platforms", shares: 60, avgPrice: 420.50, currentPrice: 502.30, sector: "Internet", country: "US" },
  { symbol: "AAPL", name: "Apple Inc.", shares: 150, avgPrice: 168.20, currentPrice: 189.84, sector: "Hardware", country: "US" },
  { symbol: "TSM", name: "Taiwan Semi", shares: 180, avgPrice: 108.40, currentPrice: 142.18, sector: "Semiconductors", country: "TW" },
  { symbol: "ASML", name: "ASML Holding", shares: 25, avgPrice: 684.20, currentPrice: 912.40, sector: "Semiconductors", country: "NL" },
  { symbol: "CRM", name: "Salesforce Inc.", shares: 90, avgPrice: 248.60, currentPrice: 272.84, sector: "Software", country: "US" },
];

const TECH_TRANSACTIONS = [
  { date: "2026-04-28", type: "Buy", symbol: "NVDA", shares: 20, price: 918.40, fees: 4.99, portfolio: "Tech Growth" },
  { date: "2026-04-25", type: "Sell", symbol: "CRM", shares: 10, price: 268.20, fees: 4.99, portfolio: "Tech Growth" },
  { date: "2026-04-22", type: "Dividend", symbol: "MSFT", shares: 85, price: 0.75, fees: 0, portfolio: "Tech Growth" },
  { date: "2026-04-18", type: "Buy", symbol: "ASML", shares: 5, price: 895.60, fees: 4.99, portfolio: "Tech Growth" },
  { date: "2026-04-15", type: "Buy", symbol: "META", shares: 15, price: 488.30, fees: 4.99, portfolio: "Tech Growth" },
];

const ALL_TRANSACTIONS = [
  { date: "2026-04-28", type: "Buy", symbol: "NVDA", shares: 20, price: 918.40, fees: 4.99, portfolio: "Tech Growth" },
  { date: "2026-04-27", type: "Dividend", symbol: "JNJ", shares: 100, price: 1.24, fees: 0, portfolio: "Dividend Growth" },
  { date: "2026-04-25", type: "Sell", symbol: "CRM", shares: 10, price: 268.20, fees: 4.99, portfolio: "Tech Growth" },
  { date: "2026-04-24", type: "Buy", symbol: "VOO", shares: 15, price: 512.80, fees: 0, portfolio: "ETF Core" },
  { date: "2026-04-22", type: "Dividend", symbol: "MSFT", shares: 85, price: 0.75, fees: 0, portfolio: "Tech Growth" },
  { date: "2026-04-20", type: "Sell", symbol: "TSLA", shares: 25, price: 252.40, fees: 4.99, portfolio: "Crypto & Speculative" },
  { date: "2026-04-18", type: "Buy", symbol: "ASML", shares: 5, price: 895.60, fees: 4.99, portfolio: "Tech Growth" },
  { date: "2026-04-16", type: "Dividend", symbol: "KO", shares: 200, price: 0.485, fees: 0, portfolio: "Dividend Growth" },
  { date: "2026-04-15", type: "Buy", symbol: "META", shares: 15, price: 488.30, fees: 4.99, portfolio: "Tech Growth" },
  { date: "2026-04-12", type: "Buy", symbol: "XOM", shares: 50, price: 108.20, fees: 4.99, portfolio: "Dividend Growth" },
  { date: "2026-04-10", type: "Sell", symbol: "AMZN", shares: 30, price: 184.60, fees: 4.99, portfolio: "Tech Growth" },
  { date: "2026-04-08", type: "Dividend", symbol: "V", shares: 80, price: 0.52, fees: 0, portfolio: "Dividend Growth" },
  { date: "2026-04-05", type: "Buy", symbol: "BTC-USD", shares: 0.5, price: 68420, fees: 12.50, portfolio: "Crypto & Speculative" },
  { date: "2026-04-02", type: "Buy", symbol: "QQQ", shares: 20, price: 448.20, fees: 0, portfolio: "ETF Core" },
  { date: "2026-03-28", type: "Sell", symbol: "INTC", shares: 100, price: 42.80, fees: 4.99, portfolio: "Tech Growth" },
];

const SCREENER_STOCKS = [
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", marketCap: "2.28T", pe: 64.2, revGrowth: 122.4, divYield: 0.02, perf6m: 42.8, price: 924.79 },
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", marketCap: "2.94T", pe: 28.4, revGrowth: 4.8, divYield: 0.54, perf6m: 8.2, price: 189.84 },
  { symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", marketCap: "3.18T", pe: 36.2, revGrowth: 18.2, divYield: 0.72, perf6m: 14.6, price: 428.52 },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", marketCap: "2.21T", pe: 24.8, revGrowth: 14.4, divYield: 0.48, perf6m: 18.4, price: 178.36 },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer", marketCap: "1.94T", pe: 42.6, revGrowth: 12.8, divYield: 0, perf6m: 22.1, price: 186.49 },
  { symbol: "META", name: "Meta Platforms", sector: "Technology", marketCap: "1.28T", pe: 26.4, revGrowth: 24.8, divYield: 0.38, perf6m: 28.4, price: 502.30 },
  { symbol: "JPM", name: "JPMorgan Chase", sector: "Finance", marketCap: "572B", pe: 11.8, revGrowth: 8.4, divYield: 2.42, perf6m: 12.6, price: 198.64 },
  { symbol: "V", name: "Visa Inc.", sector: "Finance", marketCap: "584B", pe: 31.2, revGrowth: 10.2, divYield: 0.74, perf6m: 6.8, price: 284.18 },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", marketCap: "378B", pe: 16.4, revGrowth: 2.8, divYield: 3.12, perf6m: -2.4, price: 156.72 },
  { symbol: "UNH", name: "UnitedHealth Group", sector: "Healthcare", marketCap: "484B", pe: 22.8, revGrowth: 12.4, divYield: 1.42, perf6m: 8.4, price: 524.30 },
  { symbol: "XOM", name: "Exxon Mobil Corp.", sector: "Energy", marketCap: "452B", pe: 12.4, revGrowth: -4.2, divYield: 3.48, perf6m: -6.8, price: 112.84 },
  { symbol: "PG", name: "Procter & Gamble", sector: "Consumer", marketCap: "384B", pe: 26.8, revGrowth: 3.2, divYield: 2.38, perf6m: 4.2, price: 164.28 },
  { symbol: "LLY", name: "Eli Lilly & Co.", sector: "Healthcare", marketCap: "742B", pe: 82.4, revGrowth: 28.6, divYield: 0.68, perf6m: 32.4, price: 784.50 },
  { symbol: "TSM", name: "Taiwan Semi", sector: "Technology", marketCap: "648B", pe: 22.4, revGrowth: 32.8, divYield: 1.52, perf6m: 24.8, price: 142.18 },
  { symbol: "BRK.B", name: "Berkshire Hathaway", sector: "Finance", marketCap: "892B", pe: 8.4, revGrowth: 6.8, divYield: 0, perf6m: 18.2, price: 418.72 },
];

const INDICES = [
  { name: "S&P 500", value: 5482.14, change: 0.62 },
  { name: "Nasdaq 100", value: 19284.42, change: 1.18 },
  { name: "Dow Jones", value: 41208.18, change: 0.18 },
  { name: "VIX", value: 14.82, change: -2.18 },
  { name: "10Y Yield", value: 4.318, change: 0.04 },
];

const NVDA_STATS = {
  price: 924.79, change: 18.42, changePct: 2.03,
  marketCap: "2.28T", pe: 64.2, eps: 14.40, beta: 1.68,
  high52: 974.94, low52: 473.20, divYield: "0.02%", revGrowth: "122.4%",
  revenue: "$79.8B", netIncome: "$42.4B", fcf: "$38.2B", roe: "115.4%",
  grossMargin: "72.8%", opMargin: "54.2%", debtEquity: "0.41", netMargin: "53.1%",
  sector: "Technology", exchange: "NASDAQ",
};

const NVDA_NEWS = [
  { time: "2h ago", source: "Reuters", headline: "NVIDIA unveils next-gen Blackwell Ultra GPU architecture at GTC 2026" },
  { time: "4h ago", source: "Bloomberg", headline: "Data center revenue surges 180% YoY as AI infrastructure demand accelerates" },
  { time: "6h ago", source: "CNBC", headline: "Morgan Stanley raises NVDA price target to $1,100 citing AI tailwinds" },
  { time: "1d ago", source: "TechCrunch", headline: "NVIDIA partners with leading cloud providers on sovereign AI initiatives" },
];

// Generate sparkline data
function generateSparkline(seed, points = 30) {
  const rng = mulberry32(seed);
  const data = [50];
  for (let i = 1; i < points; i++) {
    data.push(Math.max(10, Math.min(90, data[i-1] + (rng() - 0.48) * 8)));
  }
  return data;
}

// Generate performance line data (12 months)
function generatePerfLine(seed, months = 12, startVal = 100) {
  const rng = mulberry32(seed);
  const data = [startVal];
  for (let i = 1; i < months * 4; i++) {
    data.push(data[i-1] * (1 + (rng() - 0.45) * 0.04));
  }
  return data;
}

// Candlestick data
function generateCandles(seed, count, startPrice, vol = 0.02, targetClose = 924.79) {
  const rng = mulberry32(seed);
  const candles = [];
  let price = startPrice;
  const now = Date.now();
  for (let i = count - 1; i >= 0; i--) {
    const open = price;
    const change = (rng() - 0.45) * vol * open;
    const close = open + change;
    const high = Math.max(open, close) + rng() * vol * open * 0.5;
    const low = Math.min(open, close) - rng() * vol * open * 0.5;
    const volume = Math.floor(30000000 + rng() * 60000000);
    candles.push({ t: now - i * 86400000, o: open, h: high, l: low, c: close, v: volume });
    price = close;
  }
  // Scale so last close matches target
  const scale = targetClose / candles[candles.length - 1].c;
  return candles.map(c => ({ ...c, o: c.o*scale, h: c.h*scale, l: c.l*scale, c: c.c*scale }));
}

// Aggregate daily candles into weekly/monthly buckets
function aggregateCandles(daily, bucket) {
  const out = [];
  for (let i = 0; i < daily.length; i += bucket) {
    const slice = daily.slice(i, i + bucket);
    if (!slice.length) break;
    out.push({
      t: slice[0].t,
      o: slice[0].o,
      c: slice[slice.length - 1].c,
      h: Math.max(...slice.map(s => s.h)),
      l: Math.min(...slice.map(s => s.l)),
      v: slice.reduce((s, x) => s + x.v, 0),
    });
  }
  return out;
}

// Helper: generate a continuous intraday-style series (used for 4h)
function generateIntradaySeries(seed, count, startPrice, vol) {
  return generateIntradaySeriesGeneric(seed, count, startPrice, vol, 4 * 60 * 60 * 1000);
}
function generateIntradaySeriesGeneric(seed, count, startPrice, vol, stepMs) {
  const rng = mulberry32(seed);
  const out = []; let price = startPrice;
  const now = Date.now();
  for (let i = count - 1; i >= 0; i--) {
    const open = price;
    const change = (rng() - 0.47) * vol * open;
    const close = open + change;
    const high = Math.max(open, close) + rng() * vol * open * 0.5;
    const low  = Math.min(open, close) - rng() * vol * open * 0.5;
    const volume = Math.floor(2_000_000 + rng() * 6_000_000);
    out.push({ t: now - i * stepMs, o: open, h: high, l: low, c: close, v: volume });
    price = close;
  }
  return out;
}

// Build candle datasets — each TF means "interval per candle". Always render ~250 bars.
const _daily20y   = generateCandles(42, 5040, 18, 0.022);   // 20y of daily bars (synthetic deep history)
const _daily5y    = _daily20y.slice(-1260);
const _daily1y    = _daily20y.slice(-252);
const _daily6m    = _daily20y.slice(-126);

// Candle-mode intervals: 30m, 1h, 4h, 1D, 1W, 1M  — each shows ~250 bars
const _candle30m   = generateIntradaySeriesGeneric(57, 250, 30, 0.0035, 30 * 60 * 1000);  // 30m bars × 250
const _candle1h    = generateIntradaySeriesGeneric(91, 250, 30, 0.005, 60 * 60 * 1000);  // 1h bars × 250
const _candle1d_4h = generateIntradaySeries(13, 250, 30, 0.012);                       // 4h bars × 250
const _candle1d    = _daily20y.slice(-260);                                            // 1D bars × 260
const _candle1w    = aggregateCandles(_daily20y, 5).slice(-260);                       // 1W bars × 260 (~5y window)
const _candle1m    = aggregateCandles(_daily20y, 21).slice(-240);                      // 1M bars × 240 (~20y window)

// Rescale every series so the last close == the global target (924.79)
function rescaleTo(series, target) {
  if (!series.length) return;
  const scale = target / series[series.length - 1].c;
  series.forEach(c => { c.o *= scale; c.h *= scale; c.l *= scale; c.c *= scale; });
}
const TARGET_CLOSE = 924.79;
[_daily20y, _daily5y, _daily1y, _daily6m, _candle30m, _candle1h, _candle1d_4h, _candle1d, _candle1w, _candle1m]
  .forEach(s => rescaleTo(s, TARGET_CLOSE));

// CANDLE-MODE: per-candle interval
const NVDA_CANDLES_BY_TF = {
  "30m": _candle30m,    // each candle = 30 minutes
  "1h": _candle1h,      // each candle = 1 hour
  "4h": _candle1d_4h,   // each candle = 4 hours
  "1D": _candle1d,      // each candle = 1 day
  "1W": _candle1w,      // each candle = 1 week
  "1M": _candle1m,      // each candle = 1 month
};

// LINE/AREA-MODE: visible window
const NVDA_LINE_BY_TF = {
  "1W": _daily20y.slice(-5),
  "1M": _daily20y.slice(-22),
  "6M": _daily6m,
  "1Y": _daily1y,
  "5Y": _daily5y,
  "Max": _daily20y,
};

// Backwards-compat default = 1Y daily
const NVDA_CANDLES = _daily1y;

function cloneSeries(series) {
  return series.map(c => ({ ...c }));
}

function buildTickerChartData(stock, index) {
  const seed = stock.symbol.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) + index * 97;
  const target = stock.price;
  const baseVol = stock.sector === "Technology" ? 0.022 : stock.sector === "Energy" ? 0.018 : 0.014;
  const daily20y = generateCandles(seed, 5040, Math.max(5, target * 0.25), baseVol, target);
  const daily5y = daily20y.slice(-1260);
  const daily1y = daily20y.slice(-252);
  const daily6m = daily20y.slice(-126);
  const candle30m = generateIntradaySeriesGeneric(seed + 11, 250, Math.max(5, target * 0.9), baseVol * 0.16, 30 * 60 * 1000);
  const candle1h = generateIntradaySeriesGeneric(seed + 23, 250, Math.max(5, target * 0.88), baseVol * 0.22, 60 * 60 * 1000);
  const candle4h = generateIntradaySeries(seed + 37, 250, Math.max(5, target * 0.75), baseVol * 0.45);
  const candle1d = daily20y.slice(-260);
  const candle1w = aggregateCandles(daily20y, 5).slice(-260);
  const candle1m = aggregateCandles(daily20y, 21).slice(-240);

  [candle30m, candle1h, candle4h, candle1d, candle1w, candle1m].forEach(series => rescaleTo(series, target));

  return {
    candles: daily1y,
    candlesByTf: {
      "30m": candle30m,
      "1h": candle1h,
      "4h": candle4h,
      "1D": candle1d,
      "1W": candle1w,
      "1M": candle1m,
    },
    lineByTf: {
      "1W": daily20y.slice(-5),
      "1M": daily20y.slice(-22),
      "6M": daily6m,
      "1Y": daily1y,
      "5Y": daily5y,
      "Max": daily20y,
    },
  };
}

const TICKER_CHARTS = {};
SCREENER_STOCKS.forEach((stock, index) => {
  TICKER_CHARTS[stock.symbol] = stock.symbol === "NVDA"
    ? {
        candles: cloneSeries(NVDA_CANDLES),
        candlesByTf: Object.fromEntries(Object.entries(NVDA_CANDLES_BY_TF).map(([tf, series]) => [tf, cloneSeries(series)])),
        lineByTf: Object.fromEntries(Object.entries(NVDA_LINE_BY_TF).map(([tf, series]) => [tf, cloneSeries(series)])),
      }
    : buildTickerChartData(stock, index);
});

// Portfolio sparklines
PORTFOLIOS.forEach((p, i) => {
  p.sparkline = generateSparkline(i * 137 + 42);
  p.perfLine = generatePerfLine(i * 211 + 17, 12, p.cost);
});

// Watchlist sparklines
WATCHLIST_TICKERS.forEach((t, i) => {
  t.sparkline = generateSparkline(t.symbol.charCodeAt(0) * 137 + i);
});

// Top holdings for overview
const TOP_HOLDINGS = [
  { symbol: "NVDA", name: "NVIDIA Corporation", value: 110975, allocation: 14.1, gainPct: 35.9 },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", value: 89420, allocation: 11.4, gainPct: 18.2 },
  { symbol: "MSFT", name: "Microsoft Corp.", value: 76424, allocation: 9.7, gainPct: 12.7 },
  { symbol: "GOOGL", name: "Alphabet Inc.", value: 71344, allocation: 9.1, gainPct: 24.9 },
  { symbol: "AAPL", name: "Apple Inc.", value: 56952, allocation: 7.2, gainPct: 12.9 },
  { symbol: "META", name: "Meta Platforms", value: 50230, allocation: 6.4, gainPct: 19.4 },
];

// Allocation breakdown
const ALLOCATION_DATA = [
  { label: "Technology", pct: 42, color: "#6366f1" },
  { label: "ETFs / Index", pct: 22, color: "#06b6d4" },
  { label: "Finance", pct: 14, color: "#10b981" },
  { label: "Healthcare", pct: 10, color: "#f59e0b" },
  { label: "Energy", pct: 7, color: "#ef4444" },
  { label: "Other", pct: 5, color: "#94a3b8" },
];

// ---------- v3 additions ----------

// AI Portfolio Summary (top-level narrative)
const AI_PORTFOLIO_SUMMARY = {
  generated: "Apr 30, 2026 · 9:42 AM",
  headline: "Tech-heavy portfolio outperforming, but concentration risk is rising",
  bullets: [
    { tone: "good",  text: "NVDA is up +35.9% on cost basis and now drives 14.1% of total value — your biggest single contributor." },
    { tone: "watch", text: "Technology exposure has grown to 42% of net worth, vs. your 30% target — drift of +12 pts." },
    { tone: "good",  text: "Dividend Growth book is yielding ~3.4% blended; on track for $6,420 in projected 2026 income." },
    { tone: "risk",  text: "Crypto & Speculative is down -27.8% YTD; consider tax-loss harvesting before quarter-end." },
  ],
};

// Risk / Insight alerts
const RISK_ALERTS = [
  { id: "conc-tech", level: "warning", title: "Concentration: Technology",
    body: "42% of portfolio in Tech vs 30% target. NVDA + MSFT + GOOGL alone make up 32.9%.",
    cta: "Rebalance" },
  { id: "drift-crypto", level: "info", title: "Allocation drift: Crypto",
    body: "Crypto sleeve has fallen to 5.4% (target 8%). Add ~$21K to rebalance.",
    cta: "View sleeve" },
  { id: "earnings-nvda", level: "info", title: "Upcoming earnings",
    body: "NVDA reports May 22 after market close. Implied move ±7.4%.",
    cta: "Open NVDA" },
  { id: "loss-tsla", level: "danger", title: "Tax-loss opportunity",
    body: "TSLA position sits at -$1,240 unrealized. Wash-sale window clear in 4 days.",
    cta: "Review" },
];

// Target vs actual allocation (sector level)
const TARGET_VS_ACTUAL = [
  { label: "Technology",     actual: 42, target: 30, color: "#6366f1" },
  { label: "ETFs / Index",   actual: 22, target: 25, color: "#06b6d4" },
  { label: "Finance",        actual: 14, target: 15, color: "#10b981" },
  { label: "Healthcare",     actual: 10, target: 12, color: "#f59e0b" },
  { label: "Energy",         actual:  7, target:  6, color: "#ef4444" },
  { label: "Crypto / Spec.", actual:  5, target:  8, color: "#a855f7" },
  { label: "Cash",           actual:  0, target:  4, color: "#94a3b8" },
];

// Today's biggest contributors to P&L
const TODAY_CONTRIBUTORS = [
  { symbol: "NVDA", contribution: +2210, pct: +2.03 },
  { symbol: "META", contribution:  +488, pct: +1.65 },
  { symbol: "MSFT", contribution:  +270, pct: +0.75 },
  { symbol: "TSLA", contribution:  -418, pct: -1.65 },
  { symbol: "AAPL", contribution:  -184, pct: -0.64 },
];

// 52-week high/low watch
const PRICE_LEVELS = [
  { symbol: "NVDA", state: "Near 52W high",  distance: "-5.1% from high" },
  { symbol: "META", state: "Near 52W high",  distance: "-3.4% from high" },
  { symbol: "JNJ",  state: "Near 52W low",   distance: "+2.8% from low"  },
  { symbol: "XOM",  state: "Near 52W low",   distance: "+4.2% from low"  },
];

// Watchlist alerts (price + AI signals)
const WATCHLIST_SIGNALS = {
  "NVDA":  { signal: "Bullish",  note: "Earnings catalyst + analyst upgrade",  variant: "green" },
  "AAPL":  { signal: "Neutral",  note: "Mixed services growth",                variant: "default" },
  "MSFT":  { signal: "Bullish",  note: "Azure AI revenue acceleration",        variant: "green" },
  "GOOGL": { signal: "Bullish",  note: "Search AI integration positive",       variant: "green" },
  "AMZN":  { signal: "Neutral",  note: "AWS margins steady",                   variant: "default" },
  "META":  { signal: "Bullish",  note: "Reels monetization improving",         variant: "green" },
  "TSLA":  { signal: "Bearish",  note: "Demand softening in EU",               variant: "red" },
  "JPM":   { signal: "Neutral",  note: "Rate path uncertainty",                variant: "default" },
  "V":     { signal: "Neutral",  note: "Cross-border volume strong",           variant: "default" },
  "JNJ":   { signal: "Bearish",  note: "Litigation overhang",                  variant: "red" },
  "UNH":   { signal: "Neutral",  note: "Medical loss ratio in line",           variant: "default" },
  "XOM":   { signal: "Neutral",  note: "Oil range-bound",                      variant: "default" },
};

const WATCHLIST_ALERTS = [
  { symbol: "NVDA", kind: "Price",   text: "Crossed above $900 alert threshold",  time: "1h ago" },
  { symbol: "TSLA", kind: "News",    text: "Negative news: Q2 deliveries miss",   time: "3h ago" },
  { symbol: "META", kind: "Signal",  text: "Volume +180% vs 30d avg",             time: "5h ago" },
  { symbol: "AAPL", kind: "Earnings",text: "Earnings tomorrow after close",       time: "yesterday" },
];

// Dividend forecast — next 12 months
const DIVIDEND_FORECAST = [
  { month: "May", amount: 412 }, { month: "Jun", amount: 524 }, { month: "Jul", amount: 388 },
  { month: "Aug", amount: 612 }, { month: "Sep", amount: 444 }, { month: "Oct", amount: 528 },
  { month: "Nov", amount: 396 }, { month: "Dec", amount: 718 }, { month: "Jan", amount: 432 },
  { month: "Feb", amount: 504 }, { month: "Mar", amount: 412 }, { month: "Apr", amount: 552 },
];

// Per-screener AI quality score
const AI_SCORES = {
  "NVDA": { score: 88, tag: "Quality" }, "AAPL": { score: 82, tag: "Quality" }, "MSFT": { score: 91, tag: "Quality" },
  "GOOGL":{ score: 86, tag: "Quality" }, "AMZN": { score: 79, tag: "Growth"  }, "META": { score: 84, tag: "Growth"  },
  "JPM":  { score: 76, tag: "Value"   }, "V":    { score: 81, tag: "Quality" }, "JNJ":  { score: 68, tag: "Value"   },
  "UNH":  { score: 74, tag: "Quality" }, "XOM":  { score: 62, tag: "Value"   }, "PG":   { score: 73, tag: "Quality" },
  "LLY":  { score: 89, tag: "Growth"  }, "TSM":  { score: 87, tag: "Quality" }, "BRK.B":{ score: 84, tag: "Value"   },
};

// Monthly cashflow timeline (transactions screen)
const CASHFLOW_TIMELINE = [
  { month: "Nov",  buys: 18400, sells:  6200, divs: 480 },
  { month: "Dec",  buys: 22100, sells:  4100, divs: 612 },
  { month: "Jan",  buys: 14200, sells:  9800, divs: 432 },
  { month: "Feb",  buys: 19800, sells:  3200, divs: 504 },
  { month: "Mar",  buys: 11400, sells: 12800, divs: 412 },
  { month: "Apr",  buys: 28640, sells:  8920, divs: 552 },
];

// NVDA "analyst score" card values
const NVDA_SCORECARD = {
  overall: 88,
  growth: 95, value: 32, profitability: 88, momentum: 82, risk: 58,
  consensus: "Buy", priceTarget: 1078, upside: 16.6,
};

// Stocks-near-extremes helper for ticker detail
const NVDA_EXTREMES = { from52High: -5.1, from52Low: 95.4 };

// Local-first data sources (settings) — freshness/status, not quotas
const DATA_SOURCES = [
  {
    group: "Market Data",
    name: "Yahoo Finance / yfinance",
    status: "Connected · Cached",
    statusVariant: "green",
    rows: [
      ["Last price refresh", "2 min ago"],
      ["OHLC data", "Available"],
    ],
  },
  {
    group: "News Discovery",
    name: "GDELT",
    status: "Connected",
    statusVariant: "green",
    rows: [
      ["Last news scan", "12 min ago"],
      ["Articles indexed today", "84"],
    ],
  },
  {
    group: "RSS Feeds",
    name: "Optional · User-supplied",
    status: "Not configured",
    statusVariant: "default",
    rows: [],
    action: "Add feed",
  },
  {
    group: "Local AI Analysis",
    name: "Ollama / Local Agent",
    status: "Online",
    statusVariant: "green",
    rows: [
      ["Last portfolio analysis", "6 min ago"],
    ],
  },
];

// AI assistant (your own backend) — personal local-mode profile
const AI_SERVER = {
  status: "online",                    // online | offline
  uptime: "14d 06:42",
  model: "AssetFlow-Llama-3.1-8B-Instruct",
  modelVariant: "Q5_K_M · 8.0B params",
  mode: "Balanced",                    // Fast | Balanced | Deep
  currentTask: "Scanning news",        // Idle | Scanning news | Analyzing portfolio | Running risk check
  lastPortfolioAnalysis: "6 min ago",
  lastNewsScan: "2 min ago",
  lastRiskCheck: "1h 12m ago",
  avgResponseMs: 1420,
  queueDepth: 0,
  queueWait: "—",
  gpu: "RTX 4090 · 24 GB",
  gpuLoad: 0.42,                       // 0..1
  vramUsed: 11.2,                      // GB
  vramTotal: 24,                       // GB
  cpuLoad: 0.18,                       // 0..1
  ramUsed: 9.4,                        // GB
  ramTotal: 32,                        // GB
  schedule: {
    portfolioSummary: "Every 6 hours",
    newsScan:         "Every 15 minutes",
    riskCheck:        "Daily · 9:30 AM ET",
  },
};

// Refresh schedule
const REFRESH_SCHEDULE = {
  prices: "Every 5 minutes (market hours)",
  fundamentals: "Daily · 6:00 PM ET",
  news: "Every 15 minutes",
  ai: "On dashboard load",
};

export const AF_DATA = {
  PORTFOLIOS, WATCHLIST_TICKERS, TECH_HOLDINGS, TECH_TRANSACTIONS,
  ALL_TRANSACTIONS, SCREENER_STOCKS, INDICES, NVDA_STATS, NVDA_NEWS,
  NVDA_CANDLES, NVDA_CANDLES_BY_TF, NVDA_LINE_BY_TF, TICKER_CHARTS, TOP_HOLDINGS, ALLOCATION_DATA, generateSparkline,
  mulberry32,
  // v3
  AI_PORTFOLIO_SUMMARY, RISK_ALERTS, TARGET_VS_ACTUAL, TODAY_CONTRIBUTORS,
  PRICE_LEVELS, WATCHLIST_SIGNALS, WATCHLIST_ALERTS, DIVIDEND_FORECAST,
  AI_SCORES, CASHFLOW_TIMELINE, NVDA_SCORECARD, NVDA_EXTREMES,
  DATA_SOURCES, AI_SERVER, REFRESH_SCHEDULE,
};

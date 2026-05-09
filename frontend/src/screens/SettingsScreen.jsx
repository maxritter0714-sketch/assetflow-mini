import React from "react";
import { ThemeToggle } from "../theme-toggle.jsx";
import { Badge } from "../components.jsx";
import { cardStyles, mainStyles } from "../styles.js";
import { settingsLabelStyle, inputStyles } from "./secondaryShared.js";
import { AF_DATA } from "../data.jsx";

export function SettingsScreen({ theme, setTheme }) {
  const { DATA_SOURCES, AI_SERVER, REFRESH_SCHEDULE } = AF_DATA;
  const [aiMode, setAiMode] = React.useState(AI_SERVER.mode);

  return (
    <div style={mainStyles.page}>
      <div style={mainStyles.header}>
        <div>
          <h1 style={mainStyles.title}>Settings</h1>
          <p style={mainStyles.subtitle}>Manage your account, data sources, and AI preferences</p>
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 1000 }}>
        {/* Profile */}
        <div style={cardStyles.base}>
          <div style={cardStyles.cardTitle}>Profile</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
            <div>
              <label style={settingsLabelStyle}>Display Name</label>
              <input defaultValue="John Doe" style={inputStyles.text} />
            </div>
            <div>
              <label style={settingsLabelStyle}>Email</label>
              <input defaultValue="john@example.com" style={inputStyles.text} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div style={cardStyles.base}>
          <div style={cardStyles.cardTitle}>Preferences</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
            <div>
              <label style={settingsLabelStyle}>Base Currency</label>
              <select style={inputStyles.select} defaultValue="USD">
                <option>USD</option><option>EUR</option><option>GBP</option><option>JPY</option><option>CHF</option>
              </select>
            </div>
            <div>
              <label style={settingsLabelStyle}>Theme</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[{ k: "light", label: "Light" }, { k: "dark", label: "Dark" }, { k: "system", label: "System" }].map(t => {
                  const active = theme === t.k;
                  return (
                    <button key={t.k} onClick={() => t.k !== "system" && setTheme(t.k)} style={{
                      padding: "7px 16px", borderRadius: 8, border: "1px solid " + (active ? "var(--success)" : "var(--border)"),
                      background: active ? "var(--success-bg)" : "var(--card)", color: active ? "var(--success)" : "var(--muted)",
                      fontSize: 13, fontWeight: 500, cursor: "pointer", flex: 1, fontFamily: "inherit",
                    }}>{t.label}</button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Local AI Assistant — full width */}
        <div style={{ ...cardStyles.base, gridColumn: "1 / span 2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={cardStyles.cardTitle}>Local AI Assistant</span>
                <Badge variant={AI_SERVER.status === "online" ? "green" : "red"} dot>
                  {AI_SERVER.status === "online" ? "Online" : "Offline"}
                </Badge>
                <Badge variant="default">Personal Mode</Badge>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--subtle)", marginTop: 2 }}>
                Self-hosted model running on your machine · uptime {AI_SERVER.uptime}
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: 11, color: "var(--subtle)", lineHeight: 1.5 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--muted)" }}>{AI_SERVER.gpu}</div>
              <div>No daily quotas · limited only by hardware load</div>
            </div>
          </div>

          {/* Top row: model + mode + current task */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ padding: "12px 14px", background: "var(--card-hover)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--subtle)" }}>Selected Model</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginTop: 5, fontFamily: "'JetBrains Mono', monospace" }}>{AI_SERVER.model}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{AI_SERVER.modelVariant}</div>
            </div>
            <div style={{ padding: "12px 14px", background: "var(--card-hover)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--subtle)", marginBottom: 7 }}>Processing Mode</div>
              <div style={{ display: "flex", gap: 4 }}>
                {["Fast", "Balanced", "Deep"].map(m => {
                  const active = aiMode === m;
                  return (
                    <button key={m} onClick={() => setAiMode(m)} style={{
                      flex: 1, padding: "6px 0", borderRadius: 6,
                      border: "1px solid " + (active ? "var(--success)" : "var(--border)"),
                      background: active ? "var(--success-bg)" : "var(--card)",
                      color: active ? "var(--success)" : "var(--muted)",
                      fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}>{m}</button>
                  );
                })}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--subtle)", marginTop: 6, lineHeight: 1.4 }}>
                {aiMode === "Fast" ? "Lower latency · shorter context" : aiMode === "Balanced" ? "Default · ≈3s typical response" : "Higher quality · longer reasoning"}
              </div>
            </div>
            <div style={{ padding: "12px 14px", background: "var(--card-hover)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--subtle)" }}>Current Task</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: 7, background: AI_SERVER.currentTask === "Idle" ? "var(--subtle)" : "var(--success)", boxShadow: AI_SERVER.currentTask === "Idle" ? "none" : "0 0 6px var(--success)" }}></span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{AI_SERVER.currentTask}</span>
              </div>
              <div style={{ fontSize: 10.5, color: "var(--subtle)", marginTop: 4 }}>
                {AI_SERVER.queueDepth === 0 ? "No jobs queued" : `${AI_SERVER.queueDepth} queued · ${AI_SERVER.queueWait}`}
              </div>
            </div>
          </div>

          {/* Hardware utilization */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
            {[
              { label: "GPU Load",     val: Math.round(AI_SERVER.gpuLoad * 100) + "%",                          pct: AI_SERVER.gpuLoad * 100,                                  sub: AI_SERVER.gpu.split(" · ")[0] },
              { label: "VRAM",         val: AI_SERVER.vramUsed.toFixed(1) + " / " + AI_SERVER.vramTotal + " GB", pct: (AI_SERVER.vramUsed / AI_SERVER.vramTotal) * 100,         sub: ((AI_SERVER.vramUsed / AI_SERVER.vramTotal) * 100).toFixed(0) + "% used" },
              { label: "CPU / RAM",    val: Math.round(AI_SERVER.cpuLoad * 100) + "%  ·  " + AI_SERVER.ramUsed.toFixed(1) + " GB", pct: AI_SERVER.cpuLoad * 100,        sub: AI_SERVER.ramUsed.toFixed(1) + " / " + AI_SERVER.ramTotal + " GB RAM" },
            ].map(r => {
              const c = r.pct > 80 ? "var(--danger)" : r.pct > 60 ? "var(--amber)" : "var(--success)";
              return (
                <div key={r.label}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--subtle)" }}>{r.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{r.val}</div>
                  <div style={{ height: 5, background: "var(--neutral-bg)", borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ width: r.pct + "%", height: "100%", background: c }}></div>
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--subtle)", marginTop: 4 }}>{r.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Recent activity + automation schedule */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, paddingTop: 14, borderTop: "1px solid var(--divider)" }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--subtle)", marginBottom: 8 }}>Recent Activity</div>
              {[
                ["Last portfolio analysis", AI_SERVER.lastPortfolioAnalysis],
                ["Last news scan",          AI_SERVER.lastNewsScan],
                ["Last risk check",         AI_SERVER.lastRiskCheck],
                ["Avg response time",       (AI_SERVER.avgResponseMs / 1000).toFixed(2) + "s · " + aiMode + " mode"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12 }}>
                  <span style={{ color: "var(--muted)" }}>{k}</span>
                  <span style={{ color: "var(--text)", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5 }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--subtle)", marginBottom: 8 }}>Automation Schedule</div>
              {[
                ["AI Portfolio Summary", AI_SERVER.schedule.portfolioSummary],
                ["News scan",            AI_SERVER.schedule.newsScan],
                ["Risk check",           AI_SERVER.schedule.riskCheck],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12 }}>
                  <span style={{ color: "var(--muted)" }}>{k}</span>
                  <span style={{ color: "var(--text)", fontWeight: 600, fontSize: 11.5 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Source Health (local-first, MVP stack) */}
        <div style={cardStyles.base}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={cardStyles.cardTitle}>Data Source Health</span>
            <span style={{ fontSize: 11, color: "var(--subtle)" }}>Local-first · no quotas</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {DATA_SOURCES.map(d => (
              <div key={d.group} style={{ padding: "12px 14px", background: "var(--card-hover)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--subtle)" }}>{d.group}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>{d.name}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <Badge variant={d.statusVariant} dot={d.statusVariant === "green"}>{d.status}</Badge>
                    {d.action && <button style={{ ...mainStyles.btnSecondary, padding: "4px 10px", fontSize: 11.5 }}>{d.action}</button>}
                  </div>
                </div>
                {d.rows.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--divider)" }}>
                    {d.rows.map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                        <span style={{ color: "var(--muted)" }}>{k}</span>
                        <span style={{ color: "var(--text-soft)", fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Refresh Schedule */}
        <div style={cardStyles.base}>
          <div style={cardStyles.cardTitle}>Refresh Schedule</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8 }}>
            {[
              ["Live prices", REFRESH_SCHEDULE.prices],
              ["Fundamentals", REFRESH_SCHEDULE.fundamentals],
              ["News feed", REFRESH_SCHEDULE.news],
              ["AI insights", REFRESH_SCHEDULE.ai],
            ].map(([k, v], i, arr) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
              </div>
            ))}
          </div>
          <button style={{ ...mainStyles.btnSecondary, width: "100%", justifyContent: "center", marginTop: 12 }}>Refresh All Now</button>
        </div>

        {/* AI / News Settings */}
        <div style={cardStyles.base}>
          <div style={cardStyles.cardTitle}>AI & News Preferences</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8 }}>
            {[
              { label: "AI portfolio summary on home", on: true },
              { label: "Risk alerts (concentration / drift)", on: true },
              { label: "News sentiment scoring", on: true },
              { label: "Earnings reminders", on: true },
              { label: "Tax-loss suggestions", on: false },
              { label: "Suggested watchlist actions", on: true },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none" }}>
                <span style={{ fontSize: 13, color: "var(--text)" }}>{row.label}</span>
                <div style={{ width: 32, height: 18, borderRadius: 10, background: row.on ? "var(--success)" : "var(--neutral-bg)", position: "relative", cursor: "pointer", transition: "background 0.15s" }}>
                  <div style={{ position: "absolute", top: 2, left: row.on ? 16 : 2, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.15s", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Import / Export */}
        <div style={{ ...cardStyles.base, gridColumn: "1 / span 2" }}>
          <div style={cardStyles.cardTitle}>Import & Export</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            <div style={{ padding: "18px", background: "var(--card-hover)", borderRadius: 8, border: "1px dashed var(--border-strong)", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Import Transactions (CSV)</div>
              <div style={{ fontSize: 11.5, color: "var(--subtle)" }}>Drop a file or click to browse</div>
            </div>
            <div style={{ padding: "18px", background: "var(--card-hover)", borderRadius: 8, border: "1px solid var(--border)", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Export All Data</div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 6 }}>
                <button style={{ ...mainStyles.btnSecondary, padding: "5px 12px", fontSize: 11.5 }}>CSV</button>
                <button style={{ ...mainStyles.btnSecondary, padding: "5px 12px", fontSize: 11.5 }}>JSON</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

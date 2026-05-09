// Shared inline style objects. Theme values live in index.css as CSS variables.
export const mainStyles = {
  page: { padding: "28px 32px", overflowY: "auto", height: "100%" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.035em", margin: 0 },
  subtitle: { fontSize: 14, color: "var(--muted)", margin: "6px 0 0", letterSpacing: "-0.005em" },
  btnPrimary: { padding: "9px 18px", borderRadius: 9, border: "none", background: "var(--text)", color: "var(--card)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "inherit", letterSpacing: "-0.005em", boxShadow: "var(--shadow-sm)" },
  btnSecondary: { padding: "9px 16px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text-soft)", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "inherit", letterSpacing: "-0.005em", boxShadow: "var(--shadow-sm)" },
  btnIcon: { width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text-soft)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", boxShadow: "var(--shadow-sm)", transition: "all 0.15s" },
};

export const cardStyles = {
  base: { background: "var(--card)", borderRadius: 14, padding: "18px 22px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" },
  portfolio: { background: "var(--card)", borderRadius: 14, padding: "18px 22px", border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.18s ease", boxShadow: "var(--shadow-sm)", position: "relative", overflow: "hidden" },
  cardTitle: { fontSize: 13.5, fontWeight: 600, color: "var(--text)", marginBottom: 14, letterSpacing: "-0.01em" },
};

export const tableStyles = {
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", fontWeight: 600, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--subtle)", padding: "10px 14px", borderBottom: "1px solid var(--border)", background: "var(--card-2)" },
  td: { padding: "12px 14px", borderBottom: "1px solid var(--divider)", fontSize: 13, letterSpacing: "-0.005em", color: "var(--text-soft)" },
  row: {},
};

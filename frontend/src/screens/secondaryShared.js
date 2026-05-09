export const iconBtn = {
  width: 24, height: 24, borderRadius: 6, border: "1px solid var(--border)",
  background: "var(--card)", color: "var(--muted)", fontSize: 11,
  cursor: "pointer", fontFamily: "inherit", display: "inline-grid", placeItems: "center",
};

export const smallBtn = {
  padding: "3px 9px", borderRadius: 5, border: "1px solid var(--border)",
  background: "var(--card)", color: "var(--text-soft)", fontSize: 11, fontWeight: 600,
  cursor: "pointer", fontFamily: "inherit",
};

export const filterGroupStyle = { display: "flex", alignItems: "center", gap: 6 };
export const filterLabelStyle = { fontSize: 11.5, fontWeight: 500, color: "var(--muted)" };
export const settingsLabelStyle = { display: "block", fontSize: 12, fontWeight: 500, color: "var(--muted)", marginBottom: 5 };

export const inputStyles = {
  search: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, color: "var(--text)", outline: "none", fontFamily: "inherit" },
  text: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card-hover)", fontSize: 13, color: "var(--text)", outline: "none", fontFamily: "inherit" },
  select: { padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12, color: "var(--text-soft)", fontFamily: "inherit", cursor: "pointer" },
};

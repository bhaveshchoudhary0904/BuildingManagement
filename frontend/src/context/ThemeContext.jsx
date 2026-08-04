import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

/* ─── Light mode tokens ─────────────────────────────────────────────────── */
export const DARK = {
  bg:        "#000000",
  layoutBg:  "#000000",
  headerBg:  "#111111",
  sidebarBg: "#111111",
  surface:   "#1a1a1a",
  surface2:  "#0a0a0a",
  border:    "transparent",
  rMd:       14,
  ink:       "#ffffff",
  inkSoft:   "#cccccc",
  inkMuted:  "#888888",
  accent:    "#3654E0",
  accentSoft:"#6E83F2",
  accentBg:  "rgba(54,84,224,.15)",
  red:       "#ff4444",
  navItemColor:  "#aaaaaa",
  navActiveText: "#ffffff",
  searchPlaceholder: "#666666",
  isDark: true,
};

export const LIGHT = {
  bg:        "#ffffff",
  layoutBg:  "#ffffff",
  headerBg:  "#f5f5f5",
  sidebarBg: "#f5f5f5",
  surface:   "#ffffff",
  surface2:  "#f0f0f0",
  border:    "transparent",
  rMd:       14,
  ink:       "#000000",
  inkSoft:   "#333333",
  inkMuted:  "#666666",
  accent:    "#3654E0",
  accentSoft:"#6E83F2",
  accentBg:  "rgba(54,84,224,.10)",
  red:       "#cc0000",
  navItemColor:  "#666666",
  navActiveText: "#000000",
  searchPlaceholder: "#999999",
  isDark: false,
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DARK);

  const toggleTheme = () => setTheme(t => (t.isDark ? LIGHT : DARK));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
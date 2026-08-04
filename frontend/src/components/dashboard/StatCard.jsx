import { TrendingUp, TrendingDown } from "lucide-react";

/* ─── Accent map — matches Dashboard.jsx token system ───────────────────── */
const ACCENT = {
  blue:   { stripe: "#6E83F2", glow: "rgba(110,131,242,.12)", text: "#818CF8", iconBg: "rgba(110,131,242,.14)" },
  green:  { stripe: "#36D399", glow: "rgba(54,211,153,.10)",  text: "#34D399", iconBg: "rgba(54,211,153,.13)"  },
  red:    { stripe: "#FF5C5C", glow: "rgba(255,92,92,.10)",   text: "#FF7070", iconBg: "rgba(255,92,92,.13)"   },
  yellow: { stripe: "#FFC857", glow: "rgba(255,200,87,.10)",  text: "#FFC857", iconBg: "rgba(255,200,87,.13)"  },
  purple: { stripe: "#A78BFA", glow: "rgba(167,139,250,.10)", text: "#A78BFA", iconBg: "rgba(167,139,250,.13)" },
  orange: { stripe: "#FB923C", glow: "rgba(251,146,60,.10)",  text: "#FB923C", iconBg: "rgba(251,146,60,.13)"  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 0,
  trendLabel = "",
  color = "blue",
}) => {
  const a = ACCENT[color] || ACCENT.blue;
  const isUp = trend >= 0;

  return (
    <div
      className="group"
      style={{
        position: "relative",
        background: "linear-gradient(165deg, #1B1F29, #13161D)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 14,
        padding: "22px 20px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,.25)",
        transition: "transform .22s ease, box-shadow .22s ease, border-color .22s ease",
        cursor: "default",
        fontFamily: "'Inter', sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 18px 40px rgba(0,0,0,.35), 0 0 0 1px ${a.stripe}33`;
        e.currentTarget.style.borderColor = "rgba(255,255,255,.18)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.25)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
      }}
    >
      {/* ── top accent stripe ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: a.stripe,
        borderRadius: "14px 14px 0 0",
      }} />

      {/* ── background glow blob ── */}
      <div style={{
        position: "absolute", top: -24, right: -24,
        width: 100, height: 100, borderRadius: "50%",
        background: a.glow, filter: "blur(20px)",
        pointerEvents: "none",
      }} />

      {/* ── top row: text + icon ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* label */}
          <p style={{
            margin: 0,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10, fontWeight: 600,
            letterSpacing: ".06em", textTransform: "uppercase",
            color: "#5C6480",
          }}>
            {title}
          </p>

          {/* value */}
          <h2 style={{
            margin: "10px 0 0",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28, fontWeight: 700,
            color: "#F4F5F8", letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}>
            {value}
          </h2>

          {/* subtitle */}
          {subtitle && (
            <p style={{
              margin: "6px 0 0",
              fontSize: 12, color: "#9098B0", lineHeight: 1.4,
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* icon bubble */}
        <div style={{
          width: 44, height: 44, flexShrink: 0,
          borderRadius: 11,
          background: a.iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginTop: 2,
        }}>
          <Icon size={20} color={a.stripe} />
        </div>

      </div>

      {/* ── trend row ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        marginTop: 18,
        paddingTop: 14,
        borderTop: "1px solid rgba(255,255,255,.06)",
      }}>
        {/* trend icon */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 22, height: 22, borderRadius: 6,
          background: isUp ? "rgba(54,211,153,.14)" : "rgba(255,92,92,.14)",
        }}>
          {isUp
            ? <TrendingUp  size={13} color="#36D399" />
            : <TrendingDown size={13} color="#FF5C5C" />}
        </div>

        {/* percent */}
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12, fontWeight: 600,
          color: isUp ? "#36D399" : "#FF5C5C",
          letterSpacing: ".02em",
        }}>
          {isUp ? "+" : "-"}{Math.abs(trend)}%
        </span>

        {/* label */}
        {trendLabel && (
          <span style={{ fontSize: 12, color: "#7C84A0" }}>
            {trendLabel}
          </span>
        )}
      </div>

    </div>
  );
};

export default StatCard;
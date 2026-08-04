import { useEffect, useState } from "react";
import {
  Users,
  Home,
  CreditCard,
  AlertCircle,
  UserCheck,
  Bell,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";
import StatCard from "../../components/dashboard/StatCard";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

/* ─── Stat card accent map ──────────────────────────────────────────────── */
const ACCENT = {
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  purple: { glow: "rgba(167,139,250,.10)", stripe: "#A78BFA", text: "#A78BFA" },
  red:    { glow: "rgba(255,92,92,.10)",   stripe: "#FF5C5C", text: "#FF7070" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
  yellow: { glow: "rgba(255,200,87,.10)",  stripe: "#FFC857", text: "#FFC857" },
};

/* ─── Stat card — styled inline ────────────────────────────────────────── */
function MgStatCard({ title, value, subtitle, icon: Icon, color, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { theme: T } = useTheme();
  const a = ACCENT[color] || ACCENT.blue;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
        border: `1px solid ${hovered ? "rgba(255,255,255,.18)" : T.border}`,
        borderRadius: T.rMd,
        padding: "22px 20px",
        overflow: "hidden",
        boxShadow: hovered
          ? `0 18px 40px rgba(0,0,0,.35), 0 0 0 1px ${a.stripe}22`
          : "0 2px 8px rgba(0,0,0,.25)",
        transform: visible
          ? hovered ? "translateY(-4px)" : "translateY(0)"
          : "translateY(14px)",
        opacity: visible ? 1 : 0,
        transition: `opacity .45s ease ${delay}ms, transform .45s ease ${delay}ms, box-shadow .22s ease, border-color .22s ease`,
      }}
    >
      {/* top accent stripe */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: a.stripe, borderRadius: `${T.rMd}px ${T.rMd}px 0 0`,
      }} />

      {/* bg glow blob */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 90, height: 90, borderRadius: "50%",
        background: a.glow, filter: "blur(18px)", pointerEvents: "none",
      }} />

      {/* icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: `${a.stripe}1A`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14,
      }}>
        <Icon size={18} color={a.stripe} />
      </div>

      {/* label */}
      <span style={{
        display: "block",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10, fontWeight: 600,
        letterSpacing: ".06em", textTransform: "uppercase",
        color: T.inkMuted, marginBottom: 6,
      }}>
        {title}
      </span>

      {/* value */}
      <span style={{
        display: "block",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 26, fontWeight: 700,
        color: T.ink, letterSpacing: "-0.01em",
        lineHeight: 1.1,
      }}>
        {value}
      </span>

      {/* subtitle */}
      <span style={{
        display: "block", marginTop: 5,
        fontSize: 12, color: T.inkSoft,
      }}>
        {subtitle}
      </span>
    </div>
  );
}

/* ─── Summary row card ──────────────────────────────────────────────────── */
function SummaryCard({ label, value, color, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const { theme: T } = useTheme();
  const a = ACCENT[color] || ACCENT.blue;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
      border: `1px solid ${T.border}`,
      borderRadius: T.rMd,
      padding: "20px 18px",
      position: "relative", overflow: "hidden",
      transform: visible ? "translateY(0)" : "translateY(12px)",
      opacity: visible ? 1 : 0,
      transition: `opacity .4s ease ${delay}ms, transform .4s ease ${delay}ms`,
    }}>
      {/* left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 3, background: a.stripe, borderRadius: `${T.rMd}px 0 0 ${T.rMd}px`,
      }} />

      <p style={{
        margin: 0, fontSize: 11,
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: ".05em", textTransform: "uppercase",
        color: T.inkSoft, fontWeight: 600,
      }}>
        {label}
      </p>

      <h3 style={{
        margin: "8px 0 0",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 28, fontWeight: 700,
        color: a.text, letterSpacing: "-0.01em",
      }}>
        {value}
      </h3>
    </div>
  );
}

/* ─── Spinner ───────────────────────────────────────────────────────────── */
function Spinner() {
  const { theme: T } = useTheme();
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh",
      background: T.bg,
    }}>
      <style>{`@keyframes mgSpin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center" }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
          style={{ animation: "mgSpin .8s linear infinite" }}>
          <circle cx="12" cy="12" r="10" stroke={T.accent} strokeWidth="2.5" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <p style={{
          marginTop: 14, color: T.inkSoft, fontSize: 12,
          fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".06em",
        }}>
          LOADING DASHBOARD
        </p>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    residents: 0,
    occupiedFlats: 0,
    totalFlats: 0,
    revenue: 0,
    pendingComplaints: 0,
    visitorsToday: 0,
    notices: 0,
  });

  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [refreshSpin, setRefreshSpin] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard");
      setStats(response.data.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* animate header in once loading is done */
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setHeaderVisible(true), 60);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleRefresh = () => {
    setRefreshSpin(true);
    setHeaderVisible(false);
    loadDashboard().then(() => {
      setTimeout(() => setRefreshSpin(false), 600);
    });
  };

  if (loading) return <Spinner />;

  const statCards = [
    { title: "Residents",          value: stats.residents,                               subtitle: "Registered Residents",  icon: Users,       color: "blue"   },
    { title: "Occupied Flats",     value: `${stats.occupiedFlats}/${stats.totalFlats}`,  subtitle: "Current Occupancy",     icon: Home,        color: "green"  },
    { title: "Revenue",            value: `₹${Number(stats.revenue).toLocaleString()}`,  subtitle: "Maintenance Collection",icon: CreditCard,  color: "purple" },
    { title: "Pending Complaints", value: stats.pendingComplaints,                       subtitle: "Awaiting Resolution",   icon: AlertCircle, color: "red"    },
    { title: "Visitors Today",     value: stats.visitorsToday,                           subtitle: "Today's Entries",       icon: UserCheck,   color: "orange" },
    { title: "Active Notices",     value: stats.notices,                                 subtitle: "Published Notices",     icon: Bell,        color: "yellow" },
  ];

  const summaryCards = [
    { label: "Total Residents",     value: stats.residents,                              color: "blue"   },
    { label: "Occupancy",           value: `${stats.occupiedFlats}/${stats.totalFlats}`, color: "green"  },
    { label: "Revenue",             value: `₹${Number(stats.revenue).toLocaleString()}`, color: "purple" },
    { label: "Pending Complaints",  value: stats.pendingComplaints,                      color: "red"    },
    { label: "Visitors Today",      value: stats.visitorsToday,                          color: "orange" },
    { label: "Active Notices",      value: stats.notices,                                color: "yellow" },
  ];

  return (
    <>
      <style>{`
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: T.bg,
        padding: "36px 38px 64px",
        fontFamily: "'Inter', sans-serif",
        WebkitFontSmoothing: "antialiased",
        color: T.ink,
      }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 36,
          flexWrap: "wrap",
          gap: 16,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity .4s ease, transform .4s ease",
        }}>
          <div>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, letterSpacing: ".08em",
              textTransform: "uppercase",
              color: T.inkMuted, margin: "0 0 8px",
            }}>
              {user?.building?.building_name || "NestOS"} · Admin Console
            </p>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 700, color: T.ink,
              margin: 0, letterSpacing: "-0.01em",
            }}>
              Admin Dashboard
            </h1>
            <p style={{ color: T.inkSoft, margin: "6px 0 0", fontSize: 14 }}>
              {user?.building?.building_name || "NestOS"} Building Management
            </p>
          </div>

          <button
            onClick={handleRefresh}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: T.accent,
              color: T.navActiveText, border: "none",
              padding: "11px 18px", borderRadius: T.rSm,
              fontSize: 13.5, fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: ".02em",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(54,84,224,.32)",
              transition: "transform .15s, box-shadow .15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 10px 24px rgba(54,84,224,.44)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(54,84,224,.32)";
            }}
          >
            <RefreshCw
              size={15}
              style={{ animation: refreshSpin ? "mgSpin .7s linear infinite" : "none" }}
            />
            Refresh
          </button>
        </div>

        {/* ── Stat Cards Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}>
          {statCards.map((card, i) => (
            <MgStatCard key={card.title} {...card} delay={i * 70} />
          ))}
        </div>

        {/* ── Summary Panel ── */}
        <div style={{
          background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
          border: `1px solid ${T.border}`,
          borderRadius: T.rLg,
          padding: "26px 28px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* top stripe */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: T.accent,
            borderRadius: `${T.rLg}px ${T.rLg}px 0 0`,
          }} />

          {/* panel header */}
          <div style={{ marginBottom: 22 }}>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10, letterSpacing: ".07em",
              textTransform: "uppercase", color: T.inkMuted, margin: "0 0 4px",
            }}>
              Summary
            </p>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 17, fontWeight: 600,
              color: T.ink, margin: 0,
            }}>
              Building Management Summary
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 14,
          }}>
            {summaryCards.map((card, i) => (
              <SummaryCard key={card.label} {...card} delay={100 + i * 60} />
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
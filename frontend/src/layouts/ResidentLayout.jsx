import { useEffect, useState } from "react";
import {
  Home,
  CreditCard,
  AlertCircle,
  UserCheck,
  Bell,
  RefreshCw,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

/* ─── Status accent map ─────────────────────────────────────────────────── */
const ACCENT = {
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  purple: { glow: "rgba(167,139,250,.10)", stripe: "#A78BFA", text: "#A78BFA" },
  red:    { glow: "rgba(255,92,92,.10)",   stripe: "#FF5C5C", text: "#FF7070" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
  yellow: { glow: "rgba(255,200,87,.10)",  stripe: "#FFC857", text: "#FFC857" },
};

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({ title, value, subtitle, icon: Icon, color, delay = 0, T }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
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
        border: `1px solid ${hovered ? (T.isDark ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.14)") : T.border}`,
        borderRadius: 14,
        padding: "22px 20px",
        overflow: "hidden",
        boxShadow: hovered
          ? `0 18px 40px rgba(0,0,0,${T.isDark ? ".35" : ".10"}), 0 0 0 1px ${a.stripe}22`
          : `0 2px 8px rgba(0,0,0,${T.isDark ? ".25" : ".05"})`,
        transform: visible ? (hovered ? "translateY(-4px)" : "translateY(0)") : "translateY(14px)",
        opacity: visible ? 1 : 0,
        transition: `opacity .45s ease ${delay}ms, transform .45s ease ${delay}ms, box-shadow .22s ease, border-color .22s ease, background .3s`,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: a.stripe, borderRadius: "14px 14px 0 0" }} />
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: a.glow, filter: "blur(18px)", pointerEvents: "none" }} />

      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: `${a.stripe}1A`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14,
      }}>
        <Icon size={18} color={a.stripe} />
      </div>

      <span style={{
        display: "block", fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10, fontWeight: 600, letterSpacing: ".06em",
        textTransform: "uppercase", color: T.inkMuted, marginBottom: 6,
      }}>
        {title}
      </span>

      <span style={{
        display: "block", fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 26, fontWeight: 700, color: T.ink,
        letterSpacing: "-0.01em", lineHeight: 1.1,
      }}>
        {value}
      </span>

      <span style={{ display: "block", marginTop: 5, fontSize: 12, color: T.inkSoft }}>
        {subtitle}
      </span>
    </div>
  );
}

/* ─── Quick action button ───────────────────────────────────────────────── */
function QuickAction({ icon: Icon, label, onClick, T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "13px 16px",
        background: hovered ? "linear-gradient(135deg, #3654E0, #6E83F2)" : T.surface,
        border: `1px solid ${hovered ? "transparent" : T.border}`,
        borderRadius: 10,
        color: hovered ? "#fff" : T.ink,
        fontSize: 13.5, fontWeight: 600,
        fontFamily: "'Space Grotesk', sans-serif",
        cursor: "pointer",
        transform: visible ? "translateY(0)" : "translateY(10px)",
        opacity: visible ? 1 : 0,
        transition: `opacity .4s ease ${delay}ms, transform .4s ease ${delay}ms, background .2s, border-color .2s, color .2s`,
        boxShadow: hovered ? "0 8px 20px rgba(54,84,224,.35)" : "none",
        width: "100%",
      }}
    >
      <Icon size={16} />
      {label}
      <ArrowRight size={14} style={{ marginLeft: "auto", opacity: hovered ? 1 : 0.4, transition: "opacity .2s" }} />
    </button>
  );
}

/* ─── Activity row ───────────────────────────────────────────────────────── */
function ActivityRow({ icon: Icon, title, time, status, color, T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const a = ACCENT[color] || ACCENT.blue;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0",
      borderBottom: `1px solid ${T.border}`,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(-8px)",
      transition: `opacity .4s ease ${delay}ms, transform .4s ease ${delay}ms`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: `${a.stripe}1A`, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={15} color={a.stripe} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: 13.5, fontWeight: 600, color: T.ink,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {title}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 11.5, color: T.inkMuted }}>
          {time}
        </p>
      </div>
      <span style={{
        fontSize: 10.5, fontWeight: 700, padding: "4px 9px",
        borderRadius: 6, color: a.text, background: a.glow,
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: ".03em", textTransform: "uppercase",
        flexShrink: 0,
      }}>
        {status}
      </span>
    </div>
  );
}

/* ─── Spinner (full page) ───────────────────────────────────────────────── */
function FullSpinner({ T }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh",
      background: T.isDark
        ? `radial-gradient(circle at 20% 15%, rgba(110,131,242,.10), transparent 45%),
           radial-gradient(circle at 85% 80%, rgba(217,113,74,.08), transparent 45%), ${T.bg}`
        : T.bg,
    }}>
      <style>{`@keyframes mgSpin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center" }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" style={{ animation: "mgSpin .8s linear infinite" }}>
          <circle cx="12" cy="12" r="10" stroke="rgba(110,131,242,.25)" strokeWidth="2.5" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#6E83F2" strokeWidth="2.5" strokeLinecap="round" />
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

/* ─── Main Resident Dashboard ────────────────────────────────────────────── */
const Resident = () => {
  const { user } = useAuth();
  const { theme: T } = useTheme();

  const [stats, setStats] = useState({
    flatNumber: "",
    maintenanceDue: 0,
    maintenanceStatus: "Pending",
    pendingComplaints: 0,
    resolvedComplaints: 0,
    expectedVisitors: 0,
    activeNotices: 0,
  });

  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [refreshSpin, setRefreshSpin] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/resident/dashboard");
      setStats(response.data.data);
    } catch (err) {
      console.error("Resident Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

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

  if (loading) return <FullSpinner T={T} />;

  const statCards = [
    { title: "Flat Number",      value: stats.flatNumber || "—",                          subtitle: "Your Residence",        icon: Home,        color: "blue"   },
    { title: "Maintenance Due",  value: `₹${Number(stats.maintenanceDue).toLocaleString()}`, subtitle: stats.maintenanceStatus, icon: CreditCard,  color: stats.maintenanceStatus === "Paid" ? "green" : "orange" },
    { title: "Complaints",       value: stats.pendingComplaints,                          subtitle: "Pending Resolution",    icon: AlertCircle, color: "red"    },
    { title: "Visitors Expected",value: stats.expectedVisitors,                           subtitle: "Today's Entries",       icon: UserCheck,   color: "purple" },
    { title: "Active Notices",   value: stats.activeNotices,                              subtitle: "Published Notices",     icon: Bell,        color: "yellow" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: T.isDark
          ? `radial-gradient(circle at 20% 10%, rgba(110,131,242,.09), transparent 42%),
             radial-gradient(circle at 80% 85%, rgba(217,113,74,.07), transparent 42%), ${T.bg}`
          : T.bg,
        padding: "36px 38px 64px",
        fontFamily: "'Inter', sans-serif",
        WebkitFontSmoothing: "antialiased",
        color: T.ink,
        transition: "background .3s ease",
      }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: 36, flexWrap: "wrap", gap: 16,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity .4s ease, transform .4s ease",
        }}>
          <div>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
              letterSpacing: ".08em", textTransform: "uppercase",
              color: T.inkMuted, margin: "0 0 8px",
            }}>
              {user?.building?.building_name || "NestOS"} · Resident Portal
            </p>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700,
              color: T.ink, margin: 0, letterSpacing: "-0.01em",
            }}>
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p style={{ color: T.inkSoft, margin: "6px 0 0", fontSize: 14 }}>
              Here's what's happening in your residence
            </p>
          </div>

          <button
            onClick={handleRefresh}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #3654E0, #6E83F2)",
              color: "#fff", border: "none",
              padding: "11px 18px", borderRadius: 8,
              fontSize: 13.5, fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: ".02em", cursor: "pointer",
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
            <RefreshCw size={15} style={{ animation: refreshSpin ? "mgSpin .7s linear infinite" : "none" }} />
            Refresh
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16, marginBottom: 28,
        }}>
          {statCards.map((card, i) => (
            <StatCard key={card.title} {...card} delay={i * 70} T={T} />
          ))}
        </div>

        {/* ── Two-column section: Quick Actions + Recent Activity ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 20,
        }}>

          {/* Quick Actions */}
          <div style={{
            background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
            border: `1px solid ${T.border}`,
            borderRadius: 18, padding: "22px 20px",
            position: "relative", overflow: "hidden",
            transition: "background .3s",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: "linear-gradient(90deg, #3654E0, #6E83F2)",
              borderRadius: "18px 18px 0 0",
            }} />

            <p style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
              letterSpacing: ".07em", textTransform: "uppercase",
              color: T.inkMuted, margin: "0 0 4px",
            }}>
              Quick Actions
            </p>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 16,
              fontWeight: 600, color: T.ink, margin: "0 0 18px",
            }}>
              Raise a Request
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <QuickAction icon={AlertCircle} label="New Complaint" T={T} delay={100} />
              <QuickAction icon={UserCheck}   label="Add Visitor"   T={T} delay={150} />
              <QuickAction icon={CreditCard}  label="Pay Maintenance" T={T} delay={200} />
              <QuickAction icon={Plus}        label="Book Amenity"  T={T} delay={250} />
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
            border: `1px solid ${T.border}`,
            borderRadius: 18, padding: "22px 24px",
            position: "relative", overflow: "hidden",
            transition: "background .3s",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: "linear-gradient(90deg, #A78BFA, #6E83F2)",
              borderRadius: "18px 18px 0 0",
            }} />

            <p style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
              letterSpacing: ".07em", textTransform: "uppercase",
              color: T.inkMuted, margin: "0 0 4px",
            }}>
              Activity
            </p>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 16,
              fontWeight: 600, color: T.ink, margin: "0 0 16px",
            }}>
              Recent Activity
            </h2>

            <div>
              <ActivityRow
                icon={CheckCircle2} title="Maintenance payment received" time="2 hours ago"
                status="Paid" color="green" T={T} delay={100}
              />
              <ActivityRow
                icon={Clock} title="Plumbing complaint under review" time="Yesterday"
                status="Pending" color="orange" T={T} delay={150}
              />
              <ActivityRow
                icon={UserCheck} title="Guest visitor approved — Raj Mehta" time="2 days ago"
                status="Approved" color="blue" T={T} delay={200}
              />
              <ActivityRow
                icon={Bell} title="Water supply maintenance notice" time="3 days ago"
                status="Notice" color="yellow" T={T} delay={250}
              />
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default Resident;
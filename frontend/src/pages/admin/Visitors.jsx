import { useEffect, useState } from "react";
import {
  UserCheck,
  Search,
  RefreshCw,
  LogIn,
  LogOut,
  Users,
  ChevronRight,
} from "lucide-react";

import visitorService from "../../services/visitorService";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

const ACCENT = {
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
  purple: { glow: "rgba(167,139,250,.10)", stripe: "#A78BFA", text: "#A78BFA" },
};

const STATUS_COLOR = {
  "checked-in":  "green",
  "checked-out": "blue",
  pending:       "orange",
};

function formatTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function StatCard({ title, value, subtitle, icon: Icon, color, delay = 0, T }) {
  const [visible, setVisible] = useState(false);
  const a = ACCENT[color] || ACCENT.blue;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      position: "relative",
      background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
      border: `1px solid ${T.border}`,
      borderRadius: 14, padding: "20px 18px", overflow: "hidden",
      transform: visible ? "translateY(0)" : "translateY(12px)",
      opacity: visible ? 1 : 0,
      transition: `opacity .4s ease ${delay}ms, transform .4s ease ${delay}ms`,
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: a.stripe, borderRadius: "14px 14px 0 0" }} />
      <div style={{
        width: 34, height: 34, borderRadius: 9, background: `${a.stripe}1A`,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
      }}>
        <Icon size={17} color={a.stripe} />
      </div>
      <span style={{
        display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
        fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase",
        color: T.inkMuted, marginBottom: 5,
      }}>{title}</span>
      <span style={{
        display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: 24,
        fontWeight: 700, color: T.ink,
      }}>{value}</span>
      <span style={{ display: "block", marginTop: 4, fontSize: 11.5, color: T.inkSoft }}>{subtitle}</span>
    </div>
  );
}

function StatusBadge({ status, T }) {
  const key = (status || "").toLowerCase();
  const color = STATUS_COLOR[key] || "blue";
  const a = ACCENT[color] || ACCENT.blue;
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
      color: a.text, background: a.glow,
      fontFamily: "'IBM Plex Mono', monospace",
      letterSpacing: ".03em", textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {status || "Pending"}
    </span>
  );
}

function VisitorRow({ visitor, T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr 0.8fr 1.2fr 0.9fr 0.9fr 32px",
        alignItems: "center",
        gap: 12,
        padding: "14px 18px",
        borderRadius: 10,
        background: hovered ? (T.isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.025)") : "transparent",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: `opacity .35s ease ${delay}ms, transform .35s ease ${delay}ms, background .15s`,
      }}
    >
      <span style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>
        {visitor.visitorName || "—"}
      </span>
      <span style={{ fontSize: 12.5, color: T.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>
        {visitor.phone || "—"}
      </span>
      <span style={{ fontSize: 12.5, color: T.inkSoft }}>{visitor.hostResident || "—"}</span>
      <span style={{ fontSize: 12.5, color: T.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>
        {visitor.flatNumber || "—"}
      </span>
      <span style={{ fontSize: 12.5, color: T.inkSoft }}>{visitor.purpose || "—"}</span>
      <StatusBadge status={visitor.status} T={T} />
      <span style={{ fontSize: 12, color: T.inkMuted }}>
        {formatTime(visitor.entryTime)}{visitor.exitTime ? ` – ${formatTime(visitor.exitTime)}` : ""}
      </span>
      <ChevronRight size={16} color={T.inkMuted} />
    </div>
  );
}

function FullSpinner({ T }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px" }}>
      <svg width="28" height="28" viewBox="0 0 24 24" style={{ animation: "mgSpin .8s linear infinite" }}>
        <circle cx="12" cy="12" r="10" stroke={T.accent} strokeWidth="2.5" opacity="0.25" fill="none" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
      <p style={{ color: T.inkSoft, fontSize: 13, marginTop: 12 }}>Loading visitors…</p>
    </div>
  );
}

const Visitors = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [headerVisible, setHeaderVisible] = useState(false);

  const loadVisitors = async () => {
    try {
      setLoading(true);
      const response = await visitorService.getVisitors();
      setVisitors(response.data.data || []);
    } catch (err) {
      console.error("Visitors Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVisitors(); }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setHeaderVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleRefresh = () => {
    setRefreshSpin(true);
    loadVisitors().then(() => setTimeout(() => setRefreshSpin(false), 600));
  };

  const filtered = visitors.filter((v) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (v.visitorName || "").toLowerCase().includes(q) ||
      (v.phone || "").toLowerCase().includes(q) ||
      (v.hostResident || "").toLowerCase().includes(q) ||
      (v.flatNumber || "").toLowerCase().includes(q) ||
      (v.purpose || "").toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" ||
      (v.status || "").toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const today = new Date().toDateString();
  const total = visitors.length;
  const checkedIn = visitors.filter((v) => (v.status || "").toLowerCase() === "checked-in").length;
  const checkedOut = visitors.filter((v) => (v.status || "").toLowerCase() === "checked-out").length;
  const todaysVisitors = visitors.filter((v) => {
    const d = v.entryTime || v.createdAt;
    return d && new Date(d).toDateString() === today;
  }).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        .mg-search-input::placeholder { color: ${T.searchPlaceholder}; }
        .mg-search-input:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accentBg} !important; }
        .mg-filter-btn:hover { border-color: ${T.isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.18)"} !important; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: T.isDark
          ? `radial-gradient(circle at 20% 10%, rgba(110,131,242,.09), transparent 42%),
             radial-gradient(circle at 80% 85%, rgba(217,113,74,.07), transparent 42%), ${T.bg}`
          : T.bg,
        padding: "36px 38px 64px",
        fontFamily: "'Inter', sans-serif",
        color: T.ink,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: 28, flexWrap: "wrap", gap: 16,
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
              {user?.building?.building_name || "NestOS"} · Admin Console
            </p>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700,
              color: T.ink, margin: 0,
            }}>
              Visitors
            </h1>
            <p style={{ color: T.inkSoft, margin: "6px 0 0", fontSize: 14 }}>
              Monitor visitor entries, exits, and lobby activity
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="mg-filter-btn"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: T.surface, color: T.ink,
              border: `1px solid ${T.border}`,
              padding: "11px 16px", borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={15} style={{ animation: refreshSpin ? "mgSpin .7s linear infinite" : "none" }} />
            Refresh
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          gap: 16, marginBottom: 26,
        }}>
          <StatCard title="Total Visitors" value={total} subtitle="All logged entries" icon={Users} color="blue" delay={0} T={T} />
          <StatCard title="Checked In" value={checkedIn} subtitle="Currently on premises" icon={LogIn} color="green" delay={70} T={T} />
          <StatCard title="Checked Out" value={checkedOut} subtitle="Completed visits" icon={LogOut} color="purple" delay={140} T={T} />
          <StatCard title="Today" value={todaysVisitors} subtitle="Visitors logged today" icon={UserCheck} color="orange" delay={210} T={T} />
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
            <Search size={15} style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: T.inkMuted, pointerEvents: "none",
            }} />
            <input
              type="text"
              placeholder="Search by name, phone, flat, or host…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mg-search-input"
              style={{
                width: "100%", padding: "10px 14px 10px 36px",
                borderRadius: 9, border: `1px solid ${T.border}`,
                background: T.surface, color: T.ink, fontSize: 13,
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {["all", "checked-in", "checked-out"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="mg-filter-btn"
                style={{
                  padding: "9px 14px", borderRadius: 8,
                  border: `1px solid ${statusFilter === s ? "transparent" : T.border}`,
                  background: statusFilter === s ? T.accent : T.surface,
                  color: statusFilter === s ? T.navActiveText : T.inkSoft,
                  fontSize: 12.5, fontWeight: 600, textTransform: "capitalize",
                  cursor: "pointer",
                }}
              >
                {s.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
          border: `1px solid ${T.border}`,
          borderRadius: 16, overflow: "hidden",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 0.8fr 1.2fr 0.9fr 0.9fr 32px",
            gap: 12, padding: "12px 18px",
            borderBottom: `1px solid ${T.border}`,
          }}>
            {["Visitor", "Phone", "Host", "Flat", "Purpose", "Status", "Time", ""].map((h, i) => (
              <span key={i} style={{
                fontSize: 10.5, fontWeight: 700, color: T.inkMuted,
                textTransform: "uppercase", letterSpacing: ".05em",
                fontFamily: "'IBM Plex Mono', monospace",
              }}>{h}</span>
            ))}
          </div>

          <div style={{ padding: "6px 8px" }}>
            {loading ? (
              <FullSpinner T={T} />
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <Users size={32} color={T.inkMuted} style={{ marginBottom: 10 }} />
                <p style={{ color: T.inkSoft, fontSize: 13.5, margin: 0 }}>No visitors found.</p>
              </div>
            ) : (
              filtered.map((v, i) => (
                <VisitorRow key={v.visitorId || i} visitor={v} T={T} delay={i * 40} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Visitors;
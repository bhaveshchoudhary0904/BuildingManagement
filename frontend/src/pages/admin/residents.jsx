import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  Home,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  ChevronRight,
  Filter,
  Trash2,
} from "lucide-react";

import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

/* ─── Status accent map ─────────────────────────────────────────────────── */
const ACCENT = {
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  purple: { glow: "rgba(167,139,250,.10)", stripe: "#A78BFA", text: "#A78BFA" },
  red:    { glow: "rgba(255,92,92,.10)",   stripe: "#FF5C5C", text: "#FF7070" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
  yellow: { glow: "rgba(255,200,87,.10)",  stripe: "#FFC857", text: "#FFC857" },
};

const STATUS_COLOR = {
  active:   "green",
  pending:  "orange",
  inactive: "red",
};

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

/* ─── Stat summary card ──────────────────────────────────────────────────── */
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
      transition: `opacity .4s ease ${delay}ms, transform .4s ease ${delay}ms, background .3s`,
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
        fontWeight: 700, color: T.ink, letterSpacing: "-0.01em",
      }}>{value}</span>
      <span style={{ display: "block", marginTop: 4, fontSize: 11.5, color: T.inkSoft }}>{subtitle}</span>
    </div>
  );
}

/* ─── Status badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status, T }) {
  const color = STATUS_COLOR[(status || "").toLowerCase()] || "blue";
  const a = ACCENT[color];
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
      color: a.text, background: a.glow,
      fontFamily: "'IBM Plex Mono', monospace",
      letterSpacing: ".03em", textTransform: "uppercase",
      display: "inline-block",
    }}>
      {status || "—"}
    </span>
  );
}

/* ─── Resident row ───────────────────────────────────────────────────────── */
function ResidentRow({ resident, T, onClick, onDelete, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      onClick={() => onClick(resident)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1.3fr 1fr 1fr 32px 32px",
        alignItems: "center",
        gap: 12,
        padding: "14px 18px",
        borderRadius: 10,
        cursor: "pointer",
        background: hovered ? (T.isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.025)") : "transparent",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: `opacity .35s ease ${delay}ms, transform .35s ease ${delay}ms, background .15s`,
      }}
    >
      {/* Name + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: resident.profile_image ? 'transparent' : T.accent,
          color: T.navActiveText, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, flexShrink: 0,
          fontFamily: "'Space Grotesk', sans-serif",
          overflow: "hidden",
        }}>
          {resident.profile_image ? (
            <img 
              src={resident.profile_image} 
              alt={resident.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            getInitials(resident.name)
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{
            margin: 0, fontSize: 13.5, fontWeight: 600, color: T.ink,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{resident.name}</p>
          <p style={{
            margin: "2px 0 0", fontSize: 11.5, color: T.inkMuted,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{resident.email}</p>
        </div>
      </div>

      {/* Flat */}
      <span style={{ fontSize: 13, color: T.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>
        {resident.flatNumber || "—"}
      </span>

      {/* Phone */}
      <span style={{ fontSize: 12.5, color: T.inkSoft }}>
        {resident.phone || "—"}
      </span>

      {/* Complaints */}
      <span style={{
        fontSize: 12.5,
        color: resident.complaints > 0 ? "#FF7070" : T.inkSoft,
        fontWeight: resident.complaints > 0 ? 600 : 400,
      }}>
        {resident.complaints ?? 0} open
      </span>

      {/* Status */}
      <StatusBadge status={resident.status} T={T} />

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(resident);
        }}
        style={{
          width: 28, height: 28, borderRadius: 6,
          border: `1px solid ${T.border}`,
          background: T.surface,
          color: T.red,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .15s, border-color .15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,68,68,0.1)";
          e.currentTarget.style.borderColor = T.red;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = T.surface;
          e.currentTarget.style.borderColor = T.border;
        }}
      >
        <Trash2 size={14} />
      </button>

      {/* chevron */}
      <ChevronRight size={16} color={T.inkMuted} style={{
        transform: hovered ? "translateX(2px)" : "translateX(0)",
        transition: "transform .15s",
      }} />
    </div>
  );
}

/* ─── Detail drawer ──────────────────────────────────────────────────────── */
function ResidentDrawer({ resident, onClose, T }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  if (!resident) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: visible ? "rgba(0,0,0,.55)" : "rgba(0,0,0,0)",
        transition: "background .25s ease",
        display: "flex", justifyContent: "flex-end",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 400, maxWidth: "90vw", height: "100%",
          background: T.surface,
          borderLeft: `1px solid ${T.border}`,
          padding: "26px 24px",
          overflowY: "auto",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform .25s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            letterSpacing: ".07em", textTransform: "uppercase",
            color: T.inkMuted, margin: 0,
          }}>
            Resident Profile
          </p>
          <button
            onClick={handleClose}
            style={{
              width: 28, height: 28, borderRadius: 7,
              border: `1px solid ${T.border}`, background: T.surface2,
              color: T.inkSoft, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: T.accent,
            color: T.navActiveText, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 19, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0,
          }}>
            {getInitials(resident.name)}
          </div>
          <div>
            <h2 style={{
              margin: 0, fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18, fontWeight: 700, color: T.ink,
            }}>{resident.name}</h2>
            <div style={{ marginTop: 6 }}>
              <StatusBadge status={resident.status} T={T} />
            </div>
          </div>
        </div>

        {/* info rows */}
        {[
          { icon: Home,  label: "Flat Number", value: resident.flatNumber || "—" },
          { icon: Mail,  label: "Email",        value: resident.email || "—" },
          { icon: Phone, label: "Phone",        value: resident.phone || "—" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 0", borderBottom: `1px solid ${T.border}`,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: T.accentBg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Icon size={14} color={T.accent} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 10.5, color: T.inkMuted, textTransform: "uppercase", letterSpacing: ".04em", fontFamily: "'IBM Plex Mono', monospace" }}>{label}</p>
              <p style={{ margin: "2px 0 0", fontSize: 13.5, color: T.ink, fontWeight: 500 }}>{value}</p>
            </div>
          </div>
        ))}

        {/* complaints summary */}
        <div style={{ marginTop: 22 }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            letterSpacing: ".07em", textTransform: "uppercase",
            color: T.inkMuted, margin: "0 0 12px",
          }}>
            Complaint History
          </p>

          {(resident.complaintList && resident.complaintList.length > 0) ? (
            resident.complaintList.map((c, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0", borderBottom: `1px solid ${T.border}`,
              }}>
                {c.status === "resolved"
                  ? <CheckCircle2 size={15} color="#34D399" style={{ flexShrink: 0 }} />
                  : <Clock size={15} color="#FB923C" style={{ flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12.5, color: T.ink }}>{c.title}</p>
                  <p style={{ margin: "1px 0 0", fontSize: 10.5, color: T.inkMuted }}>{c.date}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: 12.5, color: T.inkMuted, fontStyle: "italic" }}>
              No complaints filed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Spinner ─────────────────────────────────────────────────────────────── */
function FullSpinner({ T }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh",
    }}>
      <style>{`@keyframes mgSpin { to { transform: rotate(360deg); } }`}</style>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: "mgSpin .8s linear infinite" }}>
        <circle cx="12" cy="12" r="10" stroke={T.accent} strokeWidth="2.5" opacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
const AdminResidents = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();

  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedResident, setSelectedResident] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [addResidentModalOpen, setAddResidentModalOpen] = useState(false);
  const [creatingResident, setCreatingResident] = useState(false);
  const [units, setUnits] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState(null);
  const [addResidentForm, setAddResidentForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    unit_id: "",
    emergency_contact: "",
  });

  const loadResidents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/residents");
      setResidents(response.data.data || []);
    } catch (err) {
      console.error("Residents Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await api.get("/api/flats");
      setUnits(response.data.data || []);
    } catch (err) {
      console.error("Units Error:", err);
    }
  };

  useEffect(() => { loadResidents(); loadUnits(); }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setHeaderVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleRefresh = () => {
    setRefreshSpin(true);
    loadResidents().then(() => setTimeout(() => setRefreshSpin(false), 600));
  };

  const handleDeleteResident = async () => {
    if (!residentToDelete) return;

    try {
      const response = await api.delete(`/api/residents/${residentToDelete.resident_id}`);
      if (response.data.success) {
        alert("Resident deleted successfully!");
        setDeleteConfirmOpen(false);
        setResidentToDelete(null);
        await loadResidents();
      } else {
        alert(response.data.message || "Failed to delete resident");
      }
    } catch (error) {
      console.error("Delete Resident Error:", error);
      alert(error.response?.data?.message || "Failed to delete resident");
    }
  };

  const handleCreateResident = async (e) => {
    e.preventDefault();

    if (!addResidentForm.name || !addResidentForm.email || !addResidentForm.phone_number || !addResidentForm.password || !addResidentForm.unit_id) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setCreatingResident(true);
      const response = await api.post("/api/residents", {
        name: addResidentForm.name.trim(),
        email: addResidentForm.email.trim(),
        phone_number: addResidentForm.phone_number.trim(),
        password: addResidentForm.password,
        unit_id: parseInt(addResidentForm.unit_id, 10),
        emergency_contact: addResidentForm.emergency_contact.trim() || null,
      });

      if (response.data.success) {
        alert("Resident added successfully!");
        setAddResidentModalOpen(false);
        setAddResidentForm({
          name: "",
          email: "",
          phone_number: "",
          password: "",
          unit_id: "",
          emergency_contact: "",
        });
        await loadResidents();
      } else {
        alert(response.data.message || "Failed to add resident");
      }
    } catch (error) {
      console.error("Create Resident Error:", error);
      alert(error.response?.data?.message || "Failed to add resident");
    } finally {
      setCreatingResident(false);
    }
  };

  const filtered = residents.filter(r => {
    const matchesSearch =
      (r.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.flatNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (r.status || "").toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalResidents   = residents.length;
  const activeResidents  = residents.filter(r => (r.status || "").toLowerCase() === "active").length;
  const totalComplaints  = residents.reduce((sum, r) => sum + (r.complaints || 0), 0);
  const pendingResidents = residents.filter(r => (r.status || "").toLowerCase() === "pending").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        .mg-search-input::placeholder { color: ${T.searchPlaceholder}; }
        .mg-search-input:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accentBg} !important; }
        .mg-filter-btn:hover { border-color: ${T.isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.18)"} !important; }
        ::-webkit-scrollbar { width: 6px; }
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
              color: T.ink, margin: 0, letterSpacing: "-0.01em",
            }}>
              Residents
            </h1>
            <p style={{ color: T.inkSoft, margin: "6px 0 0", fontSize: 14 }}>
              Manage resident profiles, flats, and complaints
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
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
                cursor: "pointer", transition: "border-color .15s",
              }}
            >
              <RefreshCw size={15} style={{ animation: refreshSpin ? "mgSpin .7s linear infinite" : "none" }} />
              Refresh
            </button>

            <button
              type="button"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: T.accent,
                color: T.navActiveText, border: "none",
                padding: "11px 18px", borderRadius: 8,
                fontSize: 13.5, fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: ".02em", cursor: "pointer",
                boxShadow: "0 6px 18px rgba(54,84,224,.32)",
                transition: "transform .15s, box-shadow .15s",
              }}
              onClick={() => setAddResidentModalOpen(true)}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Plus size={15} />
              Add Resident
            </button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          gap: 16, marginBottom: 26,
        }}>
          <StatCard title="Total Residents"  value={totalResidents}   subtitle="Registered in system" icon={Users}       color="blue"   delay={0}   T={T} />
          <StatCard title="Active"           value={activeResidents}  subtitle="Currently residing"   icon={CheckCircle2} color="green" delay={70}  T={T} />
          <StatCard title="Pending Approval" value={pendingResidents} subtitle="Awaiting verification" icon={Clock}       color="orange" delay={140} T={T} />
          <StatCard title="Open Complaints"  value={totalComplaints}  subtitle="Across all residents"  icon={AlertCircle} color="red"   delay={210} T={T} />
        </div>

        {/* ── Toolbar ── */}
        <div style={{
          display: "flex", gap: 12, alignItems: "center",
          marginBottom: 16, flexWrap: "wrap",
        }}>
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
            <Search size={15} style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: T.inkMuted, pointerEvents: "none",
            }} />
            <input
              type="text"
              placeholder="Search by name, flat, or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mg-search-input"
              style={{
                width: "100%", padding: "10px 14px 10px 36px",
                borderRadius: 9, border: `1px solid ${T.border}`,
                background: T.surface, color: T.ink, fontSize: 13,
                fontFamily: "'Inter', sans-serif", outline: "none",
                transition: "border-color .18s, box-shadow .18s",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {["all", "active", "pending", "inactive"].map(s => (
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
                  cursor: "pointer", fontFamily: "'Inter', sans-serif",
                  transition: "background .15s, border-color .15s, color .15s",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Residents table ── */}
        <div style={{
          background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
          border: `1px solid ${T.border}`,
          borderRadius: 16, overflow: "hidden",
          transition: "background .3s",
        }}>

          {/* table head */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1.3fr 1fr 1fr 32px",
            gap: 12, padding: "12px 18px",
            borderBottom: `1px solid ${T.border}`,
          }}>
            {["Resident", "Flat", "Phone", "Complaints", "Status", ""].map((h, i) => (
              <span key={i} style={{
                fontSize: 10.5, fontWeight: 700, color: T.inkMuted,
                textTransform: "uppercase", letterSpacing: ".05em",
                fontFamily: "'IBM Plex Mono', monospace",
              }}>{h}</span>
            ))}
          </div>

          {/* table body */}
          <div style={{ padding: "6px 8px" }}>
            {loading ? (
              <FullSpinner T={T} />
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <Users size={32} color={T.inkMuted} style={{ marginBottom: 10 }} />
                <p style={{ color: T.inkSoft, fontSize: 13.5, margin: 0 }}>
                  No residents found.
                </p>
              </div>
            ) : (
              filtered.map((r, i) => (
                <ResidentRow
                  key={r.id || r._id || i}
                  resident={r}
                  T={T}
                  delay={i * 40}
                  onClick={setSelectedResident}
                  onDelete={(resident) => {
                    setResidentToDelete(resident);
                    setDeleteConfirmOpen(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {addResidentModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
        }}>
          <div style={{
            background: T.surface,
            borderRadius: 16,
            padding: 28,
            width: "100%",
            maxWidth: 480,
            position: "relative",
            border: `1px solid ${T.border}`,
          }}>
            <button
              type="button"
              onClick={() => setAddResidentModalOpen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: T.ink,
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: T.ink,
              margin: "0 0 6px",
            }}>
              Add Resident
            </h2>
            <p style={{ margin: "0 0 20px", color: T.inkSoft, fontSize: 13 }}>
              Create a resident account and link it to a unit.
            </p>

            <form onSubmit={handleCreateResident} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: T.inkMuted }}>
                  <span>Name</span>
                  <input
                    required
                    value={addResidentForm.name}
                    onChange={e => setAddResidentForm({ ...addResidentForm, name: e.target.value })}
                    style={inputStyle(T)}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: T.inkMuted }}>
                  <span>Email</span>
                  <input
                    required
                    type="email"
                    value={addResidentForm.email}
                    onChange={e => setAddResidentForm({ ...addResidentForm, email: e.target.value })}
                    style={inputStyle(T)}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: T.inkMuted }}>
                  <span>Phone</span>
                  <input
                    required
                    value={addResidentForm.phone_number}
                    onChange={e => setAddResidentForm({ ...addResidentForm, phone_number: e.target.value })}
                    style={inputStyle(T)}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: T.inkMuted }}>
                  <span>Unit/Flat</span>
                  <select
                    required
                    value={addResidentForm.unit_id}
                    onChange={e => setAddResidentForm({ ...addResidentForm, unit_id: e.target.value })}
                    style={inputStyle(T)}
                  >
                    <option value="">Select a unit</option>
                    {units.map(unit => (
                      <option key={unit.unitId} value={unit.unitId}>
                        {unit.buildingName} - Flat {unit.unitNumber} (Floor {unit.floorNumber})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: T.inkMuted }}>
                <span>Password</span>
                <input
                  required
                  type="password"
                  value={addResidentForm.password}
                  onChange={e => setAddResidentForm({ ...addResidentForm, password: e.target.value })}
                  style={inputStyle(T)}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: T.inkMuted }}>
                <span>Emergency Contact</span>
                <input
                  value={addResidentForm.emergency_contact}
                  onChange={e => setAddResidentForm({ ...addResidentForm, emergency_contact: e.target.value })}
                  style={inputStyle(T)}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setAddResidentModalOpen(false)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.surface2,
                    color: T.ink,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingResident}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: T.accent,
                    color: T.navActiveText,
                    cursor: creatingResident ? "wait" : "pointer",
                    fontWeight: 700,
                  }}
                >
                  {creatingResident ? "Creating..." : "Create Resident"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 24,
            width: "100%", maxWidth: 400,
          }}>
            <h2 style={{
              margin: "0 0 16px",
              fontSize: 18,
              fontWeight: 700,
              color: T.ink,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Delete Resident
            </h2>
            <p style={{ margin: "0 0 20px", color: T.inkSoft, fontSize: 13 }}>
              Are you sure you want to delete {residentToDelete?.name}? This action cannot be undone and will remove the resident and their user account from the database.
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setResidentToDelete(null);
                }}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  background: T.surface2,
                  color: T.ink,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteResident}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: T.red,
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedResident && (
        <ResidentDrawer
          resident={selectedResident}
          onClose={() => setSelectedResident(null)}
          T={T}
        />
      )}
    </>
  );
};

function inputStyle(T) {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${T.border}`,
    background: T.bg,
    color: T.ink,
    fontSize: 14,
    outline: "none",
  };
}

export default AdminResidents;
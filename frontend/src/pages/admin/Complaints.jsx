import { useEffect, useState } from "react";
import {
  AlertCircle,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  X,
  MoreVertical,
} from "lucide-react";

import complaintService from "../../services/complaintService";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const ACCENT = {
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
  red:    { glow: "rgba(255,92,92,.10)",   stripe: "#FF5C5C", text: "#FF7070" },
  yellow: { glow: "rgba(255,200,87,.10)",  stripe: "#FFC857", text: "#FFC857" },
};

const STATUS_COLOR = {
  pending:     "orange",
  in_progress: "blue",
  resolved:    "green",
  closed:      "yellow",
};

const PRIORITY_COLOR = {
  low:    "green",
  medium: "orange",
  high:   "red",
};

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

function Badge({ label, colorKey, map, T }) {
  const color = map[(label || "").toLowerCase().replace(/\s+/g, "_")] || "blue";
  const a = ACCENT[color] || ACCENT.blue;
  const display = (label || "—").replace(/_/g, " ");

  return (
    <span style={{
      fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
      color: a.text, background: a.glow,
      fontFamily: "'IBM Plex Mono', monospace",
      letterSpacing: ".03em", textTransform: "uppercase",
    }}>
      {display}
    </span>
  );
}

function ComplaintRow({ complaint, T, delay = 0, onUpdate }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const date = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 0.9fr 0.9fr 1fr 32px",
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
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {complaint.title}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 11.5, color: T.inkMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {complaint.category || "General"}
        </p>
      </div>
      <span style={{ fontSize: 12.5, color: T.inkSoft }}>{complaint.residentName || "—"}</span>
      <span style={{ fontSize: 12.5, color: T.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>{complaint.flatNumber || "—"}</span>
      <Badge label={complaint.priority} map={PRIORITY_COLOR} T={T} />
      <Badge label={complaint.status} map={STATUS_COLOR} T={T} />
      <span style={{ fontSize: 12, color: T.inkMuted }}>{date}</span>
      <button
        onClick={() => onUpdate(complaint)}
        style={{
          padding: "6px",
          borderRadius: 6,
          border: `1px solid ${T.border}`,
          background: T.surface,
          color: T.ink,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .2s",
        }}
        onMouseEnter={(e) => { e.target.style.background = T.surface2; }}
        onMouseLeave={(e) => { e.target.style.background = T.surface; }}
      >
        <MoreVertical size={14} />
      </button>
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
      <p style={{ color: T.inkSoft, fontSize: 13, marginTop: 12 }}>Loading complaints…</p>
    </div>
  );
}

const Complaints = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [headerVisible, setHeaderVisible] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    priority: "",
  });

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintService.getComplaints();
      setComplaints(response.data.data || []);
    } catch (err) {
      console.error("Complaints Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadComplaints(); }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setHeaderVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleRefresh = () => {
    setRefreshSpin(true);
    loadComplaints().then(() => setTimeout(() => setRefreshSpin(false), 600));
  };

  const openUpdateModal = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdateForm({
      status: complaint.status || "Pending",
      priority: complaint.priority || "Medium",
    });
    setUpdateModalOpen(true);
  };

  const updateComplaint = async () => {
    try {
      await api.put(`/complaints/${selectedComplaint.complaintId}`, updateForm);
      alert("Complaint updated successfully!");
      setUpdateModalOpen(false);
      await loadComplaints();
    } catch (error) {
      console.error("Update Complaint Error:", error);
      alert("Failed to update complaint");
    }
  };

  const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, "_");

  const filtered = complaints.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (c.title || "").toLowerCase().includes(q) ||
      (c.residentName || "").toLowerCase().includes(q) ||
      (c.flatNumber || "").toLowerCase().includes(q) ||
      (c.category || "").toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || norm(c.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const total = complaints.length;
  const pending = complaints.filter((c) => norm(c.status) === "pending").length;
  const inProgress = complaints.filter((c) => norm(c.status) === "in_progress").length;
  const resolved = complaints.filter((c) => ["resolved", "closed"].includes(norm(c.status))).length;

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
              Complaints
            </h1>
            <p style={{ color: T.inkSoft, margin: "6px 0 0", fontSize: 14 }}>
              View and manage resident complaint records
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
          <StatCard title="Total Complaints" value={total} subtitle="All time records" icon={AlertCircle} color="blue" delay={0} T={T} />
          <StatCard title="Pending" value={pending} subtitle="Awaiting action" icon={Clock} color="orange" delay={70} T={T} />
          <StatCard title="In Progress" value={inProgress} subtitle="Being handled" icon={XCircle} color="red" delay={140} T={T} />
          <StatCard title="Resolved" value={resolved} subtitle="Closed or resolved" icon={CheckCircle2} color="green" delay={210} T={T} />
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
            <Search size={15} style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: T.inkMuted, pointerEvents: "none",
            }} />
            <input
              type="text"
              placeholder="Search by title, resident, or flat…"
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

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["all", "pending", "in_progress", "resolved", "closed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="mg-filter-btn"
                style={{
                  padding: "9px 14px", borderRadius: 8,
                  border: `1px solid ${statusFilter === s ? "transparent" : T.border}`,
                  background: statusFilter === s ? T.accent : T.surface,
                  color: statusFilter === s ? T.navActiveText : T.inkSoft,
                  fontSize: 12.5, fontWeight: 600,
                  cursor: "pointer", textTransform: "capitalize",
                }}
              >
                {s.replace(/_/g, " ")}
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
            gridTemplateColumns: "2fr 1fr 1fr 0.9fr 0.9fr 1fr 32px",
            gap: 12, padding: "12px 18px",
            borderBottom: `1px solid ${T.border}`,
          }}>
            {["Complaint", "Resident", "Flat", "Priority", "Status", "Date", ""].map((h, i) => (
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
                <AlertCircle size={32} color={T.inkMuted} style={{ marginBottom: 10 }} />
                <p style={{ color: T.inkSoft, fontSize: 13.5, margin: 0 }}>No complaints found.</p>
              </div>
            ) : (
              filtered.map((c, i) => (
                <ComplaintRow key={c.complaintId || i} complaint={c} T={T} delay={i * 40} onUpdate={openUpdateModal} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Update Complaint Modal */}
      {updateModalOpen && selectedComplaint && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: T.surface,
            borderRadius: 16,
            padding: 32,
            maxWidth: 450,
            width: "90%",
            position: "relative",
          }}>
            <button
              onClick={() => setUpdateModalOpen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.ink,
              }}
            >
              <X size={24} />
            </button>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: T.ink,
              marginBottom: 8,
            }}>
              Update Complaint
            </h2>
            <p style={{ fontSize: 14, color: T.inkSoft, marginBottom: 24 }}>
              {selectedComplaint.title}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.inkMuted,
                  marginBottom: 6,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  Status
                </label>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.bg,
                    color: T.ink,
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.inkMuted,
                  marginBottom: 6,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  Priority
                </label>
                <select
                  value={updateForm.priority}
                  onChange={(e) => setUpdateForm({ ...updateForm, priority: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.bg,
                    color: T.ink,
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div style={{
                display: "flex",
                gap: 12,
                marginTop: 8,
              }}>
                <button
                  onClick={() => setUpdateModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.surface,
                    color: T.ink,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.background = T.surface2; }}
                  onMouseLeave={(e) => { e.target.style.background = T.surface; }}
                >
                  Cancel
                </button>
                <button
                  onClick={updateComplaint}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: T.accent,
                    color: T.navActiveText,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.opacity = 0.9; }}
                  onMouseLeave={(e) => { e.target.style.opacity = 1; }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Complaints;

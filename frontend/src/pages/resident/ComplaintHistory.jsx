import { useEffect, useState } from "react";
import { AlertCircle, Search, RefreshCw, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

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

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
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

function ComplaintRow({ complaint, T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
        gap: "16px",
        alignItems: "center",
        padding: "14px 16px",
        background: hovered ? T.surface2 : T.surface,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius: 10,
        cursor: "pointer",
        transform: visible ? "translateX(0)" : "translateX(-12px)",
        opacity: visible ? 1 : 0,
        transition: "all .25s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: T.ink,
          }}>
            {complaint.title}
          </span>
          <Badge label={complaint.status} colorKey={complaint.status} map={STATUS_COLOR} T={T} />
        </div>
        <p style={{
          fontSize: 12, color: T.inkSoft, margin: 0,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {complaint.description}
        </p>
      </div>

      <Badge label={complaint.priority} colorKey={complaint.priority} map={PRIORITY_COLOR} T={T} />

      <span style={{ fontSize: 12, color: T.inkSoft }}>
        {complaint.category || "—"}
      </span>

      <span style={{ fontSize: 12, color: T.inkSoft }}>
        {formatDate(complaint.created_at)}
      </span>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          style={{
            width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`,
            background: T.surface, color: T.inkMuted, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => { e.target.style.background = T.surface2; e.target.style.color = T.ink; }}
          onMouseLeave={(e) => { e.target.style.background = T.surface; e.target.style.color = T.inkMuted; }}
        >
          <Clock size={14} />
        </button>
      </div>
    </div>
  );
}

const ComplaintHistory = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/complaints/resident/${user.resident_id}`);
      setComplaints(response.data.data || []);
    } catch (err) {
      console.error("Complaints Error:", err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const filteredComplaints = complaints.filter(complaint =>
    complaint.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    in_progress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  };

  return (
    <div style={{ padding: "24px 32px", minHeight: "100vh" }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase",
          color: T.inkMuted, margin: "0 0 8px",
        }}>
          {user?.building?.building_name || "NestOS"} · Resident Portal
        </p>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 28,
          fontWeight: 700, color: T.ink, margin: 0,
        }}>
          Complaint History
        </h1>
        <p style={{ fontSize: 14, color: T.inkSoft, marginTop: 8 }}>
          Track your submitted complaints and their resolution status
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 32 }}>
        <StatCard title="Total" value={stats.total} subtitle="All complaints" icon={AlertCircle} color="blue" delay={0} T={T} />
        <StatCard title="Pending" value={stats.pending} subtitle="Awaiting action" icon={Clock} color="orange" delay={100} T={T} />
        <StatCard title="In Progress" value={stats.in_progress} subtitle="Being addressed" icon={AlertCircle} color="blue" delay={200} T={T} />
        <StatCard title="Resolved" value={stats.resolved} subtitle="Completed" icon={CheckCircle2} color="green" delay={300} T={T} />
      </div>

      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
        padding: 20, marginBottom: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} color={T.inkMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%", padding: "10px 12px 10px 38px",
                borderRadius: 8, border: `1px solid ${T.border}`,
                background: T.bg, color: T.ink, fontSize: 13,
                outline: "none", fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>
          <button
            onClick={loadComplaints}
            style={{
              padding: "10px 16px", borderRadius: 8, border: `1px solid ${T.border}`,
              background: T.surface, color: T.ink, fontSize: 13, fontWeight: 500,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              transition: "all .2s",
            }}
            onMouseEnter={(e) => { e.target.style.background = T.surface2; }}
            onMouseLeave={(e) => { e.target.style.background = T.surface; }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, padding: "0 16px" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 2 }}>Complaint</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1 }}>Priority</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1 }}>Category</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1 }}>Date</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", width: 100, textAlign: "right" }}>Actions</span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: T.inkSoft }}>
            Loading complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: T.inkSoft }}>
            {searchQuery ? "No complaints found matching your search" : "No complaints submitted yet"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredComplaints.map((complaint, index) => (
              <ComplaintRow key={complaint.complaint_id || index} complaint={complaint} T={T} delay={index * 50} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
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

export default ComplaintHistory;

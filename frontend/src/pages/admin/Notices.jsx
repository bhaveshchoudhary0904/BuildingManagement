import { useEffect, useState } from "react";
import {
  Bell,
  Search,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Calendar,
  User,
  X,
} from "lucide-react";

import noticeService from "../../services/noticeService";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const ACCENT = {
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
  purple: { glow: "rgba(167,139,250,.10)", stripe: "#A78BFA", text: "#A78BFA" },
};

const STATUS_COLOR = {
  active:   "green",
  expired:  "orange",
  draft:    "blue",
};

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
      {status || "Draft"}
    </span>
  );
}

function NoticeRow({ notice, T, delay = 0 }) {
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
        gridTemplateColumns: "3fr 1.5fr 1fr 100px",
        gap: "16px",
        alignItems: "center",
        padding: "14px 16px",
        background: hovered ? T.surface2 : T.surface,
        border: `1px solid ${T.border}`,
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
            {notice.title}
          </span>
          <StatusBadge status={notice.status} T={T} />
        </div>
        <p style={{
          fontSize: 12, color: T.inkSoft, margin: 0,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {notice.description || notice.content}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <User size={14} color={T.inkMuted} />
        <span style={{ fontSize: 12, color: T.inkSoft }}>{notice.author || "Admin"}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Calendar size={14} color={T.inkMuted} />
        <span style={{ fontSize: 12, color: T.inkSoft }}>{formatDate(notice.created_at)}</span>
      </div>

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
          <Edit2 size={14} />
        </button>
        <button
          style={{
            width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`,
            background: T.surface, color: T.inkMuted, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => { e.target.style.background = "#FF5C5C1A"; e.target.style.color = "#FF5C5C"; e.target.style.borderColor = "#FF5C5C"; }}
          onMouseLeave={(e) => { e.target.style.background = T.surface; e.target.style.color = T.inkMuted; e.target.style.borderColor = T.border; }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

const Notices = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    notice_type: "General",
  });

  const loadNotices = async () => {
    try {
      setLoading(true);
      const response = await noticeService.getNotices();
      setNotices(response.data.data || []);
    } catch (err) {
      console.error("Notices Error:", err);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Please fill in title and description");
      return;
    }

    try {
      setCreating(true);
      const response = await api.post("/api/notices", formData);
      if (response.data.success) {
        alert("Notice created successfully!");
        setModalOpen(false);
        setFormData({ title: "", description: "", notice_type: "General" });
        await loadNotices();
      } else {
        alert(response.data.message || "Failed to create notice");
      }
    } catch (error) {
      console.error("Create Notice Error:", error);
      alert(error.response?.data?.message || "Failed to create notice");
    } finally {
      setCreating(false);
    }
  };

  const filteredNotices = notices.filter(notice =>
    notice.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notice.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: notices.length,
    active: notices.filter(n => n.status === "active").length,
    expired: notices.filter(n => n.status === "expired").length,
    draft: notices.filter(n => n.status === "draft").length,
  };

  return (
    <div style={{ padding: "24px 32px", minHeight: "100vh" }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase",
          color: T.inkMuted, margin: "0 0 8px",
        }}>
          {user?.building?.building_name || "NestOS"} · Admin Console
        </p>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 28,
          fontWeight: 700, color: T.ink, margin: 0,
        }}>
          Notices
        </h1>
        <p style={{ fontSize: 14, color: T.inkSoft, marginTop: 8 }}>
          Publish and review community notices
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 32 }}>
        <StatCard title="Total Notices" value={stats.total} subtitle="All notices" icon={Bell} color="blue" delay={0} T={T} />
        <StatCard title="Active" value={stats.active} subtitle="Currently visible" icon={Bell} color="green" delay={100} T={T} />
        <StatCard title="Expired" value={stats.expired} subtitle="Past due date" icon={Calendar} color="orange" delay={200} T={T} />
        <StatCard title="Drafts" value={stats.draft} subtitle="Unpublished" icon={Edit2} color="purple" delay={300} T={T} />
      </div>

      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
        padding: 20, marginBottom: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, flex: 1 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={16} color={T.inkMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search notices..."
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
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={loadNotices}
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
            <button
              onClick={() => setModalOpen(true)}
              style={{
                padding: "10px 16px", borderRadius: 8, border: "none",
                background: T.accent, color: T.navActiveText, fontSize: 13, fontWeight: 500,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                transition: "all .2s",
              }}
              onMouseEnter={(e) => { e.target.style.opacity = 0.9; }}
              onMouseLeave={(e) => { e.target.style.opacity = 1; }}
            >
              <Plus size={14} />
              New Notice
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, padding: "0 16px" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 3 }}>Notice</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1.5 }}>Author</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1 }}>Date</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", width: 100, textAlign: "right" }}>Actions</span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: T.inkSoft }}>
            Loading notices...
          </div>
        ) : filteredNotices.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: T.inkSoft }}>
            {searchQuery ? "No notices found matching your search" : "No notices yet"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredNotices.map((notice, index) => (
              <NoticeRow key={notice.id || index} notice={notice} T={T} delay={index * 50} />
            ))}
          </div>
        )}
      </div>

      {/* Create Notice Modal */}
      {modalOpen && (
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
            maxWidth: 500,
            width: "90%",
            position: "relative",
            border: `1px solid ${T.border}`,
          }}>
            <button
              onClick={() => setModalOpen(false)}
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
              Create New Notice
            </h2>
            <p style={{ fontSize: 14, color: T.inkSoft, marginBottom: 24 }}>
              Publish a new notice for the community
            </p>

            <form onSubmit={handleCreateNotice} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.inkMuted,
                  marginBottom: 6,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  Title *
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                />
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
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
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
                    resize: "vertical",
                  }}
                />
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
                  Notice Type
                </label>
                <select
                  value={formData.notice_type}
                  onChange={(e) => setFormData({ ...formData, notice_type: e.target.value })}
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
                  <option value="General">General</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                </select>
              </div>
              <div style={{
                display: "flex",
                gap: 12,
                marginTop: 8,
              }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.surface2,
                    color: T.ink,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.background = T.surface; }}
                  onMouseLeave={(e) => { e.target.style.background = T.surface2; }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: T.accent,
                    color: T.navActiveText,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: creating ? "wait" : "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => { if (!creating) e.target.style.opacity = 0.9; }}
                  onMouseLeave={(e) => { if (!creating) e.target.style.opacity = 1; }}
                >
                  {creating ? "Creating..." : "Create Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;

import { useEffect, useState } from "react";
import { Bell, Search, RefreshCw, Check, AlertTriangle, Info, Megaphone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

const ACCENT = {
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
};

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function NotificationRow({ notification, T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const getIcon = () => {
    const title = notification.title?.toLowerCase() || "";
    if (title.includes("urgent") || title.includes("emergency")) return AlertTriangle;
    if (title.includes("notice") || title.includes("announcement")) return Megaphone;
    return Info;
  };

  const Icon = getIcon();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        padding: "16px",
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
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: "#3654E01A",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={20} color="#3654E0" />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: T.ink,
          }}>
            {notification.title || "Notification"}
          </span>
          {!notification.is_read && (
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: "#3654E0",
            }} />
          )}
        </div>
        <p style={{
          fontSize: 13, color: T.inkSoft, margin: "0 0 8px 0", lineHeight: 1.5,
        }}>
          {notification.message || "—"}
        </p>
        <span style={{ fontSize: 11, color: T.inkMuted }}>
          {formatDate(notification.created_at)} at {formatTime(notification.created_at)}
        </span>
      </div>
    </div>
  );
}

const Notifications = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/notifications/user/${user.user_id}`);
      setNotifications(response.data.data || []);
    } catch (err) {
      console.error("Notifications Error:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filteredNotifications = notifications.filter(notification =>
    notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;

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
          Notifications
        </h1>
        <p style={{ fontSize: 14, color: T.inkSoft, marginTop: 8 }}>
          View recent alerts, notices, and community updates
        </p>
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
              placeholder="Search notifications..."
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
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {unreadCount > 0 && (
              <span style={{
                fontSize: 12, color: T.inkSoft, fontFamily: "'IBM Plex Mono', monospace",
              }}>
                {unreadCount} unread
              </span>
            )}
            <button
              onClick={loadNotifications}
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
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: T.inkSoft }}>
            Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: T.inkSoft }}>
            {searchQuery ? "No notifications found matching your search" : "No notifications yet"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredNotifications.map((notification, index) => (
              <NotificationRow key={notification.notification_id || index} notification={notification} T={T} delay={index * 50} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

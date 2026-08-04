import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Home, CreditCard, AlertCircle,
  Bell, UserCheck, ShieldCheck, Settings, LogOut, Building,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext"

function getInitials(name = "") {
  if (!name) return "NO";
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme: T } = useTheme();
  const navigate = useNavigate();

  const adminMenu = [
    { name: "Dashboard",  icon: LayoutDashboard, path: "/admin/dashboard"  },
    { name: "Residents",  icon: Users,            path: "/admin/residents"  },
    { name: "Flats",      icon: Building,        path: "/admin/flats"      },
    { name: "Complaints", icon: AlertCircle,      path: "/admin/complaints" },
    { name: "Payments",   icon: CreditCard,       path: "/admin/payments"   },
    { name: "Visitors",   icon: UserCheck,        path: "/admin/visitors"   },
    { name: "Notices",    icon: Bell,             path: "/admin/notices"    },
    { name: "Settings",   icon: Settings,         path: "/admin/settings"   },
  ];

  const residentMenu = [
    { name: "Dashboard",  icon: LayoutDashboard, path: "/resident/dashboard"  },
    { name: "Complaints", icon: AlertCircle,     path: "/resident/complaints" },
    { name: "Payments",   icon: CreditCard,      path: "/resident/payments"   },
    { name: "Visitors",   icon: UserCheck,       path: "/resident/visitors"   },
    { name: "Notices",    icon: Bell,            path: "/resident/notifications"    },
  ];

  const securityMenu = [
    { name: "Dashboard",     icon: LayoutDashboard, path: "/security/dashboard" },
    { name: "Visitors",      icon: UserCheck,       path: "/security/visitor-entry" },
    { name: "Security Logs", icon: ShieldCheck,     path: "/security/visitor-history" },
  ];

  const developerMenu = [
    { name: "Dashboard",  icon: LayoutDashboard, path: "/developer/dashboard" },
  ];

  const getMenu = () => {
    switch (user?.role_id ?? user?.role) {
      case 1: case "ADMIN":     return adminMenu;
      case 2: case "RESIDENT":  return residentMenu;
      case 3: case "SECURITY":  return securityMenu;
      case 4: case "DEVELOPER": return developerMenu;
      default: return [];
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .mg-nav-link {
          display:flex; align-items:center; gap:10px; padding:10px 12px;
          border-radius:9px; font-size:13.5px; font-weight:500;
          color:${T.navItemColor}; text-decoration:none;
          transition:background .14s, color .14s;
        }
        .mg-nav-link:hover { background:${T.isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)"}; color:${T.ink}; }
        .mg-nav-link.active { background:${T.accentBg}; color:${T.navActiveText}; }
        .mg-logout-btn:hover { background:rgba(255,92,92,.16) !important; border-color:rgba(255,92,92,.45) !important; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:4px; }
      `}</style>

      <aside style={{
        width: 240, flexShrink: 0,
        background: T.sidebarBg,
        display: "flex", flexDirection: "column",
        height: "100vh",
        fontFamily: "'Inter', sans-serif",
        WebkitFontSmoothing: "antialiased",
        transition: "background .3s ease",
      }}>

        {/* Brand */}
        <div style={{
          display: "flex", alignItems: "center", gap: 11,
          padding: "0 16px", height: 64,
          borderBottom: `1px solid ${T.border}`, flexShrink: 0,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #3654E0, #6E83F2)",
            color: "#fff", fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, letterSpacing: ".02em",
          }}>{getInitials(user?.building?.building_name || "NestOS")}</div>
          <div>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 14,
              fontWeight: 700, color: T.ink, margin: 0, lineHeight: 1.2,
            }}>{user?.building?.building_name || "NestOS"}</p>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
              letterSpacing: ".08em", textTransform: "uppercase",
              color: T.inkMuted, margin: "2px 0 0",
            }}>Admin Console</p>
          </div>
        </div>

        {/* User block */}
        <div style={{
          padding: "14px 16px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: user?.profile_image ? 'transparent' : T.accentBg,
            color: "#818CF8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, flexShrink: 0,
            fontFamily: "'Space Grotesk', sans-serif",
            overflow: "hidden",
          }}>
            {user?.profile_image ? (
              <img 
                src={user.profile_image} 
                alt={user.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              getInitials(user?.name)
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontSize: 13, fontWeight: 600, color: T.ink, margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{user?.name}</p>
            <p style={{
              fontSize: 10, fontFamily: "'IBM Plex Mono', monospace",
              color: T.inkMuted, letterSpacing: ".05em",
              textTransform: "uppercase", margin: "2px 0 0",
            }}>{user?.role}</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{
          flex: 1, padding: "12px 10px",
          overflowY: "auto", display: "flex",
          flexDirection: "column", gap: 2,
        }}>
          {getMenu().map(({ name, icon: Icon, path }) => (
            <NavLink
              key={path} to={path} end
              className={({ isActive }) => `mg-nav-link${isActive ? " active" : ""}`}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "10px", borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
          <button
            className="mg-logout-btn"
            onClick={handleLogout}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8, padding: "10px 0",
              borderRadius: 9, border: "1px solid rgba(255,92,92,.25)",
              background: "rgba(255,92,92,.08)", color: "#FF7070",
              fontSize: 13, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif", cursor: "pointer",
              transition: "background .15s, border-color .15s",
            }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
import { useEffect, useState } from "react";
import { Building2, Home, Calendar, Phone, Mail, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

const MyApartment = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [residentData, setResidentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResidentData();
  }, []);

  const loadResidentData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/residents/user/${user.user_id}`);
      setResidentData(response.data.data);
    } catch (err) {
      console.error("Error loading resident data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "24px 32px", minHeight: "100vh", color: T.inkSoft }}>
        Loading apartment details...
      </div>
    );
  }

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
          My Apartment
        </h1>
        <p style={{ fontSize: 14, color: T.inkSoft, marginTop: 8 }}>
          View your apartment details and information
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: "#3654E01A",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Home size={20} color="#3654E0" />
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 18,
              fontWeight: 600, color: T.ink, margin: 0,
            }}>
              Unit Information
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InfoRow label="Unit Number" value={residentData?.unit?.unit_number || "—"} icon={Building2} T={T} />
            <InfoRow label="Floor" value={residentData?.unit?.floor_number ? `Floor ${residentData.unit.floor_number}` : "—"} icon={Building2} T={T} />
            <InfoRow label="Building" value={residentData?.unit?.building?.building_name || "—"} icon={Building2} T={T} />
            <InfoRow label="Status" value={residentData?.unit?.occupancy_status || "—"} icon={Home} T={T} />
          </div>
        </div>

        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: "#36D3991A",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User size={20} color="#36D399" />
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 18,
              fontWeight: 600, color: T.ink, margin: 0,
            }}>
              Resident Details
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InfoRow label="Name" value={user?.name || "—"} icon={User} T={T} />
            <InfoRow label="Phone" value={user?.phone_number || "—"} icon={Phone} T={T} />
            <InfoRow label="Email" value={user?.email || "—"} icon={Mail} T={T} />
            <InfoRow label="Move-in Date" value={residentData?.move_in_date ? new Date(residentData.move_in_date).toLocaleDateString() : "—"} icon={Calendar} T={T} />
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ label, value, icon: Icon, T }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Icon size={16} color={T.inkMuted} />
      <div style={{ flex: 1 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: ".04em",
          textTransform: "uppercase", color: T.inkMuted,
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          {label}
        </span>
        <p style={{ fontSize: 14, color: T.ink, margin: "4px 0 0 0" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default MyApartment;

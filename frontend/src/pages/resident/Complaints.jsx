import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

const Complaints = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setMessage("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      // Get resident info first
      const residentResponse = await api.get(`/residents/user/${user.user_id}`);
      const resident = residentResponse.data.data;
      
      if (!resident) {
        setMessage("⚠️ Your account is not linked to a resident profile. Please contact the administrator to set up your resident profile before filing complaints.");
        setLoading(false);
        return;
      }

      const complaintResponse = await api.post("/complaints", {
        ...formData,
        resident_id: resident.resident_id,
      });
      
      if (complaintResponse.data.success) {
        setMessage("✅ Complaint submitted successfully!");
        setFormData({ title: "", description: "", category: "", priority: "Medium" });
      } else {
        setMessage(complaintResponse.data.message || "Failed to submit complaint");
      }
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setMessage(err.response?.data?.message || "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
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
          File a Complaint
        </h1>
        <p style={{ fontSize: 14, color: T.inkSoft, marginTop: 8 }}>
          Submit a new complaint to the management
        </p>
      </div>

      <div style={{
        maxWidth: 600, background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 14, padding: 32,
      }}>
        {message && (
          <div style={{
            padding: 12, borderRadius: 8, marginBottom: 20,
            background: message.includes("success") ? "#36D3991A" : "#FF5C5C1A",
            color: message.includes("success") ? "#36D399" : "#FF5C5C",
            fontSize: 13,
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block", fontSize: 12, fontWeight: 600,
              fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
              textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
            }}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: 8, border: `1px solid ${T.border}`,
                background: T.bg, color: T.ink, fontSize: 14,
                outline: "none", fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block", fontSize: 12, fontWeight: 600,
              fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
              textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
            }}>
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the issue"
              rows={5}
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: 8, border: `1px solid ${T.border}`,
                background: T.bg, color: T.ink, fontSize: 14,
                outline: "none", fontFamily: "'Inter', sans-serif",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block", fontSize: 12, fontWeight: 600,
              fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
              textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
            }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: 8, border: `1px solid ${T.border}`,
                background: T.bg, color: T.ink, fontSize: 14,
                outline: "none", fontFamily: "'Inter', sans-serif",
              }}
            >
              <option value="">Select category</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Security">Security</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block", fontSize: 12, fontWeight: 600,
              fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
              textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
            }}>
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: 8, border: `1px solid ${T.border}`,
                background: T.bg, color: T.ink, fontSize: 14,
                outline: "none", fontFamily: "'Inter', sans-serif",
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px", borderRadius: 8, border: "none",
              background: loading ? "#3654E080" : "#3654E0",
              color: "#FFFFFF", fontSize: 14, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all .2s",
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = "#4A66F0"; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = "#3654E0"; }}
          >
            {loading ? "Submitting..." : (
              <>
                <Send size={16} />
                Submit Complaint
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Complaints;

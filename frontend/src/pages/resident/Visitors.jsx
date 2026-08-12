import { useEffect, useState } from "react";
import { User, Search, RefreshCw, Plus, LogIn, LogOut, Clock, X, Phone, FileText, Home } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

const ACCENT = {
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
};

const STATUS_COLOR = {
  approved:    "green",
  checked_in:  "blue",
  checked_out: "orange",
};

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function Badge({ label, map, T }) {
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

function VisitorRow({ visitor, T, delay = 0 }) {
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
            {visitor.visitor_name || "—"}
          </span>
          <Badge label={visitor.status} map={STATUS_COLOR} T={T} />
        </div>
        <p style={{
          fontSize: 12, color: T.inkSoft, margin: 0,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {visitor.purpose || "—"}
        </p>
      </div>

      <span style={{ fontSize: 12, color: T.inkSoft }}>
        {visitor.phone_number || "—"}
      </span>

      <span style={{ fontSize: 12, color: T.inkSoft }}>
        {formatDate(visitor.check_in)}
      </span>

      <span style={{ fontSize: 12, color: T.inkSoft }}>
        {formatTime(visitor.check_in)}
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

function AddVisitorModal({ onClose, onSuccess, residentId, T }) {
  const [form, setForm] = useState({ visitor_name: '', phone_number: '', purpose: '' });
  const [focus, setFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 200); };
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.visitor_name) return setError('Visitor name is required.');
    setLoading(true); setError('');
    try {
      await api.post('/api/visitors', {
        visitor_name: form.visitor_name.trim(),
        phone_number: form.phone_number.trim() || null,
        purpose: form.purpose.trim() || 'Visit',
        resident_id: residentId,
        status: 'Approved',
      });
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add visitor.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (key) => ({
    width: '100%', padding: '10px 14px 10px 34px', borderRadius: 8,
    border: `1px solid ${focus === key ? '#3654E0' : T.border}`,
    background: T.bg, color: T.ink, fontSize: 13.5,
    fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box',
    boxShadow: focus === key ? '0 0 0 3px rgba(54,84,224,.12)' : 'none',
    transition: 'border-color .18s, box-shadow .18s',
  });

  const iconStyle = { position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.inkMuted, pointerEvents: 'none' };

  return (
    <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: visible ? 'rgba(0,0,0,.55)' : 'rgba(0,0,0,0)', backdropFilter: visible ? 'blur(3px)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, transition: 'background .22s' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 420, background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`, border: `1px solid ${T.border}`, borderRadius: 18, padding: '28px 26px', position: 'relative', boxShadow: '0 28px 60px rgba(0,0,0,.5)', transform: visible ? 'translateY(0) scale(1)' : 'translateY(14px) scale(.97)', opacity: visible ? 1 : 0, transition: 'transform .22s, opacity .22s' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#3654E0', borderRadius: '18px 18px 0 0' }} />
        <button onClick={handleClose} style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: 7, border: `1px solid ${T.border}`, background: T.surface2, color: T.inkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={14} /></button>

        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: T.inkMuted, margin: '4px 0 6px' }}>New Request</p>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: T.ink, margin: '0 0 20px' }}>Request Visitor Pass</h3>

        {[
          { key: 'visitor_name', label: 'Visitor Name *', icon: User,     placeholder: 'Full name',          type: 'text'  },
          { key: 'phone_number', label: 'Phone Number',  icon: Phone,    placeholder: '10-digit number',    type: 'tel'   },
          { key: 'purpose',      label: 'Purpose',       icon: FileText, placeholder: 'e.g. Personal visit',type: 'text'  },
        ].map(({ key, label, icon: Icon, placeholder, type }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: T.inkMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em', fontFamily: "'IBM Plex Mono', monospace" }}>{label}</label>
            <div style={{ position: 'relative' }}>
              <Icon size={14} style={iconStyle} />
              <input type={type} placeholder={placeholder} value={form[key]} onChange={set(key)} onFocus={() => setFocus(key)} onBlur={() => setFocus('')} style={inputStyle(key)} />
            </div>
          </div>
        ))}

        {error && (
          <div style={{ marginBottom: 14, background: 'rgba(255,92,92,.1)', border: '1px solid rgba(255,92,92,.25)', borderRadius: 8, padding: '10px 13px', color: '#FF7070', fontSize: 12.5 }}>{error}</div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '12px 0', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #3654E0, #6E83F2)', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 4px 14px rgba(54,84,224,.3)' }}>
          {loading ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'mgSpin .7s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.25)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>Creating…</> : <><Plus size={15} />Request Pass</>}
        </button>
      </div>
    </div>
  );
}

const Visitors = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const loadVisitors = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/visitors/resident/${user.resident_id}`);
      setVisitors(response.data.data || []);
    } catch (err) {
      console.error("Visitors Error:", err);
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const filteredVisitors = visitors.filter(visitor =>
    visitor.visitor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visitor.purpose?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: visitors.length,
    checked_in: visitors.filter(v => v.status === "Checked_In").length,
    checked_out: visitors.filter(v => v.status === "Checked_Out").length,
    approved: visitors.filter(v => v.status === "Approved").length,
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
          Visitor Passes
        </h1>
        <p style={{ fontSize: 14, color: T.inkSoft, marginTop: 8 }}>
          Request and manage visitor access passes
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 32 }}>
        <StatCard title="Total Visitors" value={stats.total} subtitle="All visitors" icon={User} color="blue" delay={0} T={T} />
        <StatCard title="Checked In" value={stats.checked_in} subtitle="Currently in" icon={LogIn} color="blue" delay={100} T={T} />
        <StatCard title="Checked Out" value={stats.checked_out} subtitle="Left premises" icon={LogOut} color="orange" delay={200} T={T} />
        <StatCard title="Approved" value={stats.approved} subtitle="Pre-approved" icon={Clock} color="green" delay={300} T={T} />
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
              placeholder="Search visitors..."
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
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={loadVisitors}
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
              onClick={() => setShowModal(true)}
              style={{
                padding: "10px 16px", borderRadius: 8, border: "none",
                background: "#3654E0", color: "#FFFFFF", fontSize: 13, fontWeight: 500,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                transition: "all .2s",
              }}
              onMouseEnter={(e) => { e.target.style.background = "#4A66F0"; }}
              onMouseLeave={(e) => { e.target.style.background = "#3654E0"; }}
            >
              <Plus size={14} />
              Request Pass
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, padding: "0 16px" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 2 }}>Visitor</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1 }}>Phone</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1 }}>Date</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1 }}>Time</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", width: 100, textAlign: "right" }}>Actions</span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: T.inkSoft }}>
            Loading visitors...
          </div>
        ) : filteredVisitors.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: T.inkSoft }}>
            {searchQuery ? "No visitors found matching your search" : "No visitor passes yet"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[...filteredVisitors].reverse().map((visitor, index) => (
              <VisitorRow key={visitor.visitor_id || index} visitor={visitor} T={T} delay={index * 50} />
            ))}
          </div>
        )}
      </div>

      {showModal && <AddVisitorModal onClose={() => setShowModal(false)} onSuccess={loadVisitors} residentId={user.resident_id} T={T} />}
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

export default Visitors;

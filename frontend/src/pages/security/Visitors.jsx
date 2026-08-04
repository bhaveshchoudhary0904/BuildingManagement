import { useState, useEffect } from 'react';
import { Users, Search, Filter, RefreshCw, Clock, Phone, MapPin } from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const ACCENT = {
  yellow: { glow: "rgba(255,200,87,.12)", stripe: "#FFC857", text: "#FFC857" },
  green: { glow: "rgba(54,211,153,.10)", stripe: "#36D399", text: "#34D399" },
  blue: { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  red: { glow: "rgba(255,92,92,.10)", stripe: "#FF5C5C", text: "#FF7070" },
  orange: { glow: "rgba(251,146,60,.10)", stripe: "#FB923C", text: "#FB923C" },
};

function StatCard({ title, value, icon: Icon, color, delay = 0, T }) {
  const [visible, setVisible] = useState(false);
  const a = ACCENT[color] || ACCENT.blue;
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      position: 'relative',
      background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: '20px 18px',
      overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: `opacity .4s ease ${delay}ms, transform .4s ease ${delay}ms`,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: a.stripe, borderRadius: '14px 14px 0 0' }} />
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${a.stripe}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon size={17} color={a.stripe} />
      </div>
      <span style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: T.inkMuted, marginBottom: 5 }}>{title}</span>
      <span style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: T.ink }}>{value}</span>
    </div>
  );
}

function VisitorRow({ visitor, T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);

  const statusColors = {
    'Approved': { color: ACCENT.yellow, label: 'Approved' },
    'Checked_In': { color: ACCENT.green, label: 'Checked In' },
    'Checked_Out': { color: ACCENT.blue, label: 'Checked Out' },
  };
  const statusInfo = statusColors[visitor.status] || { color: ACCENT.blue, label: visitor.status };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr',
        alignItems: 'center',
        gap: 12,
        padding: '14px 18px',
        borderRadius: 10,
        background: hovered ? (T.isDark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.025)') : 'transparent',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity .35s ease ${delay}ms, transform .35s ease ${delay}ms, background .15s`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: `linear-gradient(135deg, ${statusInfo.color.stripe}, ${statusInfo.color.stripe}CC)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
        }}>
          {(visitor.visitor_name || '?')[0].toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{visitor.visitor_name}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11.5, color: T.inkMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Phone size={11} /> {visitor.phone_number || '—'}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.inkSoft, fontSize: 12.5 }}>
        <MapPin size={13} />
        {visitor.purpose || '—'}
      </div>
      <span style={{
        fontSize: 10.5,
        fontWeight: 700,
        padding: '4px 10px',
        borderRadius: 6,
        color: statusInfo.color.text,
        background: statusInfo.color.glow,
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: '.03em',
        textTransform: 'uppercase',
        display: 'inline-block',
      }}>
        {statusInfo.label}
      </span>
      <span style={{ fontSize: 12, color: T.inkSoft, fontFamily: "'IBM Plex Mono', monospace", display: 'flex', alignItems: 'center', gap: 4 }}>
        <Clock size={12} />
        {visitor.check_in ? new Date(visitor.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
      </span>
      <span style={{ fontSize: 12, color: T.inkSoft }}>
        {visitor.check_out ? new Date(visitor.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
      </span>
    </div>
  );
}

function FullSpinner({ T }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: 'mgSpin .8s linear infinite' }}>
        <circle cx="12" cy="12" r="10" stroke="rgba(110,131,242,.25)" strokeWidth="2.5" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#6E83F2" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const Visitors = () => {
  const { theme: T } = useTheme();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, checkedOut: 0 });

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/visitors');
      const data = response.data.data || [];
      setVisitors(data);
      
      // Calculate stats
      setStats({
        total: data.length,
        checkedIn: data.filter(v => v.status === 'Checked_In').length,
        checkedOut: data.filter(v => v.status === 'Checked_Out').length,
      });
    } catch (err) {
      console.error('Failed to fetch visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = visitors.filter(v => {
    const matchesSearch = v.visitor_name?.toLowerCase().includes(search.toLowerCase()) ||
                         v.phone_number?.includes(search) ||
                         v.purpose?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '24px' }}>
      <style>
        {`
          @keyframes mgSpin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: T.ink, fontFamily: "'Space Grotesk', sans-serif" }}>
          Visitors
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: T.inkMuted }}>
          Manage and track all visitor activities
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard title="Total Visitors" value={stats.total} icon={Users} color="blue" delay={0} T={T} />
        <StatCard title="Checked In" value={stats.checkedIn} icon={Users} color="green" delay={50} T={T} />
        <StatCard title="Checked Out" value={stats.checkedOut} icon={Users} color="blue" delay={100} T={T} />
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap',
        alignItems: 'center',
        background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
        padding: 16,
        borderRadius: 12,
        border: `1px solid ${T.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
          <Search size={16} color={T.inkMuted} />
          <input
            type="text"
            placeholder="Search by name, phone, or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: 13.5,
              color: T.ink,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.surface,
            color: T.ink,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <option value="all">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Checked_In">Checked In</option>
          <option value="Checked_Out">Checked Out</option>
        </select>
        <button
          onClick={fetchVisitors}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.surface,
            color: T.ink,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Space Grotesk', sans-serif",
            transition: 'all .2s',
          }}
          onMouseEnter={(e) => e.target.style.background = T.surface2}
          onMouseLeave={(e) => e.target.style.background = T.surface}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <FullSpinner T={T} />
      ) : (
        <div style={{
          background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr',
            gap: 12,
            padding: '14px 18px',
            background: T.isDark ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.02)',
            borderBottom: `1px solid ${T.border}`,
            fontWeight: 700,
            fontSize: 12,
            color: T.inkMuted,
            fontFamily: "'IBM Plex Mono', monospace",
            textTransform: 'uppercase',
            letterSpacing: '.05em',
          }}>
            <span>Visitor</span>
            <span>Purpose</span>
            <span>Status</span>
            <span>Check-In</span>
            <span>Check-Out</span>
          </div>

          {/* Table Rows */}
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filtered.length > 0 ? (
              filtered.map((visitor, idx) => (
                <VisitorRow key={visitor.visitor_id} visitor={visitor} T={T} delay={idx * 30} />
              ))
            ) : (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: T.inkMuted,
                fontSize: 14,
              }}>
                No visitors found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Visitors;

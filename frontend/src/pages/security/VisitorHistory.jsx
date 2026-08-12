import { useState, useEffect } from 'react';
import { ClipboardList, Search, LogIn, LogOut, Clock, Filter, RefreshCw, ChevronDown, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

const ACCENT = {
  yellow: { glow: "rgba(255,200,87,.12)",  stripe: "#FFC857", text: "#FFC857" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  red:    { glow: "rgba(255,92,92,.10)",   stripe: "#FF5C5C", text: "#FF7070" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
};

const STATUS_MAP = {
  'Approved':    { color: 'yellow', icon: Clock   },
  'Checked In':  { color: 'green',  icon: LogIn   },
  'Checked_In':  { color: 'green',  icon: LogIn   },
  'Checked Out': { color: 'blue',   icon: LogOut  },
  'Checked_Out': { color: 'blue',   icon: LogOut  },
};

function StatCard({ title, value, icon: Icon, color, delay = 0, T }) {
  const [visible, setVisible] = useState(false);
  const a = ACCENT[color] || ACCENT.blue;
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ position: 'relative', background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`, border: `1px solid ${T.border}`, borderRadius: 14, padding: '20px 18px', overflow: 'hidden', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: `opacity .4s ease ${delay}ms, transform .4s ease ${delay}ms` }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: a.stripe, borderRadius: '14px 14px 0 0' }} />
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${a.stripe}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon size={17} color={a.stripe} />
      </div>
      <span style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: T.inkMuted, marginBottom: 5 }}>{title}</span>
      <span style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: T.ink }}>{value}</span>
    </div>
  );
}

function HistoryRow({ item, onCheckOut, T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);

  const meta = STATUS_MAP[item.status] || { color: 'blue', icon: Clock };
  const a = ACCENT[meta.color];
  const Icon = meta.icon;

  const canCheckOut = item.status === 'Checked_In' || item.status === 'Checked In';

  const fmt = (dt) => dt ? new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
  const duration = item.check_in && item.check_out
    ? `${Math.round((new Date(item.check_out) - new Date(item.check_in)) / 60000)} min`
    : item.check_in ? 'Inside' : '—';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr 100px',
        alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 10,
        background: hovered ? (T.isDark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.025)') : 'transparent',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity .35s ease ${delay}ms, transform .35s ease ${delay}ms, background .15s`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: a.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={14} color={a.stripe} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.visitor_name}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11.5, color: T.inkMuted }}>{item.phone_number || '—'}</p>
        </div>
      </div>
      <span style={{ fontSize: 12.5, color: T.inkSoft }}>{item.purpose || '—'}</span>
      <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 6, color: a.text, background: a.glow, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.03em', textTransform: 'uppercase', display: 'inline-block' }}>
        {item.status?.replace('_', ' ')}
      </span>
      <span style={{ fontSize: 12, color: T.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>{fmt(item.check_in)}</span>
      <span style={{ fontSize: 12, color: T.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>{fmt(item.check_out)}</span>
      <span style={{ fontSize: 12, color: T.inkSoft }}>{duration}</span>
      {canCheckOut ? (
        <button
          onClick={async () => { setLoading(true); await onCheckOut(item.visitor_id); setLoading(false); }}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 0', borderRadius: 7, border: 'none',
            background: 'linear-gradient(135deg, #6E83F2, #5B72E0)',
            color: '#fff', fontSize: 12.5, fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer', width: '100%',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ animation: 'mgSpin .7s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.25)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>
            : <><CheckCircle2 size={13} />Exit</>
          }
        </button>
      ) : (
        <span style={{ fontSize: 11.5, color: T.inkMuted, textAlign: 'center' }}>—</span>
      )}
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

const VisitorHistory = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [headerVisible, setHeaderVisible] = useState(false);
  const [refreshSpin, setRefreshSpin] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/visitors');
      setVisitors(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (!loading) { const t = setTimeout(() => setHeaderVisible(true), 50); return () => clearTimeout(t); } }, [loading]);

  const handleRefresh = () => { setRefreshSpin(true); setHeaderVisible(false); load().then(() => setTimeout(() => setRefreshSpin(false), 600)); };

  const handleCheckOut = async (id) => {
    try { await api.post(`/api/visitors/${id}/check-out`); await load(); } catch (e) { console.error(e); }
  };

  const filtered = visitors.filter(v => {
    const matchSearch = (v.visitor_name || '').toLowerCase().includes(search.toLowerCase()) || (v.purpose || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || (v.status || '').toLowerCase().replace(' ', '_') === statusFilter.toLowerCase().replace(' ', '_');
    return matchSearch && matchStatus;
  });

  const checkedIn  = visitors.filter(v => v.status === 'Checked_In'  || v.status === 'Checked In').length;
  const checkedOut = visitors.filter(v => v.status === 'Checked_Out' || v.status === 'Checked Out').length;
  const approved   = visitors.filter(v => v.status === 'Approved').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: ${T.isDark ? '#4A5068' : '#9098AC'}; }
        .mg-search:focus { border-color: #6E83F2 !important; box-shadow: 0 0 0 3px rgba(110,131,242,.15) !important; }
        .mg-filter:hover { border-color: ${T.isDark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.18)'} !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: T.isDark ? `radial-gradient(circle at 15% 10%, rgba(110,131,242,.08), transparent 40%), radial-gradient(circle at 85% 85%, rgba(255,200,87,.06), transparent 40%), ${T.bg}` : T.bg, padding: '36px 38px 64px', fontFamily: "'Inter', sans-serif", WebkitFontSmoothing: 'antialiased', color: T.ink, transition: 'background .3s' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16, opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(-10px)', transition: 'opacity .4s ease, transform .4s ease' }}>
          <div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: T.inkMuted, margin: '0 0 8px' }}>{user?.building?.building_name || "NestOS"} · Gate 1</p>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, color: T.ink, margin: 0 }}>Visitor History</h1>
            <p style={{ color: T.inkSoft, margin: '6px 0 0', fontSize: 14 }}>Full log of all visitor activity</p>
          </div>
          <button onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg, #3654E0, #6E83F2)`, color: '#fff', border: 'none', padding: '11px 18px', borderRadius: 8, fontSize: 13.5, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer', boxShadow: '0 6px 18px rgba(54,84,224,.32)' }}>
            <RefreshCw size={15} style={{ animation: refreshSpin ? 'mgSpin .7s linear infinite' : 'none' }} />Refresh
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard title="Total Visitors" value={visitors.length} icon={ClipboardList} color="blue"   delay={0}   T={T} />
          <StatCard title="Checked In"     value={checkedIn}       icon={LogIn}         color="green"  delay={70}  T={T} />
          <StatCard title="Checked Out"    value={checkedOut}      icon={LogOut}        color="orange" delay={140} T={T} />
          <StatCard title="Awaiting"       value={approved}        icon={Clock}         color="yellow" delay={210} T={T} />
        </div>

        {/* Table */}
        <div style={{ background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden' }}>
          {/* toolbar */}
          <div style={{ padding: '16px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 320 }}>
              <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.inkMuted }} />
              <input type="text" placeholder="Search by name or purpose…" value={search} onChange={e => setSearch(e.target.value)} className="mg-search" style={{ width: '100%', padding: '9px 14px 9px 33px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.ink, fontSize: 13, fontFamily: "'Inter', sans-serif", outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['all', 'Approved', 'Checked_In', 'Checked_Out'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className="mg-filter" style={{ padding: '8px 13px', borderRadius: 8, border: `1px solid ${statusFilter === s ? 'transparent' : T.border}`, background: statusFilter === s ? 'linear-gradient(135deg, #3654E0, #6E83F2)' : T.surface, color: statusFilter === s ? '#fff' : T.inkSoft, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'background .15s, border-color .15s, color .15s' }}>
                  {s === 'all' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* head */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr 100px', gap: 12, padding: '10px 18px', borderBottom: `1px solid ${T.border}` }}>
            {['Visitor', 'Purpose', 'Status', 'Check-in', 'Check-out', 'Duration', 'Action'].map((h, i) => (
              <span key={i} style={{ fontSize: 10.5, fontWeight: 700, color: T.inkMuted, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: "'IBM Plex Mono', monospace" }}>{h}</span>
            ))}
          </div>

          <div style={{ padding: '6px 8px' }}>
            {loading ? <FullSpinner T={T} /> : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <ClipboardList size={30} color={T.inkMuted} style={{ marginBottom: 8 }} />
                <p style={{ color: T.inkSoft, fontSize: 13 }}>No history found</p>
              </div>
            ) : filtered.map((v, i) => <HistoryRow key={v.visitor_id || i} item={v} onCheckOut={handleCheckOut} T={T} delay={i * 35} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default VisitorHistory;
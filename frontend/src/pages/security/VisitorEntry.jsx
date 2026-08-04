import { useState, useEffect } from 'react';
import {
  UserCheck, Search, Plus, X, User, Home,
  Phone, FileText, CheckCircle2, Clock,
  Camera, RefreshCw, ChevronRight, LogOut,
} from 'lucide-react';
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

function StatCard({ title, value, subtitle, icon: Icon, color, delay = 0, T }) {
  const [visible, setVisible] = useState(false);
  const a = ACCENT[color] || ACCENT.blue;
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      position: 'relative',
      background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
      border: `1px solid ${T.border}`, borderRadius: 14, padding: '20px 18px', overflow: 'hidden',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: `opacity .4s ease ${delay}ms, transform .4s ease ${delay}ms`,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: a.stripe, borderRadius: '14px 14px 0 0' }} />
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${a.stripe}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon size={17} color={a.stripe} />
      </div>
      <span style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: T.inkMuted, marginBottom: 5 }}>{title}</span>
      <span style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: T.ink }}>{value}</span>
      <span style={{ display: 'block', marginTop: 4, fontSize: 11.5, color: T.inkSoft }}>{subtitle}</span>
    </div>
  );
}

function StatusBadge({ status, T }) {
  const map = {
    'Approved':    ACCENT.yellow,
    'Checked In':  ACCENT.green,
    'Checked_In':  ACCENT.green,
    'Checked Out': ACCENT.blue,
    'Checked_Out': ACCENT.blue,
  };
  const a = map[status] || ACCENT.blue;
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
      color: a.text, background: a.glow,
      fontFamily: "'IBM Plex Mono', monospace",
      letterSpacing: '.03em', textTransform: 'uppercase',
    }}>
      {status?.replace('_', ' ')}
    </span>
  );
}

function VisitorRow({ visitor, onCheckIn, onCheckOut, T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);

  const canCheckIn = visitor.status === 'Approved' && !visitor.check_in;
  const canCheckOut = visitor.status === 'Checked_In' || visitor.status === 'Checked In';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr 120px',
        alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 10,
        background: hovered ? (T.isDark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.025)') : 'transparent',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity .35s ease ${delay}ms, transform .35s ease ${delay}ms, background .15s`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFC857, #FFB830)',
          color: '#13161D', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, flexShrink: 0,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {(visitor.visitor_name || '?')[0].toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{visitor.visitor_name}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11.5, color: T.inkMuted }}>{visitor.phone_number || '—'}</p>
        </div>
      </div>
      <span style={{ fontSize: 12.5, color: T.inkSoft }}>{visitor.purpose || '—'}</span>
      <StatusBadge status={visitor.status} T={T} />
      <span style={{ fontSize: 11.5, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
        {visitor.check_in ? new Date(visitor.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
      </span>
      {canCheckIn ? (
        <button
          onClick={async () => { setLoading(true); await onCheckIn(visitor.visitor_id); setLoading(false); }}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 0', borderRadius: 7, border: 'none',
            background: 'linear-gradient(135deg, #FFC857, #FFB830)',
            color: '#13161D', fontSize: 12.5, fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer', width: '100%',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ animation: 'mgSpin .7s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,.25)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#13161D" strokeWidth="3" strokeLinecap="round" /></svg>
            : <><CheckCircle2 size={13} />Allow</>
          }
        </button>
      ) : canCheckOut ? (
        <button
          onClick={async () => { setLoading(true); await onCheckOut(visitor.visitor_id); setLoading(false); }}
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
            : <><LogOut size={13} />Exit</>
          }
        </button>
      ) : (
        <span style={{ fontSize: 11.5, color: T.inkMuted, textAlign: 'center' }}>—</span>
      )}
    </div>
  );
}

function AddVisitorModal({ onClose, onSuccess, T }) {
  const [form, setForm] = useState({ visitor_name: '', phone_number: '', purpose: '', unit: '' });
  const [focus, setFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 200); };
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.visitor_name || !form.unit) return setError('Name and flat number are required.');
    setLoading(true); setError('');
    try {
      const residentsRes = await api.get('/residents');
      const residents = residentsRes.data.data || [];
      const matched = residents.find(r => r.unit?.unit_number === form.unit.trim()) || residents[0];
      await api.post('/visitors', {
        visitor_name: form.visitor_name.trim(),
        phone_number: form.phone_number.trim() || null,
        purpose: form.purpose.trim() || 'Visit',
        resident_id: matched?.resident_id,
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
    border: `1px solid ${focus === key ? '#FFC857' : T.border}`,
    background: T.bg, color: T.ink, fontSize: 13.5,
    fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box',
    boxShadow: focus === key ? '0 0 0 3px rgba(255,200,87,.12)' : 'none',
    transition: 'border-color .18s, box-shadow .18s',
  });

  const iconStyle = { position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.inkMuted, pointerEvents: 'none' };

  return (
    <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: visible ? 'rgba(0,0,0,.55)' : 'rgba(0,0,0,0)', backdropFilter: visible ? 'blur(3px)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, transition: 'background .22s' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 420, background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`, border: `1px solid ${T.border}`, borderRadius: 18, padding: '28px 26px', position: 'relative', boxShadow: '0 28px 60px rgba(0,0,0,.5)', transform: visible ? 'translateY(0) scale(1)' : 'translateY(14px) scale(.97)', opacity: visible ? 1 : 0, transition: 'transform .22s, opacity .22s' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#FFC857', borderRadius: '18px 18px 0 0' }} />
        <button onClick={handleClose} style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: 7, border: `1px solid ${T.border}`, background: T.surface2, color: T.inkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={14} /></button>

        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: T.inkMuted, margin: '4px 0 6px' }}>New Entry</p>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: T.ink, margin: '0 0 20px' }}>Add Visitor</h3>

        {[
          { key: 'visitor_name', label: 'Visitor Name *', icon: User,     placeholder: 'Full name',          type: 'text'  },
          { key: 'phone_number', label: 'Phone Number',  icon: Phone,    placeholder: '10-digit number',    type: 'tel'   },
          { key: 'unit',         label: 'Flat / Unit *', icon: Home,     placeholder: 'e.g. A-204',         type: 'text'  },
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

        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '12px 0', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #FFC857, #FFB830)', color: '#13161D', fontSize: 14, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 4px 14px rgba(255,200,87,.3)' }}>
          {loading ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'mgSpin .7s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,.25)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#13161D" strokeWidth="3" strokeLinecap="round" /></svg>Adding…</> : <><Plus size={15} />Add Visitor</>}
        </button>
      </div>
    </div>
  );
}

function FullSpinner({ T }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: 'mgSpin .8s linear infinite' }}>
        <circle cx="12" cy="12" r="10" stroke="rgba(255,200,87,.25)" strokeWidth="2.5" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#FFC857" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const VisitorEntry = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [refreshSpin, setRefreshSpin] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/visitors');
      const all = res.data.data || [];
      // Show all visitors including pre-approved ones
      setVisitors(all);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (!loading) { const t = setTimeout(() => setHeaderVisible(true), 50); return () => clearTimeout(t); } }, [loading]);

  const handleRefresh = () => { setRefreshSpin(true); setHeaderVisible(false); load().then(() => setTimeout(() => setRefreshSpin(false), 600)); };

  const handleCheckIn = async (id) => {
    try { await api.post(`/visitors/${id}/check-in`); await load(); } catch (e) { console.error(e); }
  };

  const handleCheckOut = async (id) => {
    try { await api.post(`/visitors/${id}/check-out`); await load(); } catch (e) { console.error(e); }
  };

  const filtered = visitors.filter(v =>
    (v.visitor_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.purpose || '').toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount  = visitors.filter(v => v.status === 'Approved' && !v.check_in).length;
  const checkedIn     = visitors.filter(v => v.status === 'Checked_In' || v.status === 'Checked In').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: ${T.isDark ? '#4A5068' : '#9098AC'}; }
        .mg-search:focus { border-color: #FFC857 !important; box-shadow: 0 0 0 3px rgba(255,200,87,.12) !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: T.isDark ? `radial-gradient(circle at 15% 10%, rgba(255,200,87,.07), transparent 40%), radial-gradient(circle at 85% 85%, rgba(110,131,242,.07), transparent 40%), ${T.bg}` : T.bg, padding: '36px 38px 64px', fontFamily: "'Inter', sans-serif", WebkitFontSmoothing: 'antialiased', color: T.ink, transition: 'background .3s' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16, opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(-10px)', transition: 'opacity .4s ease, transform .4s ease' }}>
          <div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: T.inkMuted, margin: '0 0 8px' }}>{user?.building?.building_name || "NestOS"} · Gate 1</p>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, color: T.ink, margin: 0 }}>Visitor Entry</h1>
            <p style={{ color: T.inkSoft, margin: '6px 0 0', fontSize: 14 }}>Manage and approve visitor access</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.surface, color: T.ink, border: `1px solid ${T.border}`, padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer' }}>
              <RefreshCw size={14} style={{ animation: refreshSpin ? 'mgSpin .7s linear infinite' : 'none' }} />Refresh
            </button>
            <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #FFC857, #FFB830)', color: '#13161D', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 13.5, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer', boxShadow: '0 6px 16px rgba(255,200,87,.3)' }}>
              <Plus size={15} />Add Visitor
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard title="Pending"     value={pendingCount}        subtitle="Awaiting check-in"  icon={Clock}      color="yellow" delay={0}   T={T} />
          <StatCard title="Checked In"  value={checkedIn}           subtitle="Currently inside"   icon={CheckCircle2} color="green" delay={70} T={T} />
          <StatCard title="Total Today" value={visitors.length}     subtitle="All approvals"      icon={UserCheck}  color="blue"   delay={140} T={T} />
        </div>

        {/* Table */}
        <div style={{ background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden' }}>
          {/* toolbar */}
          <div style={{ padding: '16px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
              <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.inkMuted }} />
              <input type="text" placeholder="Search visitors…" value={search} onChange={e => setSearch(e.target.value)} className="mg-search" style={{ width: '100%', padding: '9px 14px 9px 33px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.ink, fontSize: 13, fontFamily: "'Inter', sans-serif", outline: 'none' }} />
            </div>
          </div>

          {/* head */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr 120px', gap: 12, padding: '10px 18px', borderBottom: `1px solid ${T.border}` }}>
            {['Visitor', 'Purpose', 'Status', 'Check-in', 'Action'].map((h, i) => (
              <span key={i} style={{ fontSize: 10.5, fontWeight: 700, color: T.inkMuted, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: "'IBM Plex Mono', monospace" }}>{h}</span>
            ))}
          </div>

          {/* body */}
          <div style={{ padding: '6px 8px' }}>
            {loading ? <FullSpinner T={T} /> : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <UserCheck size={30} color={T.inkMuted} style={{ marginBottom: 8 }} />
                <p style={{ color: T.inkSoft, fontSize: 13 }}>No visitors found</p>
              </div>
            ) : filtered.map((v, i) => (
              <VisitorRow key={v.visitor_id} visitor={v} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} T={T} delay={i * 40} />
            ))}
          </div>
        </div>
      </div>

      {showModal && <AddVisitorModal onClose={() => setShowModal(false)} onSuccess={load} T={T} />}
    </>
  );
};

export default VisitorEntry;
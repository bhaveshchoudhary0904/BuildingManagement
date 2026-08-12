import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck, Truck, ClipboardList, ShieldCheck,
  RefreshCw, Plus, X, User, Home,
  CheckCircle2, Clock, LogIn, LogOut,
} from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

/* ─── Accent map ────────────────────────────────────────────────────────── */
const ACCENT = {
  yellow: { glow: "rgba(255,200,87,.12)",  stripe: "#FFC857", text: "#FFC857" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  red:    { glow: "rgba(255,92,92,.10)",   stripe: "#FF5C5C", text: "#FF7070" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
};

const STATUS_MAP = {
  'Approved':    { color: 'yellow', icon: Clock       },
  'Checked In':  { color: 'green',  icon: LogIn       },
  'Checked Out': { color: 'blue',   icon: LogOut      },
  'Checked_In':  { color: 'green',  icon: LogIn       },
  'Checked_Out': { color: 'blue',   icon: LogOut      },
};

/* ─── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({ title, value, subtitle, icon: Icon, color, delay = 0, T }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const a = ACCENT[color] || ACCENT.blue;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
        border: `1px solid ${hovered ? (T.isDark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.14)') : T.border}`,
        borderRadius: 14, padding: '20px 18px', overflow: 'hidden',
        transform: visible ? (hovered ? 'translateY(-3px)' : 'translateY(0)') : 'translateY(12px)',
        opacity: visible ? 1 : 0,
        boxShadow: hovered ? `0 14px 32px rgba(0,0,0,.28), 0 0 0 1px ${a.stripe}22` : 'none',
        transition: `opacity .4s ease ${delay}ms, transform .4s ease ${delay}ms, box-shadow .2s, border-color .2s`,
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: a.stripe, borderRadius: '14px 14px 0 0' }} />
      <div style={{ position: 'absolute', top: -16, right: -16, width: 70, height: 70, borderRadius: '50%', background: a.glow, filter: 'blur(14px)', pointerEvents: 'none' }} />
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${a.stripe}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon size={17} color={a.stripe} />
      </div>
      <span style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: T.inkMuted, marginBottom: 5 }}>{title}</span>
      <span style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>{value}</span>
      <span style={{ display: 'block', marginTop: 4, fontSize: 11.5, color: T.inkSoft }}>{subtitle}</span>
    </div>
  );
}

/* ─── Quick nav button ──────────────────────────────────────────────────── */
function NavBtn({ icon: Icon, label, onClick, color = 'blue', T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const a = ACCENT[color] || ACCENT.blue;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '11px 18px', borderRadius: 9,
        border: `1px solid ${hovered ? 'transparent' : T.border}`,
        background: hovered ? `linear-gradient(135deg, ${a.stripe}CC, ${a.stripe})` : T.surface,
        color: hovered ? (color === 'yellow' ? '#13161D' : '#fff') : T.ink,
        fontSize: 13.5, fontWeight: 700,
        fontFamily: "'Space Grotesk', sans-serif",
        cursor: 'pointer',
        boxShadow: hovered ? `0 6px 18px ${a.glow}` : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity .35s ease ${delay}ms, transform .35s ease ${delay}ms, background .18s, border-color .18s, color .18s, box-shadow .18s`,
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

/* ─── Pending visitor card ──────────────────────────────────────────────── */
function PendingCard({ visitor, onAllow, T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const handleAllow = async () => {
    setLoading(true);
    await onAllow(visitor.visitor_id);
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      padding: '16px 18px',
      background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-8px)',
      transition: `opacity .38s ease ${delay}ms, transform .38s ease ${delay}ms`,
    }}>
      {/* left accent */}
      <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 3, background: '#FFC857', flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.ink, fontFamily: "'Space Grotesk', sans-serif" }}>
          {visitor.visitor_name}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: T.inkSoft }}>
          {visitor.purpose || 'Visitor'}
        </p>
      </div>

      <button
        onClick={handleAllow}
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '9px 16px', borderRadius: 8, border: 'none',
          background: loading ? 'rgba(255,200,87,.4)' : 'linear-gradient(135deg, #FFC857, #FFB830)',
          color: '#13161D', fontSize: 13, fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
          cursor: loading ? 'not-allowed' : 'pointer',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(255,200,87,.3)',
          transition: 'opacity .15s',
        }}
      >
        {loading
          ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation: 'mgSpin .7s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,.25)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#13161D" strokeWidth="3" strokeLinecap="round" /></svg>Checking…</>
          : <><CheckCircle2 size={14} />Verify &amp; Allow</>
        }
      </button>
    </div>
  );
}

/* ─── Log row ───────────────────────────────────────────────────────────── */
function LogRow({ item, T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const meta = STATUS_MAP[item.status] || { color: 'blue', icon: Clock };
  const a = ACCENT[meta.color];
  const Icon = meta.icon;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 0', borderBottom: `1px solid ${T.border}`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-6px)',
      transition: `opacity .35s ease ${delay}ms, transform .35s ease ${delay}ms`,
    }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, background: a.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={13} color={a.stripe} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.visitor_name}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: T.inkMuted }}>
          {item.check_in ? new Date(item.check_in).toLocaleTimeString() : '—'}
        </p>
      </div>
      <span style={{
        fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
        color: a.text, background: a.glow,
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: '.03em', textTransform: 'uppercase', flexShrink: 0,
      }}>
        {item.status?.replace('_', ' ')}
      </span>
    </div>
  );
}

/* ─── Full spinner ───────────────────────────────────────────────────────── */
function FullSpinner({ T }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: T.bg }}>
      <style>{`@keyframes mgSpin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: 'center' }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" style={{ animation: 'mgSpin .8s linear infinite' }}>
          <circle cx="12" cy="12" r="10" stroke="rgba(255,200,87,.25)" strokeWidth="2.5" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#FFC857" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <p style={{ marginTop: 12, color: T.inkSoft, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.06em' }}>
          LOADING DASHBOARD
        </p>
      </div>
    </div>
  );
}

/* ─── Walk-in modal ─────────────────────────────────────────────────────── */
function WalkinModal({ onClose, onSubmit, T }) {
  const [walkinName, setWalkinName] = useState('');
  const [walkinUnit, setWalkinUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [focus, setFocus] = useState('');

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit(walkinName, walkinUnit);
    setLoading(false);
    handleClose();
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: visible ? 'rgba(0,0,0,.55)' : 'rgba(0,0,0,0)',
        backdropFilter: visible ? 'blur(3px)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        transition: 'background .22s, backdrop-filter .22s',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 400,
          background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
          border: `1px solid ${T.border}`,
          borderRadius: 18, padding: '28px 26px',
          position: 'relative',
          boxShadow: '0 28px 60px rgba(0,0,0,.5)',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(14px) scale(.97)',
          opacity: visible ? 1 : 0,
          transition: 'transform .22s ease, opacity .22s ease',
        }}
      >
        {/* stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#FFC857', borderRadius: '18px 18px 0 0' }} />

        {/* close */}
        <button onClick={handleClose} style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: 7, border: `1px solid ${T.border}`, background: T.surface2, color: T.inkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={14} />
        </button>

        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: T.inkMuted, margin: '4px 0 6px' }}>Walk-in Entry</p>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: T.ink, margin: '0 0 20px' }}>Log a Walk-in Visitor</h3>

        {/* Name */}
        <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: T.inkMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em', fontFamily: "'IBM Plex Mono', monospace" }}>
          Visitor Name
        </label>
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <User size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.inkMuted }} />
          <input
            type="text"
            placeholder="Full name"
            value={walkinName}
            onChange={e => setWalkinName(e.target.value)}
            onFocus={() => setFocus('name')} onBlur={() => setFocus('')}
            style={{
              width: '100%', padding: '10px 14px 10px 32px', borderRadius: 8,
              border: `1px solid ${focus === 'name' ? '#FFC857' : T.border}`,
              background: T.bg, color: T.ink, fontSize: 13.5,
              fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box',
              boxShadow: focus === 'name' ? '0 0 0 3px rgba(255,200,87,.12)' : 'none',
              transition: 'border-color .18s, box-shadow .18s',
            }}
          />
        </div>

        {/* Unit */}
        <label style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: T.inkMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em', fontFamily: "'IBM Plex Mono', monospace" }}>
          Flat / Unit
        </label>
        <div style={{ position: 'relative', marginBottom: 22 }}>
          <Home size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.inkMuted }} />
          <input
            type="text"
            placeholder="e.g. B-108"
            value={walkinUnit}
            onChange={e => setWalkinUnit(e.target.value)}
            onFocus={() => setFocus('unit')} onBlur={() => setFocus('')}
            style={{
              width: '100%', padding: '10px 14px 10px 32px', borderRadius: 8,
              border: `1px solid ${focus === 'unit' ? '#FFC857' : T.border}`,
              background: T.bg, color: T.ink, fontSize: 13.5,
              fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box',
              boxShadow: focus === 'unit' ? '0 0 0 3px rgba(255,200,87,.12)' : 'none',
              transition: 'border-color .18s, box-shadow .18s',
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !walkinName || !walkinUnit}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 8, border: 'none',
            background: (!walkinName || !walkinUnit) ? T.border : 'linear-gradient(135deg, #FFC857, #FFB830)',
            color: (!walkinName || !walkinUnit) ? T.inkMuted : '#13161D',
            fontSize: 13.5, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
            cursor: (!walkinName || !walkinUnit || loading) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            boxShadow: (!walkinName || !walkinUnit) ? 'none' : '0 4px 14px rgba(255,200,87,.3)',
            transition: 'background .2s, color .2s',
          }}
        >
          {loading
            ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'mgSpin .7s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,.25)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#13161D" strokeWidth="3" strokeLinecap="round" /></svg>Sending…</>
            : 'Send for Approval'
          }
        </button>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
const SecurityDashboard = () => {
  const navigate = useNavigate();
  const { theme: T } = useTheme();
  const { user } = useAuth();

  const [pending, setPending]       = useState([]);
  const [history, setHistory]       = useState([]);
  const [walkinOpen, setWalkinOpen] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  const loadVisitors = async () => {
    try {
      const response = await api.get('/api/visitors');
      const visitors = response.data.data || [];
      setPending(visitors.filter(v => v.status === 'Approved' && !v.check_in));
      setHistory(visitors.filter(v => v.check_in || v.check_out));
    } catch (error) {
      console.error('Error loading visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVisitors(); }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setHeaderVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleRefresh = () => {
    setRefreshSpin(true);
    setLoading(true);
    setHeaderVisible(false);
    loadVisitors().then(() => setTimeout(() => setRefreshSpin(false), 600));
  };

  const allowEntry = async (id) => {
    try {
      await api.post(`/api/visitors/${id}/check-in`);
      await loadVisitors();
    } catch (error) {
      console.error('Error checking in visitor:', error);
    }
  };

  const submitWalkin = async (walkinName, walkinUnit) => {
    if (!walkinName || !walkinUnit) return;
    try {
      const residentsResponse = await api.get('/api/residents');
      const residents = residentsResponse.data.data || [];
      const resident = residents[0];
      await api.post('/api/visitors', {
        visitor_name: walkinName,
        resident_id: resident?.resident_id,
        purpose: 'Walk-in',
        status: 'Approved',
      });
      await loadVisitors();
    } catch (error) {
      console.error('Error creating visitor:', error);
    }
  };

  if (loading) return <FullSpinner T={T} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: ${T.isDark ? '#4A5068' : '#9098AC'}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: T.isDark
          ? `radial-gradient(circle at 15% 10%, rgba(255,200,87,.07), transparent 40%),
             radial-gradient(circle at 85% 85%, rgba(110,131,242,.07), transparent 40%), ${T.bg}`
          : T.bg,
        padding: '36px 38px 64px',
        fontFamily: "'Inter', sans-serif",
        WebkitFontSmoothing: 'antialiased',
        color: T.ink,
        transition: 'background .3s',
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 28, flexWrap: 'wrap', gap: 16,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity .4s ease, transform .4s ease',
        }}>
          <div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: T.inkMuted, margin: '0 0 8px' }}>
              {user?.building?.building_name || "NestOS"} · Gate 1
            </p>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, color: T.ink, margin: 0, letterSpacing: '-0.01em' }}>
              Security Dashboard
            </h1>
            <p style={{ color: T.inkSoft, margin: '6px 0 0', fontSize: 14 }}>
              {user?.building?.building_name || "NestOS"} - Visitor Management
            </p>
          </div>

          <button
            onClick={handleRefresh}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: `linear-gradient(135deg, #3654E0, #6E83F2)`,
              color: '#fff', border: 'none',
              padding: '11px 18px', borderRadius: 8,
              fontSize: 13.5, fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(54,84,224,.32)',
              transition: 'transform .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <RefreshCw size={15} style={{ animation: refreshSpin ? 'mgSpin .7s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {/* ── Stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
          <StatCard title="Pending Approval" value={pending.length}  subtitle="Awaiting check-in"  icon={Clock}      color="yellow" delay={0}   T={T} />
          <StatCard title="Checked In Today" value={history.filter(v => v.status === 'Checked In' || v.status === 'Checked_In').length} subtitle="Currently inside" icon={LogIn}  color="green"  delay={70}  T={T} />
          <StatCard title="Checked Out"      value={history.filter(v => v.status === 'Checked Out' || v.status === 'Checked_Out').length} subtitle="Exited today" icon={LogOut} color="blue"   delay={140} T={T} />
          <StatCard title="Total Today"      value={history.length}  subtitle="All entries today"  icon={ShieldCheck} color="orange" delay={210} T={T} />
        </div>

        {/* ── Quick nav ── */}
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          marginBottom: 26,
          padding: '18px 20px',
          background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#FFC857', borderRadius: '14px 14px 0 0' }} />
          <NavBtn icon={UserCheck}    label="Visitor Entry"   onClick={() => navigate('/security/visitor-entry')}   color="yellow" T={T} delay={0}   />
          <NavBtn icon={Truck}        label="Delivery"        onClick={() => navigate('/security/delivery')}        color="blue"   T={T} delay={50}  />
          <NavBtn icon={ClipboardList} label="History"        onClick={() => navigate('/security/visitor-history')} color="orange" T={T} delay={100} />
        </div>

        {/* ── Two col: Pending + Log ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

          {/* Pending visitors */}
          <div style={{
            background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
            border: `1px solid ${T.border}`,
            borderRadius: 16, padding: '22px 20px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#FFC857', borderRadius: '16px 16px 0 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: T.inkMuted, margin: 0 }}>Awaiting Entry</p>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: T.ink, margin: '4px 0 0' }}>Pre-approved Visitors</h2>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 6, color: '#FFC857', background: 'rgba(255,200,87,.12)', fontFamily: "'IBM Plex Mono', monospace" }}>
                {pending.length} pending
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pending.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <CheckCircle2 size={28} color={T.inkMuted} style={{ marginBottom: 8 }} />
                  <p style={{ color: T.inkSoft, fontSize: 13 }}>No pending visitors</p>
                </div>
              ) : (
                pending.map((v, i) => (
                  <PendingCard key={v.visitor_id} visitor={v} onAllow={allowEntry} T={T} delay={i * 60} />
                ))
              )}
            </div>

            {/* Walk-in trigger */}
            <button
              onClick={() => setWalkinOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginTop: 16, background: 'none', border: `1px dashed ${T.border}`,
                color: T.inkSoft, width: '100%', padding: '10px 0',
                borderRadius: 9, cursor: 'pointer', justifyContent: 'center',
                fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
                transition: 'border-color .15s, color .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFC857'; e.currentTarget.style.color = '#FFC857'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.inkSoft; }}
            >
              <Plus size={15} />
              Log a walk-in visitor
            </button>
          </div>

          {/* Today's log */}
          <div style={{
            background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
            border: `1px solid ${T.border}`,
            borderRadius: 16, padding: '22px 20px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #6E83F2, #A78BFA)', borderRadius: '16px 16px 0 0' }} />
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: T.inkMuted, margin: '0 0 4px' }}>Activity</p>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: T.ink, margin: '0 0 16px' }}>Today's Log</h2>

            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <ClipboardList size={28} color={T.inkMuted} style={{ marginBottom: 8 }} />
                <p style={{ color: T.inkSoft, fontSize: 13 }}>No activity yet today</p>
              </div>
            ) : (
              history.map((item, i) => (
                <LogRow key={i} item={item} T={T} delay={i * 50} />
              ))
            )}
          </div>

        </div>
      </div>

      {walkinOpen && (
        <WalkinModal onClose={() => setWalkinOpen(false)} onSubmit={submitWalkin} T={T} />
      )}
    </>
  );
};

export default SecurityDashboard;
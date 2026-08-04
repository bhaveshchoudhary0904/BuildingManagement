/**
 * Meridian Greens — Building Management System
 * React 18 + Tailwind CSS + Axios (mock)
 *
 * Drop into a Next.js or Vite + React project.
 * Requires: tailwindcss, axios, framer-motion
 *
 * tailwind.config.js — add to content:
 *   './src/**\/*.{js,jsx,ts,tsx}'
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

// ─── Framer Motion — optional; falls back to plain divs if not installed ────
let motion, AnimatePresence;
try {
  const fm = require('framer-motion');
  motion = fm.motion;
  AnimatePresence = fm.AnimatePresence;
} catch {
  // Lightweight shim so the rest of the file works without framer-motion
  motion = {
    div: (props) => <div {...props} />,
    button: (props) => <button {...props} />,
    section: (props) => <section {...props} />,
  };
  AnimatePresence = ({ children }) => <>{children}</>;
}

// ═══════════════════════════════════════════════════════════════
// ICON COMPONENTS
// ═══════════════════════════════════════════════════════════════
const iconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = ({ size = 18, className = '', children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={`inline-block flex-shrink-0 ${className}`} {...iconProps}>
    {children}
  </svg>
);

export const Icons = {
  Home: (p) => <Ico {...p}><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"/></Ico>,
  Users: (p) => <Ico {...p}><circle cx="9" cy="8.5" r="3"/><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><circle cx="17" cy="8.8" r="2.3"/><path d="M15.8 13.5c2.6 0 4.7 1.8 4.9 4.6"/></Ico>,
  Wrench: (p) => <Ico {...p}><path d="M14.5 5.5a4 4 0 0 0-5.4 5.4L4 16l2 2 5.1-5.1a4 4 0 0 0 5.4-5.4l-2.4 2.4-2-2Z"/></Ico>,
  Card: (p) => <Ico {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10.5h18"/><path d="M6.5 15h4"/></Ico>,
  Megaphone: (p) => <Ico {...p}><path d="M3.5 10v4l3 .6V9.4Z"/><path d="M6.5 9.4 16 5.7v12.6L6.5 14.6"/><path d="M16 8.4c1.9.5 3 1.9 3 3.6s-1.1 3.1-3 3.6"/><path d="M7.5 15l1 4.5h2.2L9.7 15"/></Ico>,
  Bell: (p) => <Ico {...p}><path d="M6 10.5a6 6 0 1 1 12 0c0 3.2 1 4.8 1.6 5.6.3.4 0 1-.5 1H4.9c-.5 0-.8-.6-.5-1C5 15.3 6 13.7 6 10.5Z"/><path d="M9.7 19.5a2.4 2.4 0 0 0 4.6 0"/></Ico>,
  User: (p) => <Ico {...p}><circle cx="12" cy="8" r="3.4"/><path d="M5 19.5c0-3.6 3.1-6 7-6s7 2.4 7 6"/></Ico>,
  Shield: (p) => <Ico {...p}><path d="M12 3.5 19 6.3v5.4c0 4.6-3.2 7.4-7 8.8-3.8-1.4-7-4.2-7-8.8V6.3Z"/><path d="M9 12.2l2 2 4-4.4"/></Ico>,
  Truck: (p) => <Ico {...p}><rect x="2.5" y="8" width="11" height="8" rx="1"/><path d="M13.5 11h3.6l2.4 2.6V16h-6z"/><circle cx="6.5" cy="17.5" r="1.6"/><circle cx="16.5" cy="17.5" r="1.6"/></Ico>,
  Clock: (p) => <Ico {...p}><circle cx="12" cy="12" r="8.3"/><path d="M12 7.5V12l3.2 2"/></Ico>,
  Search: (p) => <Ico {...p}><circle cx="10.5" cy="10.5" r="6.3"/><path d="M15.3 15.3 20 20"/></Ico>,
  Plus: (p) => <Ico {...p}><path d="M12 5v14M5 12h14" strokeWidth={1.9}/></Ico>,
  Check: (p) => <Ico {...p}><path d="M5 12.5 9.5 17 19 7" strokeWidth={2}/></Ico>,
  X: (p) => <Ico {...p}><path d="M6 6l12 12M18 6 6 18" strokeWidth={1.9}/></Ico>,
  Chevron: (p) => <Ico {...p}><path d="M9 5.5 16 12l-7 6.5" strokeWidth={1.8}/></Ico>,
  Logout: (p) => <Ico {...p}><path d="M9 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h3"/><path d="M14 8l4.5 4-4.5 4M9.5 12H19"/></Ico>,
  Badge: (p) => <Ico {...p}><rect x="4" y="3.5" width="16" height="17" rx="2.2"/><circle cx="12" cy="9.3" r="2.6"/><path d="M7.3 17c.5-2 2.3-3.2 4.7-3.2s4.2 1.2 4.7 3.2"/></Ico>,
  ArrowLeft: (p) => <Ico {...p}><path d="M15 5.5 8 12l7 6.5M9 12h11" strokeWidth={1.8}/></Ico>,
};

// ═══════════════════════════════════════════════════════════════
// INITIAL DATA
// ═══════════════════════════════════════════════════════════════
const INITIAL_RESIDENTS = [
  { unit: 'A-204', name: 'Priya Nair',    phone: '+91 98212 30421', status: 'Active' },
  { unit: 'A-108', name: 'Rohan Mehta',   phone: '+91 99870 11209', status: 'Active' },
  { unit: 'B-302', name: 'Ananya Iyer',   phone: '+91 96543 88712', status: 'Notice period' },
  { unit: 'B-110', name: 'Karan Joshi',   phone: '+91 90220 67781', status: 'Active' },
  { unit: 'C-405', name: 'Fatima Sheikh', phone: '+91 98192 54430', status: 'Active' },
  { unit: 'C-201', name: 'Aditya Rane',   phone: '+91 99301 77654', status: 'Notice period' },
];

const INITIAL_COMPLAINTS = [
  { id: 1, unit: 'A-204', issue: 'Lift malfunction — Block A',       category: 'Lift / elevator', assignee: 'Maintenance — Sandeep', status: 'progress' },
  { id: 2, unit: 'B-110', issue: 'Kitchen tap leaking',              category: 'Plumbing',        assignee: 'Maintenance — Iqbal',   status: 'assigned' },
  { id: 3, unit: 'C-405', issue: 'Common area light flickering',     category: 'Electrical',      assignee: 'Unassigned',            status: 'pending'  },
  { id: 4, unit: 'A-108', issue: 'AC not cooling',                   category: 'Electrical',      assignee: 'Maintenance — Sandeep', status: 'resolved' },
  { id: 5, unit: 'B-302', issue: 'Parking gate sensor stuck',        category: 'Security',        assignee: 'Maintenance — Iqbal',   status: 'pending'  },
];

const INITIAL_PAYMENTS = [
  { unit: 'A-204', name: 'Priya Nair',    amount: '₹4,500', due: '20 Jun', status: 'pending' },
  { unit: 'A-108', name: 'Rohan Mehta',   amount: '₹4,500', due: '20 Jun', status: 'paid'    },
  { unit: 'B-302', name: 'Ananya Iyer',   amount: '₹5,200', due: '10 Jun', status: 'overdue' },
  { unit: 'B-110', name: 'Karan Joshi',   amount: '₹4,500', due: '20 Jun', status: 'paid'    },
  { unit: 'C-405', name: 'Fatima Sheikh', amount: '₹4,800', due: '20 Jun', status: 'pending' },
];

const INITIAL_NOTICES = [
  { id: 1, title: 'Water supply interruption', body: 'Supply will be paused 10 AM–2 PM on Jun 19 for overhead tank cleaning.', date: 'Jun 17' },
  { id: 2, title: 'Society AGM — Jun 28',      body: 'Annual general meeting in the clubhouse, 7 PM. Attendance encouraged.',  date: 'Jun 15' },
];

const INITIAL_ACTIVITY = [
  { text: 'Ananya Iyer (B-302) marked overdue on maintenance fee', color: '#E0524D', time: '2h ago' },
  { text: 'Complaint #2 assigned to Iqbal — Plumbing',            color: '#3654E0', time: '5h ago' },
  { text: 'New notice published: Water supply interruption',       color: '#C98A1F', time: '1d ago' },
  { text: 'Rohan Mehta (A-108) paid maintenance fee',             color: '#2F9E64', time: '1d ago' },
];

const COMPLAINT_FLOW = ['pending', 'assigned', 'progress', 'resolved'];
const COMPLAINT_CATEGORIES = ['Plumbing', 'Electrical', 'Lift / elevator', 'Housekeeping', 'Security', 'Other'];

const STATUS_META = {
  pending:  { label: 'Pending',     tw: 'bg-amber-50  text-amber-700  border border-amber-200'  },
  assigned: { label: 'Assigned',    tw: 'bg-blue-50   text-blue-700   border border-blue-200'   },
  progress: { label: 'In progress', tw: 'bg-blue-50   text-blue-600   border border-blue-200'   },
  resolved: { label: 'Resolved',    tw: 'bg-green-50  text-green-700  border border-green-200'  },
  paid:     { label: 'Paid',        tw: 'bg-green-50  text-green-700  border border-green-200'  },
  overdue:  { label: 'Overdue',     tw: 'bg-red-50    text-red-600    border border-red-200'    },
  allowed:  { label: 'Allowed',     tw: 'bg-green-50  text-green-700  border border-green-200'  },
  denied:   { label: 'Denied',      tw: 'bg-red-50    text-red-600    border border-red-200'    },
};

const STATUS_META_DARK = {
  pending:  { label: 'Pending',     tw: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800'  },
  allowed:  { label: 'Allowed',     tw: 'bg-green-900/40  text-green-400  border border-green-800'   },
  denied:   { label: 'Denied',      tw: 'bg-red-900/40    text-red-400    border border-red-800'     },
  progress: { label: 'In progress', tw: 'bg-blue-900/40   text-blue-400   border border-blue-800'    },
};

// ═══════════════════════════════════════════════════════════════
// SHARED UTILITIES & HOOKS
// ═══════════════════════════════════════════════════════════════

/** Deterministic decorative QR cell pattern */
function qrPattern(seedStr) {
  let seed = 0;
  for (const ch of seedStr) seed += ch.charCodeAt(0);
  const cells = [];
  for (let i = 0; i < 49; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    cells.push(seed / 233280 > 0.45);
  }
  return cells;
}

function nowTime() {
  const d = new Date();
  let h = d.getHours(), m = d.getMinutes();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ap}`;
}

/** Mock Axios wrapper — replace base URL to hit a real backend */
const api = {
  baseURL: '/api', // e.g. 'https://your-bms-api.com/api'
  async post(endpoint, data) {
    try {
      // Uncomment to use real API:
      // const res = await axios.post(this.baseURL + endpoint, data);
      // return res.data;
      await new Promise(r => setTimeout(r, 200)); // simulate latency
      return { ok: true, data };
    } catch (err) {
      console.error('API error:', err);
      throw err;
    }
  },
};

/** Toast hook */
function useToast() {
  const [toast, setToast] = useState({ msg: '', visible: false });
  const timerRef = useRef(null);
  const show = useCallback((msg) => {
    setToast({ msg, visible: true });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2600);
  }, []);
  return { toast, show };
}

/** Modal hook */
function useModal() {
  const [open, setOpen] = useState(false);
  return { open, show: () => setOpen(true), hide: () => setOpen(false) };
}

// ═══════════════════════════════════════════════════════════════
// SHARED UI ATOMS
// ═══════════════════════════════════════════════════════════════

function StatusBadge({ status, dark = false }) {
  const meta = dark
    ? (STATUS_META_DARK[status] || STATUS_META[status])
    : STATUS_META[status];
  if (!meta) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${meta.tw}`}>
      {meta.label}
    </span>
  );
}

function Toast({ msg, visible }) {
  return (
    <div
      className={`fixed bottom-7 left-1/2 -translate-x-1/2 bg-[#161A23] text-white px-5 py-3 rounded-xl text-sm font-medium shadow-2xl z-[999] transition-all duration-300 pointer-events-none ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {msg}
    </div>
  );
}

function Modal({ open, onClose, title, children, accent = '#3654E0' }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <Icons.X size={18} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-1.5">{children}</label>;
}

function FieldInput({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white text-gray-900 focus:outline-none focus:border-blue-500 transition-colors ${className}`}
      {...props}
    />
  );
}

function FieldSelect({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white text-gray-900 focus:outline-none focus:border-blue-500 transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function Btn({ children, onClick, className = '', variant = 'primary', size = 'md', block = false }) {
  const base = 'inline-flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all duration-150 cursor-pointer active:scale-[.98]';
  const sizes = { sm: 'text-xs px-3 py-1.5', md: 'text-sm px-4 py-2.5', lg: 'text-base px-5 py-3' };
  const variants = {
    primary:  'bg-[#3654E0] text-white shadow-[0_6px_16px_rgba(54,84,224,.28)] hover:brightness-110',
    amber:    'bg-[#FFC857] text-[#1B1305] font-bold hover:brightness-105',
    ghost:    'bg-white/10 text-white hover:bg-white/15',
    soft:     'bg-[#E8ECFD] text-[#3654E0] hover:bg-[#dce2fc]',
    resident: 'bg-[#D9714A] text-white shadow-[0_6px_16px_rgba(217,113,74,.3)] hover:brightness-110',
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${block ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOBBY SCREEN
// ═══════════════════════════════════════════════════════════════
function LobbyScreen({ onEnter }) {
  const [scanning, setScanning] = useState(null);

  const roles = [
    { id: 'admin',    icon: Icons.Shield, label: 'Admin',    meta: 'Property Manager · All Access', accent: '#3654E0' },
    { id: 'resident', icon: Icons.Home,   label: 'Resident', meta: 'Unit A‑204 · Priya Nair',       accent: '#D9714A' },
    { id: 'security', icon: Icons.Badge,  label: 'Security', meta: 'Gate 1 · Suresh Pawar',          accent: '#FFC857' },
  ];

  const handleClick = (role) => {
    setScanning(role.id);
    setTimeout(() => { setScanning(null); onEnter(role.id); }, 500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: 'radial-gradient(circle at 20% 15%, rgba(110,131,242,.10), transparent 45%), radial-gradient(circle at 85% 80%, rgba(217,113,74,.08), transparent 45%), #0E1014' }}
    >
      <div className="max-w-3xl w-full text-center">
        <p className="font-mono text-[11px] tracking-[.08em] uppercase text-[#7C84A0] mb-5">
          Meridian Greens · Kharghar, Navi Mumbai
        </p>
        <h1 className="font-['Space_Grotesk',sans-serif] text-white text-4xl md:text-5xl font-semibold tracking-tight mb-3">
          Tap a badge to enter
        </h1>
        <p className="text-[#9098B0] text-[15px] mb-12 max-w-md mx-auto">
          Demo build — pick a role to preview how the interface adapts to that job.
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          {roles.map(role => {
            const Icon = role.icon;
            const isScanning = scanning === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleClick(role)}
                className={`relative w-52 h-64 rounded-[18px] flex flex-col items-start p-5 text-left overflow-hidden cursor-pointer transition-all duration-300 border ${
                  isScanning
                    ? 'border-white/40 -translate-y-1'
                    : 'border-white/[.08] hover:border-white/[.18] hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(0,0,0,.35)]'
                }`}
                style={{ background: 'linear-gradient(165deg,#1B1F29,#13161D)' }}
              >
                {/* Colour stripe */}
                <span className="absolute top-0 left-0 right-0 h-1.5" style={{ background: role.accent }} />

                {/* Scan-sweep animation */}
                {isScanning && (
                  <span
                    className="absolute left-0 right-0 h-0.5 z-10"
                    style={{
                      background: '#fff',
                      boxShadow: '0 0 14px 2px rgba(255,255,255,.8)',
                      animation: 'scanSweep .5s ease forwards',
                    }}
                  />
                )}

                <Icon size={28} className="text-[#EDEFF5] mt-4" />
                <span className="font-['Space_Grotesk',sans-serif] text-white text-[19px] font-semibold mt-4 block">
                  {role.label}
                </span>
                <span className="text-[#8890A8] text-[12.5px] mt-1.5 leading-snug">{role.meta}</span>

                {/* Mag stripe decoration */}
                <span
                  className="absolute bottom-8 left-0 right-0 h-6 opacity-40"
                  style={{ background: 'repeating-linear-gradient(90deg,#000 0 2px,transparent 2px 5px)' }}
                />
              </button>
            );
          })}
        </div>

        <p className="text-[#5C6480] text-[13px] mt-14">
          Same system, three different jobs — watch the interface change shape, not just color.
        </p>
      </div>

      <style>{`@keyframes scanSweep{0%{top:0;opacity:1;}90%{opacity:1;}100%{top:100%;opacity:0;}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN APP
// ═══════════════════════════════════════════════════════════════
function AdminApp({ onExit }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [residents, setResidents] = useState(INITIAL_RESIDENTS);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [activity, setActivity] = useState(INITIAL_ACTIVITY);
  const [residentFilter, setResidentFilter] = useState('');
  const noticeModal = useModal();
  const { toast, show: showToast } = useToast();

  // New notice form state
  const [noticeForm, setNoticeForm] = useState({ title: '', body: '' });

  const tabs = [
    { id: 'overview',   label: 'Overview',   Icon: Icons.Home      },
    { id: 'residents',  label: 'Residents',  Icon: Icons.Users     },
    { id: 'complaints', label: 'Complaints', Icon: Icons.Wrench    },
    { id: 'payments',   label: 'Payments',   Icon: Icons.Card      },
    { id: 'notices',    label: 'Notices',    Icon: Icons.Megaphone },
  ];

  const filteredResidents = residents.filter(r =>
    r.name.toLowerCase().includes(residentFilter.toLowerCase()) ||
    r.unit.toLowerCase().includes(residentFilter.toLowerCase())
  );

  const advanceComplaint = useCallback(async (id) => {
    const c = complaints.find(x => x.id === id);
    const idx = COMPLAINT_FLOW.indexOf(c.status);
    if (idx >= COMPLAINT_FLOW.length - 1) { showToast('Complaint already resolved'); return; }
    const next = COMPLAINT_FLOW[idx + 1];

    // Mock API call — wire to real endpoint here
    await api.post('/complaints/update', { id, status: next });
    setComplaints(prev => prev.map(x => x.id === id ? { ...x, status: next } : x));
    showToast(`Complaint moved to "${STATUS_META[next].label}"`);
  }, [complaints, showToast]);

  const sendReminder = useCallback(async (payment) => {
    await api.post('/payments/remind', { unit: payment.unit });
    showToast(`Reminder sent to ${payment.name}`);
  }, [showToast]);

  const publishNotice = useCallback(async () => {
    const title = noticeForm.title.trim() || 'Untitled notice';
    const body = noticeForm.body.trim() || 'No further details provided.';
    await api.post('/notices', { title, body });
    setNotices(prev => [{ id: Date.now(), title, body, date: 'Just now' }, ...prev]);
    setActivity(prev => [{ text: `New notice published: ${title}`, color: '#C98A1F', time: 'just now' }, ...prev]);
    setNoticeForm({ title: '', body: '' });
    noticeModal.hide();
    showToast('Notice published to all residents');
  }, [noticeForm, noticeModal, showToast]);

  const tabLabel = tabs.find(t => t.id === activeTab)?.label ?? '';

  return (
    <div className="flex min-h-screen bg-[#F5F6FB] font-['Inter',sans-serif]">

      {/* ── Sidebar ── */}
      <aside className="w-56 xl:w-60 flex-shrink-0 bg-[#161A23] flex flex-col py-6 px-4 sticky top-0 h-screen">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 pb-6 border-b border-white/[.08] mb-5">
          <span className="w-9 h-9 rounded-[9px] flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#3654E0,#6E83F2)' }}>MG</span>
          <div>
            <p className="text-[#F4F5F8] text-[14px] font-semibold leading-tight font-['Space_Grotesk',sans-serif]">Meridian Greens</p>
            <p className="text-[#6A7290] text-[10px] tracking-[.08em] font-mono">ADMIN CONSOLE</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[9px] text-[13.5px] font-medium text-left transition-all cursor-pointer ${
                activeTab === id
                  ? 'bg-[rgba(110,131,242,.16)] text-white'
                  : 'text-[#A8AEC4] hover:bg-white/[.05] hover:text-[#E4E6F0]'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={onExit}
          className="flex items-center gap-2 text-[#7C84A0] hover:text-white text-[13px] pt-4 border-t border-white/[.08] mt-2 transition-colors cursor-pointer"
        >
          <Icons.ArrowLeft size={16} /> Switch role
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 px-8 xl:px-10 py-8 min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between mb-7 flex-wrap gap-4">
          <h2 className="text-2xl font-semibold text-[#161A23] font-['Space_Grotesk',sans-serif]">{tabLabel}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-black/[.08] rounded-xl px-3 py-2 text-[#9098AC] w-56">
              <Icons.Search size={16} />
              <input className="border-none outline-none text-[13.5px] w-full bg-transparent text-[#161A23] placeholder:text-[#9098AC]" placeholder="Search anything…" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-[#E8ECFD] text-[#3654E0] text-xs font-bold flex items-center justify-center">VS</span>
              <div className="text-[12.5px] font-semibold text-[#161A23] leading-snug">
                Vikram Shah<br /><span className="text-[#9098AC] font-normal">Property Manager</span>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Occupancy',      value: '92%',        foot: '110 of 120 units'       },
                    { label: 'Pending dues',   value: '₹1,84,200',  foot: '23 invoices outstanding' },
                    { label: 'Open complaints',value: '7',          foot: '2 unassigned'            },
                    { label: 'Active notices', value: '2',          foot: '1 expiring today'        },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
                      <span className="block text-[12px] text-[#9098AC] font-semibold">{s.label}</span>
                      <span className="block text-[26px] font-semibold text-[#161A23] font-['Space_Grotesk',sans-serif] my-2">{s.value}</span>
                      <span className="text-[12px] text-[#9098AC]">{s.foot}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-[16px] font-semibold mb-4">Recent activity</h3>
                  <ul className="flex flex-col gap-3">
                    {activity.map((a, i) => (
                      <li key={i} className="flex items-center gap-3 text-[13.5px] text-[#3A3F4D]">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
                        {a.text}
                        <time className="ml-auto text-[#9098AC] text-[12px] whitespace-nowrap">{a.time}</time>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* RESIDENTS */}
            {activeTab === 'residents' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-semibold">Residents</h3>
                  <div className="flex items-center gap-2 bg-[#F5F6FB] border border-black/[.06] rounded-xl px-3 py-2 text-[#9098AC] w-52">
                    <Icons.Search size={15} />
                    <input
                      className="border-none outline-none text-[13px] w-full bg-transparent text-[#161A23] placeholder:text-[#9098AC]"
                      placeholder="Filter by name or unit…"
                      value={residentFilter}
                      onChange={e => setResidentFilter(e.target.value)}
                    />
                  </div>
                </div>
                <table className="w-full border-collapse text-[13.5px]">
                  <thead>
                    <tr>
                      {['Unit', 'Resident', 'Phone', 'Status'].map(h => (
                        <th key={h} className="text-left text-[11.5px] font-semibold text-[#9098AC] uppercase tracking-[.04em] pb-3 border-b border-[#EFF1F6] px-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResidents.length === 0 ? (
                      <tr><td colSpan={4} className="text-[#9098AC] py-6 px-2">No residents match "{residentFilter}".</td></tr>
                    ) : filteredResidents.map(r => (
                      <tr key={r.unit} className="border-b border-[#F4F5F9] last:border-none hover:bg-[#F8F9FC] transition-colors">
                        <td className="py-3 px-2 font-semibold font-mono text-[#161A23]">{r.unit}</td>
                        <td className="py-3 px-2">{r.name}</td>
                        <td className="py-3 px-2 text-[#9098AC] text-[12px]">{r.phone}</td>
                        <td className="py-3 px-2">
                          <StatusBadge status={r.status === 'Active' ? 'resolved' : 'pending'} />
                          <span className="ml-2 text-[#9098AC] text-[12px]">{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* COMPLAINTS */}
            {activeTab === 'complaints' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-semibold">Complaints</h3>
                  <span className="text-[12px] text-[#9098AC]">Click a status to move it forward</span>
                </div>
                <table className="w-full border-collapse text-[13.5px]">
                  <thead>
                    <tr>
                      {['Unit', 'Issue', 'Category', 'Assigned to', 'Status'].map(h => (
                        <th key={h} className="text-left text-[11.5px] font-semibold text-[#9098AC] uppercase tracking-[.04em] pb-3 border-b border-[#EFF1F6] px-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map(c => (
                      <tr key={c.id} className="border-b border-[#F4F5F9] last:border-none hover:bg-[#F8F9FC] transition-colors">
                        <td className="py-3 px-2 font-semibold font-mono">{c.unit}</td>
                        <td className="py-3 px-2">{c.issue}</td>
                        <td className="py-3 px-2 text-[#9098AC] text-[12px]">{c.category}</td>
                        <td className="py-3 px-2 text-[#9098AC] text-[12px]">{c.assignee}</td>
                        <td className="py-3 px-2">
                          <button onClick={() => advanceComplaint(c.id)} className="cursor-pointer hover:scale-105 transition-transform active:scale-95">
                            <StatusBadge status={c.status} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAYMENTS */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-[16px] font-semibold mb-4">Invoices</h3>
                <table className="w-full border-collapse text-[13.5px]">
                  <thead>
                    <tr>
                      {['Unit', 'Resident', 'Amount', 'Due date', 'Status', ''].map(h => (
                        <th key={h} className="text-left text-[11.5px] font-semibold text-[#9098AC] uppercase tracking-[.04em] pb-3 border-b border-[#EFF1F6] px-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={i} className="border-b border-[#F4F5F9] last:border-none hover:bg-[#F8F9FC] transition-colors">
                        <td className="py-3 px-2 font-semibold font-mono">{p.unit}</td>
                        <td className="py-3 px-2">{p.name}</td>
                        <td className="py-3 px-2 font-semibold">{p.amount}</td>
                        <td className="py-3 px-2 text-[#9098AC] text-[12px]">{p.due}</td>
                        <td className="py-3 px-2"><StatusBadge status={p.status} /></td>
                        <td className="py-3 px-2">
                          {p.status !== 'paid' && (
                            <Btn size="sm" variant="soft" onClick={() => sendReminder(p)}>Send reminder</Btn>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* NOTICES */}
            {activeTab === 'notices' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-semibold text-[#161A23]">Notice board</h3>
                  <Btn onClick={noticeModal.show}><Icons.Plus size={15} /> New notice</Btn>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {notices.map(n => (
                    <div key={n.id} className="bg-white rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Icons.Megaphone size={16} className="text-[#3654E0]" />
                        <h4 className="text-[14.5px] font-semibold">{n.title}</h4>
                      </div>
                      <p className="text-[13px] text-[#5A5F6E] leading-relaxed mb-2">{n.body}</p>
                      <time className="text-[11.5px] text-[#9098AC]">{n.date}</time>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Notice modal */}
      <AnimatePresence>
        {noticeModal.open && (
          <Modal open title="New notice" onClose={noticeModal.hide}>
            <FieldLabel>Title</FieldLabel>
            <FieldInput placeholder="e.g. Lift maintenance — Block B" value={noticeForm.title} onChange={e => setNoticeForm(f => ({ ...f, title: e.target.value }))} />
            <FieldLabel>Details</FieldLabel>
            <FieldInput placeholder="Short description residents will see" value={noticeForm.body} onChange={e => setNoticeForm(f => ({ ...f, body: e.target.value }))} />
            <Btn block className="mt-5" onClick={publishNotice}>Publish notice</Btn>
          </Modal>
        )}
      </AnimatePresence>

      <Toast {...toast} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// RESIDENT APP
// ═══════════════════════════════════════════════════════════════
function ResidentApp({ onExit }) {
  const [activeTab, setActiveTab] = useState('home');
  const [resDue, setResDue] = useState({ amount: '₹4,500', sub: 'Maintenance fee · June' });
  const [resComplaints, setResComplaints] = useState([
    { id: 1, issue: 'Lift malfunction — Block A',      category: 'Lift / elevator', status: 'progress', date: 'Jun 14' },
    { id: 2, issue: 'Common entrance gate squeaking',  category: 'Other',           status: 'resolved', date: 'Jun 2' },
  ]);
  const [paymentHistory, setPaymentHistory] = useState([
    { label: 'May maintenance fee',   date: 'May 19', amount: '₹4,500' },
    { label: 'April maintenance fee', date: 'Apr 18', amount: '₹4,500' },
  ]);
  const [visitorName, setVisitorName] = useState('');
  const [visitorTime, setVisitorTime] = useState('');
  const [visitorPass, setVisitorPass] = useState(null);
  const complaintModal = useModal();
  const [complaintForm, setComplaintForm] = useState({ category: 'Plumbing', desc: '' });
  const { toast, show: showToast } = useToast();
  const [paying, setPaying] = useState(false);

  const bottomTabs = [
    { id: 'home',       label: 'Home',      Icon: Icons.Home      },
    { id: 'complaints', label: 'Complaints',Icon: Icons.Wrench    },
    { id: 'payments',   label: 'Payments',  Icon: Icons.Card      },
    { id: 'visitors',   label: 'Visitors',  Icon: Icons.Badge     },
    { id: 'profile',    label: 'Profile',   Icon: Icons.User      },
  ];

  const stepStages = ['Submitted', 'Assigned', 'In progress', 'Resolved'];
  const currentStep = 2;

  const handlePayNow = useCallback(async () => {
    if (resDue.sub === 'No pending dues') { showToast('Already paid up for this month'); return; }
    setPaying(true);
    showToast('Processing payment…');
    await api.post('/payments/pay', { unit: 'A-204' });
    setTimeout(() => {
      setPaying(false);
      setResDue({ amount: '₹0', sub: 'No pending dues' });
      setPaymentHistory(prev => [{ label: 'June maintenance fee', date: 'Today', amount: '₹4,500' }, ...prev]);
      showToast('Payment successful ✓ Receipt saved');
    }, 900);
  }, [resDue, showToast]);

  const submitComplaint = useCallback(async () => {
    const desc = complaintForm.desc.trim() || 'No description provided';
    await api.post('/complaints', { unit: 'A-204', category: complaintForm.category, desc });
    setResComplaints(prev => [{ id: Date.now(), issue: desc, category: complaintForm.category, status: 'pending', date: 'Today' }, ...prev]);
    setComplaintForm(f => ({ ...f, desc: '' }));
    complaintModal.hide();
    showToast('Complaint submitted to admin');
  }, [complaintForm, complaintModal, showToast]);

  const generatePass = useCallback(async () => {
    const name = visitorName.trim() || 'Guest';
    const time = visitorTime.trim() || 'Today';
    await api.post('/visitors/pass', { unit: 'A-204', name, time });
    setVisitorPass({ name, time, cells: qrPattern(name + time) });
    showToast('Pass generated — share with your visitor');
  }, [visitorName, visitorTime, showToast]);

  const goTo = (tab) => setActiveTab(tab);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-4 py-9"
      style={{ background: 'radial-gradient(circle at 50% 0%, #14110D, #0E1014 60%)' }}
    >
      {/* Exit button */}
      <button
        onClick={onExit}
        className="fixed top-5 left-5 flex items-center gap-2 text-[#D8D2C8] text-[13px] px-3.5 py-2 rounded-full cursor-pointer transition-colors z-20"
        style={{ background: 'rgba(255,255,255,.06)' }}
      >
        <Icons.ArrowLeft size={15} /> Switch role
      </button>

      {/* Phone frame */}
      <div className="w-[390px] max-w-full rounded-[38px] p-2.5 shadow-[0_30px_70px_rgba(0,0,0,.5)]" style={{ background: '#15110C', height: '780px' }}>
        <div className="rounded-[30px] h-full overflow-hidden flex flex-col" style={{ background: '#FBF3EA' }}>

          {/* Header */}
          <header className="flex items-center justify-between px-6 pt-6 pb-3 flex-shrink-0">
            <div>
              <p className="text-[24px] font-semibold text-[#2B231C] font-['Fraunces',serif] m-0">Hi, Priya</p>
              <p className="text-[12.5px] text-[#9A8975] mt-1">Unit A‑204 · Meridian Greens</p>
            </div>
            <button className="relative w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2B231C] cursor-pointer">
              <Icons.Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#D9714A]" />
            </button>
          </header>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex flex-col gap-3.5 pt-1">

                {/* HOME */}
                {activeTab === 'home' && <>
                  {/* Due card */}
                  <div className="rounded-2xl p-4 flex items-center justify-between shadow-sm" style={{ background: 'linear-gradient(135deg,#fff,#F7E0D5)' }}>
                    <div>
                      <p className="text-[11px] font-semibold text-[#9A8975] uppercase tracking-wider">Pending due</p>
                      <p className="text-[26px] font-semibold text-[#2B231C] my-1 font-['Fraunces',serif]">{resDue.amount}</p>
                      <p className="text-[12.5px] text-[#9A8975]">{resDue.sub}</p>
                    </div>
                    <Btn variant="resident" onClick={handlePayNow} className={paying ? 'opacity-60 pointer-events-none' : ''}>Pay now</Btn>
                  </div>

                  {/* Active complaint */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-[11px] font-semibold text-[#9A8975] uppercase tracking-wider">Active complaint</p>
                    <p className="font-semibold text-[14.5px] text-[#2B231C] mt-1 mb-3">Lift malfunction — Block A</p>
                    <div className="flex items-center">
                      {stepStages.map((s, i) => (
                        <div key={s} className="flex flex-col items-center flex-1 relative">
                          {i < stepStages.length - 1 && (
                            <span className={`absolute top-[5px] left-1/2 w-full h-0.5 z-0 ${i < currentStep ? 'bg-[#D9714A]' : 'bg-[#E2D9CC]'}`} />
                          )}
                          <span className={`w-3 h-3 rounded-full z-10 relative ${
                            i < currentStep ? 'bg-[#D9714A]' :
                            i === currentStep ? 'bg-[#D9714A] ring-4 ring-[#F7E0D5]' :
                            'bg-[#E2D9CC]'
                          }`} />
                          <span className="text-[9.5px] text-[#9A8975] mt-1.5 text-center leading-tight">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notice */}
                  <div className="rounded-2xl p-4 flex gap-3 items-start" style={{ background: '#F7E0D5' }}>
                    <Icons.Megaphone size={18} className="text-[#D9714A] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[14.5px] text-[#2B231C] mb-1">Water supply interruption</p>
                      <p className="text-[12.5px] text-[#9A8975]">Jun 19, 10:00 AM – 2:00 PM, for tank cleaning</p>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-3">
                    {[
                      { label: 'Visitor pass', Icon: Icons.Badge, tab: 'visitors' },
                      { label: 'Raise complaint', Icon: Icons.Wrench, tab: 'complaints' },
                    ].map(({ label, Icon, tab }) => (
                      <button key={tab} onClick={() => goTo(tab)}
                        className="flex-1 flex flex-col items-center gap-2 bg-white rounded-2xl py-4 text-[12.5px] font-semibold text-[#2B231C] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                        <Icon size={22} className="text-[#D9714A]" />
                        {label}
                      </button>
                    ))}
                  </div>
                </>}

                {/* COMPLAINTS */}
                {activeTab === 'complaints' && <>
                  <div className="flex items-center justify-between mt-1">
                    <h3 className="text-[19px] font-semibold text-[#2B231C] font-['Fraunces',serif]">Complaints</h3>
                    <Btn size="sm" variant="resident" onClick={complaintModal.show}><Icons.Plus size={13} /> New</Btn>
                  </div>
                  {resComplaints.map(c => (
                    <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-[13.5px] text-[#2B231C]">{c.issue}</span>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-[12px] text-[#9A8975]">{c.category} · Filed {c.date}</p>
                    </div>
                  ))}
                </>}

                {/* PAYMENTS */}
                {activeTab === 'payments' && <>
                  <h3 className="text-[19px] font-semibold text-[#2B231C] font-['Fraunces',serif] mt-1">Payments</h3>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-[11px] font-semibold text-[#9A8975] uppercase tracking-wider mb-2">June maintenance bill</p>
                    {[['Maintenance fee', '₹4,000'], ['Parking', '₹500']].map(([l, v]) => (
                      <div key={l} className="flex justify-between text-[13.5px] text-[#2B231C] py-2 border-b border-black/[.06]"><span>{l}</span><span>{v}</span></div>
                    ))}
                    <div className="flex justify-between font-bold text-[13.5px] text-[#2B231C] pt-3"><span>Total due</span><span>₹4,500</span></div>
                    <Btn block variant="resident" className="mt-4" onClick={handlePayNow}>Pay now</Btn>
                  </div>
                  <p className="text-[11px] font-semibold text-[#9A8975] uppercase tracking-wider mt-2">History</p>
                  {paymentHistory.map((p, i) => (
                    <div key={i} className="flex justify-between items-center py-2.5 border-b border-black/[.06] text-[13px] text-[#2B231C]">
                      <div>{p.label}<span className="block text-[11px] text-[#9A8975]">{p.date}</span></div>
                      <div className="font-semibold">{p.amount}</div>
                    </div>
                  ))}
                </>}

                {/* VISITORS */}
                {activeTab === 'visitors' && <>
                  <h3 className="text-[19px] font-semibold text-[#2B231C] font-['Fraunces',serif] mt-1">Pre‑approve a visitor</h3>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <FieldLabel>Visitor name</FieldLabel>
                    <FieldInput placeholder="e.g. Rohan Mehta" value={visitorName} onChange={e => setVisitorName(e.target.value)} />
                    <FieldLabel>Expected arrival</FieldLabel>
                    <FieldInput placeholder="e.g. Today, 5:30 PM" value={visitorTime} onChange={e => setVisitorTime(e.target.value)} />
                    <Btn block variant="resident" className="mt-4" onClick={generatePass}>Generate pass</Btn>
                  </div>
                  {visitorPass && (
                    <div className="rounded-2xl p-5 text-center text-white" style={{ background: '#2B231C' }}>
                      <div className="w-32 h-32 bg-white rounded-xl mx-auto mb-4 p-2.5 grid gap-0.5" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(7, 1fr)' }}>
                        {visitorPass.cells.map((on, i) => (
                          <div key={i} className={`rounded-sm ${on ? 'bg-[#11141A]' : 'bg-transparent'}`} />
                        ))}
                      </div>
                      <h4 className="font-semibold text-[15px] mb-1">{visitorPass.name}</h4>
                      <p className="text-[12px] text-[#C7C2BA]">Unit A‑204 · Valid until {visitorPass.time}</p>
                    </div>
                  )}
                </>}

                {/* PROFILE */}
                {activeTab === 'profile' && <>
                  <h3 className="text-[19px] font-semibold text-[#2B231C] font-['Fraunces',serif] mt-1">Profile</h3>
                  <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                    <span className="w-12 h-12 rounded-full bg-[#D9714A] text-white flex items-center justify-center font-bold text-[14px] flex-shrink-0">PN</span>
                    <div>
                      <p className="font-semibold text-[14.5px] text-[#2B231C]">Priya Nair</p>
                      <p className="text-[12.5px] text-[#9A8975]">Unit A‑204 · +91 98xxxxxx21</p>
                      <p className="text-[12.5px] text-[#9A8975]">2 family members</p>
                    </div>
                  </div>
                  {['Edit profile', 'Change password'].map(label => (
                    <button key={label} className="w-full flex items-center justify-between py-3.5 border-b border-black/[.07] text-[14.5px] font-medium text-[#2B231C] cursor-pointer">
                      {label} <Icons.Chevron size={16} className="text-[#9A8975]" />
                    </button>
                  ))}
                  <button onClick={onExit} className="w-full flex items-center justify-between py-3.5 text-[14.5px] font-medium text-[#2B231C] cursor-pointer">
                    Log out <Icons.Logout size={16} className="text-[#9A8975]" />
                  </button>
                </>}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom tab bar */}
          <nav className="flex border-t border-black/[.07] bg-white px-1.5 pt-2.5 pb-3.5 flex-shrink-0">
            {bottomTabs.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 flex flex-col items-center gap-1 text-[10px] font-semibold cursor-pointer transition-colors ${activeTab === id ? 'text-[#D9714A]' : 'text-[#9A8975]'}`}>
                <Icon size={20} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Complaint modal */}
      <AnimatePresence>
        {complaintModal.open && (
          <Modal open title="New complaint" onClose={complaintModal.hide}>
            <FieldLabel>Category</FieldLabel>
            <FieldSelect value={complaintForm.category} onChange={e => setComplaintForm(f => ({ ...f, category: e.target.value }))}>
              {COMPLAINT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </FieldSelect>
            <FieldLabel>Describe the issue</FieldLabel>
            <FieldInput placeholder="e.g. Kitchen tap leaking continuously" value={complaintForm.desc} onChange={e => setComplaintForm(f => ({ ...f, desc: e.target.value }))} />
            <Btn block variant="resident" className="mt-5" onClick={submitComplaint}>Submit complaint</Btn>
          </Modal>
        )}
      </AnimatePresence>

      <Toast {...toast} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECURITY APP
// ═══════════════════════════════════════════════════════════════
function SecurityApp({ onExit }) {
  const [activeTab, setActiveTab] = useState('entry');
  const [pending, setPending] = useState([
    { id: 1, name: 'Rohan Mehta — guest', unit: 'A-108', time: '5:30 PM', meta: 'Expected via main gate' },
    { id: 2, name: 'Swiggy delivery',     unit: 'C-201', time: 'Now',     meta: 'Pre-approved by resident' },
  ]);
  const [history, setHistory] = useState([]);
  const [walkinOpen, setWalkinOpen] = useState(false);
  const [walkin, setWalkin] = useState({ name: '', unit: '', purpose: '' });
  const [delivery, setDelivery] = useState({ courier: '', unit: '', note: '' });
  const { toast, show: showToast } = useToast();

  const tabs = [
    { id: 'entry',    label: 'Visitor entry', Icon: Icons.Badge  },
    { id: 'delivery', label: 'Delivery',       Icon: Icons.Truck  },
    { id: 'history',  label: 'History',        Icon: Icons.Clock  },
    { id: 'profile',  label: 'Profile',        Icon: Icons.User   },
  ];

  const pushHistory = (entry) => setHistory(prev => [entry, ...prev]);

  const allowEntry = useCallback(async (visitor) => {
    await api.post('/visitors/allow', { id: visitor.id });
    setPending(prev => prev.filter(v => v.id !== visitor.id));
    pushHistory({ id: Date.now(), text: `${visitor.name} — entry allowed`, meta: `${visitor.unit} · ${nowTime()}`, status: 'allowed', confirmed: true });
    showToast('Entry logged');
  }, [showToast]);

  const submitWalkin = useCallback(async () => {
    if (!walkin.name || !walkin.unit) { showToast('Add a name and unit first'); return; }
    await api.post('/visitors/walkin', walkin);
    pushHistory({ id: Date.now(), text: `${walkin.name} — sent for approval`, meta: `${walkin.unit} · ${walkin.purpose || 'Not specified'} · ${nowTime()}`, status: 'pending' });
    setWalkin({ name: '', unit: '', purpose: '' });
    setWalkinOpen(false);
    showToast(`Sent to ${walkin.unit} for approval`);
  }, [walkin, showToast]);

  const submitDelivery = useCallback(async () => {
    if (!delivery.courier || !delivery.unit) { showToast('Add a courier and unit first'); return; }
    await api.post('/deliveries', delivery);
    pushHistory({ id: Date.now(), text: `${delivery.courier} — package for ${delivery.unit}`, meta: `${delivery.note || '—'} · ${nowTime()}`, status: 'allowed', kind: 'delivery' });
    setDelivery({ courier: '', unit: '', note: '' });
    showToast('Delivery logged');
  }, [delivery, showToast]);

  const deliveries = history.filter(h => h.kind === 'delivery');

  return (
    <div className="min-h-screen font-['Inter',sans-serif]" style={{ background: '#11141A', color: '#F4F5F7' }}>
      <div className="max-w-xl mx-auto px-5 pt-7 pb-16">

        {/* Topbar */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[24px] font-extrabold uppercase tracking-tight text-white font-['Archivo',sans-serif]" style={{ letterSpacing: '.01em' }}>Gate 1</p>
            <p className="text-[12.5px] text-[#8B93A6] mt-1">Suresh Pawar · On duty</p>
          </div>
          <button onClick={onExit} className="flex items-center gap-2 text-[#8B93A6] hover:text-white text-[12.5px] bg-[#1B1F29] px-3.5 py-2.5 rounded-full cursor-pointer transition-colors">
            <Icons.ArrowLeft size={15} /> Switch role
          </button>
        </header>

        {/* Nav pills */}
        <nav className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[12.5px] font-bold uppercase tracking-[.02em] cursor-pointer transition-all ${
                activeTab === id ? 'bg-[#FFC857] text-[#1B1305]' : 'bg-[#1B1F29] text-[#8B93A6] hover:text-white'
              }`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

            {/* ENTRY */}
            {activeTab === 'entry' && <>
              <p className="text-[11px] text-[#8B93A6] font-bold uppercase tracking-[.06em] mb-3">Pre‑approved, expected today</p>

              {/* Confirmed entries */}
              {history.filter(h => h.confirmed).map(h => (
                <div key={h.id} className="rounded-2xl p-6 text-center mb-3 border border-[#2C4A36]" style={{ background: 'linear-gradient(135deg,#16321F,#1B1F29)' }}>
                  <Icons.Check size={34} className="text-[#36D399] mx-auto" />
                  <h4 className="text-[#36D399] font-extrabold uppercase tracking-[.04em] mt-2.5 mb-1 font-['Archivo',sans-serif]">Entry allowed</h4>
                  <p className="text-[#8B93A6] text-[12.5px]">{h.text.replace(' — entry allowed', '')} · {h.meta.split(' · ')[1]}</p>
                </div>
              ))}

              {pending.map(v => (
                <div key={v.id} className="flex items-center justify-between bg-[#1B1F29] rounded-2xl px-4 py-4 mb-2.5 gap-3">
                  <div>
                    <div className="font-bold text-[14.5px] text-white">{v.name}</div>
                    <div className="text-[12px] text-[#8B93A6] mt-0.5">{v.unit} · Expected {v.time} · {v.meta}</div>
                  </div>
                  <Btn size="sm" variant="amber" onClick={() => allowEntry(v)}>Verify &amp; allow</Btn>
                </div>
              ))}

              {/* Walk-in */}
              <button onClick={() => setWalkinOpen(o => !o)} className="flex items-center gap-2 text-[#8B93A6] hover:text-white text-[13px] font-semibold py-3 cursor-pointer transition-colors">
                <Icons.Plus size={16} /> Log a walk‑in visitor
              </button>
              {walkinOpen && (
                <div className="bg-[#1B1F29] rounded-2xl p-4 mt-1">
                  {[
                    { label: 'Visitor name', key: 'name', placeholder: 'Full name' },
                    { label: 'Visiting unit', key: 'unit', placeholder: 'e.g. B‑108' },
                    { label: 'Purpose', key: 'purpose', placeholder: 'e.g. Courier, guest, cab' },
                  ].map(f => (
                    <div key={f.key}>
                      <FieldLabel>{f.label}</FieldLabel>
                      <input
                        className="w-full px-3 py-2.5 rounded-lg border border-[#2A3040] text-sm bg-[#11141A] text-white placeholder:text-[#5B6373] focus:outline-none focus:border-[#FFC857] transition-colors"
                        placeholder={f.placeholder}
                        value={walkin[f.key]}
                        onChange={e => setWalkin(w => ({ ...w, [f.key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <Btn block variant="amber" className="mt-4" onClick={submitWalkin}>Send for approval</Btn>
                </div>
              )}
            </>}

            {/* DELIVERY */}
            {activeTab === 'delivery' && <>
              <div className="bg-[#1B1F29] rounded-2xl p-4 mb-4">
                {[
                  { label: 'Courier / company', key: 'courier', placeholder: 'e.g. Amazon, Zomato, Bluedart' },
                  { label: 'Unit', key: 'unit', placeholder: 'e.g. C‑302' },
                  { label: 'Note', key: 'note', placeholder: 'Optional — package size, OTP, etc.' },
                ].map(f => (
                  <div key={f.key}>
                    <FieldLabel>{f.label}</FieldLabel>
                    <input
                      className="w-full px-3 py-2.5 rounded-lg border border-[#2A3040] text-sm bg-[#11141A] text-white placeholder:text-[#5B6373] focus:outline-none focus:border-[#FFC857] transition-colors"
                      placeholder={f.placeholder}
                      value={delivery[f.key]}
                      onChange={e => setDelivery(d => ({ ...d, [f.key]: e.target.value }))}
                    />
                  </div>
                ))}
                <Btn block variant="amber" className="mt-4" onClick={submitDelivery}>Log delivery</Btn>
              </div>
              <p className="text-[11px] text-[#8B93A6] font-bold uppercase tracking-[.06em] mb-3">Logged today</p>
              {deliveries.length === 0
                ? <p className="text-[#8B93A6] text-[13px]">No deliveries logged yet.</p>
                : deliveries.map(d => (
                  <div key={d.id} className="flex items-center justify-between py-3 border-b border-[#232833] text-[13px]">
                    <div>{d.text}<span className="block text-[#8B93A6] text-[11.5px] mt-0.5">{d.meta}</span></div>
                    <StatusBadge status={d.status} dark />
                  </div>
                ))
              }
            </>}

            {/* HISTORY */}
            {activeTab === 'history' && <>
              <p className="text-[11px] text-[#8B93A6] font-bold uppercase tracking-[.06em] mb-3">Today's log</p>
              {history.length === 0
                ? <p className="text-[#8B93A6] text-[13px]">No activity logged yet today.</p>
                : history.map(h => (
                  <div key={h.id} className="flex items-center justify-between py-3 border-b border-[#232833] text-[13px]">
                    <div className="text-white">{h.text}<span className="block text-[#8B93A6] text-[11.5px] mt-0.5">{h.meta}</span></div>
                    <StatusBadge status={h.status} dark />
                  </div>
                ))
              }
            </>}

            {/* PROFILE */}
            {activeTab === 'profile' && <>
              <div className="bg-[#1B1F29] rounded-2xl p-4 flex items-center gap-4 mb-4">
                <span className="w-12 h-12 rounded-full bg-[#FFC857] text-[#1B1305] flex items-center justify-center font-bold text-[14px] flex-shrink-0">SP</span>
                <div>
                  <p className="font-semibold text-[14.5px] text-white">Suresh Pawar</p>
                  <p className="text-[12px] text-[#8B93A6]">Gate 1 · Shift 8:00 AM – 8:00 PM</p>
                </div>
              </div>
              <button onClick={onExit} className="w-full flex items-center justify-between text-white text-[14.5px] font-medium py-3 cursor-pointer">
                Log out <Icons.Logout size={16} className="text-[#8B93A6]" />
              </button>
            </>}

          </motion.div>
        </AnimatePresence>
      </div>
      <Toast {...toast} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function MeridianGreensBMS() {
  const [screen, setScreen] = useState('lobby'); // 'lobby' | 'admin' | 'resident' | 'security'

  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  return (
    <AnimatePresence mode="wait">
      {screen === 'lobby' && (
        <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <LobbyScreen onEnter={setScreen} />
        </motion.div>
      )}
      {screen === 'admin' && (
        <motion.div key="admin" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <AdminApp onExit={() => setScreen('lobby')} />
        </motion.div>
      )}
      {screen === 'resident' && (
        <motion.div key="resident" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <ResidentApp onExit={() => setScreen('lobby')} />
        </motion.div>
      )}
      {screen === 'security' && (
        <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <SecurityApp onExit={() => setScreen('lobby')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
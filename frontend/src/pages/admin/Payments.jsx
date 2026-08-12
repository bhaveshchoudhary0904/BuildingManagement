import { useEffect, useState } from "react";
import {
  CreditCard,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  IndianRupee,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";

import paymentService from "../../services/paymentService";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const ACCENT = {
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
  purple: { glow: "rgba(167,139,250,.10)", stripe: "#A78BFA", text: "#A78BFA" },
};

const STATUS_COLOR = {
  pending: "orange",
  paid:    "green",
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

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

function StatusBadge({ status, T }) {
  const color = STATUS_COLOR[(status || "").toLowerCase()] || "blue";
  const a = ACCENT[color] || ACCENT.blue;
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
      color: a.text, background: a.glow,
      fontFamily: "'IBM Plex Mono', monospace",
      letterSpacing: ".03em", textTransform: "uppercase",
    }}>
      {status || "Pending"}
    </span>
  );
}

function PaymentRow({ payment, T, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const period = payment.month && payment.year
    ? `${payment.month} ${payment.year}`
    : "—";

  const date = payment.paymentDate || payment.createdAt;
  const dateStr = date
    ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.9fr 1fr 32px",
        alignItems: "center",
        gap: 12,
        padding: "14px 18px",
        borderRadius: 10,
        background: hovered ? (T.isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.025)") : "transparent",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: `opacity .35s ease ${delay}ms, transform .35s ease ${delay}ms, background .15s`,
      }}
    >
      <span style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, fontFamily: "'IBM Plex Mono', monospace" }}>
        {formatCurrency(payment.amount)}
      </span>
      <span style={{ fontSize: 12.5, color: T.inkSoft }}>{payment.residentName || "—"}</span>
      <span style={{ fontSize: 12.5, color: T.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>{payment.flatNumber || "—"}</span>
      <span style={{ fontSize: 12.5, color: T.inkSoft }}>{period}</span>
      <StatusBadge status={payment.status} T={T} />
      <span style={{ fontSize: 12, color: T.inkMuted }}>{dateStr}</span>
      <ChevronRight size={16} color={T.inkMuted} />
    </div>
  );
}

function FullSpinner({ T }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px" }}>
      <svg width="28" height="28" viewBox="0 0 24 24" style={{ animation: "mgSpin .8s linear infinite" }}>
        <circle cx="12" cy="12" r="10" stroke={T.accent} strokeWidth="2.5" opacity="0.25" fill="none" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
      <p style={{ color: T.inkSoft, fontSize: 13, marginTop: 12 }}>Loading payments…</p>
    </div>
  );
}

const Payments = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [headerVisible, setHeaderVisible] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [billForm, setBillForm] = useState({ resident_id: "", amount: "", month: "", year: new Date().getFullYear() });
  const [residents, setResidents] = useState([]);
  const [loadingResidents, setLoadingResidents] = useState(false);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPayments();
      setPayments(response.data.data || []);
    } catch (err) {
      console.error("Payments Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadResidents = async () => {
    try {
      setLoadingResidents(true);
      const response = await api.get("/api/residents");
      setResidents(response.data.data || []);
    } catch (err) {
      console.error("Residents Error:", err);
    } finally {
      setLoadingResidents(false);
    }
  };

  useEffect(() => { loadPayments(); }, []);
  useEffect(() => { loadResidents(); }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setHeaderVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleRefresh = () => {
    setRefreshSpin(true);
    loadPayments().then(() => setTimeout(() => setRefreshSpin(false), 600));
  };

  const createBill = async () => {
    if (!billForm.resident_id || !billForm.amount || !billForm.month || !billForm.year) {
      alert("Please fill all fields");
      return;
    }
    try {
      const response = await api.post("/api/payments/bill/create-for-resident", {
        resident_id: parseInt(billForm.resident_id),
        amount: parseFloat(billForm.amount),
        month: billForm.month,
        year: parseInt(billForm.year),
      });
      
      if (response.data.success) {
        alert("Maintenance bill created successfully!");
        setBillModalOpen(false);
        setBillForm({ resident_id: "", amount: "", month: "", year: new Date().getFullYear() });
        await loadPayments();
      } else {
        alert(response.data.message || "Failed to create bill");
      }
    } catch (error) {
      console.error("Create Bill Error:", error);
      alert(error.response?.data?.message || "Failed to create bill");
    }
  };

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (p.residentName || "").toLowerCase().includes(q) ||
      (p.flatNumber || "").toLowerCase().includes(q) ||
      (p.transactionId || "").toLowerCase().includes(q) ||
      (p.paymentMethod || "").toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" ||
      (p.status || "").toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const total = payments.length;
  const pending = payments.filter((p) => (p.status || "").toLowerCase() === "pending").length;
  const paid = payments.filter((p) => (p.status || "").toLowerCase() === "paid").length;
  const totalRevenue = payments
    .filter((p) => (p.status || "").toLowerCase() === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        .mg-search-input::placeholder { color: ${T.searchPlaceholder}; }
        .mg-search-input:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accentBg} !important; }
        .mg-filter-btn:hover { border-color: ${T.isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.18)"} !important; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: T.isDark
          ? `radial-gradient(circle at 20% 10%, rgba(110,131,242,.09), transparent 42%),
             radial-gradient(circle at 80% 85%, rgba(217,113,74,.07), transparent 42%), ${T.bg}`
          : T.bg,
        padding: "36px 38px 64px",
        fontFamily: "'Inter', sans-serif",
        color: T.ink,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: 28, flexWrap: "wrap", gap: 16,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity .4s ease, transform .4s ease",
        }}>
          <div>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
              letterSpacing: ".08em", textTransform: "uppercase",
              color: T.inkMuted, margin: "0 0 8px",
            }}>
              {user?.building?.building_name || "NestOS"} · Admin Console
            </p>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700,
              color: T.ink, margin: 0,
            }}>
              Payments
            </h1>
            <p style={{ color: T.inkSoft, margin: "6px 0 0", fontSize: 14 }}>
              Track and manage maintenance payment transactions
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setBillModalOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: T.accent,
                color: T.navActiveText,
                border: "none",
                padding: "11px 16px", borderRadius: 8,
                fontSize: 13, fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: "pointer",
              }}
            >
              <Plus size={15} />
              Create Bill
            </button>
            <button
              onClick={handleRefresh}
              className="mg-filter-btn"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: T.surface, color: T.ink,
                border: `1px solid ${T.border}`,
                padding: "11px 16px", borderRadius: 8,
                fontSize: 13, fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: "pointer",
              }}
            >
              <RefreshCw size={15} style={{ animation: refreshSpin ? "mgSpin .7s linear infinite" : "none" }} />
              Refresh
            </button>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          gap: 16, marginBottom: 26,
        }}>
          <StatCard title="Total Records" value={total} subtitle="All payment entries" icon={CreditCard} color="blue" delay={0} T={T} />
          <StatCard title="Collected" value={formatCurrency(totalRevenue)} subtitle="Paid transactions" icon={IndianRupee} color="green" delay={70} T={T} />
          <StatCard title="Pending" value={pending} subtitle="Awaiting payment" icon={Clock} color="orange" delay={140} T={T} />
          <StatCard title="Paid" value={paid} subtitle="Successfully received" icon={CheckCircle2} color="purple" delay={210} T={T} />
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
            <Search size={15} style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: T.inkMuted, pointerEvents: "none",
            }} />
            <input
              type="text"
              placeholder="Search by resident, flat, or transaction…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mg-search-input"
              style={{
                width: "100%", padding: "10px 14px 10px 36px",
                borderRadius: 9, border: `1px solid ${T.border}`,
                background: T.surface, color: T.ink, fontSize: 13,
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {["all", "pending", "paid"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="mg-filter-btn"
                style={{
                  padding: "9px 14px", borderRadius: 8,
                  border: `1px solid ${statusFilter === s ? "transparent" : T.border}`,
                  background: statusFilter === s ? T.accent : T.surface,
                  color: statusFilter === s ? T.navActiveText : T.inkSoft,
                  fontSize: 12.5, fontWeight: 600, textTransform: "capitalize",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
          border: `1px solid ${T.border}`,
          borderRadius: 16, overflow: "hidden",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.9fr 1fr 32px",
            gap: 12, padding: "12px 18px",
            borderBottom: `1px solid ${T.border}`,
          }}>
            {["Amount", "Resident", "Flat", "Period", "Status", "Date", ""].map((h, i) => (
              <span key={i} style={{
                fontSize: 10.5, fontWeight: 700, color: T.inkMuted,
                textTransform: "uppercase", letterSpacing: ".05em",
                fontFamily: "'IBM Plex Mono', monospace",
              }}>{h}</span>
            ))}
          </div>

          <div style={{ padding: "6px 8px" }}>
            {loading ? (
              <FullSpinner T={T} />
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <CreditCard size={32} color={T.inkMuted} style={{ marginBottom: 10 }} />
                <p style={{ color: T.inkSoft, fontSize: 13.5, margin: 0 }}>No payments found.</p>
              </div>
            ) : (
              filtered.map((p, i) => (
                <PaymentRow key={p.paymentId || i} payment={p} T={T} delay={i * 40} />
              ))
            )}
          </div>
        </div>

        {/* Create Bill Modal */}
        {billModalOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}>
            <div style={{
              background: T.surface,
              borderRadius: 16,
              padding: 32,
              maxWidth: 450,
              width: "90%",
              position: "relative",
            }}>
              <button
                onClick={() => setBillModalOpen(false)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.ink,
                }}
              >
                <X size={24} />
              </button>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: T.ink,
                marginBottom: 24,
              }}>
                Create Maintenance Bill
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.inkMuted, marginBottom: 6 }}>
                    Resident
                  </label>
                  <select
                    value={billForm.resident_id}
                    onChange={(e) => setBillForm({ ...billForm, resident_id: e.target.value })}
                    disabled={loadingResidents}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                      background: T.bg,
                      color: T.ink,
                      fontSize: 14,
                      outline: "none",
                    }}
                  >
                    <option value="">Select resident</option>
                    {residents.map((r) => (
                      <option key={r.resident_id} value={r.resident_id}>
                        Resident ID: {r.resident_id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.inkMuted, marginBottom: 6 }}>
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={billForm.amount}
                    onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                    placeholder="Enter amount"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                      background: T.bg,
                      color: T.ink,
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.inkMuted, marginBottom: 6 }}>
                    Month
                  </label>
                  <select
                    value={billForm.month}
                    onChange={(e) => setBillForm({ ...billForm, month: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                      background: T.bg,
                      color: T.ink,
                      fontSize: 14,
                      outline: "none",
                    }}
                  >
                    <option value="">Select month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.inkMuted, marginBottom: 6 }}>
                    Year
                  </label>
                  <input
                    type="number"
                    value={billForm.year}
                    onChange={(e) => setBillForm({ ...billForm, year: e.target.value })}
                    placeholder="Enter year"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                      background: T.bg,
                      color: T.ink,
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
                <button
                  onClick={createBill}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: T.accent,
                    color: T.navActiveText,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.opacity = 0.9; }}
                  onMouseLeave={(e) => { e.target.style.opacity = 1; }}
                >
                  Create Bill
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Payments;

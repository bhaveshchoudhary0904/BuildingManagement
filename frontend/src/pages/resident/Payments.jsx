import { useState, useEffect } from "react";
import { IndianRupee, Search, RefreshCw, CheckCircle2, Clock, QrCode, Plus, X, CreditCard, Building2, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

const ACCENT = {
  blue:   { glow: "rgba(110,131,242,.12)", stripe: "#6E83F2", text: "#818CF8" },
  green:  { glow: "rgba(54,211,153,.10)",  stripe: "#36D399", text: "#34D399" },
  orange: { glow: "rgba(251,146,60,.10)",  stripe: "#FB923C", text: "#FB923C" },
  red:    { glow: "rgba(248,113,113,.10)",  stripe: "#F87171", text: "#F87171" },
};

const STATUS_COLOR = {
  pending: "orange",
  paid:    "green",
  failed:  "red",
};

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(amount) {
  if (!amount) return "₹0";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
}

function Badge({ label, map, T }) {
  const color = map[(label || "").toLowerCase()] || "blue";
  const a = ACCENT[color] || ACCENT.blue;

  return (
    <span style={{
      fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
      color: a.text, background: a.glow,
      fontFamily: "'IBM Plex Mono', monospace",
      letterSpacing: ".03em", textTransform: "uppercase",
    }}>
      {label || "Pending"}
    </span>
  );
}

function PaymentRow({ payment, T, delay = 0, onShowQR, onPay, onRazorpayPay, onShowBreakdown, expandedPaymentId }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const isAdminBill = payment.billSource === "admin";
  const isExpanded = expandedPaymentId === payment.payment_id;

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 140px",
          gap: "16px",
          alignItems: "center",
          padding: "14px 16px",
          background: hovered ? T.surface2 : T.surface,
          border: `1px solid ${hovered ? T.borderHover : isAdminBill ? ACCENT.blue.stripe : T.border}`,
          borderRadius: 10,
          cursor: "pointer",
          transform: visible ? "translateX(0)" : "translateX(-12px)",
          opacity: visible ? 1 : 0,
          transition: "all .25s ease",
          position: "relative",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {isAdminBill && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: ACCENT.blue.stripe,
              borderRadius: "10px 10px 0 0",
            }}
          />
        )}
        
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>
            {payment.month || "—"} {payment.year}
          </span>
          {isAdminBill && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 6px",
                borderRadius: 4,
                background: `${ACCENT.blue.glow}`,
                border: `1px solid ${ACCENT.blue.stripe}`,
              }}
            >
              <Building2 size={10} color={ACCENT.blue.text} />
              <span style={{ fontSize: 9, fontWeight: 600, color: ACCENT.blue.text, fontFamily: "'IBM Plex Mono', monospace" }}>
                ADMIN
              </span>
            </div>
          )}
        </div>

        <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>
          {formatCurrency(payment.amount)}
        </span>

        <Badge label={payment.payment_status} map={STATUS_COLOR} T={T} />

        <span style={{ fontSize: 12, color: T.inkSoft }}>
          {payment.payment_method || "—"}
        </span>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {payment.payment_status === "Pending" && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onShowQR(payment); }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${T.border}`,
                  background: T.surface,
                  color: T.ink,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.target.style.background = T.surface2; }}
                onMouseLeave={(e) => { e.target.style.background = T.surface; }}
              >
                <QrCode size={14} />
                QR
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onRazorpayPay(payment); }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "none",
                  background: "linear-gradient(135deg, #3654E0 0%, #6E83F2 100%)",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.target.style.opacity = 0.9; }}
                onMouseLeave={(e) => { e.target.style.opacity = 1; }}
              >
                <CreditCard size={14} />
                Pay Now
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onPay(payment); }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${T.border}`,
                  background: T.surface,
                  color: T.ink,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.target.style.background = T.surface2; }}
                onMouseLeave={(e) => { e.target.style.background = T.surface; }}
              >
                Manual
              </button>
            </>
          )}
          {payment.payment_status === "Failed" && (
            <button
              onClick={(e) => { e.stopPropagation(); onRazorpayPay(payment); }}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "none",
                background: ACCENT.red.stripe,
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                transition: "all .2s",
              }}
              onMouseEnter={(e) => { e.target.style.opacity = 0.9; }}
              onMouseLeave={(e) => { e.target.style.opacity = 1; }}
            >
              <RefreshCw size={14} />
              Retry
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onShowBreakdown(payment.payment_id); }}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: `1px solid ${T.border}`,
              background: T.surface,
              color: T.ink,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "all .2s",
            }}
            onMouseEnter={(e) => { e.target.style.background = T.surface2; }}
            onMouseLeave={(e) => { e.target.style.background = T.surface; }}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Details
          </button>
          <span style={{ fontSize: 12, color: T.inkSoft }}>
            {formatDate(payment.payment_date)}
          </span>
        </div>
      </div>
      
      {/* Charge Breakdown Expansion */}
      {isExpanded && (
        <div style={{
          marginTop: 12,
          padding: 16,
          background: T.surface2,
          borderRadius: 8,
          border: `1px solid ${T.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <FileText size={16} color={ACCENT.blue.text} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
              Charge Breakdown (MCS Compliant)
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: T.inkSoft }}>Service Charges</span>
              <span style={{ color: T.ink, fontWeight: 500 }}>₹{payment.service_charge || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: T.inkSoft }}>Property Tax</span>
              <span style={{ color: T.ink, fontWeight: 500 }}>₹{payment.property_tax || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: T.inkSoft }}>Water Charges</span>
              <span style={{ color: T.ink, fontWeight: 500 }}>₹{payment.water_charge || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: T.inkSoft }}>Lift Maintenance</span>
              <span style={{ color: T.ink, fontWeight: 500 }}>₹{payment.lift_maintenance || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: T.inkSoft }}>Parking Charges</span>
              <span style={{ color: T.ink, fontWeight: 500 }}>₹{payment.parking_charge || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: T.inkSoft }}>Sinking Fund (0.25%)</span>
              <span style={{ color: T.ink, fontWeight: 500 }}>₹{payment.sinking_fund || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: T.inkSoft }}>Repair & Maintenance Fund (0.75%)</span>
              <span style={{ color: T.ink, fontWeight: 500 }}>₹{payment.repair_fund || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: T.inkSoft }}>Major Repair Fund</span>
              <span style={{ color: T.ink, fontWeight: 500 }}>₹{payment.major_repair_fund || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: T.inkSoft }}>Education & Training Fund</span>
              <span style={{ color: T.ink, fontWeight: 500 }}>₹{payment.education_fund || 0}</span>
            </div>
            {payment.non_occupancy_charge > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: ACCENT.orange.text }}>Non-Occupancy Charges (10%)</span>
                <span style={{ color: ACCENT.orange.text, fontWeight: 500 }}>₹{payment.non_occupancy_charge}</span>
              </div>
            )}
            {payment.interest_on_dues > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: ACCENT.red.text }}>Late Payment Interest</span>
                <span style={{ color: ACCENT.red.text, fontWeight: 500 }}>₹{payment.interest_on_dues}</span>
              </div>
            )}
            <div style={{ 
              marginTop: 8, 
              paddingTop: 8, 
              borderTop: `1px solid ${T.border}`,
              display: "flex", 
              justifyContent: "space-between", 
              fontSize: 13, 
              fontWeight: 600 
            }}>
              <span style={{ color: T.ink }}>Total</span>
              <span style={{ color: ACCENT.blue.text }}>₹{formatCurrency(payment.amount)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const Payments = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [isResident, setIsResident] = useState(false);
  const [manualPaymentModalOpen, setManualPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [manualPaymentForm, setManualPaymentForm] = useState({
    payment_method: 'UPI',
    upi_id: '',
    transaction_id: '',
    notes: ''
  });
  const [createBillModalOpen, setCreateBillModalOpen] = useState(false);
  const [billForm, setBillForm] = useState({
    amount: '',
    month: '',
    year: new Date().getFullYear()
  });
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [razorpaySuccess, setRazorpaySuccess] = useState(false);
  const [razorpayError, setRazorpayError] = useState(null);
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);

  // Add spinning animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const toggleChargeBreakdown = (paymentId) => {
    if (expandedPaymentId === paymentId) {
      setExpandedPaymentId(null);
    } else {
      setExpandedPaymentId(paymentId);
    }
  };

  const loadPayments = async () => {
    try {
      setLoading(true);
      // Get resident info first
      const residentResponse = await api.get(`/residents/user/${user.user_id}`);
      const resident = residentResponse.data.data;
      
      if (resident) {
        setIsResident(true);
        const response = await api.get(`/payments/resident/${resident.resident_id}`);
        setPayments(response.data.data || []);
      } else {
        console.log("No resident record found for user");
        setIsResident(false);
        setPayments([]);
      }
    } catch (err) {
      console.error("Payments Error:", err);
      if (err.response?.status === 404) {
        console.log("User is not registered as a resident");
        setIsResident(false);
      }
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [user]);

  const showQRCode = async (payment) => {
    try {
      const response = await api.get(`/payments/${payment.payment_id}/qr`);
      setQrData(response.data.data);
      setQrModalOpen(true);
    } catch (error) {
      console.error("QR Generation Error:", error);
      alert("Failed to generate QR code");
    }
  };

  const confirmPayment = async (payment) => {
    if (!confirm(`Confirm payment of ${formatCurrency(payment.amount)}?`)) {
      return;
    }
    try {
      await api.post(`/payments/${payment.payment_id}/confirm`, {
        payment_method: "QR Code",
      });
      alert("Payment confirmed successfully!");
      await loadPayments();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to confirm payment");
    }
  };

  const openManualPaymentModal = (payment) => {
    setSelectedPayment(payment);
    setManualPaymentForm({
      payment_method: 'UPI',
      upi_id: '',
      transaction_id: '',
      notes: ''
    });
    setManualPaymentModalOpen(true);
  };

  const submitManualPayment = async () => {
    if (!manualPaymentForm.upi_id && manualPaymentForm.payment_method === 'UPI') {
      alert('UPI ID is required for UPI payments');
      return;
    }
    if (!manualPaymentForm.transaction_id) {
      alert('Transaction ID is required');
      return;
    }

    try {
      await api.post(`/payments/${selectedPayment.payment_id}/confirm`, {
        payment_method: manualPaymentForm.payment_method,
        transaction_id: manualPaymentForm.transaction_id,
        upi_id: manualPaymentForm.upi_id,
        notes: manualPaymentForm.notes,
      });
      alert("Payment submitted successfully!");
      setManualPaymentModalOpen(false);
      await loadPayments();
    } catch (error) {
      console.error("Manual Payment Error:", error);
      alert("Failed to submit payment");
    }
  };

  const handleRazorpayPayment = async (payment) => {
    try {
      setRazorpayLoading(true);
      setRazorpayError(null);
      setRazorpaySuccess(false);

      // Get resident info
      const residentResponse = await api.get(`/residents/user/${user.user_id}`);
      const resident = residentResponse.data.data;

      if (!resident) {
        throw new Error("Resident information not found");
      }

      // Create Razorpay order
      const orderResponse = await api.post('/payments/create-order', {
        resident_id: resident.resident_id,
        building_id: resident.building_id,
        amount: payment.amount,
        month: payment.month,
        year: payment.year,
      });

      const { orderId, keyId, amount } = orderResponse.data.data;

      // Load Razorpay checkout script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const options = {
          key: keyId,
          amount: amount * 100, // Razorpay expects amount in paise
          currency: 'INR',
          name: 'Building Management System',
          description: `Payment for ${payment.month} ${payment.year}`,
          order_id: orderId,
          handler: async function (response) {
            try {
              // Verify payment on backend
              await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              
              setRazorpaySuccess(true);
              await loadPayments();
              
              setTimeout(() => {
                setRazorpaySuccess(false);
              }, 3000);
            } catch (error) {
              console.error("Payment verification failed:", error);
              setRazorpayError("Payment verification failed. Please try again.");
              await loadPayments();
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone_number,
          },
          theme: {
            color: '#3654E0',
          },
          modal: {
            ondismiss: function() {
              setRazorpayLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        setRazorpayError("Failed to load payment gateway. Please try again.");
        setRazorpayLoading(false);
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Razorpay payment error:", error);
      setRazorpayError(error.message || "Payment initiation failed. Please try again.");
      setRazorpayLoading(false);
    }
  };

  const createBill = async () => {
    if (!billForm.amount || !billForm.month || !billForm.year) {
      alert("Please fill all fields");
      return;
    }
    try {
      const response = await api.post("/payments/bill/create", {
        amount: parseFloat(billForm.amount),
        month: billForm.month,
        year: parseInt(billForm.year),
      });
      
      if (response.data.success) {
        alert("Maintenance bill created successfully!");
        setCreateBillModalOpen(false);
        setBillForm({ amount: "", month: "", year: new Date().getFullYear() });
        await loadPayments();
      } else {
        alert(response.data.message || "Failed to create bill");
      }
    } catch (error) {
      console.error("Create Bill Error:", error);
      alert(error.response?.data?.message || "Failed to create bill");
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.month?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.year?.toString().includes(searchQuery)
  );

  const stats = {
    total: payments.length,
    paid: payments.filter(p => p.payment_status === "Paid").length,
    pending: payments.filter(p => p.payment_status === "Pending").length,
    totalAmount: payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
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
          Payments
        </h1>
        <p style={{ fontSize: 14, color: T.inkSoft, marginTop: 8 }}>
          View your payment history and dues
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 32 }}>
        <StatCard title="Total Payments" value={stats.total} subtitle="All records" icon={IndianRupee} color="blue" delay={0} T={T} />
        <StatCard title="Paid" value={stats.paid} subtitle="Completed" icon={CheckCircle2} color="green" delay={100} T={T} />
        <StatCard title="Pending" value={stats.pending} subtitle="Awaiting" icon={Clock} color="orange" delay={200} T={T} />
        <StatCard title="Total Amount" value={formatCurrency(stats.totalAmount)} subtitle="Sum of all" icon={IndianRupee} color="blue" delay={300} T={T} />
      </div>

      {!isResident && !loading && (
        <div style={{
          background: `${ACCENT.orange.glow}`,
          border: `1px solid ${ACCENT.orange.stripe}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        }}>
          <p style={{ margin: 0, fontSize: 13, color: ACCENT.orange.text }}>
            <strong>Note:</strong> Your account is not linked to a resident record. Only residents can view and pay maintenance bills. Please contact the administrator to set up your resident profile.
          </p>
        </div>
      )}

      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
        padding: 20, marginBottom: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} color={T.inkMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search payments..."
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
          <div style={{ display: "flex", gap: 8 }}>
            {isResident && (
              <button
                onClick={() => setCreateBillModalOpen(true)}
                style={{
                  padding: "10px 16px", borderRadius: 8, border: "none",
                  background: "linear-gradient(135deg, #3654E0, #6E83F2)",
                  color: "white", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.target.style.opacity = 0.9; }}
                onMouseLeave={(e) => { e.target.style.opacity = 1; }}
              >
                <Plus size={14} />
                Create Bill
              </button>
            )}
            <button
              onClick={loadPayments}
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
          </div>
        </div>

        {/* Razorpay Status Messages */}
        {razorpayLoading && (
          <div style={{
            padding: "12px 16px",
            margin: "0 16px 16px",
            borderRadius: 8,
            background: `${ACCENT.blue.glow}`,
            border: `1px solid ${ACCENT.blue.stripe}`,
            color: ACCENT.blue.text,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <RefreshCw size={16} style={{ animation: "spin 1s linear infinite", "@keyframes spin": "{ from { transform: rotate(0deg); } to { transform: rotate(360deg); } }" }} />
            <span>Processing payment...</span>
          </div>
        )}

        {razorpaySuccess && (
          <div style={{
            padding: "12px 16px",
            margin: "0 16px 16px",
            borderRadius: 8,
            background: `${ACCENT.green.glow}`,
            border: `1px solid ${ACCENT.green.stripe}`,
            color: ACCENT.green.text,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <CheckCircle2 size={16} />
            <span>Payment successful!</span>
          </div>
        )}

        {razorpayError && (
          <div style={{
            padding: "12px 16px",
            margin: "0 16px 16px",
            borderRadius: 8,
            background: `${ACCENT.red.glow}`,
            border: `1px solid ${ACCENT.red.stripe}`,
            color: ACCENT.red.text,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <X size={16} />
            <span>{razorpayError}</span>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginBottom: 16, padding: "0 16px" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1 }}>Period</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1 }}>Amount</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1 }}>Status</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", flex: 1 }}>Method</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em", textTransform: "uppercase", width: 120, textAlign: "right" }}>Date</span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: T.inkSoft }}>
            Loading payments...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: T.inkSoft }}>
            {searchQuery ? "No payments found matching your search" : "No payment records yet"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredPayments.map((payment, index) => (
              <PaymentRow 
                key={payment.payment_id || index} 
                payment={payment} 
                T={T} 
                delay={index * 50}
                onShowQR={showQRCode}
                onPay={openManualPaymentModal}
                onRazorpayPay={handleRazorpayPayment}
                onShowBreakdown={toggleChargeBreakdown}
                expandedPaymentId={expandedPaymentId}
              />
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && qrData && (
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
            maxWidth: 400,
            width: "90%",
            position: "relative",
          }}>
            <button
              onClick={() => setQrModalOpen(false)}
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
              marginBottom: 8,
            }}>
              Scan to Pay
            </h2>
            <p style={{ fontSize: 14, color: T.inkSoft, marginBottom: 24 }}>
              {qrData.payment.month} {qrData.payment.year} - {formatCurrency(qrData.payment.amount)}
            </p>
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 24,
            }}>
              <img 
                src={qrData.qrCode} 
                alt="Payment QR Code" 
                style={{ maxWidth: "100%", borderRadius: 8 }}
              />
            </div>
            <div style={{
              background: T.surface2,
              padding: 12,
              borderRadius: 8,
              fontSize: 12,
              color: T.inkSoft,
            }}>
              <p style={{ margin: 0 }}>
                <strong>Resident:</strong> {qrData.payment.residentName}<br />
                <strong>Flat:</strong> {qrData.payment.flatNumber}<br />
                <strong>Status:</strong> {qrData.payment.status}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manual Payment Modal */}
      {manualPaymentModalOpen && selectedPayment && (
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
              onClick={() => setManualPaymentModalOpen(false)}
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
              marginBottom: 8,
            }}>
              Manual Payment
            </h2>
            <p style={{ fontSize: 14, color: T.inkSoft, marginBottom: 24 }}>
              {selectedPayment.month} {selectedPayment.year} - {formatCurrency(selectedPayment.amount)}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.inkMuted,
                  marginBottom: 6,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  Payment Method
                </label>
                <select
                  value={manualPaymentForm.payment_method}
                  onChange={(e) => setManualPaymentForm({ ...manualPaymentForm, payment_method: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.bg,
                    color: T.ink,
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              {manualPaymentForm.payment_method === 'UPI' && (
                <div>
                  <label style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.inkMuted,
                    marginBottom: 6,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}>
                    UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={manualPaymentForm.upi_id}
                    onChange={(e) => setManualPaymentForm({ ...manualPaymentForm, upi_id: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                      background: T.bg,
                      color: T.ink,
                      fontSize: 13,
                      outline: "none",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.inkMuted,
                  marginBottom: 6,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  Transaction ID *
                </label>
                <input
                  type="text"
                  placeholder="Enter transaction ID"
                  value={manualPaymentForm.transaction_id}
                  onChange={(e) => setManualPaymentForm({ ...manualPaymentForm, transaction_id: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.bg,
                    color: T.ink,
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.inkMuted,
                  marginBottom: 6,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  Notes (Optional)
                </label>
                <textarea
                  placeholder="Add any additional notes..."
                  value={manualPaymentForm.notes}
                  onChange={(e) => setManualPaymentForm({ ...manualPaymentForm, notes: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.bg,
                    color: T.ink,
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{
                display: "flex",
                gap: 12,
                marginTop: 8,
              }}>
                <button
                  onClick={() => setManualPaymentModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.surface,
                    color: T.ink,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.background = T.surface2; }}
                  onMouseLeave={(e) => { e.target.style.background = T.surface; }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitManualPayment}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: ACCENT.green.stripe,
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.opacity = 0.9; }}
                  onMouseLeave={(e) => { e.target.style.opacity = 1; }}
                >
                  Submit Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Bill Modal */}
      {createBillModalOpen && (
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
              onClick={() => setCreateBillModalOpen(false)}
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
              marginBottom: 8,
            }}>
              Create Maintenance Bill
            </h2>
            <p style={{ fontSize: 14, color: T.inkSoft, marginBottom: 24 }}>
              Generate a new maintenance bill for yourself
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.inkMuted,
                  marginBottom: 6,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={billForm.amount}
                  onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.bg,
                    color: T.ink,
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.inkMuted,
                  marginBottom: 6,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
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
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
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
                <label style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.inkMuted,
                  marginBottom: 6,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  Year
                </label>
                <input
                  type="number"
                  placeholder="Enter year"
                  value={billForm.year}
                  onChange={(e) => setBillForm({ ...billForm, year: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.bg,
                    color: T.ink,
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <div style={{
                display: "flex",
                gap: 12,
                marginTop: 8,
              }}>
                <button
                  onClick={() => setCreateBillModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.surface,
                    color: T.ink,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.background = T.surface2; }}
                  onMouseLeave={(e) => { e.target.style.background = T.surface; }}
                >
                  Cancel
                </button>
                <button
                  onClick={createBill}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg, #3654E0, #6E83F2)",
                    color: "white",
                    fontSize: 13,
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
        </div>
      )}
    </div>
    </>
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

export default Payments;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, X, User, Mail, Lock, Phone, Home, UserCheck, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

/* ─── Design tokens matching meridian-greens-bms-demo.html ───────────────── */
const S = {
  page: {
    minHeight: "100vh",
    background: `
      radial-gradient(circle at 20% 15%, rgba(110,131,242,.10), transparent 45%),
      radial-gradient(circle at 85% 80%, rgba(217,113,74,.08), transparent 45%),
      #0E1014
    `,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    fontFamily: "'Inter', sans-serif",
    WebkitFontSmoothing: "antialiased",
  },
  inner: {
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: "#7C84A0",
    margin: "0 0 14px",
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "clamp(24px, 4vw, 32px)",
    fontWeight: 600,
    color: "#F4F5F8",
    margin: "0 0 8px",
    letterSpacing: "-0.01em",
    textAlign: "center",
  },
  sub: {
    color: "#9098B0",
    fontSize: 14,
    margin: "0 0 32px",
    textAlign: "center",
    lineHeight: 1.5,
  },
  card: {
    width: "100%",
    background: "linear-gradient(165deg, #1B1F29, #13161D)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 18,
    padding: "32px 28px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(0,0,0,.45)",
  },
  cardStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: "linear-gradient(90deg, #3654E0, #6E83F2)",
    borderRadius: "18px 18px 0 0",
  },
  fieldLabel: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#7C84A0",
    marginBottom: 7,
    marginTop: 20,
    textTransform: "uppercase",
    letterSpacing: ".04em",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  fieldInputWrap: {
    position: "relative",
  },
  fieldInput: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.09)",
    background: "#11141A",
    color: "#F4F5F8",
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .18s",
  },
  fieldInputFocus: {
    borderColor: "#6E83F2",
    boxShadow: "0 0 0 3px rgba(110,131,242,.15)",
  },
  eyeBtn: {
    position: "absolute",
    right: 13,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#6A7290",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    lineHeight: 1,
  },
  rowMiddle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#9098B0",
    fontSize: 13,
    cursor: "pointer",
    userSelect: "none",
  },
  checkBox: {
    width: 15,
    height: 15,
    accentColor: "#6E83F2",
    cursor: "pointer",
  },
  forgotBtn: {
    background: "none",
    border: "none",
    color: "#6E83F2",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    padding: 0,
  },
  submitBtn: {
    marginTop: 24,
    width: "100%",
    padding: "13px 0",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #3654E0 0%, #6E83F2 100%)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: ".02em",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(54,84,224,.35)",
    transition: "transform .15s, box-shadow .15s, opacity .15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
    transform: "none",
  },
  errorBox: {
    marginTop: 16,
    background: "rgba(224,82,77,.12)",
    border: "1px solid rgba(224,82,77,.28)",
    borderRadius: 8,
    padding: "11px 14px",
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    color: "#FF7775",
    fontSize: 13,
    lineHeight: 1.5,
  },
  successBox: {
    marginTop: 16,
    background: "rgba(54,211,153,.12)",
    border: "1px solid rgba(54,211,153,.28)",
    borderRadius: 8,
    padding: "11px 14px",
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    color: "#34D399",
    fontSize: 13,
    lineHeight: 1.5,
  },
  foot: {
    marginTop: 26,
    color: "#5C6480",
    fontSize: 11,
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: ".04em",
    textAlign: "center",
  },
  createAccBtn: {
    marginTop: 16,
    width: "100%",
    padding: "12px 0",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.09)",
    background: "transparent",
    color: "#9098B0",
    fontSize: 13.5,
    fontWeight: 600,
    fontFamily: "'Space Grotesk', sans-serif",
    cursor: "pointer",
    transition: "border-color .15s, color .15s, background .15s",
  },
};

/* ─── Spinner ────────────────────────────────────────────────────────────── */
function Spinner({ color = "#fff" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "mgSpin 0.75s linear infinite", flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" stroke={`${color}40`} strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Role pill selector ─────────────────────────────────────────────────── */
function RolePicker({ role, setRole }) {
  const options = [
    { key: "RESIDENT", label: "Resident", icon: UserCheck },
    { key: "SECURITY", label: "Security", icon: ShieldCheck },
  ];

  return (
    <div style={{
      display: "flex", gap: 8, marginTop: 8,
    }}>
      {options.map(({ key, label, icon: Icon }) => {
        const active = role === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setRole(key)}
            style={{
              flex: 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "11px 0",
              borderRadius: 8,
              border: `1px solid ${active ? "transparent" : "rgba(255,255,255,.09)"}`,
              background: active
                ? "linear-gradient(135deg, #3654E0, #6E83F2)"
                : "#11141A",
              color: active ? "#fff" : "#9098B0",
              fontSize: 13, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: "pointer",
              transition: "background .18s, border-color .18s, color .18s",
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Create Account Modal ───────────────────────────────────────────────── */
function CreateAccountModal({ onClose }) {
  const [visible, setVisible] = useState(false);
  const [role, setRole] = useState("RESIDENT");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    flatNumber: "",
    building_id: "",
    password: "",
    confirmPassword: "",
  });
  const [buildings, setBuildings] = useState([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusField, setFocusField] = useState("");

  // Fetch buildings when modal opens or role changes to SECURITY
  useEffect(() => {
    if (role === "SECURITY") {
      fetchBuildings();
    }
  }, [role]);

  const fetchBuildings = async () => {
    try {
      setLoadingBuildings(true);
      const response = await api.get("/api/buildings/public");
      setBuildings(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch buildings:", err);
    } finally {
      setLoadingBuildings(false);
    }
  };

  useState(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.password) {
      return setError("Please fill in all required fields.");
    }
    if (role === "RESIDENT" && !form.flatNumber) {
      return setError("Please enter your flat number.");
    }
    if (role === "SECURITY" && !form.building_id) {
      return setError("Please select a building.");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      const ROLE_ID_MAP = { RESIDENT: 2, SECURITY: 3 };

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone_number: form.phone.trim(),
        password: form.password,
        role_id: ROLE_ID_MAP[role], // 2 for Resident, 3 for Security
        ...(role === "RESIDENT" ? { flatNumber: form.flatNumber.trim() } : {}),
        ...(role === "SECURITY" ? { building_id: form.building_id } : {}),
      };

      const res = await api.post("/api/auth/register", payload);

      // backend's success() helper returns { success: true, message, data }
      if (res.data?.success === false) {
        setError(res.data.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: visible ? "rgba(0,0,0,.6)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(3px)" : "blur(0px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        transition: "background .22s ease, backdrop-filter .22s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 440,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "linear-gradient(165deg, #1B1F29, #13161D)",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 18,
          padding: "28px 26px",
          position: "relative",
          boxShadow: "0 30px 70px rgba(0,0,0,.5)",
          transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(.97)",
          opacity: visible ? 1 : 0,
          transition: "transform .22s ease, opacity .22s ease",
        }}
      >
        <div style={S.cardStripe} />

        {/* close */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: 18, right: 18,
            width: 28, height: 28, borderRadius: 7,
            border: "1px solid rgba(255,255,255,.09)",
            background: "#11141A", color: "#9098B0",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={14} />
        </button>

        {/* header */}
        <p style={{ ...S.eyebrow, margin: "4px 0 6px" }}>Create New Account</p>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 21, fontWeight: 700, color: "#F4F5F8", margin: "0 0 4px",
        }}>
          Join NestOS
        </h2>
        <p style={{ color: "#9098B0", fontSize: 13, margin: "0 0 18px" }}>
          Register as a resident or security staff member
        </p>

        {/* role picker */}
        <label style={{ ...S.fieldLabel, marginTop: 0 }}>Account Type</label>
        <RolePicker role={role} setRole={setRole} />

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <label style={S.fieldLabel}>Full Name</label>
          <div style={S.fieldInputWrap}>
            <User size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6A7290" }} />
            <input
              type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="Enter your full name"
              onFocus={() => setFocusField("name")} onBlur={() => setFocusField("")}
              style={{ ...S.fieldInput, paddingLeft: 36, ...(focusField === "name" ? S.fieldInputFocus : {}) }}
            />
          </div>

          {/* Email */}
          <label style={S.fieldLabel}>Email Address</label>
          <div style={S.fieldInputWrap}>
            <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6A7290" }} />
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              onFocus={() => setFocusField("email")} onBlur={() => setFocusField("")}
              style={{ ...S.fieldInput, paddingLeft: 36, ...(focusField === "email" ? S.fieldInputFocus : {}) }}
            />
          </div>

          {/* Phone */}
          <label style={S.fieldLabel}>Phone Number</label>
          <div style={S.fieldInputWrap}>
            <Phone size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6A7290" }} />
            <input
              type="tel" name="phone" value={form.phone} onChange={handleChange}
              placeholder="10-digit mobile number"
              onFocus={() => setFocusField("phone")} onBlur={() => setFocusField("")}
              style={{ ...S.fieldInput, paddingLeft: 36, ...(focusField === "phone" ? S.fieldInputFocus : {}) }}
            />
          </div>

          {/* Flat Number — resident only */}
          {role === "RESIDENT" && (
            <>
              <label style={S.fieldLabel}>Flat Number</label>
              <div style={S.fieldInputWrap}>
                <Home size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6A7290" }} />
                <input
                  type="text" name="flatNumber" value={form.flatNumber} onChange={handleChange}
                  placeholder="e.g. A-204"
                  onFocus={() => setFocusField("flatNumber")} onBlur={() => setFocusField("")}
                  style={{ ...S.fieldInput, paddingLeft: 36, ...(focusField === "flatNumber" ? S.fieldInputFocus : {}) }}
                />
              </div>
            </>
          )}

          {/* Building Selection — security only */}
          {role === "SECURITY" && (
            <>
              <label style={S.fieldLabel}>Assign to Building</label>
              <div style={S.fieldInputWrap}>
                <Home size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6A7290" }} />
                <select
                  name="building_id"
                  value={form.building_id}
                  onChange={handleChange}
                  onFocus={() => setFocusField("building_id")} onBlur={() => setFocusField("")}
                  style={{ 
                    ...S.fieldInput, 
                    paddingLeft: 36, 
                    ...(focusField === "building_id" ? S.fieldInputFocus : {}),
                    cursor: loadingBuildings ? "not-allowed" : "pointer",
                  }}
                  disabled={loadingBuildings}
                >
                  <option value="">Select a building</option>
                  {buildings.map((building) => (
                    <option key={building.building_id} value={building.building_id}>
                      {building.building_name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Password */}
          <label style={S.fieldLabel}>Password</label>
          <div style={S.fieldInputWrap}>
            <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6A7290" }} />
            <input
              type={showPassword ? "text" : "password"}
              name="password" value={form.password} onChange={handleChange}
              placeholder="At least 6 characters"
              onFocus={() => setFocusField("password")} onBlur={() => setFocusField("")}
              style={{ ...S.fieldInput, paddingLeft: 36, paddingRight: 42, ...(focusField === "password" ? S.fieldInputFocus : {}) }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={S.eyeBtn}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Confirm Password */}
          <label style={S.fieldLabel}>Confirm Password</label>
          <div style={S.fieldInputWrap}>
            <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6A7290" }} />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
              placeholder="Re-enter your password"
              onFocus={() => setFocusField("confirmPassword")} onBlur={() => setFocusField("")}
              style={{ ...S.fieldInput, paddingLeft: 36, paddingRight: 42, ...(focusField === "confirmPassword" ? S.fieldInputFocus : {}) }}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={S.eyeBtn}>
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={S.errorBox}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10" stroke="#FF7775" strokeWidth="1.8" />
                <path d="M12 8v5M12 16v.5" stroke="#FF7775" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={S.successBox}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10" stroke="#34D399" strokeWidth="1.8" />
                <path d="M8 12l2.5 2.5L16 9" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Account created successfully! You can now sign in.
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || success}
            style={{
              ...S.submitBtn,
              ...((loading || success) ? S.submitDisabled : {}),
              ...(success ? { background: "linear-gradient(135deg, #36D399, #34D399)", opacity: 1 } : {}),
            }}
          >
            {loading ? (
              <><Spinner />Creating account…</>
            ) : success ? (
              "Account Created"
            ) : (
              `Create ${role === "RESIDENT" ? "Resident" : "Security"} Account`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Login ───────────────────────────────────────────────────────────────── */
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [focusField, setFocusField] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("Please enter email and password.");
    }

    setLoading(true);
    const result = await login(form.email.trim(), form.password);
    setLoading(false);

    if (!result.success) {
      return setError(result.message);
    }

    const user = result.user;
    const building = result.building;
    if (!user) {
      return setError("Unable to load user data.");
    }

    console.log("User data after login:", user);
    console.log("Building data after login:", building);
    console.log("User role_id:", user.role_id);
    console.log("User role:", user.role);
    console.log("User role_id type:", typeof user.role_id);

    // Convert role_id to number for comparison
    const roleId = Number(user.role_id);
    
    switch (roleId) {
      case 1: navigate("/admin/dashboard"); break;
      case 2: navigate("/resident/dashboard"); break;
      case 3: navigate("/security/dashboard"); break;
      case 4: navigate("/developer/dashboard"); break;
      default: navigate("/");
    }
  };

  return (
    <>
      <style>{`
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        input[type="email"]::placeholder,
        input[type="password"]::placeholder,
        input[type="text"]::placeholder,
        input[type="tel"]::placeholder { color: #4A5068; }
      `}</style>

      <div style={S.page}>
        <div style={S.inner}>

          {/* Eyebrow */}
          <p style={S.eyebrow}>Building Management System</p>

          {/* Heading */}
          <h1 style={S.title}>NestOS</h1>
          <p style={S.sub}>Sign in to access your role dashboard</p>

          {/* Card */}
          <div style={S.card}>
            <div style={S.cardStripe} />

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <label style={{ ...S.fieldLabel, marginTop: 4 }}>Email Address</label>
              <div style={S.fieldInputWrap}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@vedashreechs.in"
                  onFocus={() => setFocusField("email")}
                  onBlur={() => setFocusField("")}
                  style={{
                    ...S.fieldInput,
                    ...(focusField === "email" ? S.fieldInputFocus : {}),
                  }}
                />
              </div>

              {/* Password */}
              <label style={S.fieldLabel}>Password</label>
              <div style={S.fieldInputWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  onFocus={() => setFocusField("password")}
                  onBlur={() => setFocusField("")}
                  style={{
                    ...S.fieldInput,
                    paddingRight: 42,
                    ...(focusField === "password" ? S.fieldInputFocus : {}),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={S.eyeBtn}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Remember + Forgot */}
              <div style={S.rowMiddle}>
                <label style={S.checkLabel}>
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    style={S.checkBox}
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  style={S.forgotBtn}
                >
                  Forgot password?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div style={S.errorBox}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  >
                    <circle cx="12" cy="12" r="10" stroke="#FF7775" strokeWidth="1.8" />
                    <path
                      d="M12 8v5M12 16v.5"
                      stroke="#FF7775"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...S.submitBtn,
                  ...(loading ? S.submitDisabled : {}),
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 10px 26px rgba(54,84,224,.45)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(54,84,224,.35)";
                }}
              >
                {loading ? (
                  <><Spinner />Signing in…</>
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Create Account */}
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                style={S.createAccBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(110,131,242,.4)";
                  e.currentTarget.style.color = "#F4F5F8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,.09)";
                  e.currentTarget.style.color = "#9098B0";
                }}
              >
                Create New Account
              </button>

            </form>
          </div>

          {/* Footer */}
          <p style={S.foot}>Access restricted to authorised personnel only</p>

        </div>
      </div>

      {showCreateModal && (
        <CreateAccountModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}

export default Login;
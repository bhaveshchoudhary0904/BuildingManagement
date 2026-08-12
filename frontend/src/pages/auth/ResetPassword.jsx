import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle, X, Loader2, Eye, EyeOff } from "lucide-react";
import api from "../../services/api";

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
  backBtn: {
    background: "none",
    border: "none",
    color: "#6E83F2",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    padding: 0,
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
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
};

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [formData, setFormData] = useState({
    email: email,
    otp: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    if (formData.new_password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/reset-password", {
        email: formData.email,
        otp: formData.otp,
        new_password: formData.new_password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={S.page}>
        <div style={S.inner}>
          <div style={S.card}>
            <div style={S.cardStripe} />
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <CheckCircle size={64} color="#34D399" style={{ marginBottom: 16 }} />
              <h2 style={S.title}>Password Reset Successful</h2>
              <p style={S.sub}>
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                style={S.submitBtn}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.inner}>
        <p style={S.eyebrow}>Password Recovery</p>
        <h1 style={S.title}>Reset Password</h1>
        <p style={S.sub}>
          Enter the OTP sent to your email and create a new password.
        </p>

        <div style={S.card}>
          <div style={S.cardStripe} />
          
          <button
            onClick={() => navigate("/forgot-password")}
            style={S.backBtn}
          >
            <ArrowLeft size={16} />
            Back to Forgot Password
          </button>

          <form onSubmit={handleSubmit}>
            <label style={S.fieldLabel}>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
              style={S.fieldInput}
              onFocus={(e) => {
                e.target.style.borderColor = "#6E83F2";
                e.target.style.boxShadow = "0 0 0 3px rgba(110,131,242,.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,.09)";
                e.target.style.boxShadow = "none";
              }}
            />

            <label style={S.fieldLabel}>OTP</label>
            <input
              type="text"
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              placeholder="Enter 6-digit OTP"
              required
              maxLength={6}
              style={S.fieldInput}
              onFocus={(e) => {
                e.target.style.borderColor = "#6E83F2";
                e.target.style.boxShadow = "0 0 0 3px rgba(110,131,242,.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,.09)";
                e.target.style.boxShadow = "none";
              }}
            />

            <label style={S.fieldLabel}>New Password</label>
            <div style={S.fieldInputWrap}>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                placeholder="Enter new password"
                required
                minLength={6}
                style={S.fieldInput}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6E83F2";
                  e.target.style.boxShadow = "0 0 0 3px rgba(110,131,242,.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,.09)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={S.eyeBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label style={S.fieldLabel}>Confirm New Password</label>
            <div style={S.fieldInputWrap}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                placeholder="Confirm new password"
                required
                minLength={6}
                style={S.fieldInput}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6E83F2";
                  e.target.style.boxShadow = "0 0 0 3px rgba(110,131,242,.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,.09)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={S.eyeBtn}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div style={S.errorBox}>
                <X size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...S.submitBtn,
                ...(loading ? S.submitDisabled : {}),
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
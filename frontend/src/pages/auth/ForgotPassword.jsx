import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const ForgotPassword = () => {
  const { theme: T } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // TODO: Add API call to send reset link
    setTimeout(() => {
      setMessage('If an account exists with this email, a reset link will be sent.');
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .mg-input::placeholder { color: ${T.searchPlaceholder}; }
        .mg-input:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accentBg} !important; }
      `}</style>
      
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: T.isDark
          ? `radial-gradient(circle at 20% 10%, rgba(110,131,242,.09), transparent 42%),
             radial-gradient(circle at 80% 85%, rgba(217,113,74,.07), transparent 42%), ${T.bg}`
          : T.bg,
        padding: "24px",
        fontFamily: "'Inter', sans-serif",
        color: T.ink,
      }}>
        <div style={{
          width: "100%",
          maxWidth: 420,
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: "40px 36px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              color: T.ink,
              margin: "0 0 8px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Forgot Password
            </h1>
            <p style={{
              fontSize: 14,
              color: T.inkSoft,
              margin: 0,
            }}>
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: T.inkMuted,
                marginBottom: 8,
                fontFamily: "'IBM Plex Mono', monospace",
                letterSpacing: ".03em",
                textTransform: "uppercase",
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mg-input"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  background: T.bg,
                  color: T.ink,
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                  transition: "border-color .18s, box-shadow .18s",
                }}
              />
            </div>

            {message && (
              <div style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: "rgba(54,211,153,0.1)",
                border: "1px solid rgba(54,211,153,0.3)",
                color: "#36D399",
                fontSize: 13,
                textAlign: "center",
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "none",
                background: T.accent,
                color: T.navActiveText,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: loading ? "wait" : "pointer",
                transition: "transform .15s, box-shadow .15s",
                opacity: loading ? 0.75 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(54,84,224,.32)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p style={{
            marginTop: 24,
            fontSize: 13,
            color: T.inkSoft,
            textAlign: "center",
            margin: "24px 0 0",
          }}>
            Remembered your password?{' '}
            <Link 
              to="/login" 
              style={{
                color: T.accent,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

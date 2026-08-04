import { useEffect, useState } from "react";
import { Bell, Search, Moon, Sun, Menu, UserCircle, LogOut, Lock, Mail, Phone, Edit } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [currentTime, setCurrentTime]         = useState(new Date());
  const [showProfileMenu, setShowProfileMenu]  = useState(false);
  
  // Profile editing state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    profile_image: '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const [emailForm, setEmailForm] = useState({
    new_email: '',
    otp: '',
  });
  
  const [phoneForm, setPhoneForm] = useState({
    new_phone: '',
    otp: '',
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load user data when profile modal opens
  useEffect(() => {
    if (showProfileModal && user) {
      setProfileForm({
        name: user.name || '',
        profile_image: user.profile_image || '',
      });
    }
  }, [showProfileModal, user]);

  const T = theme;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('name', profileForm.name);
      if (profileForm.profile_image) {
        formData.append('profile_image', profileForm.profile_image);
      }
      
      await api.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated successfully');
      setShowProfileModal(false);
      // Reload user data
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert('Passwords do not match');
      return;
    }
    try {
      setSaving(true);
      await api.put('/auth/password', {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      alert('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/auth/email', {
        new_email: emailForm.new_email,
        otp: emailForm.otp,
      });
      alert('Email updated successfully');
      setShowEmailModal(false);
      setEmailForm({ new_email: '', otp: '' });
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update email');
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneChange = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/auth/phone', {
        new_phone: phoneForm.new_phone,
        otp: phoneForm.otp,
      });
      alert('Phone number updated successfully');
      setShowPhoneModal(false);
      setPhoneForm({ new_phone: '', otp: '' });
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update phone number');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .mg-search::placeholder { color: ${T.searchPlaceholder}; }
        .mg-search:focus { border-color: #6E83F2 !important; box-shadow: 0 0 0 3px rgba(110,131,242,.15) !important; }
        .mg-icon-btn:hover { border-color: ${T.isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.2)"} !important; color: ${T.ink} !important; background: ${T.surface2} !important; }
        .mg-profile-btn:hover { border-color: ${T.isDark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.2)"} !important; }
        .mg-drop-item:hover { background: ${T.isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)"} !important; color: ${T.ink} !important; }
        .mg-drop-danger:hover { background: rgba(224,82,77,.08) !important; color: ${T.red} !important; }
        .mg-theme-btn { transition: transform .2s ease; }
        .mg-theme-btn:hover { transform: rotate(20deg); }
        @media (max-width: 768px) {
          .mg-menu-btn { display: flex !important; }
          .mg-search-wrap { display: none !important; }
          .mg-time-block { display: none !important; }
          .mg-profile-text { display: none !important; }
        }
      `}</style>

      <header
        style={{
          height: 64,
          background: T.headerBg,
          borderBottom: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          fontFamily: "'Inter', sans-serif",
          WebkitFontSmoothing: "antialiased",
          flexShrink: 0,
          transition: "background .3s ease",
        }}
      >
        {/* ── Left ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            className="mg-menu-btn"
            style={{
              display: "none", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, borderRadius: 8,
              border: `1px solid ${T.border}`, background: T.surface,
              color: T.inkSoft, cursor: "pointer",
            }}
          >
            <Menu size={18} />
          </button>

          <div className="mg-search-wrap" style={{ position: "relative" }}>
            <Search
              size={15}
              style={{
                position: "absolute", left: 11, top: "50%",
                transform: "translateY(-50%)",
                color: T.inkMuted, pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search…"
              className="mg-search"
              style={{
                width: 240,
                padding: "9px 14px 9px 36px",
                borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: T.surface,
                color: T.ink,
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                outline: "none",
                transition: "border-color .18s, box-shadow .18s, background .3s",
              }}
            />
          </div>
        </div>

        {/* ── Right ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

          {/* Date & Time */}
          <div className="mg-time-block" style={{ textAlign: "right", marginRight: 8 }}>
            <p style={{
              fontSize: 12, fontFamily: "'IBM Plex Mono', monospace",
              color: T.ink, fontWeight: 600, letterSpacing: ".02em",
              lineHeight: 1.3, margin: 0,
            }}>
              {currentTime.toLocaleDateString()}
            </p>
            <p style={{
              fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
              color: T.inkSoft, letterSpacing: ".02em", margin: 0,
            }}>
              {currentTime.toLocaleTimeString()}
            </p>
          </div>

          {/* Dark / Light toggle */}
          <button
            className="mg-icon-btn mg-theme-btn"
            onClick={toggleTheme}
            title={T.isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              width: 36, height: 36, borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: T.surface,
              color: T.isDark ? "#FFC857" : "#3654E0",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background .3s, border-color .15s, color .3s",
            }}
          >
            {T.isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notification */}
          <button
            className="mg-icon-btn"
            title="Notifications"
            style={{
              width: 36, height: 36, borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: T.surface,
              color: T.inkSoft,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              transition: "background .3s, border-color .15s",
            }}
          >
            <Bell size={16} />
            <span style={{
              position: "absolute", top: -4, right: -4,
              width: 18, height: 18, borderRadius: "50%",
              background: T.red, color: "#fff",
              fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `2px solid ${T.headerBg}`,
            }}>
              3
            </span>
          </button>

          {/* Profile */}
          <div style={{ position: "relative" }}>
            <button
              className="mg-profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "6px 10px", borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: T.surface, color: T.ink,
                cursor: "pointer", marginLeft: 4,
                transition: "background .3s, border-color .15s",
              }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: user?.profile_image ? "transparent" : "linear-gradient(135deg, #3654E0, #6E83F2)",
                color: "#fff", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 12, fontWeight: 700,
                flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif",
                overflow: "hidden",
              }}>
                {user?.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt="Profile" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <div className="mg-profile-text" style={{ textAlign: "left" }}>
                <p style={{
                  fontSize: 13, fontWeight: 600, color: T.ink,
                  lineHeight: 1.3, margin: 0,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  {user?.name}
                </p>
                <p style={{
                  fontSize: 10, color: T.inkSoft, margin: 0,
                  fontFamily: "'IBM Plex Mono', monospace",
                  letterSpacing: ".04em", textTransform: "uppercase",
                }}>
                  {user?.role}
                </p>
              </div>
            </button>

            {showProfileMenu && (
              <div style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0,
                width: 220, background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 12, boxShadow: "0 16px 40px rgba(0,0,0,.25)",
                overflow: "hidden", zIndex: 100,
              }}>
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
                  <p style={{
                    fontSize: 14, fontWeight: 700, color: T.ink, margin: 0,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    {user?.name}
                  </p>
                  <p style={{
                    fontSize: 11, color: T.inkSoft, margin: "3px 0 0",
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}>
                    {user?.email}
                  </p>
                </div>

                <button 
                  className="mg-drop-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowProfileModal(true);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "11px 16px",
                    background: "none", border: "none",
                    color: T.inkSoft, fontSize: 13, cursor: "pointer",
                    fontFamily: "'Inter', sans-serif", textAlign: "left",
                  }}
                >
                  <UserCircle size={15} />
                  Edit Profile
                </button>

                <button 
                  className="mg-drop-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowPasswordModal(true);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "11px 16px",
                    background: "none", border: "none",
                    color: T.inkSoft, fontSize: 13, cursor: "pointer",
                    fontFamily: "'Inter', sans-serif", textAlign: "left",
                  }}
                >
                  <Lock size={15} />
                  Change Password
                </button>

                <button 
                  className="mg-drop-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowEmailModal(true);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "11px 16px",
                    background: "none", border: "none",
                    color: T.inkSoft, fontSize: 13, cursor: "pointer",
                    fontFamily: "'Inter', sans-serif", textAlign: "left",
                  }}
                >
                  <Mail size={15} />
                  Change Email
                </button>

                <button 
                  className="mg-drop-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowPhoneModal(true);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "11px 16px",
                    background: "none", border: "none",
                    color: T.inkSoft, fontSize: 13, cursor: "pointer",
                    fontFamily: "'Inter', sans-serif", textAlign: "left",
                  }}
                >
                  <Phone size={15} />
                  Change Phone
                </button>

                <button
                  className="mg-drop-item mg-drop-danger"
                  onClick={logout}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "11px 16px",
                    background: "none", border: "none",
                    color: T.red, fontSize: 13, cursor: "pointer",
                    fontFamily: "'Inter', sans-serif", textAlign: "left",
                  }}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 24,
            width: "100%", maxWidth: 400,
          }}>
            <h3 style={{
              margin: "0 0 16px",
              fontSize: 18,
              fontWeight: 700,
              color: T.ink,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Edit Profile
            </h3>
            <form onSubmit={handleProfileUpdate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{
                  display: "block", fontSize: 11.5, fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
                  textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
                }}>
                  Profile Image
                </label>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: "50%",
                    background: T.surface2,
                    border: `1px solid ${T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden",
                  }}>
                    {profileForm.profile_image ? (
                      <img 
                        src={typeof profileForm.profile_image === 'string' 
                          ? profileForm.profile_image 
                          : URL.createObjectURL(profileForm.profile_image)} 
                        alt="Profile" 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{
                        fontSize: 20, fontWeight: 700, color: T.inkMuted,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}>
                        {getInitials(profileForm.name)}
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileForm({ ...profileForm, profile_image: e.target.files[0] })}
                    style={{
                      fontSize: 12,
                      color: T.inkSoft,
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{
                  display: "block", fontSize: 11.5, fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
                  textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
                }}>
                  Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  style={{
                    width: "100%", padding: "10px 12px",
                    borderRadius: 8, border: `1px solid ${T.border}`,
                    background: T.bg, color: T.ink, fontSize: 13,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.surface2,
                    color: T.ink,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: T.accent,
                    color: T.navActiveText,
                    cursor: saving ? "wait" : "pointer",
                    fontWeight: 700,
                    opacity: saving ? 0.75 : 1,
                  }}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 24,
            width: "100%", maxWidth: 400,
          }}>
            <h3 style={{
              margin: "0 0 16px",
              fontSize: 18,
              fontWeight: 700,
              color: T.ink,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{
                  display: "block", fontSize: 11.5, fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
                  textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
                }}>
                  Old Password
                </label>
                <input
                  type="password"
                  value={passwordForm.old_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                  required
                  style={{
                    width: "100%", padding: "10px 12px",
                    borderRadius: 8, border: `1px solid ${T.border}`,
                    background: T.bg, color: T.ink, fontSize: 13,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", fontSize: 11.5, fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
                  textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  required
                  style={{
                    width: "100%", padding: "10px 12px",
                    borderRadius: 8, border: `1px solid ${T.border}`,
                    background: T.bg, color: T.ink, fontSize: 13,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", fontSize: 11.5, fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
                  textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
                }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  required
                  style={{
                    width: "100%", padding: "10px 12px",
                    borderRadius: 8, border: `1px solid ${T.border}`,
                    background: T.bg, color: T.ink, fontSize: 13,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.surface2,
                    color: T.ink,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: T.accent,
                    color: T.navActiveText,
                    cursor: saving ? "wait" : "pointer",
                    fontWeight: 700,
                    opacity: saving ? 0.75 : 1,
                  }}
                >
                  {saving ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Change Modal */}
      {showEmailModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 24,
            width: "100%", maxWidth: 400,
          }}>
            <h3 style={{
              margin: "0 0 16px",
              fontSize: 18,
              fontWeight: 700,
              color: T.ink,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Change Email
            </h3>
            <p style={{ margin: "0 0 16px", color: T.inkSoft, fontSize: 13 }}>
              An OTP will be sent to your new email for verification.
            </p>
            <form onSubmit={handleEmailChange} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{
                  display: "block", fontSize: 11.5, fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
                  textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
                }}>
                  New Email
                </label>
                <input
                  type="email"
                  value={emailForm.new_email}
                  onChange={(e) => setEmailForm({ ...emailForm, new_email: e.target.value })}
                  required
                  style={{
                    width: "100%", padding: "10px 12px",
                    borderRadius: 8, border: `1px solid ${T.border}`,
                    background: T.bg, color: T.ink, fontSize: 13,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", fontSize: 11.5, fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
                  textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
                }}>
                  OTP
                </label>
                <input
                  type="text"
                  value={emailForm.otp}
                  onChange={(e) => setEmailForm({ ...emailForm, otp: e.target.value })}
                  required
                  style={{
                    width: "100%", padding: "10px 12px",
                    borderRadius: 8, border: `1px solid ${T.border}`,
                    background: T.bg, color: T.ink, fontSize: 13,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailForm({ new_email: '', otp: '' });
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.surface2,
                    color: T.ink,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: T.accent,
                    color: T.navActiveText,
                    cursor: saving ? "wait" : "pointer",
                    fontWeight: 700,
                    opacity: saving ? 0.75 : 1,
                  }}
                >
                  {saving ? "Updating..." : "Update Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Phone Change Modal */}
      {showPhoneModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 24,
            width: "100%", maxWidth: 400,
          }}>
            <h3 style={{
              margin: "0 0 16px",
              fontSize: 18,
              fontWeight: 700,
              color: T.ink,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Change Phone Number
            </h3>
            <p style={{ margin: "0 0 16px", color: T.inkSoft, fontSize: 13 }}>
              An OTP will be sent to your new phone number for verification.
            </p>
            <form onSubmit={handlePhoneChange} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{
                  display: "block", fontSize: 11.5, fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
                  textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
                }}>
                  New Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneForm.new_phone}
                  onChange={(e) => setPhoneForm({ ...phoneForm, new_phone: e.target.value })}
                  required
                  style={{
                    width: "100%", padding: "10px 12px",
                    borderRadius: 8, border: `1px solid ${T.border}`,
                    background: T.bg, color: T.ink, fontSize: 13,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", fontSize: 11.5, fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
                  textTransform: "uppercase", color: T.inkMuted, marginBottom: 8,
                }}>
                  OTP
                </label>
                <input
                  type="text"
                  value={phoneForm.otp}
                  onChange={(e) => setPhoneForm({ ...phoneForm, otp: e.target.value })}
                  required
                  style={{
                    width: "100%", padding: "10px 12px",
                    borderRadius: 8, border: `1px solid ${T.border}`,
                    background: T.bg, color: T.ink, fontSize: 13,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowPhoneModal(false);
                    setPhoneForm({ new_phone: '', otp: '' });
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.surface2,
                    color: T.ink,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: T.accent,
                    color: T.navActiveText,
                    cursor: saving ? "wait" : "pointer",
                    fontWeight: 700,
                    opacity: saving ? 0.75 : 1,
                  }}
                >
                  {saving ? "Updating..." : "Update Phone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
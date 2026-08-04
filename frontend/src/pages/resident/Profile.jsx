import { useState, useEffect } from 'react';
import { User, Phone, Mail, Home, Save, CheckCircle2, Calendar, MapPin, Lock, Key, Shield } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const Profile = () => {
  const { user } = useAuth();
  const { theme: T } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone_number: '',
    email: '',
    emergency_contact: '',
  });

  const [residentData, setResidentData] = useState({
    unit_number: '',
    building_name: '',
    move_in_date: '',
  });

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Email change state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    new_email: '',
    otp: '',
  });

  // Phone change state
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneForm, setPhoneForm] = useState({
    new_phone: '',
    otp: '',
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      const userData = response.data.data?.user || response.data.data;
      if (userData) {
        setForm({
          name: userData.name || '',
          phone_number: userData.phone_number || '',
          email: userData.email || '',
          emergency_contact: userData.emergency_contact || '',
        });
        
        // Load resident details if available
        if (userData.resident_id) {
          try {
            const residentRes = await api.get(`/residents/${userData.resident_id}`);
            const resident = residentRes.data.data;
            if (resident) {
              setResidentData({
                unit_number: resident.unit?.unit_number || '',
                building_name: resident.unit?.building?.building_name || '',
                move_in_date: resident.move_in_date || '',
              });
            }
          } catch (err) {
            console.error('Error loading resident details:', err);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setHeaderVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      await api.put('/auth/profile', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
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
      await loadProfile();
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
      await loadProfile();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update phone number');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        .mg-input:focus { border-color: #FFC857 !important; box-shadow: 0 0 0 3px rgba(255,200,87,.12) !important; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: T.isDark
          ? `radial-gradient(circle at 15% 10%, rgba(255,200,87,.08), transparent 40%), ${T.bg}`
          : T.bg,
        padding: '36px 38px 64px',
        fontFamily: "'Inter', sans-serif",
        color: T.ink,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 32, flexWrap: 'wrap', gap: 16,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity .4s ease, transform .4s ease',
        }}>
          <div>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
              letterSpacing: '.08em', textTransform: 'uppercase',
              color: T.inkMuted, margin: '0 0 8px',
            }}>
              {user?.building?.building_name || "NestOS"} · Resident Portal
            </p>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700,
              color: T.ink, margin: 0,
            }}>
              My Profile
            </h1>
            <p style={{ color: T.inkSoft, margin: '6px 0 0', fontSize: 14 }}>
              Manage your resident account information
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: saved ? 'linear-gradient(135deg, #1F9D6C, #36D399)' : 'linear-gradient(135deg, #FFC857, #FFB830)',
              color: '#13161D', border: 'none',
              padding: '11px 18px', borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: saving ? 'default' : 'pointer',
              opacity: saving ? 0.75 : 1,
              transition: 'background .2s',
            }}
          >
            {saved ? <CheckCircle2 size={15} /> : <Save size={15} style={{ animation: saving ? 'mgSpin .8s linear infinite' : 'none' }} />}
            {saved ? 'Saved' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" style={{ animation: 'mgSpin .8s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(255,200,87,.25)" strokeWidth="2.5" fill="none" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#FFC857" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
            <p style={{ color: T.inkSoft, fontSize: 13, marginTop: 12 }}>Loading profile…</p>
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28, alignItems: 'start',
          }}>
            {/* Profile Card */}
            <div style={{
              background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
              border: `1px solid ${T.border}`,
              borderRadius: 16, padding: '28px 24px',
              textAlign: 'center',
            }}>
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: user?.profile_image ? 'transparent' : 'linear-gradient(135deg, #FFC857, #FFB830)',
                color: '#13161D',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                margin: '0 auto 16px',
                overflow: 'hidden',
              }}>
                {user?.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  (form.name || user?.name || 'R')[0].toUpperCase()
                )}
              </div>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 18, fontWeight: 700, color: T.ink, margin: '0 0 6px',
              }}>
                {form.name || user?.name || 'Resident'}
              </h3>
              <p style={{ color: T.inkMuted, fontSize: 13, margin: '0 0 8px' }}>
                {user?.role || 'RESIDENT'}
              </p>
              {residentData.unit_number && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '6px 10px', borderRadius: 6,
                  background: 'rgba(255,200,87,.1)', color: '#FFC857',
                  fontSize: 11.5, fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace",
                  marginBottom: 12,
                }}>
                  <Home size={12} />
                  {residentData.unit_number}
                </div>
              )}
              {residentData.move_in_date && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontSize: 12, color: T.inkSoft,
                }}>
                  <Calendar size={12} />
                  {new Date(residentData.move_in_date).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Form */}
            <div style={{
              background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
              border: `1px solid ${T.border}`,
              borderRadius: 16, padding: '28px 26px',
            }}>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 18, fontWeight: 700, color: T.ink, margin: '0 0 24px',
              }}>
                Personal Information
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                {/* Name */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: 'block', fontSize: 11.5, fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.04em',
                    textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
                  }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{
                      position: 'absolute', left: 12, top: '50%',
                      transform: 'translateY(-50%)', color: T.inkMuted,
                    }} />
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange('name')}
                      className="mg-input"
                      style={{
                        width: '100%', padding: '10px 14px 10px 38px',
                        borderRadius: 9, border: `1px solid ${T.border}`,
                        background: T.bg, color: T.ink, fontSize: 13.5,
                        outline: 'none', fontFamily: "'Inter', sans-serif",
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: 'block', fontSize: 11.5, fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.04em',
                    textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
                  }}>
                    Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{
                      position: 'absolute', left: 12, top: '50%',
                      transform: 'translateY(-50%)', color: T.inkMuted,
                    }} />
                    <input
                      type="tel"
                      value={form.phone_number}
                      readOnly
                      className="mg-input"
                      style={{
                        width: '100%', padding: '10px 14px 10px 38px',
                        borderRadius: 9, border: `1px solid ${T.border}`,
                        background: T.surface2, color: T.inkMuted, fontSize: 13.5,
                        outline: 'none', fontFamily: "'Inter', sans-serif",
                        cursor: 'not-allowed',
                      }}
                      placeholder="Phone number"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPhoneModal(true)}
                      style={{
                        position: 'absolute', right: 8, top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '4px 8px', borderRadius: 6,
                        background: 'rgba(255,200,87,.1)', color: '#FFC857',
                        border: 'none', fontSize: 11, fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: 'block', fontSize: 11.5, fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.04em',
                    textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
                  }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{
                      position: 'absolute', left: 12, top: '50%',
                      transform: 'translateY(-50%)', color: T.inkMuted,
                    }} />
                    <input
                      type="email"
                      value={form.email}
                      readOnly
                      className="mg-input"
                      style={{
                        width: '100%', padding: '10px 14px 10px 38px',
                        borderRadius: 9, border: `1px solid ${T.border}`,
                        background: T.surface2, color: T.inkMuted, fontSize: 13.5,
                        outline: 'none', fontFamily: "'Inter', sans-serif",
                        cursor: 'not-allowed',
                      }}
                      placeholder="Email address"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(true)}
                      style={{
                        position: 'absolute', right: 8, top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '4px 8px', borderRadius: 6,
                        background: 'rgba(255,200,87,.1)', color: '#FFC857',
                        border: 'none', fontSize: 11, fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: 'block', fontSize: 11.5, fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.04em',
                    textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
                  }}>
                    Emergency Contact
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{
                      position: 'absolute', left: 12, top: '50%',
                      transform: 'translateY(-50%)', color: T.inkMuted,
                    }} />
                    <input
                      type="tel"
                      value={form.emergency_contact}
                      onChange={handleChange('emergency_contact')}
                      className="mg-input"
                      style={{
                        width: '100%', padding: '10px 14px 10px 38px',
                        borderRadius: 9, border: `1px solid ${T.border}`,
                        background: T.bg, color: T.ink, fontSize: 13.5,
                        outline: 'none', fontFamily: "'Inter', sans-serif",
                      }}
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
              <div style={{
                marginTop: 24,
                padding: '16px 18px',
                borderRadius: 10,
                background: T.isDark ? 'rgba(255,200,87,.05)' : 'rgba(255,200,87,.08)',
                border: `1px solid rgba(255,200,87,.2)`,
              }}>
                <h4 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 14, fontWeight: 600, color: T.ink, margin: '0 0 12px',
                }}>
                  Security Settings
                </h4>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', borderRadius: 6,
                    background: 'rgba(255,200,87,.1)', color: '#FFC857',
                    border: 'none', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Lock size={14} />
                  Change Password
                </button>
              </div>

              {/* Apartment Info (Read-only) */}
              {residentData.unit_number && (
                <div style={{
                  marginTop: 24,
                  padding: '16px 18px',
                  borderRadius: 10,
                  background: T.isDark ? 'rgba(255,200,87,.05)' : 'rgba(255,200,87,.08)',
                  border: `1px solid rgba(255,200,87,.2)`,
                }}>
                  <h4 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14, fontWeight: 600, color: T.ink, margin: '0 0 12px',
                  }}>
                    Apartment Details
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkSoft }}>
                      <Home size={14} color="#FFC857" />
                      <span>Unit: {residentData.unit_number}</span>
                    </div>
                    {residentData.building_name && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkSoft }}>
                        <MapPin size={14} color="#FFC857" />
                        <span>{residentData.building_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: 24,
              width: '100%', maxWidth: 400,
            }}>
              <h3 style={{
                margin: '0 0 16px',
                fontSize: 18,
                fontWeight: 700,
                color: T.ink,
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Change Password
              </h3>
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{
                    display: 'block', fontSize: 11.5, fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.04em',
                    textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
                  }}>
                    Old Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.old_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                    required
                    style={{
                      width: '100%', padding: '10px 12px',
                      borderRadius: 8, border: `1px solid ${T.border}`,
                      background: T.bg, color: T.ink, fontSize: 13,
                      outline: 'none', fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block', fontSize: 11.5, fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.04em',
                    textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
                  }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    required
                    style={{
                      width: '100%', padding: '10px 12px',
                      borderRadius: 8, border: `1px solid ${T.border}`,
                      background: T.bg, color: T.ink, fontSize: 13,
                      outline: 'none', fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block', fontSize: 11.5, fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.04em',
                    textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
                  }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                    required
                    style={{
                      width: '100%', padding: '10px 12px',
                      borderRadius: 8, border: `1px solid ${T.border}`,
                      background: T.bg, color: T.ink, fontSize: 13,
                      outline: 'none', fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                      background: T.surface2,
                      color: T.ink,
                      cursor: 'pointer',
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
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#FFC857',
                      color: '#13161D',
                      cursor: saving ? 'wait' : 'pointer',
                      fontWeight: 700,
                      opacity: saving ? 0.75 : 1,
                    }}
                  >
                    {saving ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Email Change Modal */}
        {showEmailModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: 24,
              width: '100%', maxWidth: 400,
            }}>
              <h3 style={{
                margin: '0 0 16px',
                fontSize: 18,
                fontWeight: 700,
                color: T.ink,
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Change Email
              </h3>
              <p style={{ margin: '0 0 16px', color: T.inkSoft, fontSize: 13 }}>
                An OTP will be sent to your new email for verification.
              </p>
              <form onSubmit={handleEmailChange} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{
                    display: 'block', fontSize: 11.5, fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.04em',
                    textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
                  }}>
                    New Email
                  </label>
                  <input
                    type="email"
                    value={emailForm.new_email}
                    onChange={(e) => setEmailForm({ ...emailForm, new_email: e.target.value })}
                    required
                    style={{
                      width: '100%', padding: '10px 12px',
                      borderRadius: 8, border: `1px solid ${T.border}`,
                      background: T.bg, color: T.ink, fontSize: 13,
                      outline: 'none', fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block', fontSize: 11.5, fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.04em',
                    textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
                  }}>
                    OTP
                  </label>
                  <input
                    type="text"
                    value={emailForm.otp}
                    onChange={(e) => setEmailForm({ ...emailForm, otp: e.target.value })}
                    required
                    style={{
                      width: '100%', padding: '10px 12px',
                      borderRadius: 8, border: `1px solid ${T.border}`,
                      background: T.bg, color: T.ink, fontSize: 13,
                      outline: 'none', fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailModal(false);
                      setEmailForm({ new_email: '', otp: '' });
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                      background: T.surface2,
                      color: T.ink,
                      cursor: 'pointer',
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
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#FFC857',
                      color: '#13161D',
                      cursor: saving ? 'wait' : 'pointer',
                      fontWeight: 700,
                      opacity: saving ? 0.75 : 1,
                    }}
                  >
                    {saving ? 'Updating...' : 'Update Email'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Phone Change Modal */}
        {showPhoneModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: 24,
              width: '100%', maxWidth: 400,
            }}>
              <h3 style={{
                margin: '0 0 16px',
                fontSize: 18,
                fontWeight: 700,
                color: T.ink,
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Change Phone Number
              </h3>
              <p style={{ margin: '0 0 16px', color: T.inkSoft, fontSize: 13 }}>
                An OTP will be sent to your new phone number for verification.
              </p>
              <form onSubmit={handlePhoneChange} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{
                    display: 'block', fontSize: 11.5, fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.04em',
                    textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
                  }}>
                    New Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneForm.new_phone}
                    onChange={(e) => setPhoneForm({ ...phoneForm, new_phone: e.target.value })}
                    required
                    style={{
                      width: '100%', padding: '10px 12px',
                      borderRadius: 8, border: `1px solid ${T.border}`,
                      background: T.bg, color: T.ink, fontSize: 13,
                      outline: 'none', fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block', fontSize: 11.5, fontWeight: 600,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.04em',
                    textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
                  }}>
                    OTP
                  </label>
                  <input
                    type="text"
                    value={phoneForm.otp}
                    onChange={(e) => setPhoneForm({ ...phoneForm, otp: e.target.value })}
                    required
                    style={{
                      width: '100%', padding: '10px 12px',
                      borderRadius: 8, border: `1px solid ${T.border}`,
                      background: T.bg, color: T.ink, fontSize: 13,
                      outline: 'none', fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPhoneModal(false);
                      setPhoneForm({ new_phone: '', otp: '' });
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                      background: T.surface2,
                      color: T.ink,
                      cursor: 'pointer',
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
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#FFC857',
                      color: '#13161D',
                      cursor: saving ? 'wait' : 'pointer',
                      fontWeight: 700,
                      opacity: saving ? 0.75 : 1,
                    }}
                  >
                    {saving ? 'Updating...' : 'Update Phone'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;

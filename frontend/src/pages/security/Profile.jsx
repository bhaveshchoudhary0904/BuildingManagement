import { useState, useEffect } from 'react';
import { User, Phone, Mail, ShieldCheck, Save, CheckCircle2, Camera } from 'lucide-react';
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
        });
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        .mg-input:focus { border-color: #6E83F2 !important; box-shadow: 0 0 0 3px rgba(110,131,242,.15) !important; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: T.isDark
          ? `radial-gradient(circle at 15% 10%, rgba(110,131,242,.08), transparent 40%), ${T.bg}`
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
              {user?.building?.building_name || "NestOS"} · Gate 1
            </p>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700,
              color: T.ink, margin: 0,
            }}>
              Security Profile
            </h1>
            <p style={{ color: T.inkSoft, margin: '6px 0 0', fontSize: 14 }}>
              Manage your security staff account information
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: saved ? 'linear-gradient(135deg, #1F9D6C, #36D399)' : 'linear-gradient(135deg, #3654E0, #6E83F2)',
              color: '#fff', border: 'none',
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
              <circle cx="12" cy="12" r="10" stroke="rgba(110,131,242,.25)" strokeWidth="2.5" fill="none" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#6E83F2" strokeWidth="2.5" strokeLinecap="round" fill="none" />
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
                background: 'linear-gradient(135deg, #3654E0, #6E83F2)',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                margin: '0 auto 16px',
              }}>
                {(form.name || user?.name || 'U')[0].toUpperCase()}
              </div>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 18, fontWeight: 700, color: T.ink, margin: '0 0 6px',
              }}>
                {form.name || user?.name || 'Security Staff'}
              </h3>
              <p style={{ color: T.inkMuted, fontSize: 13, margin: '0 0 16px' }}>
                {user?.role || 'SECURITY'}
              </p>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '8px 12px', borderRadius: 8,
                background: 'rgba(54,211,153,.1)', color: '#36D399',
                fontSize: 12, fontWeight: 600,
                fontFamily: "'IBM Plex Mono', monospace"
              }}>
                <ShieldCheck size={14} />
                Active
              </div>
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
                      onChange={handleChange('phone_number')}
                      className="mg-input"
                      style={{
                        width: '100%', padding: '10px 14px 10px 38px',
                        borderRadius: 9, border: `1px solid ${T.border}`,
                        background: T.bg, color: T.ink, fontSize: 13.5,
                        outline: 'none', fontFamily: "'Inter', sans-serif",
                      }}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 20, gridColumn: '1 / -1' }}>
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
                      onChange={handleChange('email')}
                      className="mg-input"
                      style={{
                        width: '100%', padding: '10px 14px 10px 38px',
                        borderRadius: 9, border: `1px solid ${T.border}`,
                        background: T.bg, color: T.ink, fontSize: 13.5,
                        outline: 'none', fontFamily: "'Inter', sans-serif",
                      }}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;

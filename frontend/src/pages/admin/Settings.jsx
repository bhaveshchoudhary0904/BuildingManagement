import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Bell,
  ShieldCheck,
  IndianRupee,
  Save,
  CheckCircle2,
} from "lucide-react";

import settingService from "../../services/settingService";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

const TABS = [
  { id: "general",       label: "General",       icon: Building2 },
  { id: "notifications", label: "Notifications",  icon: Bell },
  { id: "security",      label: "Security",       icon: ShieldCheck },
  { id: "billing",       label: "Billing",        icon: IndianRupee },
];

function Field({ label, children, T }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block", fontSize: 11.5, fontWeight: 600,
        fontFamily: "'IBM Plex Mono', monospace", letterSpacing: ".04em",
        textTransform: "uppercase", color: T.inkMuted, marginBottom: 7,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function inputStyle(T) {
  return {
    width: "100%", padding: "10px 14px",
    borderRadius: 9, border: `1px solid ${T.border}`,
    background: T.bg, color: T.ink, fontSize: 13.5,
    outline: "none", fontFamily: "'Inter', sans-serif",
  };
}

function Toggle({ checked, onChange, T }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 42, height: 24, borderRadius: 999, border: "none",
        cursor: "pointer", position: "relative",
        background: checked ? T.accent : T.border,
        transition: "background .2s",
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: checked ? 21 : 3,
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.25)",
      }} />
    </button>
  );
}

function ToggleRow({ title, subtitle, checked, onChange, T }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 0", borderBottom: `1px solid ${T.border}`,
    }}>
      <div>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, margin: 0 }}>{title}</p>
        <p style={{ fontSize: 12, color: T.inkSoft, margin: "3px 0 0" }}>{subtitle}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} T={T} />
    </div>
  );
}

function Card({ title, description, children, T }) {
  return (
    <div style={{
      background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
      border: `1px solid ${T.border}`,
      borderRadius: 16, padding: "24px 26px", marginBottom: 18,
    }}>
      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif", fontSize: 16,
        fontWeight: 700, color: T.ink, margin: "0 0 4px",
      }}>{title}</h3>
      {description && (
        <p style={{ fontSize: 12.5, color: T.inkSoft, margin: "0 0 18px" }}>{description}</p>
      )}
      {!description && <div style={{ marginBottom: 12 }} />}
      {children}
    </div>
  );
}

const Settings = () => {
  const { theme: T } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  const [general, setGeneral] = useState({
    societyName: "", address: "", city: "", registrationNumber: "", contactEmail: "", contactPhone: "",
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true, smsAlerts: false, visitorAlerts: true, paymentReminders: true, maintenanceUpdates: true,
  });
  const [security, setSecurity] = useState({
    twoFactorAuth: false, sessionTimeout: "30", passwordExpiry: "90",
  });
  const [billing, setBilling] = useState({
    maintenanceAmount: "", dueDay: "5", lateFeePercent: "2", gstNumber: "",
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingService.getSettings();
      const data = response.data.data || {};
      if (data.general) setGeneral((g) => ({ ...g, ...data.general }));
      if (data.notifications) setNotifications((n) => ({ ...n, ...data.notifications }));
      if (data.security) setSecurity((s) => ({ ...s, ...data.security }));
      if (data.billing) setBilling((b) => ({ ...b, ...data.billing }));
    } catch (err) {
      console.error("Settings Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSettings(); }, []);

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
      await settingService.updateSettings({ general, notifications, security, billing });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save Settings Error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes mgSpin { to { transform: rotate(360deg); } }
        .mg-input:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accentBg} !important; }
        .mg-tab-btn:hover { background: ${T.isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.025)"} !important; }
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
              Settings
            </h1>
            <p style={{ color: T.inkSoft, margin: "6px 0 0", fontSize: 14 }}>
              Configure society details, notifications, and billing preferences
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: saved ? "#1F9D6C" : T.accent,
              color: "#fff", border: "none",
              padding: "11px 18px", borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: saving ? "default" : "pointer",
              opacity: saving ? 0.75 : 1,
              transition: "background .2s",
            }}
          >
            {saved ? <CheckCircle2 size={15} /> : <Save size={15} style={{ animation: saving ? "mgSpin .8s linear infinite" : "none" }} />}
            {saved ? "Saved" : saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "start" }}>
          <div style={{
            background: `linear-gradient(165deg, ${T.surface}, ${T.surface2})`,
            border: `1px solid ${T.border}`,
            borderRadius: 14, padding: "10px", display: "flex",
            flexDirection: "column", gap: 4,
          }}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="mg-tab-btn"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 9, border: "none",
                    background: active ? (T.isDark ? "rgba(110,131,242,.14)" : "rgba(110,131,242,.10)") : "transparent",
                    color: active ? "#818CF8" : T.inkSoft,
                    fontSize: 13, fontWeight: 600, textAlign: "left",
                    cursor: "pointer", fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" style={{ animation: "mgSpin .8s linear infinite" }}>
                  <circle cx="12" cy="12" r="10" stroke={T.accent} strokeWidth="2.5" opacity="0.25" fill="none" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
                <p style={{ color: T.inkSoft, fontSize: 13, marginTop: 12 }}>Loading settings…</p>
              </div>
            ) : (
              <>
                {activeTab === "general" && (
                  <Card title="Society Details" description="Basic information shown across the platform" T={T}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
                      <Field label="Society Name" T={T}>
                        <input className="mg-input" style={inputStyle(T)} value={general.societyName}
                          onChange={(e) => setGeneral({ ...general, societyName: e.target.value })} placeholder={user?.building?.building_name || "NestOS"} />
                      </Field>
                      <Field label="Registration Number" T={T}>
                        <input className="mg-input" style={inputStyle(T)} value={general.registrationNumber}
                          onChange={(e) => setGeneral({ ...general, registrationNumber: e.target.value })} placeholder="MH/NM/CHS/000000" />
                      </Field>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <Field label="Address" T={T}>
                          <input className="mg-input" style={inputStyle(T)} value={general.address}
                            onChange={(e) => setGeneral({ ...general, address: e.target.value })} placeholder="Plot no., Sector, Kharghar" />
                        </Field>
                      </div>
                      <Field label="City" T={T}>
                        <input className="mg-input" style={inputStyle(T)} value={general.city}
                          onChange={(e) => setGeneral({ ...general, city: e.target.value })} placeholder="Navi Mumbai" />
                      </Field>
                      <Field label="Contact Email" T={T}>
                        <input className="mg-input" style={inputStyle(T)} value={general.contactEmail}
                          onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })} placeholder="admin@vedashreechs.in" />
                      </Field>
                      <Field label="Contact Phone" T={T}>
                        <input className="mg-input" style={inputStyle(T)} value={general.contactPhone}
                          onChange={(e) => setGeneral({ ...general, contactPhone: e.target.value })} placeholder="+91 98XXXXXXXX" />
                      </Field>
                    </div>
                  </Card>
                )}

                {activeTab === "notifications" && (
                  <Card title="Notification Preferences" description="Choose how the society office is notified of activity" T={T}>
                    <ToggleRow title="Email Alerts" subtitle="Receive updates via email"
                      checked={notifications.emailAlerts}
                      onChange={(v) => setNotifications({ ...notifications, emailAlerts: v })} T={T} />
                    <ToggleRow title="SMS Alerts" subtitle="Receive updates via SMS"
                      checked={notifications.smsAlerts}
                      onChange={(v) => setNotifications({ ...notifications, smsAlerts: v })} T={T} />
                    <ToggleRow title="Visitor Alerts" subtitle="Notify when a visitor checks in or out"
                      checked={notifications.visitorAlerts}
                      onChange={(v) => setNotifications({ ...notifications, visitorAlerts: v })} T={T} />
                    <ToggleRow title="Payment Reminders" subtitle="Remind residents of pending maintenance dues"
                      checked={notifications.paymentReminders}
                      onChange={(v) => setNotifications({ ...notifications, paymentReminders: v })} T={T} />
                    <div style={{ borderBottom: "none" }}>
                      <ToggleRow title="Maintenance Updates" subtitle="Notify residents of facility maintenance work"
                        checked={notifications.maintenanceUpdates}
                        onChange={(v) => setNotifications({ ...notifications, maintenanceUpdates: v })} T={T} />
                    </div>
                  </Card>
                )}

                {activeTab === "security" && (
                  <Card title="Security" description="Manage authentication and session policies" T={T}>
                    <ToggleRow title="Two-Factor Authentication" subtitle="Require an OTP for admin logins"
                      checked={security.twoFactorAuth}
                      onChange={(v) => setSecurity({ ...security, twoFactorAuth: v })} T={T} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 18px", marginTop: 18 }}>
                      <Field label="Session Timeout (minutes)" T={T}>
                        <input className="mg-input" type="number" style={inputStyle(T)} value={security.sessionTimeout}
                          onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })} />
                      </Field>
                      <Field label="Password Expiry (days)" T={T}>
                        <input className="mg-input" type="number" style={inputStyle(T)} value={security.passwordExpiry}
                          onChange={(e) => setSecurity({ ...security, passwordExpiry: e.target.value })} />
                      </Field>
                    </div>
                  </Card>
                )}

                {activeTab === "billing" && (
                  <Card title="Billing & Maintenance" description="Default maintenance charge configuration" T={T}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
                      <Field label="Monthly Maintenance Amount (₹)" T={T}>
                        <input className="mg-input" type="number" style={inputStyle(T)} value={billing.maintenanceAmount}
                          onChange={(e) => setBilling({ ...billing, maintenanceAmount: e.target.value })} placeholder="3500" />
                      </Field>
                      <Field label="Due Day of Month" T={T}>
                        <input className="mg-input" type="number" style={inputStyle(T)} value={billing.dueDay}
                          onChange={(e) => setBilling({ ...billing, dueDay: e.target.value })} placeholder="5" />
                      </Field>
                      <Field label="Late Fee (%)" T={T}>
                        <input className="mg-input" type="number" style={inputStyle(T)} value={billing.lateFeePercent}
                          onChange={(e) => setBilling({ ...billing, lateFeePercent: e.target.value })} placeholder="2" />
                      </Field>
                      <Field label="GST Number" T={T}>
                        <input className="mg-input" style={inputStyle(T)} value={billing.gstNumber}
                          onChange={(e) => setBilling({ ...billing, gstNumber: e.target.value })} placeholder="27XXXXX0000X1ZX" />
                      </Field>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
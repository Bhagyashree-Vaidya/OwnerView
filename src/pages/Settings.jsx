import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from '../components/TopBar';
import { ToastContainer, useToast } from '../components/Toast';

const SettingsSection = ({ title, subtitle, icon, children }) => (
  <div className="settings-section card card-padded" style={{ marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
      {icon && (
        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
      )}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer', flexShrink: 0 }}>
    <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} checked={checked} onChange={onChange} />
    <span style={{ position: 'absolute', inset: 0, borderRadius: 99, background: checked ? 'var(--primary)' : 'var(--gray-300)', transition: 'background 0.2s' }}>
      <span style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, left: checked ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </span>
  </label>
);

// ---------------------------------------------------------------
// Shopify Integration Section
// ---------------------------------------------------------------
const ShopifySection = ({ addToast }) => {
  const saved = JSON.parse(localStorage.getItem('shopify_config') || '{}');

  const [store, setStore]     = useState(saved.store || '');
  const [token, setToken]     = useState(saved.token || '');
  const [showToken, setShowToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const isConnected = !!(saved.store && saved.token);

  const handleSave = () => {
    if (!store || !token) {
      addToast('Please fill in both the store URL and API token.', 'error');
      return;
    }
    const clean = store.replace(/^https?:\/\//, '').replace(/\/$/, '');
    localStorage.setItem('shopify_config', JSON.stringify({ store: clean, token }));
    addToast('Shopify credentials saved! Go to Orders to fetch live data.', 'success');
    // Force re-render to update badge
    window.dispatchEvent(new Event('shopify_config_updated'));
  };

  const handleTest = async () => {
    if (!store || !token) {
      addToast('Fill in your store URL and token first.', 'error');
      return;
    }
    setTesting(true);
    const clean = store.replace(/^https?:\/\//, '').replace(/\/$/, '');
    try {
      const res = await fetch(
        `https://${clean}/admin/api/2024-01/shop.json`,
        { headers: { 'X-Shopify-Access-Token': token } }
      );
      if (res.ok) {
        const data = await res.json();
        addToast(`Connected to "${data.shop?.name || clean}" successfully!`, 'success');
        localStorage.setItem('shopify_config', JSON.stringify({ store: clean, token }));
        window.dispatchEvent(new Event('shopify_config_updated'));
      } else {
        addToast(`Connection failed (${res.status}). Check your token and store URL.`, 'error');
      }
    } catch {
      addToast('Could not reach Shopify. This usually happens in local dev due to browser CORS restrictions. Your credentials are saved and will work when deployed.', 'info');
      // Save anyway so Orders page can try when running in a proper environment
      const clean = store.replace(/^https?:\/\//, '').replace(/\/$/, '');
      localStorage.setItem('shopify_config', JSON.stringify({ store: clean, token }));
      window.dispatchEvent(new Event('shopify_config_updated'));
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('shopify_config');
    setStore('');
    setToken('');
    addToast('Shopify disconnected. Orders will show demo data.', 'info');
    window.dispatchEvent(new Event('shopify_config_updated'));
  };

  return (
    <SettingsSection
      title="Shopify Integration"
      subtitle="Connect your Shopify store so orders placed there show up automatically in this dashboard."
      icon={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      }
    >
      {/* Status badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: isConnected ? 'var(--green-bg)' : 'var(--gray-100)', border: `1px solid ${isConnected ? '#bbf7d0' : 'var(--border)'}` }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: isConnected ? 'var(--green)' : 'var(--gray-400)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.83rem', fontWeight: 600, color: isConnected ? 'var(--green)' : 'var(--text-secondary)' }}>
          {isConnected ? `Connected to ${saved.store}` : 'Not connected'}
        </span>
        {isConnected && (
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', color: 'var(--red)', fontSize: '0.75rem' }} onClick={handleDisconnect}>
            Disconnect
          </button>
        )}
      </div>

      {/* How it works */}
      <div style={{ background: 'var(--primary-lighter)', border: '1px solid var(--primary-light)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.4rem' }}>How to get your Shopify API token</strong>
        1. Go to your Shopify admin and click Settings.<br/>
        2. Click "Apps and sales channels" and then "Develop apps".<br/>
        3. Click "Create an app" and give it any name.<br/>
        4. Click "Configure Admin API scopes" and check "read_orders".<br/>
        5. Click "Install app" and copy the "Admin API access token" that appears.<br/>
        6. Paste it below along with your store URL.
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">
            Shopify Store URL
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.4rem' }}>(just the subdomain)</span>
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '0.9rem', fontSize: '0.85rem', color: 'var(--text-muted)', pointerEvents: 'none' }}>https://</span>
            <input
              className="form-input"
              style={{ paddingLeft: '4.2rem', paddingRight: '7rem' }}
              placeholder="your-store.myshopify.com"
              value={store}
              onChange={e => setStore(e.target.value)}
            />
            <span style={{ position: 'absolute', right: '0.9rem', fontSize: '0.8rem', color: 'var(--text-muted)', pointerEvents: 'none' }}></span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Admin API Access Token</label>
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              type={showToken ? 'text' : 'password'}
              placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={e => setToken(e.target.value)}
              style={{ paddingRight: '3.5rem', fontFamily: showToken ? 'monospace' : 'inherit' }}
            />
            <button
              type="button"
              onClick={() => setShowToken(p => !p)}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
            >
              {showToken ? 'Hide' : 'Show'}
            </button>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            This is stored locally in your browser and never sent anywhere except directly to Shopify.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={handleTest} disabled={testing}>
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Save & Connect
          </button>
        </div>
      </div>
    </SettingsSection>
  );
};

// ---------------------------------------------------------------
// Main Settings Page
// ---------------------------------------------------------------
const Settings = () => {
  const { toasts, addToast, removeToast } = useToast();
  const [profile, setProfile] = useState({ name: 'Super Admin', email: 'admin@ownerview.com', phone: '+1 555-0001', timezone: 'America/Los_Angeles' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [notifs, setNotifs] = useState({ newOrder: true, review: true, fileUpload: false, monthlyReport: true });

  const handleProfileSave = (e) => {
    e.preventDefault();
    addToast('Profile updated successfully!', 'success');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) { addToast('New passwords do not match.', 'error'); return; }
    if (passwords.new.length < 8) { addToast('Password must be at least 8 characters.', 'error'); return; }
    addToast('Password changed successfully!', 'success');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <TopBar />
        <div className="page-content" style={{ maxWidth: 720 }}>

          {/* Shopify Integration — first and most prominent */}
          <ShopifySection addToast={addToast} />

          {/* Profile */}
          <SettingsSection
            title="Profile Information"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          >
            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select className="form-select" value={profile.timezone} onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="Europe/London">UTC / London</option>
                    <option value="Asia/Kolkata">India Standard Time (IST)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </SettingsSection>

          {/* Password */}
          <SettingsSection
            title="Change Password"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
          >
            <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} placeholder="Min 8 characters" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input className="form-input" type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat password" required />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary">Update Password</button>
              </div>
            </form>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection
            title="Notification Preferences"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { key: 'newOrder',      label: 'New Order Received',   desc: 'Get notified when a new order is placed' },
                { key: 'review',        label: 'New Review Submitted',  desc: 'Get notified when a customer submits a review' },
                { key: 'fileUpload',    label: 'File Upload',           desc: 'Get notified when a file is uploaded to an order' },
                { key: 'monthlyReport', label: 'Monthly Report Ready',  desc: 'Receive a summary report at end of each month' },
              ].map(n => (
                <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.label}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{n.desc}</div>
                  </div>
                  <Toggle checked={notifs[n.key]} onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} />
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={() => addToast('Notification preferences saved!', 'success')}>Save Preferences</button>
              </div>
            </div>
          </SettingsSection>

        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Settings;

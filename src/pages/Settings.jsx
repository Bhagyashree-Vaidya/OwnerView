import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from '../components/TopBar';
import { ToastContainer, useToast } from '../components/Toast';

const SettingsSection = ({ title, children }) => (
  <div className="settings-section card card-padded" style={{ marginBottom: '1.5rem' }}>
    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
      {title}
    </h3>
    {children}
  </div>
);

const Settings = () => {
  const { toasts, addToast, removeToast } = useToast();
  const [profile, setProfile] = useState({ name: 'Super Admin', email: 'admin@corelconvert.com', phone: '+1 555-0001', timezone: 'America/Los_Angeles' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [notifs, setNotifs] = useState({ newOrder: true, review: true, fileUpload: false, monthlyReport: true });

  const handleProfileSave = (e) => {
    e.preventDefault();
    addToast('Profile updated successfully!', 'success');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    if (passwords.new.length < 8) {
      addToast('Password must be at least 8 characters.', 'error');
      return;
    }
    addToast('Password changed successfully!', 'success');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <TopBar />
        <div className="page-content" style={{ maxWidth: 720 }}>

          {/* Profile */}
          <SettingsSection title="Profile Information">
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
          <SettingsSection title="Change Password">
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
          <SettingsSection title="Notification Preferences">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'newOrder',      label: 'New Order Received',          desc: 'Get notified when a new order is placed' },
                { key: 'review',        label: 'New Review Submitted',         desc: 'Get notified when a customer submits a review' },
                { key: 'fileUpload',    label: 'File Upload',                  desc: 'Get notified when a file is uploaded to an order' },
                { key: 'monthlyReport', label: 'Monthly Report Ready',         desc: 'Receive a summary report at end of each month' },
              ].map(n => (
                <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.label}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{n.desc}</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer', flexShrink: 0 }}>
                    <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} checked={notifs[n.key]} onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} />
                    <span style={{
                      position: 'absolute', inset: 0, borderRadius: 99,
                      background: notifs[n.key] ? 'var(--primary)' : 'var(--gray-300)',
                      transition: 'background 0.2s',
                    }}>
                      <span style={{
                        position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff',
                        top: 3, left: notifs[n.key] ? 23 : 3, transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </span>
                  </label>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
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

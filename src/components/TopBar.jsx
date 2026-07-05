import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TopBar.css';

const pageTitles = {
  '/orders': { title: 'Orders', subtitle: 'Manage and track all client orders' },
  '/customers': { title: 'Customers', subtitle: 'View and manage registered customers' },
  '/reviews': { title: 'Reviews', subtitle: 'Monitor client feedback and ratings' },
  '/working-files': { title: 'Working Files', subtitle: 'Track project files and deliverables' },
  '/settings': { title: 'Settings', subtitle: 'Configure your account preferences' },
  '/profile': { title: 'Profile', subtitle: 'Your admin profile and details' },
};

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const page = pageTitles[location.pathname] || { title: 'Dashboard', subtitle: '' };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const notifications = [
    { id: 1, text: 'New order #ORD-089 received', time: '2 min ago', unread: true },
    { id: 2, text: 'Customer review pending approval', time: '15 min ago', unread: true },
    { id: 3, text: 'File upload completed for #ORD-081', time: '1 hr ago', unread: false },
    { id: 4, text: 'Monthly report is ready', time: '3 hr ago', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="topbar">
      <div className="topbar__left">
        <div className="topbar__title">{page.title}</div>
        <div className="topbar__subtitle">{page.subtitle}</div>
      </div>

      <div className="topbar__right">
        {/* Notification Bell */}
        <div className="topbar__notif-wrap" ref={notifRef}>
          <button className="topbar__icon-btn" onClick={() => setNotifOpen(p => !p)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && <span className="topbar__notif-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="topbar__dropdown notif-dropdown">
              <div className="notif-dropdown__header">
                <span>Notifications</span>
                <span className="badge badge-purple">{unreadCount} new</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`notif-item ${n.unread ? 'notif-item--unread' : ''}`}>
                  <div className="notif-item__dot" />
                  <div>
                    <div className="notif-item__text">{n.text}</div>
                    <div className="notif-item__time">{n.time}</div>
                  </div>
                </div>
              ))}
              <button className="notif-dropdown__footer">View all notifications</button>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="topbar__profile-wrap" ref={dropdownRef}>
          <button className="topbar__profile-btn" onClick={() => setDropdownOpen(p => !p)}>
            <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>SA</div>
            <div className="topbar__profile-info">
              <span className="topbar__profile-name">Super Admin</span>
              <span className="topbar__profile-role">Administrator</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="topbar__dropdown profile-dropdown">
              <button className="profile-dropdown__item" onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                View Profile
              </button>
              <button className="profile-dropdown__item" onClick={() => { navigate('/settings'); setDropdownOpen(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </svg>
                Settings
              </button>
              <div className="profile-dropdown__divider" />
              <button className="profile-dropdown__item profile-dropdown__item--danger" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;

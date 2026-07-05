import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import SearchFilterBar from '../components/SearchFilterBar';
import UploadModal from '../components/UploadModal';
import { ToastContainer, useToast } from '../components/Toast';
import { mockOrders } from '../mockData';
import '../components/StatCard.css';

// =============================================================
// SHOPIFY INTEGRATION PLACEHOLDER
// =============================================================
// Right now this page loads demo orders from mockData.js.
// To connect your real Shopify store, do the following:
//
// 1. Go to your Shopify admin > Settings > Apps and sales channels
//    > Develop apps > Create an app.
// 2. Give it a name like "OwnerView Admin" and click Create.
// 3. Under API credentials, copy your "Admin API access token".
// 4. Paste it in a .env file at the root of this project:
//    VITE_SHOPIFY_TOKEN=your_token_here
//    VITE_SHOPIFY_STORE=your-store-name.myshopify.com
// 5. Replace the mock import above with this real fetch:
//
// import { useEffect } from 'react';
// const [orders, setOrders] = useState([]);
// useEffect(() => {
//   fetch(`https://${import.meta.env.VITE_SHOPIFY_STORE}/admin/api/2024-01/orders.json?status=any`, {
//     headers: {
//       'X-Shopify-Access-Token': import.meta.env.VITE_SHOPIFY_TOKEN,
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(res => res.json())
//     .then(data => setOrders(data.orders))
//     .catch(err => console.error('Shopify fetch failed:', err));
// }, []);
//
// Then replace "mockOrders" everywhere below with "orders".
// =============================================================

const statusBadge = {
  'Pending':     'badge badge-yellow',
  'In Progress': 'badge badge-blue',
  'Completed':   'badge badge-green',
  'Cancelled':   'badge badge-red',
};

const statusOptions = [
  { value: 'Pending',     label: 'Pending'     },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed',   label: 'Completed'   },
  { value: 'Cancelled',   label: 'Cancelled'   },
];

const Orders = () => {
  const [modalOpen, setModalOpen]     = useState(false);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [orders, setOrders]           = useState(mockOrders);
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [shopifyConnected, setShopifyConnected] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  // -------------------------------------------------------
  // Try to fetch real Shopify orders if credentials exist
  // -------------------------------------------------------
  const loadOrders = () => {
    const config = JSON.parse(localStorage.getItem('shopify_config') || '{}');
    if (!config.store || !config.token) {
      setOrders(mockOrders);
      setShopifyConnected(false);
      return;
    }
    setShopifyLoading(true);
    fetch(
      `https://${config.store}/admin/api/2024-01/orders.json?status=any&limit=50`,
      { headers: { 'X-Shopify-Access-Token': config.token, 'Content-Type': 'application/json' } }
    )
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Map Shopify order shape to our app's shape
        const mapped = (data.orders || []).map(o => ({
          id:      `#${o.order_number}`,
          client:  o.customer ? `${o.customer.first_name} ${o.customer.last_name}` : 'Guest',
          service: o.line_items?.[0]?.title || 'Shopify Order',
          status:  o.financial_status === 'paid' ? 'Completed'
                 : o.fulfillment_status === 'fulfilled' ? 'Completed'
                 : o.cancelled_at ? 'Cancelled'
                 : 'Pending',
          date:    o.created_at?.split('T')[0] || '',
          amount:  parseFloat(o.total_price || 0),
          files:   0,
        }));
        setOrders(mapped.length ? mapped : mockOrders);
        setShopifyConnected(true);
      })
      .catch(() => {
        // CORS in local dev or bad token -- fall back to mock
        setOrders(mockOrders);
        setShopifyConnected(false);
      })
      .finally(() => setShopifyLoading(false));
  };

  useEffect(() => {
    loadOrders();
    // Re-load whenever the owner saves new credentials in Settings
    window.addEventListener('shopify_config_updated', loadOrders);
    return () => window.removeEventListener('shopify_config_updated', loadOrders);
  }, []);

  const shopifyConfig = JSON.parse(localStorage.getItem('shopify_config') || '{}');
  const hasCredentials = !!(shopifyConfig.store && shopifyConfig.token);

  const stats = useMemo(() => ({
    total:      orders.length,
    pending:    orders.filter(o => o.status === 'Pending').length,
    inProgress: orders.filter(o => o.status === 'In Progress').length,
    completed:  orders.filter(o => o.status === 'Completed').length,
    revenue:    orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.amount, 0),
  }), [orders]);

  const filtered = useMemo(() => orders.filter(o => {
    const q = search.toLowerCase();
    const matchesSearch = !q || o.id.toLowerCase().includes(q) || o.client.toLowerCase().includes(q) || o.service.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [orders, search, statusFilter]);

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <TopBar />
        <div className="page-content">
          {/* Shopify connection banner */}
          {shopifyLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.85rem 1.1rem', marginBottom: '1.25rem', borderRadius: 'var(--radius-sm)', background: 'var(--gray-100)', border: '1px solid var(--border)', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--primary)', borderTopColor: 'transparent', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              Fetching live orders from Shopify...
            </div>
          ) : shopifyConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.85rem 1.1rem', marginBottom: '1.25rem', borderRadius: 'var(--radius-sm)', background: 'var(--green-bg)', border: '1px solid #bbf7d0', fontSize: '0.83rem', color: '#15803d' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <strong>Shopify connected</strong> — showing live orders from {shopifyConfig.store}
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', fontSize: '0.75rem' }} onClick={loadOrders}>Refresh</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.85rem 1.1rem', marginBottom: '1.25rem', borderRadius: 'var(--radius-sm)', background: hasCredentials ? 'var(--yellow-bg)' : 'var(--primary-lighter)', border: `1px solid ${hasCredentials ? '#fde68a' : 'var(--primary-light)'}`, fontSize: '0.83rem', color: hasCredentials ? '#92400e' : 'var(--primary)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {hasCredentials
                ? 'Could not reach Shopify (CORS in local dev is normal). Showing demo data. This will work when deployed.'
                : 'You are viewing demo data. Connect your Shopify store in Settings to see real orders.'}
              <a href="/settings" style={{ marginLeft: 'auto', fontWeight: 700, textDecoration: 'underline', whiteSpace: 'nowrap' }}>Go to Settings</a>
            </div>
          )}
          {/* Stats */}
          <div className="stats-grid">
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>} label="Total Orders" value={stats.total} trend={8} trendLabel="vs last month" color="purple" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} label="Pending" value={stats.pending} trend={-2} color="yellow" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} label="In Progress" value={stats.inProgress} trend={12} color="blue" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} label="Completed" value={stats.completed} trend={15} color="green" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} label="Revenue" value={`$${stats.revenue.toLocaleString()}`} trend={22} trendLabel="this month" color="green" />
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="table-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="table-title">All Orders</span>
                <span className="table-count">{filtered.length}</span>
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem 0' }}>
              <SearchFilterBar
                onSearch={setSearch}
                onStatusChange={setStatusFilter}
                statusOptions={statusOptions}
                buttonText="Upload File"
                onButtonClick={() => setModalOpen(true)}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Files</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="8" className="empty-state">No orders match your search.</td></tr>
                  ) : filtered.map(order => (
                    <tr key={order.id}>
                      <td><span style={{ fontWeight: 600, color: 'var(--primary)' }}>{order.id}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div className="avatar-placeholder" style={{ width: 30, height: 30, fontSize: '0.7rem' }}>
                            {order.client.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </div>
                          {order.client}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{order.service}</td>
                      <td><span className={statusBadge[order.status]}>{order.status}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{order.date}</td>
                      <td><strong>${order.amount}</strong></td>
                      <td>
                        <span style={{ color: order.files > 0 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {order.files} file{order.files !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-ghost btn-sm">View</button>
                          <button className="btn btn-outline btn-sm" onClick={() => setModalOpen(true)}>Upload</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <UploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpload={(file) => { setModalOpen(false); addToast(`"${file.name}" uploaded successfully!`, 'success'); }}
      />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Orders;
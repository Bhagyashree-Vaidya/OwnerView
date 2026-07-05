import React, { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import SearchFilterBar from '../components/SearchFilterBar';
import UploadModal from '../components/UploadModal';
import { ToastContainer, useToast } from '../components/Toast';
import { mockOrders } from '../mockData';
import '../components/StatCard.css';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  const stats = useMemo(() => ({
    total:      mockOrders.length,
    pending:    mockOrders.filter(o => o.status === 'Pending').length,
    inProgress: mockOrders.filter(o => o.status === 'In Progress').length,
    completed:  mockOrders.filter(o => o.status === 'Completed').length,
    revenue:    mockOrders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.amount, 0),
  }), []);

  const filtered = useMemo(() => mockOrders.filter(o => {
    const q = search.toLowerCase();
    const matchesSearch = !q || o.id.toLowerCase().includes(q) || o.client.toLowerCase().includes(q) || o.service.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [search, statusFilter]);

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <TopBar />
        <div className="page-content">
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
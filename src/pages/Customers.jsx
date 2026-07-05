import React, { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import SearchFilterBar from '../components/SearchFilterBar';
import { ToastContainer, useToast } from '../components/Toast';
import { mockCustomers } from '../mockData';
import '../components/StatCard.css';

const statusBadge = {
  'Active':    'badge badge-green',
  'Inactive':  'badge badge-gray',
  'Suspended': 'badge badge-red',
};

const statusOptions = [
  { value: 'Active',    label: 'Active'    },
  { value: 'Inactive',  label: 'Inactive'  },
  { value: 'Suspended', label: 'Suspended' },
];

const AddCustomerModal = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'Active' });
  if (!open) return null;
  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const submit = e => {
    e.preventDefault();
    onAdd(form);
    setForm({ name: '', email: '', phone: '', status: 'Active' });
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-box__header">
          <div><h2 className="modal-box__title">Add Customer</h2><p className="modal-box__subtitle">Create a new customer account</p></div>
          <button className="modal-box__close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-box__body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="e.g. Jane Doe" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="jane@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handle} placeholder="+1 555-0100" />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handle}>
                <option>Active</option><option>Inactive</option><option>Suspended</option>
              </select>
            </div>
          </div>
          <div className="modal-box__footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Customer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Customers = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const stats = useMemo(() => ({
    total:    customers.length,
    active:   customers.filter(c => c.status === 'Active').length,
    inactive: customers.filter(c => c.status === 'Inactive').length,
    suspended:customers.filter(c => c.status === 'Suspended').length,
  }), [customers]);

  const filtered = useMemo(() => customers.filter(c => {
    const q = search.toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [customers, search, statusFilter]);

  const handleAdd = (form) => {
    const newCustomer = {
      id: `USR-${String(customers.length + 1).padStart(3, '0')}`,
      ...form,
      orders: 0,
      joined: new Date().toISOString().split('T')[0],
      spend: 0,
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setModalOpen(false);
    addToast(`${form.name} added successfully!`, 'success');
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <TopBar />
        <div className="page-content">
          <div className="stats-grid">
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} label="Total Customers" value={stats.total} trend={5} color="purple" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} label="Active" value={stats.active} trend={3} color="green" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>} label="Inactive" value={stats.inactive} trend={0} color="yellow" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>} label="Suspended" value={stats.suspended} trend={-1} color="red" />
          </div>

          <div className="table-container">
            <div className="table-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="table-title">All Customers</span>
                <span className="table-count">{filtered.length}</span>
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem 0' }}>
              <SearchFilterBar
                onSearch={setSearch}
                onStatusChange={setStatusFilter}
                statusOptions={statusOptions}
                buttonText="Add Customer"
                onButtonClick={() => setModalOpen(true)}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Orders</th>
                    <th>Total Spend</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="8" className="empty-state">No customers match your search.</td></tr>
                  ) : filtered.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                            {c.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.email}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.phone}</td>
                      <td><strong>{c.orders}</strong></td>
                      <td><strong style={{ color: 'var(--green)' }}>${c.spend.toLocaleString()}</strong></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.joined}</td>
                      <td><span className={statusBadge[c.status]}>{c.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-ghost btn-sm">View</button>
                          <button className="btn btn-outline btn-sm">Edit</button>
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

      <AddCustomerModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Customers;
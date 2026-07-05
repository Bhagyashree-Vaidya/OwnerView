import React, { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import SearchFilterBar from '../components/SearchFilterBar';
import { ToastContainer, useToast } from '../components/Toast';
import { mockReviews } from '../mockData';
import '../components/StatCard.css';

const statusBadge = {
  'Published': 'badge badge-green',
  'Flagged':   'badge badge-red',
  'Hidden':    'badge badge-gray',
};

const statusOptions = [
  { value: 'Published', label: 'Published' },
  { value: 'Flagged',   label: 'Flagged'   },
  { value: 'Hidden',    label: 'Hidden'    },
];

const Stars = ({ rating }) => (
  <div className="stars">
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= rating ? '#fbbf24' : '#e5e7eb' }}>★</span>
    ))}
  </div>
);

const Reviews = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  const stats = useMemo(() => {
    const published = reviews.filter(r => r.status === 'Published');
    const avg = published.length
      ? (published.reduce((s, r) => s + r.rating, 0) / published.length).toFixed(1)
      : '0.0';
    return {
      total:     reviews.length,
      avg,
      fiveStar:  reviews.filter(r => r.rating === 5).length,
      flagged:   reviews.filter(r => r.status === 'Flagged').length,
      published: published.length,
    };
  }, [reviews]);

  const filtered = useMemo(() => reviews.filter(r => {
    const q = search.toLowerCase();
    const matchesSearch = !q || r.reviewer.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [reviews, search, statusFilter]);

  const updateStatus = (id, newStatus) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    addToast(`Review ${newStatus.toLowerCase()} successfully.`, newStatus === 'Flagged' ? 'error' : 'success');
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <TopBar />
        <div className="page-content">
          <div className="stats-grid">
            <StatCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
              label="Avg Rating" value={`${stats.avg} ★`} trend={4} color="yellow"
            />
            <StatCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
              label="Total Reviews" value={stats.total} trend={10} color="purple"
            />
            <StatCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
              label="Published" value={stats.published} trend={7} color="green"
            />
            <StatCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
              label="Flagged" value={stats.flagged} trend={-1} color="red"
            />
          </div>

          <div className="table-container">
            <div className="table-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="table-title">All Reviews</span>
                <span className="table-count">{filtered.length}</span>
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem 0' }}>
              <SearchFilterBar
                onSearch={setSearch}
                onStatusChange={setStatusFilter}
                statusOptions={statusOptions}
                buttonText="Export"
                onButtonClick={() => addToast('Reviews exported!', 'info')}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reviewer</th>
                    <th>Order</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="7" className="empty-state">No reviews match your search.</td></tr>
                  ) : filtered.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: '0.72rem' }}>
                            {r.reviewer.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.reviewer}</span>
                        </div>
                      </td>
                      <td><span style={{ fontWeight: 600, color: 'var(--primary)' }}>{r.orderId}</span></td>
                      <td><Stars rating={r.rating} /></td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 260 }}>
                          {r.comment}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.date}</td>
                      <td><span className={statusBadge[r.status]}>{r.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {r.status !== 'Published' && (
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--green)' }} onClick={() => updateStatus(r.id, 'Published')}>Approve</button>
                          )}
                          {r.status !== 'Flagged' && (
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => updateStatus(r.id, 'Flagged')}>Flag</button>
                          )}
                          {r.status !== 'Hidden' && (
                            <button className="btn btn-ghost btn-sm" onClick={() => updateStatus(r.id, 'Hidden')}>Hide</button>
                          )}
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
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Reviews;
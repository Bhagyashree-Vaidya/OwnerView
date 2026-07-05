import React, { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import SearchFilterBar from '../components/SearchFilterBar';
import UploadModal from '../components/UploadModal';
import { ToastContainer, useToast } from '../components/Toast';
import { mockFiles } from '../mockData';
import '../components/StatCard.css';

const statusBadge = {
  'Pending':  'badge badge-yellow',
  'Approved': 'badge badge-green',
  'Rejected': 'badge badge-red',
};

const typeBadge = (type) => {
  const map = { PDF: 'badge-red', ZIP: 'badge-orange', DOCX: 'badge-blue', MP4: 'badge-purple', PPTX: 'badge-yellow', FIG: 'badge-purple', XLSX: 'badge-green' };
  return `badge ${map[type] || 'badge-gray'}`;
};

const statusOptions = [
  { value: 'Pending',  label: 'Pending'  },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

const WorkingFiles = () => {
  const [files, setFiles] = useState(mockFiles);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const stats = useMemo(() => ({
    total:    files.length,
    pending:  files.filter(f => f.status === 'Pending').length,
    approved: files.filter(f => f.status === 'Approved').length,
    rejected: files.filter(f => f.status === 'Rejected').length,
  }), [files]);

  const filtered = useMemo(() => files.filter(f => {
    const q = search.toLowerCase();
    const matchesSearch = !q || f.name.toLowerCase().includes(q) || f.orderId.toLowerCase().includes(q) || f.uploadedBy.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [files, search, statusFilter]);

  const updateStatus = (id, newStatus) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    addToast(`File ${newStatus.toLowerCase()}.`, newStatus === 'Rejected' ? 'error' : 'success');
  };

  const handleUpload = (file) => {
    const newFile = {
      id: `FILE-${String(files.length + 1).padStart(3, '0')}`,
      name: file.name,
      orderId: 'ORD-NEW',
      uploadedBy: 'Admin',
      type: file.name.split('.').pop().toUpperCase(),
      size: file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setFiles(prev => [newFile, ...prev]);
    setModalOpen(false);
    addToast(`"${file.name}" uploaded and pending review.`, 'success');
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <TopBar />
        <div className="page-content">
          <div className="stats-grid">
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>} label="Total Files" value={stats.total} trend={6} color="purple" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} label="Pending Review" value={stats.pending} trend={-2} color="yellow" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} label="Approved" value={stats.approved} trend={8} color="green" />
            <StatCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>} label="Rejected" value={stats.rejected} trend={0} color="red" />
          </div>

          <div className="table-container">
            <div className="table-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="table-title">All Files</span>
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
                    <th>File Name</th>
                    <th>Order ID</th>
                    <th>Uploaded By</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="8" className="empty-state">No files match your search.</td></tr>
                  ) : filtered.map(f => (
                    <tr key={f.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            {f.type}
                          </div>
                          <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{f.name}</span>
                        </div>
                      </td>
                      <td><span style={{ fontWeight: 600, color: 'var(--primary)' }}>{f.orderId}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{f.uploadedBy}</td>
                      <td><span className={typeBadge(f.type)}>{f.type}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{f.size}</td>
                      <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{f.date}</td>
                      <td><span className={statusBadge[f.status]}>{f.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-ghost btn-sm">↓ Download</button>
                          {f.status === 'Pending' && (
                            <>
                              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--green)' }} onClick={() => updateStatus(f.id, 'Approved')}>Approve</button>
                              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => updateStatus(f.id, 'Rejected')}>Reject</button>
                            </>
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

      <UploadModal open={modalOpen} onClose={() => setModalOpen(false)} onUpload={handleUpload} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default WorkingFiles;
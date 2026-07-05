import React, { useState, useRef } from 'react';
import './UploadModal.css';

const UploadModal = ({ open, onClose, onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef();

  if (!open) return null;

  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setDone(false);
    setProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploading(true);
    setProgress(0);
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setDone(true);
          onUpload && onUpload(selectedFile);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploading(false);
    setProgress(0);
    setDone(false);
    onClose();
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return '📄';
    if (['jpg','jpeg','png','gif','webp'].includes(ext)) return '🖼️';
    if (['xlsx','xls','csv'].includes(ext)) return '📊';
    if (['doc','docx'].includes(ext)) return '📝';
    if (['zip','rar'].includes(ext)) return '🗜️';
    return '📁';
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-box">
        {/* Header */}
        <div className="modal-box__header">
          <div>
            <h2 className="modal-box__title">Upload File</h2>
            <p className="modal-box__subtitle">Attach files to this order or project</p>
          </div>
          <button className="modal-box__close" onClick={handleClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-box__body">
          {done ? (
            <div className="upload-success">
              <div className="upload-success__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p className="upload-success__title">Upload Complete!</p>
              <p className="upload-success__file">{selectedFile.name}</p>
            </div>
          ) : (
            <>
              {/* Drop zone */}
              <div
                className={`upload-zone ${dragging ? 'upload-zone--active' : ''} ${selectedFile ? 'upload-zone--has-file' : ''}`}
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !selectedFile && fileInputRef.current.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />

                {selectedFile ? (
                  <div className="upload-preview">
                    <span className="upload-preview__icon">{getFileIcon(selectedFile.name)}</span>
                    <div className="upload-preview__info">
                      <span className="upload-preview__name">{selectedFile.name}</span>
                      <span className="upload-preview__size">{formatSize(selectedFile.size)}</span>
                    </div>
                    <button className="upload-preview__remove" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setProgress(0); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="upload-zone__empty">
                    <div className="upload-zone__icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <p className="upload-zone__text">
                      <strong>Drag & drop</strong> your file here
                    </p>
                    <p className="upload-zone__hint">or <span>browse to upload</span></p>
                    <p className="upload-zone__types">PDF, DOCX, XLSX, PNG, JPG — up to 10MB</p>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {uploading && (
                <div className="upload-progress">
                  <div className="upload-progress__bar">
                    <div className="upload-progress__fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                  <span className="upload-progress__pct">{Math.min(Math.round(progress), 100)}%</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="modal-box__footer">
          <button className="btn btn-ghost" onClick={handleClose}>
            {done ? 'Close' : 'Cancel'}
          </button>
          {!done && (
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? 'Uploading…' : 'Upload File'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
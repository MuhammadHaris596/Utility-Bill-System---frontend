import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Upload, Plus, FileText, Calendar, Hash, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import ToggleSwitch from './ToggleSwitch';

const NewBillModal = ({ isOpen, onClose, onBillCreated }) => {
  const [formData, setFormData] = useState({
    billId: '',
    billName: '',
    userId: '',
    phoneNumber: '',
    // Set entry date to current date in Pakistan timezone (Asia/Karachi)
    billEntryDate: new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Karachi' }).format(new Date()),
    amount: '',
    comment: '',
  });

  const [notify, setNotify] = useState(false);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNotify(false);
      setFormData({
        billId: '',
        billName: '',
        userId: '',
        phoneNumber: '',
        billEntryDate: new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Karachi' }).format(new Date()),
        amount: '',
        comment: '',
      });
      setFiles([]);
      setPreviews([]);
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      userId: suggestion.userId || prev.userId,
      phoneNumber: suggestion.phoneNumber || prev.phoneNumber,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError('');
    setFiles([...files, ...selectedFiles]);

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('billId', formData.billId);
      data.append('billName', formData.billName);
      data.append('username', formData.userId || formData.billName || 'User');
      data.append('userId', formData.userId);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('billEntryDate', formData.billEntryDate);
      data.append('billDueDate', formData.billEntryDate);
      data.append('amount', formData.amount);
      data.append('comment', formData.comment);
      data.append('notify', notify ? 'true' : 'false');

      files.forEach((file) => {
        data.append('images', file);
      });

      const token = localStorage.getItem('adminToken');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.post('http://localhost:5000/api/bills', data, {
        headers,
      });

      setSuccess(true);
      window.dispatchEvent(new CustomEvent('bill-created', { detail: response.data }));
      setTimeout(() => {
        setSuccess(false);
        if (onBillCreated) onBillCreated(response.data);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bill');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 99999,
      padding: 'clamp(0.5rem, 2vw, 1.5rem) clamp(0.5rem, 2vw, 1rem)',
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color-active)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '540px',
        maxHeight: 'calc(100vh - 2rem)',
        overflowY: 'auto',
        boxShadow: 'var(--glass-shadow)',
        padding: 'clamp(1rem, 3.5vw, 1.5rem)',
        position: 'relative',
        margin: 'auto 0'
      }}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.85rem',
            right: '0.85rem',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            color: 'var(--text-muted)',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1rem', paddingRight: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.35rem)', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <Plus color="var(--accent-cyan)" size={20} />
              Create New Utility Bill
            </h2>
            <ToggleSwitch
              label="Add to Notification"
              checked={notify}
              onChange={setNotify}
            />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Fill in the bill metadata. Autocomplete suggests existing users when typing User ID or Phone Number.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: 'var(--accent-rose)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: 'var(--accent-emerald)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle size={18} />
            Bill created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Row 1: Bill ID & Bill Name */}
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 'min(200px, 100%)' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Bill No (Duplicates allowed) <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <input
                type="text"
                name="billId"
                value={formData.billId}
                onChange={handleChange}
                placeholder="e.g. ELEC-2026-001"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 'min(200px, 100%)' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Bill Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <input
                type="text"
                name="billName"
                value={formData.billName}
                onChange={handleChange}
                placeholder="e.g. Electricity - Store #4"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Row 2: User ID (Autocomplete) & Phone Number (Autocomplete) */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <AutocompleteInput
              label="User ID"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              onSelectSuggestion={handleSelectSuggestion}
              field="userId"
              placeholder="Type User ID (e.g. USR-102)"
            />

            <AutocompleteInput
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onSelectSuggestion={handleSelectSuggestion}
              field="phone"
              placeholder="Type Phone (e.g. +92 300 1234567)"
            />
          </div>



          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Bill Price / Amount (PKR) <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 15450"
                required
                min="0"
                step="any"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Upload Images Section */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Attach Bill Images
            </label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              textAlign: 'center',
              background: 'rgba(15, 23, 42, 0.3)',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <Upload size={20} color="var(--accent-cyan)" style={{ marginBottom: '0.25rem' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>
                Click or drag images to upload
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                PNG, JPG, WEBP, PDF up to 10MB each
              </div>
            </div>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                {previews.map((src, index) => (
                  <div key={index} style={{ position: 'relative', width: '52px', height: '52px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom One-Line Comment Section */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              One-Line Comment / Notes (Bottom)
            </label>
            <input
              type="text"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="e.g. Paid via online bank transfer by Store Manager on 1st Sept"
              maxLength={250}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>

          {/* Action Buttons - Centered and Vertically Stacked */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '1.5rem',
            width: '100%'
          }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                maxWidth: '320px',
                height: '46px',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                opacity: submitting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
            >
              {submitting ? 'Saving...' : 'Save Bill'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100%',
                maxWidth: '320px',
                height: '46px',
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = 'var(--text-main)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBillModal;

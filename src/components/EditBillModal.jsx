import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Upload, Edit, CheckCircle, AlertCircle, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import ToggleSwitch from './ToggleSwitch';

const EditBillModal = ({ bill, isOpen, onClose, onBillUpdated }) => {
  const [formData, setFormData] = useState({
    billId: '',
    billName: '',
    username: '',
    userId: '',
    phoneNumber: '',
    billEntryDate: '',
    billDueDate: '',
    amount: '',
    comment: '',
  });

  const [notify, setNotify] = useState(() => Boolean(bill?.notify));

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const allImages = [...existingImages, ...newPreviews];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, allImages.length]);

  useEffect(() => {
    if (bill && isOpen) {
      setFormData({
        billId: bill.billId || '',
        billName: bill.billName || '',
        username: bill.username || '',
        userId: bill.userId || '',
        phoneNumber: bill.phoneNumber || '',
        billEntryDate: bill.billEntryDate ? new Date(bill.billEntryDate).toISOString().split('T')[0] : '',
        billDueDate: bill.billDueDate ? new Date(bill.billDueDate).toISOString().split('T')[0] : '',
        amount: bill.amount !== undefined ? bill.amount : '',
        comment: bill.comment || '',
      });
      setNotify(Boolean(bill.notify));
      setExistingImages(bill.images || []);
      setNewFiles([]);
      setNewPreviews([]);
      setError('');
      setSuccess(false);
    }
  }, [bill, isOpen]);

  if (!isOpen || !bill) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      username: suggestion.username || prev.username,
      userId: suggestion.userId || prev.userId,
      phoneNumber: suggestion.phoneNumber || prev.phoneNumber,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError('');
    setNewFiles([...newFiles, ...selectedFiles]);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setNewPreviews([...newPreviews, ...previews]);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('billId', formData.billId);
      data.append('billName', formData.billName);
      data.append('username', formData.username);
      // Preserve existing userId for updates; New bills will have it generated server‑side
      if (formData.userId) {
        data.append('userId', formData.userId);
      }
      data.append('phoneNumber', formData.phoneNumber);
      data.append('billEntryDate', formData.billEntryDate);
      data.append('billDueDate', formData.billDueDate);
      data.append('amount', formData.amount);
      data.append('comment', formData.comment);
      data.append('notify', notify ? 'true' : 'false');

      existingImages.forEach((img) => { 
        data.append('existingImages', img);
      });

      newFiles.forEach((file) => {
        data.append('images', file);
      });

      const token = localStorage.getItem('adminToken');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.put(`https://utility-bill-system-backend.vercel.app/api/bills/${bill._id}`, data, {
        headers,
      });

      const wasNewlyEnabled = !Boolean(bill.notify) && Boolean(notify);
      setSuccess(true);
      window.dispatchEvent(
        new CustomEvent('bill-updated', {
          detail: { bill: response.data, wasNewlyEnabled },
        })
      );
      setTimeout(() => {
        setSuccess(false);
        if (onBillUpdated) onBillUpdated(response.data);
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bill');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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
        maxWidth: '650px',
        maxHeight: 'calc(100vh - 2rem)',
        overflowY: 'auto',
        boxShadow: 'var(--glass-shadow)',
        padding: 'clamp(1rem, 3.5vw, 2rem)',
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
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Edit color="var(--primary)" size={24} />
              Update Bill Record
            </h2>
            <ToggleSwitch
              label="Add to Notification"
              checked={notify}
              onChange={setNotify}
            />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Modify any field of this utility bill entry and click Save Changes.
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
            Bill record updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Row 1: Bill ID & Bill Name */}
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 'min(200px, 100%)' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Bill No <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <input
                type="text"
                name="billId"
                value={formData.billId}
                onChange={handleChange}
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
                Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <input
                type="text"
                name="billName"
                value={formData.billName}
                onChange={handleChange}
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

          {/* Row 2: User ID & Phone Number */}
          {/* Row 2: Phone Number */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <AutocompleteInput
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onSelectSuggestion={handleSelectSuggestion}
              field="phone"
              placeholder="Type Phone Number"
            />
          </div>


          
         

          {/* Manage Images */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Manage Attached Images
            </label>

            {/* Existing Images list */}
            {existingImages.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Current Images (click to expand):</div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {existingImages.map((src, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      style={{
                        position: 'relative',
                        width: '72px',
                        height: '72px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, border-color 0.2s',
                        background: 'rgba(15, 23, 42, 0.8)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                      }}
                      title="Click to view full photo"
                    >
                      <img src={src} alt="existing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveExistingImage(idx);
                        }}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          background: 'rgba(244,63,94,0.9)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 5
                        }}
                        title="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add new files drop area */}
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
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
              <Upload size={22} color="var(--accent-cyan)" style={{ marginBottom: '0.3rem' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>
                Add more images
              </div>
            </div>

            {/* New File Previews */}
            {newPreviews.length > 0 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {newPreviews.map((src, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(existingImages.length + index)}
                    style={{
                      position: 'relative',
                      width: '72px',
                      height: '72px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid var(--primary)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, border-color 0.2s',
                      background: 'rgba(15, 23, 42, 0.8)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }}
                    title="Click to view full photo"
                  >
                    <img src={src} alt="new preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveNewFile(index);
                      }}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 5
                      }}
                      title="Remove preview"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom One-Line Comment Section */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Comment / Notes (Bottom)
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
                  if (!e.shiftKey && !isMobile) {
                    e.preventDefault();
                    if (e.target.form) {
                      e.target.form.requestSubmit();
                    }
                  }
                  // Allow newline for Shift+Enter or on mobile keyboards
                }
              }}
              placeholder="e.g. Paid via online transfer (Shift + Enter for new line)"
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontWeight: '700',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* Expanded Interactive Lightbox Slider with Next/Prev Arrow Buttons */}
    {selectedImageIndex !== null && allImages.length > 0 && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 15, 0.95)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100005,
          padding: '1.5rem'
        }}
        onClick={() => setSelectedImageIndex(null)}
      >
        {/* Header Bar in Lightbox */}
        <div
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '2rem',
            right: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff',
            zIndex: 100010
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: '0.95rem', fontWeight: '700', background: 'rgba(255, 255, 255, 0.1)', padding: '0.4rem 1rem', borderRadius: '20px' }}>
            Document {selectedImageIndex + 1} of {allImages.length}
          </div>

          <button
            type="button"
            onClick={() => setSelectedImageIndex(null)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244, 63, 94, 0.8)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
            title="Close Lightbox (Esc)"
          >
            <X size={22} />
          </button>
        </div>

        {/* LEFT ARROW BUTTON */}
        {allImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
            }}
            style={{
              position: 'absolute',
              left: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.2s',
              zIndex: 100010
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            title="Previous Image (Left Arrow)"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* MAIN ENLARGED IMAGE */}
        <div
          style={{
            maxWidth: '85vw',
            maxHeight: '78vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={allImages[selectedImageIndex]}
            alt={`Document ${selectedImageIndex + 1}`}
            style={{
              maxWidth: '85vw',
              maxHeight: '78vh',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
        </div>

        {/* RIGHT ARROW BUTTON */}
        {allImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
            }}
            style={{
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.2s',
              zIndex: 100010
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            title="Next Image (Right Arrow)"
          >
            <ChevronRight size={32} />
          </button>
        )}

        {/* Bottom Thumbnails Strip */}
        {allImages.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              display: 'flex',
              gap: '0.75rem',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '0.5rem 1rem',
              borderRadius: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 100010,
              maxWidth: '90vw',
              overflowX: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx + 1}`}
                onClick={() => setSelectedImageIndex(idx)}
                style={{
                  width: '44px',
                  height: '44px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: idx === selectedImageIndex ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  opacity: idx === selectedImageIndex ? 1 : 0.6,
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    )}
  </>
);
};

export default EditBillModal;

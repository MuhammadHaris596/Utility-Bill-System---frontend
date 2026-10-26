import React, { useState, useEffect } from 'react';
import { X, Printer, Edit, Trash2, Calendar, User, Phone, Tag, Hash, FileText, CheckCircle, ExternalLink, Image as ImageIcon, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import PrintBillModal from './PrintBillModal';
import { formatDatePK, getRecordNumber } from '../utils/billUtils';

const ViewBillModal = ({ bill, onClose, onEdit, onDelete, showEdit = true, showDelete = true }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!bill) return null;

  const images = bill.images || [];

  const formatDate = (dateStr) => formatDatePK(dateStr);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete bill "${bill.billName}" (${bill.billId})?`)) {
      setDeleting(true);
      await onDelete(bill._id);
      setDeleting(false);
      onClose();
    }
  };

  // Keyboard navigation for image slider (Left Arrow, Right Arrow, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, images.length]);

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(9, 13, 22, 0.88)',
        backdropFilter: 'blur(12px)',
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
          maxWidth: '750px',
          maxHeight: 'calc(100vh - 2rem)',
          overflowY: 'auto',
          boxShadow: 'var(--glass-shadow)',
          padding: 'clamp(1rem, 3.5vw, 2.25rem)',
          position: 'relative',
          margin: 'auto 0'
        }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'var(--text-muted)',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
          >
            <X size={18} />
          </button>

          {/* Modal Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1.25rem',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              {/* Record Number above Bill No */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: '700',
                marginBottom: '0.4rem'
              }}>
                Record ID: {getRecordNumber(bill)}
              </div>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--accent-cyan)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>
                  <Tag size={13} />
                  BILL NO: {bill.billId}
                </div>
              </div>
            </div>

            
           
          </div>

          {/* Detail Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem'
          }}>
            {/* Bill & User Details Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={14} />
                Bill & User Details
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
                  Name:
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {bill.billName}
                </span>
              </div>
             
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Phone size={13} />
                {bill.phoneNumber}
              </div>
            </div>
          </div>

          {/* One-Line Comment / Notes Section */}
          {bill.comment && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem 1.25rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                💬 One-Line Comment / Remarks
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                "{bill.comment}"
              </div>
            </div>
          )}

          {/* Attached Document Images */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={18} color="var(--accent-cyan)" />
              Attached Documents ({images.length})
            </h4>

            {images.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.85rem' }}>
                {images.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      height: '110px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      position: 'relative',
                      background: 'rgba(15, 23, 42, 0.8)',
                      transition: 'transform 0.2s, border-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.04)';
                      e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    <img src={imgSrc} alt={`Bill document ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      fontSize: '0.7rem',
                      padding: '3px 6px',
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>
                      Doc #{idx + 1} • Expand 🔍
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-sm)', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                No attached images for this bill.
              </div>
            )}
          </div>

          {/* Action Buttons Footer - Centered & Vertically Stacked */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            marginTop: '1.5rem',
            width: '100%',
            gap: '0.75rem'
          }}>
            {/* View Bill Button */}
            <button
              type="button"
              onClick={() => {
                if (images.length > 0) {
                  setSelectedImageIndex(0);
                } else {
                  alert('No attached images for this bill. You can view printable bill details via Print Bill.');
                }
              }}
              style={{
                width: '100%',
                maxWidth: '320px',
                height: '46px',
                padding: '0.75rem 1.5rem',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-cyan)',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)'}
            >
              <Eye size={18} />
              View Bill
            </button>

            {/* Print Bill Button */}
            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
            >
              <Printer size={18} />
              Print Bill
            </button>

            {/* Cancel Button */}
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
                gap: '0.5rem',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
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
              <X size={18} />
              Cancel
            </button>

            {/* Edit & Delete Actions (preserved for existing functionality) */}
            {((showEdit && onEdit) || (showDelete && onDelete)) && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.75rem',
                width: '100%',
                maxWidth: '320px',
                marginTop: '0.5rem',
                paddingTop: '0.75rem',
                borderTop: '1px dashed var(--border-color)'
              }}>
                {showEdit && onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEdit(bill);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-main)',
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                )}

                {showDelete && onDelete && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(244, 63, 94, 0.15)',
                      border: '1px solid rgba(244, 63, 94, 0.4)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--accent-rose)',
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Expanded Interactive Lightbox Slider with Next/Prev Arrow Buttons */}
      {selectedImageIndex !== null && images.length > 0 && (
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
        >
          {/* Header Bar in Lightbox */}
          <div style={{
            position: 'absolute',
            top: '1.5rem',
            left: '2rem',
            right: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff',
            zIndex: 100010
          }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', background: 'rgba(255, 255, 255, 0.1)', padding: '0.4rem 1rem', borderRadius: '20px' }}>
              Document {selectedImageIndex + 1} of {images.length}
            </div>

            <button
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
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              title="Close Lightbox (Esc)"
            >
              <X size={22} />
            </button>
          </div>

          {/* LEFT ARROW BUTTON */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
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
                zIndex: 3100
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
          <div style={{
            maxWidth: '85vw',
            maxHeight: '78vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <img
              src={images[selectedImageIndex]}
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
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
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
                zIndex: 3100
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

          {/* Bottom Thumbnails Navigation Strip */}
          {images.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              display: 'flex',
              gap: '0.75rem',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '0.5rem 1rem',
              borderRadius: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 3100
            }}>
              {images.map((img, idx) => (
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

      {/* Embedded Print View Modal */}
      {showPrintModal && (
        <PrintBillModal
          bill={bill}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </>
  );
};

export default ViewBillModal;

import React, { useState, useEffect } from 'react';
import { X, Printer, Edit, Trash2, Calendar, User, Phone, Tag, FileText, CheckCircle, ExternalLink, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import PrintBillModal from './PrintBillModal';

const ViewBillModal = ({ bill, onClose, onEdit, onDelete, showEdit = true, showDelete = true }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!bill) return null;

  const images = bill.images || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
        padding: '2rem 1rem',
        overflowY: 'auto'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color-active)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '750px',
          maxHeight: 'calc(100vh - 4rem)',
          overflowY: 'auto',
          boxShadow: 'var(--glass-shadow)',
          padding: '2.25rem',
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
                BILL ID: {bill.billId}
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {bill.billName}
              </h2>
            </div>

            {/* Price Badge */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem 1.25rem',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                Bill Price
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
                PKR {bill.amount ? Number(bill.amount).toLocaleString() : '0'}
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
            {/* Customer Details Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={14} />
                Customer Info
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                {bill.username}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                User ID: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{bill.userId}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Phone size={13} />
                {bill.phoneNumber}
              </div>
            </div>

            {/* Dates & Timeline Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-purple)', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} />
                Bill Dates
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Entry Date: <strong>{formatDate(bill.billEntryDate)}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-rose)', fontWeight: '600' }}>
                Due Date: <strong>{formatDate(bill.billDueDate)}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                Logged on: {formatDate(bill.createdAt)}
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
              <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.4' }}>
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

          {/* Action Buttons Footer */}
          <div style={{
            display: 'flex',
            justifyContent: (showDelete && onDelete) ? 'space-between' : 'flex-end',
            alignItems: 'center',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {showDelete && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: '0.65rem 1.25rem',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--accent-rose)',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Trash2 size={16} />
                Delete Record
              </button>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {showEdit && onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(bill);
                  }}
                  style={{
                    padding: '0.65rem 1.25rem',
                    background: 'rgba(99, 102, 241, 0.2)',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Edit size={16} />
                  Edit Record
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                style={{
                  padding: '0.65rem 1.25rem',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                }}
              >
                <Printer size={16} />
                Print Receipt
              </button>
            </div>
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
            zIndex: 3000,
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
            zIndex: 3100
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

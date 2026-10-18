import React from 'react';
import { X, Printer, Receipt, Calendar, User, Phone, Tag, Hash } from 'lucide-react';
import { formatDatePK, getRecordNumber } from '../utils/billUtils';

const PrintBillModal = ({ bill, onClose }) => {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr) => formatDatePK(dateStr);

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
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: 'clamp(0.5rem, 2vw, 1.5rem)'
    }}>
      <div style={{
        background: '#ffffff',
        color: '#1e293b',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        padding: 'clamp(1rem, 3.5vw, 2.5rem)',
        position: 'relative'
      }} className="printable-container">

        {/* Controls - Hidden on Print */}
        <div className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <h3 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Receipt color="#4f46e5" size={20} />
            Bill Details & Printable Invoice
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handlePrint}
              style={{
                background: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              <Printer size={16} />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                color: '#64748b',
                border: 'none',
                padding: '0.6rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT LAYOUT */}
        <div style={{ padding: '0.5rem' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.025em' }}>
                UTILITY BILL RECEIPT
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                Clothing Brand Management System
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                background: '#e0e7ff',
                color: '#3730a3',
                fontWeight: '700',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                display: 'inline-block',
                marginBottom: '0.35rem'
              }}>
                Record No: #{getRecordNumber(bill)}
              </div>
              <br />
              <div style={{
                background: '#f1f5f9',
                color: '#0f172a',
                fontWeight: '700',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                display: 'inline-block'
              }}>
                Bill No: {bill.billId}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
                Logged on: {formatDate(bill.createdAt)}
              </div>
            </div>
          </div>

          {/* Bill & User Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '2rem',
            background: '#f8fafc',
            padding: '1.25rem',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                User & Contact Details
              </div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.2rem' }}>
                Bill Name: <strong style={{ color: '#0f172a' }}>{bill.billName}</strong>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.2rem' }}>
                User ID: <strong>{bill.userId}</strong>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                Phone: <strong>{bill.phoneNumber}</strong>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Bill Information
              </div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                Entry Date: <strong>{formatDate(bill.billEntryDate)}</strong>
              </div>
              <div style={{ fontSize: '1rem', color: '#16a34a', fontWeight: '800', marginTop: '0.4rem' }}>
                Amount: PKR {bill.amount ? Number(bill.amount).toLocaleString() : '0'}
              </div>
            </div>
          </div>

          {/* Attached Bill Images Section */}
          {bill.images && bill.images.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
                Attached Bill Documents/Images ({bill.images.length})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {bill.images.map((img, idx) => (
                  <div key={idx} style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#f1f5f9',
                    height: '180px'
                  }}>
                    <img
                      src={img}
                      alt={`Bill doc ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom One-Line Comment Section */}
          {bill.comment && (
            <div style={{
              marginTop: '1.5rem',
              padding: '0.85rem 1.25rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #4f46e5',
              fontSize: '0.875rem',
              color: '#334155'
            }}>
              <strong style={{ color: '#0f172a' }}>Comment / Note:</strong> {bill.comment}
            </div>
          )}

          {/* Footer Note */}
          <div style={{
            marginTop: '2.5rem',
            borderTop: '1px dashed #cbd5e1',
            paddingTop: '1rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#94a3b8'
          }}>
            Official Internal Utility Bill Record • Clothing Brand System • Generated automatically
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrintBillModal;

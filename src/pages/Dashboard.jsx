import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Receipt, Shield, Sparkles } from 'lucide-react';
import NewBillModal from '../components/NewBillModal';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleBillCreated = () => {
    navigate('/old-bills');
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '3rem auto',
      padding: '0 1.5rem'
    }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
        border: '1px solid var(--border-color-active)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        marginBottom: '3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--glass-shadow)',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(99, 102, 241, 0.2)',
            color: 'var(--accent-cyan)',
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={14} />
            CLOTHING BRAND ADMIN PORTAL
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Utility Bill Control Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.4rem', maxWidth: '600px' }}>
            Select an action below to enter new electricity, water, or gas bill details with autocompletion, or review and print existing bill records.
          </p>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Shield color="var(--accent-emerald)" size={28} />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true }}>Session Status</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
              Admin Authenticated
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Hub - TWO BIG BUTTONS */}
      <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: '600' }}>
        Quick Actions
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* NEW BILL BUTTON */}
        <div
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem 2rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = 'var(--accent-cyan)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(6, 182, 212, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            padding: '1.25rem',
            borderRadius: '16px',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)'
          }}>
            <PlusCircle size={36} color="#ffffff" />
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            New Bill
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Log a new utility bill into the database. Features autocomplete on User ID and Phone Number to auto-fill details.
          </p>

          <div style={{
            marginTop: '2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--accent-cyan)',
            fontWeight: '700',
            fontSize: '0.95rem'
          }}>
            Open Entry Popup &rarr;
          </div>
        </div>

        {/* OLD BILL BUTTON */}
        <div
          onClick={() => navigate('/old-bills')}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem 2rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
            padding: '1.25rem',
            borderRadius: '16px',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
          }}>
            <FileText size={36} color="#ffffff" />
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Old Bill
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            View, search, and manage all previously created bill records. Includes single-click browser print view for each bill.
          </p>

          <div style={{
            marginTop: '2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--primary)',
            fontWeight: '700',
            fontSize: '0.95rem'
          }}>
            Browse All Bills &rarr;
          </div>
        </div>
      </div>

      {/* New Bill Popup Modal */}
      <NewBillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBillCreated={handleBillCreated}
      />
    </div>
  );
};

export default Dashboard;

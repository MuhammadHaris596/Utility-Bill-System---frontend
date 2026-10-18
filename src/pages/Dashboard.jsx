import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Shield, Sparkles } from 'lucide-react';
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
      margin: 'clamp(1.5rem, 4vw, 3rem) auto',
      padding: '0 clamp(0.75rem, 3vw, 1.5rem)',
      width: '100%',
    }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
        border: '1px solid var(--border-color-active)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(1.25rem, 4vw, 2.5rem)',
        marginBottom: 'clamp(1.5rem, 4vw, 3rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--glass-shadow)',
        flexWrap: 'wrap',
        gap: '1.25rem',
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(99, 102, 241, 0.2)',
            color: 'var(--accent-cyan)',
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
          }}>
            <Sparkles size={14} />
            CLOTHING BRAND ADMIN PORTAL
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.25rem)', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.2' }}>
            Utility Bill Control Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.4rem', maxWidth: '600px', lineHeight: '1.5' }}>
            Select an action below to enter new electricity, water, or gas bill details with autocompletion, or review and print existing bill records.
          </p>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          alignSelf: 'flex-start',
        }}>
          <Shield color="var(--accent-emerald)" size={26} />
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Session Status</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
              Admin Authenticated
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Hub - TWO BIG BUTTONS */}
      <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: '600' }}>
        Quick Actions
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
        gap: '1.5rem',
      }}>
        {/* NEW BILL BUTTON */}
        <div
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 3vw, 2rem)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            overflow: 'hidden',
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
            padding: '1.1rem',
            borderRadius: '16px',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)',
          }}>
            <PlusCircle size={32} color="#ffffff" />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            New Bill
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
            Log a new utility bill into the database. Features autocomplete on User ID and Phone Number to auto-fill details.
          </p>

          <div style={{
            marginTop: '1.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--accent-cyan)',
            fontWeight: '700',
            fontSize: '0.925rem',
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
            padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 3vw, 2rem)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            overflow: 'hidden',
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
            padding: '1.1rem',
            borderRadius: '16px',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
          }}>
            <FileText size={32} color="#ffffff" />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Old Bill
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
            View, search, and manage all previously created bill records. Includes single-click browser print view for each bill.
          </p>

          <div style={{
            marginTop: '1.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--primary)',
            fontWeight: '700',
            fontSize: '0.925rem',
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

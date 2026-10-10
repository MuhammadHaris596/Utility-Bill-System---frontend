import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { Receipt, LogOut, ShieldCheck, Home, FileText } from 'lucide-react';

const Navbar = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!admin) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="no-print" style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          color: 'var(--text-main)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            <Receipt size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.2rem', lineHeight: '1.1' }}>
              LUXE <span style={{ color: 'var(--accent-cyan)' }}>BILLS</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              UTILITY MANAGEMENT SYSTEM
            </div>
          </div>
        </Link>

        {/* Action Links, Notification Bell & Admin Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'color 0.2s'
          }}>
            <Home size={18} />
            Dashboard
          </Link>

          <Link to="/old-bills" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'color 0.2s'
          }}>
            <FileText size={18} />
            Old Bills
          </Link>

          <Link to="/manage-admins" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'color 0.2s'
          }}>
            <ShieldCheck size={18} />
            Manage Admins
          </Link>

          {/* Facebook-style Due Date Notification Bell */}
          <NotificationBell />

          {/* User Tag & Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingLeft: '1rem',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '0.85rem', textAlign: 'right' }}>
              <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>{admin.name}</div>
              <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>Admin</div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: 'var(--accent-rose)',
                padding: '0.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

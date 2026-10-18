import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import NewBillModal from './NewBillModal';
import { Receipt, LogOut, ShieldCheck, Home, FileText, Menu, X, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { admin, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isNewBillOpen, setIsNewBillOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!admin) return null;

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/old-bills', label: 'Old Bills', icon: FileText },
    { to: '/manage-admins', label: 'Manage Admins', icon: ShieldCheck },
  ];

  return (
    <nav className="no-print" style={{
      background: 'rgba(15, 23, 42, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1250px',
        margin: '0 auto',
        padding: '0.85rem clamp(1rem, 3vw, 2rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
      }}>
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            color: 'var(--text-main)',
            minWidth: 0,
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
            padding: '0.45rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            flexShrink: 0,
          }}>
            <Receipt size={20} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: '800', fontSize: '1.15rem', lineHeight: '1.1', whiteSpace: 'nowrap' }}>
              LUXE <span style={{ color: 'var(--accent-cyan)' }}>BILLS</span>
            </div>
            <div
              className="mobile-brand-subtitle"
              style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}
            >
              UTILITY MANAGEMENT SYSTEM
            </div>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Desktop Navigation Links */}
          <div className="navbar-desktop-menu">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    color: active ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: active ? '700' : '600',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    background: active ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
            {/* New Bill Desktop Button */}
            <button
              type="button"
              onClick={() => setIsNewBillOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: 'var(--text-main)',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                fontSize: '0.9rem',
                fontWeight: '700',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.28)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              }}
            >
              <PlusCircle size={17} color="var(--accent-cyan)" />
              New Bill
            </button>
          </div>

          {/* Exactly ONE Notification Bell */}
          <NotificationBell />

          {/* Desktop User Info & Logout */}
          <div className="navbar-desktop-user">
            <div style={{ fontSize: '0.825rem', textAlign: 'right' }}>
              <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>{admin.name}</div>
              <div style={{ color: 'var(--accent-cyan)', fontSize: '0.72rem' }}>Admin</div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: 'var(--accent-rose)',
                padding: '0.45rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={17} />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="navbar-mobile-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      <div className={`navbar-mobile-dropdown ${mobileOpen ? 'open' : ''}`}>
        {/* New Bill Mobile Button */}
        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            setIsNewBillOpen(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--text-main)',
            background: 'rgba(99, 102, 241, 0.18)',
            border: '1px solid rgba(99, 102, 241, 0.45)',
            fontSize: '0.925rem',
            fontWeight: '700',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <PlusCircle size={18} color="var(--accent-cyan)" />
          New Bill
        </button>

        {navLinks.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: active ? 'var(--accent-cyan)' : 'var(--text-main)',
                background: active ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: '1px solid ' + (active ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.05)'),
                textDecoration: 'none',
                fontSize: '0.925rem',
                fontWeight: '600',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
              }}
            >
              <Icon size={18} color={active ? 'var(--accent-cyan)' : 'var(--primary)'} />
              {item.label}
            </Link>
          );
        })}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div>
            <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '700' }}>{admin.name}</div>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>Logged in as Admin</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--accent-rose)',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.825rem',
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* New Bill Modal Triggered from Navbar */}
      <NewBillModal
        isOpen={isNewBillOpen}
        onClose={() => setIsNewBillOpen(false)}
        onBillCreated={() => setIsNewBillOpen(false)}
      />
    </nav>
  );
};

export default Navbar;

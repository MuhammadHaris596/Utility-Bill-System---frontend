import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserPlus, User, Mail, Lock, CheckCircle, AlertCircle, Users, ShieldCheck, Calendar, RefreshCw } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ManageAdmins = () => {
  const { admin: currentAdmin } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [adminsList, setAdminsList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAdmins = async () => {
    try {
      setLoadingList(true);
      const { data } = await axios.get('http://localhost:5000/api/auth/admins');
      setAdminsList(data);
    } catch (err) {
      console.error('Failed to fetch admin list:', err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register-admin', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(`Admin account created for ${data.name} (${data.email})!`);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      fetchAdmins(); // Refresh admin list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: 'clamp(1rem, 3vw, 2rem) auto',
      padding: '0 clamp(0.75rem, 3vw, 1.5rem)',
      width: '100%'
    }}>
      {/* Page Title */}
      <div style={{
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
            fontWeight: '800',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <ShieldCheck color="var(--accent-purple)" size={28} />
            Manage Admins
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Add new administrator accounts and view current system administrators.
          </p>
        </div>

        <button
          onClick={fetchAdmins}
          disabled={loadingList}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 0.95rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}
        >
          <RefreshCw size={15} className={loadingList ? 'spin' : ''} />
          Refresh List
        </button>
      </div>

      {/* Grid Layout: Add Admin Form + Admin List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
        gap: '1.5rem',
        alignItems: 'start'
      }}>

        {/* Left Box: Create Admin Form */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--glass-shadow)',
          padding: 'clamp(1.25rem, 3vw, 2rem)',
        }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--accent-purple), var(--primary))',
              padding: '0.6rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={22} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Add New Admin
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Grant system access to a team member
              </span>
            </div>
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
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Full Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Jenkins"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Admin Email <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sarah@brand.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Password <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Confirm Password <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '0.5rem',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, var(--accent-purple), var(--primary))',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                transition: 'opacity 0.2s'
              }}
            >
              {submitting ? 'Creating Admin...' : 'Create Admin Account'}
            </button>
          </form>
        </div>

        {/* Right Box: Admin Accounts List */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--glass-shadow)',
          padding: 'clamp(1.25rem, 3vw, 2rem)',
          minWidth: 0,
          overflow: 'hidden'
        }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--primary))',
                padding: '0.6rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Users size={22} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Active Admins
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {adminsList.length} registered admin(s)
                </span>
              </div>
            </div>
          </div>

          {loadingList ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading admin accounts...
            </div>
          ) : adminsList.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No admins found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {adminsList.map((adm) => {
                const isCurrent = currentAdmin && (currentAdmin._id === adm._id || currentAdmin.email === adm.email);
                return (
                  <div
                    key={adm._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.25rem',
                      background: isCurrent ? 'rgba(99, 102, 241, 0.12)' : 'rgba(15, 23, 42, 0.5)',
                      border: isCurrent ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      gap: '0.85rem',
                      flexWrap: 'wrap',
                      boxSizing: 'border-box',
                      width: '100%',
                      minWidth: 0,
                      transition: 'transform 0.2s'
                    }}
                  >
                    {/* Left: Avatar & Admin Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: '1 1 200px', minWidth: 0 }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        minWidth: '42px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                      }}>
                        {adm.name ? adm.name.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', minWidth: 0 }}>
                          <span style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.95rem', wordBreak: 'break-word' }}>
                            {adm.name}
                          </span>
                          {isCurrent && (
                            <span style={{
                              background: 'var(--primary)',
                              color: '#fff',
                              fontSize: '0.68rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '10px',
                              fontWeight: '700',
                              flexShrink: 0,
                              lineHeight: 1.2,
                              letterSpacing: '0.02em'
                            }}>
                              YOU
                            </span>
                          )}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.15rem', wordBreak: 'break-all', minWidth: 0 }}>
                          {adm.email}
                        </div>
                      </div>
                    </div>

                    {/* Right: Date & Admin Role Badge */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      flexShrink: 0,
                      marginLeft: 'auto'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-dim)',
                        whiteSpace: 'nowrap',
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}>
                        <Calendar size={13} style={{ flexShrink: 0 }} />
                        <span>{adm.createdAt ? new Date(adm.createdAt).toLocaleDateString() : 'Active'}</span>
                      </div>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: 'var(--accent-emerald)',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '0.72rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap'
                      }}>
                        Admin
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageAdmins;

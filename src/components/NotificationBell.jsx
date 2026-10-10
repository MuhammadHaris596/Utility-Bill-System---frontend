import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Bell, Calendar, User, FileText, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import ViewBillModal from './ViewBillModal';

const NotificationBell = () => {
  const [dueBills, setDueBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBillDetails, setSelectedBillDetails] = useState(null);

  // Persistent individual read status tracking
  const [readBillIds, setReadBillIds] = useState(() => {
    try {
      const saved = localStorage.getItem('read_due_bill_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const dropdownRef = useRef(null);

  // Strict same-day calendar date matching (only matches if due date is TODAY's date)
  const isDueToday = (dueDateVal) => {
    if (!dueDateVal) return false;
    const d = new Date(dueDateVal);
    if (isNaN(d.getTime())) return false;

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayLocalStr = `${yyyy}-${mm}-${dd}`;

    const dYyyy = d.getFullYear();
    const dMm = String(d.getMonth() + 1).padStart(2, '0');
    const dDd = String(d.getDate()).padStart(2, '0');
    const dLocalStr = `${dYyyy}-${dMm}-${dDd}`;

    const dUtcStr = d.toISOString().split('T')[0];

    return dLocalStr === todayLocalStr || dUtcStr === todayLocalStr;
  };

  const fetchDueBills = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const { data } = await axios.get('/api/bills/due-today');

      // Filter on frontend as well to strictly enforce same-day due dates
      const strictlyTodayBills = (data || []).filter((bill) => isDueToday(bill.billDueDate));
      setDueBills(strictlyTodayBills);
    } catch (error) {
      console.error('Failed to fetch due bills:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueBills(false);

    const handleBillCreated = (e) => {
      const createdBill = e?.detail;
      if (createdBill && isDueToday(createdBill.billDueDate)) {
        setDueBills((prev) => [createdBill, ...prev.filter((b) => b._id !== createdBill._id)]);
      }
      fetchDueBills(false);
    };

    const handleBillUpdated = (e) => {
      const updatedBill = e?.detail;
      if (updatedBill) {
        if (isDueToday(updatedBill.billDueDate)) {
          setDueBills((prev) => [updatedBill, ...prev.filter((b) => b._id !== updatedBill._id)]);
        } else {
          setDueBills((prev) => prev.filter((b) => b._id !== updatedBill._id));
        }
      }
      fetchDueBills(false);
    };

    window.addEventListener('bill-created', handleBillCreated);
    window.addEventListener('bill-updated', handleBillUpdated);

    const interval = setInterval(() => fetchDueBills(false), 2 * 60 * 1000);
    return () => {
      window.removeEventListener('bill-created', handleBillCreated);
      window.removeEventListener('bill-updated', handleBillUpdated);
      clearInterval(interval);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle dropdown without auto-marking all items as read
  const handleToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // Manual refresh click handler
  const handleRefresh = async (e) => {
    e.stopPropagation();
    await fetchDueBills(true);
  };

  // Click on a SPECIFIC notification item -> mark THAT item as read and open ViewBillModal
  const handleSelectBill = (e, bill) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();
    if (!bill || !bill._id) return;

    // Mark ONLY this specific notification item as read
    if (!readBillIds.includes(bill._id)) {
      const updatedReadIds = [...readBillIds, bill._id];
      setReadBillIds(updatedReadIds);
      try {
        localStorage.setItem('read_due_bill_ids', JSON.stringify(updatedReadIds));
      } catch (err) {
        console.error('Failed to save read notification state:', err);
      }
    }

    setIsOpen(false);
    setSelectedBillDetails(bill);
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return 'Due Today';
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Unread count = due-today bills whose ID has NOT been clicked yet
  const unreadBills = dueBills.filter((b) => !readBillIds.includes(b._id));
  const unreadCount = unreadBills.length;

  return (
    <>
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        {/* Bell Icon Button */}
        <button
          onClick={handleToggle}
          title="Due Date Notifications"
          style={{
            background: isOpen ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: dueBills.length > 0 ? 'var(--accent-amber)' : 'var(--text-muted)',
            padding: '0.55rem',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'all 0.2s',
            outline: 'none',
          }}
        >
          <Bell size={20} />

          {/* Unread Red Badge counter (shows number of unread due-today items) */}
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'linear-gradient(135deg, var(--accent-rose), #f43f5e)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: '800',
                borderRadius: '999px',
                minWidth: '18px',
                height: '18px',
                padding: '0 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(244, 63, 94, 0.5)',
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Facebook-style Notification Dropdown Panel */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              width: '360px',
              maxHeight: 'calc(100vh - 90px)',
              background: 'rgba(15, 23, 42, 0.96)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
              zIndex: 5000,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} color="var(--accent-amber)" />
                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  Due Date Notifications
                </span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                title="Refresh notifications"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-main)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '5px',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} />
              </button>
            </div>

            {/* List Content */}
            <div
              style={{
                overflowY: 'auto',
                flex: 1,
                maxHeight: '380px',
                padding: '0.5rem 0',
              }}
            >
              {loading && dueBills.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Updating notifications...
                </div>
              ) : dueBills.length === 0 ? (
                <div
                  style={{
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <CheckCircle2 size={36} color="var(--accent-emerald)" />
                  <div>
                    <div style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem' }}>
                      All caught up!
                    </div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      No bills due today.
                    </div>
                  </div>
                </div>
              ) : (
                dueBills.map((bill) => {
                  const isItemRead = readBillIds.includes(bill._id);
                  return (
                    <div
                      key={bill._id}
                      onClick={(e) => handleSelectBill(e, bill)}
                      style={{
                        padding: '0.85rem 1.25rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        background: isItemRead ? 'transparent' : 'rgba(99, 102, 241, 0.06)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = isItemRead ? 'transparent' : 'rgba(99, 102, 241, 0.06)')}
                    >
                      <div
                        style={{
                          background: isItemRead ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.15)',
                          border: isItemRead ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                          padding: '0.5rem',
                          borderRadius: '10px',
                          color: isItemRead ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '0.15rem',
                        }}
                      >
                        <FileText size={18} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {bill.billName}
                          {isItemRead && (
                            <span style={{ color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.72rem', fontWeight: '600' }}>
                              <CheckCircle2 size={13} /> Checked
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                          <User size={13} color="var(--accent-cyan)" />
                          <span>{bill.username}</span>
                          {bill.amount > 0 && (
                            <span style={{ color: 'var(--accent-emerald)', fontWeight: '600', marginLeft: 'auto' }}>
                              ${bill.amount.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-rose)', fontSize: '0.78rem', marginTop: '0.3rem', fontWeight: '600' }}>
                          <Calendar size={13} />
                          <span>{formatDueDate(bill.billDueDate)}</span>
                        </div>
                      </div>

                      <ChevronRight size={16} color="var(--text-dim)" style={{ alignSelf: 'center' }} />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Render ViewBillModal safely via React Portal at document.body level */}
      {selectedBillDetails && ReactDOM.createPortal(
        <ViewBillModal
          bill={selectedBillDetails}
          onClose={() => setSelectedBillDetails(null)}
          showEdit={false}
          showDelete={false}
        />,
        document.body
      )}
    </>
  );
};

export default NotificationBell;

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Bell, Phone, FileText, CheckCircle2, ChevronRight, RefreshCw, X } from 'lucide-react';
import ViewBillModal from './ViewBillModal';

const NotificationBell = () => {
  const [dueBills, setDueBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBillDetails, setSelectedBillDetails] = useState(null);

  // Viewport-aware panel coordinates
  const [panelCoords, setPanelCoords] = useState({
    top: 64,
    right: 16,
    isMobile: false,
    maxHeight: '440px',
  });

  // Persistent individual read status tracking
  const [readBillIds, setReadBillIds] = useState(() => {
    try {
      const saved = localStorage.getItem('read_due_bill_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const fetchDueBills = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get('https://utility-bill-system-backend.vercel.app/api/bills/due-today', { headers });
      setDueBills(data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueBills(false);

    const handleBillCreated = (event) => {
      const createdBill = event?.detail;
      if (createdBill && createdBill._id && (createdBill.notify === true || createdBill.notify === 'true')) {
        setDueBills((prev) => {
          const stableKey = createdBill.billId ? String(createdBill.billId).trim() : String(createdBill._id);
          const exists = prev.some(
            (b) => b._id === createdBill._id || (b.billId && String(b.billId).trim() === stableKey)
          );
          if (!exists) {
            return [{ ...createdBill, isRead: false }, ...prev];
          }
          return prev;
        });
      }
      fetchDueBills(false);
    };

    const handleBillUpdated = (event) => {
      const updatedBill = event?.detail?.bill || event?.detail;
      const wasNewlyEnabled = event?.detail?.wasNewlyEnabled;

      if (updatedBill && updatedBill._id) {
        const stableKey = updatedBill.billId ? String(updatedBill.billId).trim() : String(updatedBill._id);
        const notifyVal = updatedBill.notify === true || updatedBill.notify === 'true';

        // If newly enabled, remove from readBillIds so it shows as unread immediately
        if (wasNewlyEnabled) {
          setReadBillIds((prev) => {
            const next = prev.filter(
              (id) => id !== String(updatedBill._id) && (!updatedBill.billId || id !== String(updatedBill.billId).trim())
            );
            try {
              localStorage.setItem('read_due_bill_ids', JSON.stringify(next));
            } catch (e) {}
            return next;
          });
        }

        setDueBills((prev) => {
          if (!notifyVal) {
            // Turned OFF -> remove from active notifications immediately
            return prev.filter(
              (b) => b._id !== updatedBill._id && (!b.billId || String(b.billId).trim() !== stableKey)
            );
          } else {
            // Turned ON or updated
            const exists = prev.some(
              (b) => b._id === updatedBill._id || (b.billId && String(b.billId).trim() === stableKey)
            );
            if (exists) {
              return prev.map((b) =>
                b._id === updatedBill._id || (b.billId && String(b.billId).trim() === stableKey)
                  ? {
                      ...b,
                      ...updatedBill,
                      isRead: wasNewlyEnabled
                        ? false
                        : (updatedBill.isRead !== undefined ? updatedBill.isRead : b.isRead),
                    }
                  : b
              );
            } else {
              return [{ ...updatedBill, isRead: false }, ...prev];
            }
          }
        });
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

  // Update position relative to viewport on open, scroll, or resize
  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth <= 640;
    const top = Math.round(rect.bottom + 8);
    const availableHeight = Math.max(220, window.innerHeight - top - 16);

    if (isMobile) {
      setPanelCoords({
        top,
        left: 12,
        right: 12,
        isMobile: true,
        maxHeight: `${availableHeight}px`,
      });
    } else {
      const right = Math.max(16, Math.round(window.innerWidth - rect.right));
      setPanelCoords({
        top,
        right,
        isMobile: false,
        maxHeight: `${availableHeight}px`,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Toggle dropdown
  const handleToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // Manual refresh click handler
  const handleRefresh = async (e) => {
    e.stopPropagation();
    await fetchDueBills(true);
  };

  // Deduplicate dueBills by stable order ID (billId or _id)
  const uniqueDueBills = React.useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const b of dueBills) {
      if (!b) continue;
      const key = b.billId ? String(b.billId).trim() : String(b._id);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(b);
      }
    }
    return result;
  }, [dueBills]);

  const isItemRead = (b) => {
    if (!b) return false;
    if (b.isRead === true) return true;
    if (b.isRead === false) return false;

    const stableKey = b.billId ? String(b.billId).trim() : null;
    return Boolean(
      readBillIds.includes(String(b._id)) ||
      (stableKey && readBillIds.includes(stableKey))
    );
  };

  // Read status tracking within notification list
  const unreadBills = uniqueDueBills.filter((b) => !isItemRead(b));
  const unreadCount = unreadBills.length;

  // Click on a SPECIFIC notification item -> mark THAT item as read and open ViewBillModal
  const handleSelectBill = async (e, bill) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();
    if (!bill || !bill._id) return;

    const stableKey = bill.billId ? String(bill.billId).trim() : null;
    const idsToAdd = [String(bill._id)];
    if (stableKey) idsToAdd.push(stableKey);

    const updatedReadIds = Array.from(new Set([...readBillIds, ...idsToAdd]));
    setReadBillIds(updatedReadIds);
    try {
      localStorage.setItem('read_due_bill_ids', JSON.stringify(updatedReadIds));
    } catch (err) {
      console.error('Failed to save read notification state:', err);
    }

    // Persist read status to backend database
    try {
      const token = localStorage.getItem('adminToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(`https://utility-bill-system-backend.vercel.app/api/bills/${bill._id}/read`, {}, { headers });
    } catch (err) {
      console.error('Failed to update read status on server:', err);
    }

    // Optimistically update local dueBills
    setDueBills((prev) =>
      prev.map((b) =>
        b._id === bill._id || (stableKey && String(b.billId).trim() === stableKey)
          ? { ...b, isRead: true }
          : b
      )
    );

    setIsOpen(false);
    setSelectedBillDetails(bill);
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return 'Today';
    const date = new Date(dateString);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return 'Today';
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        {/* Bell Icon Button */}
        <button
          ref={buttonRef}
          onClick={handleToggle}
          title="Notifications"
          aria-expanded={isOpen}
          aria-label="Notifications"
          style={{
            background: isOpen ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
            border: isOpen ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.12)',
            color: uniqueDueBills.length > 0 ? 'var(--accent-amber)' : 'var(--text-muted)',
            padding: '0.55rem',
            borderRadius: '10px',
            minWidth: '38px',
            minHeight: '38px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
            flexShrink: 0,
          }}
        >
          <Bell size={20} />

          {/* Badge counter - hidden when unreadCount is 0 */}
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'linear-gradient(135deg, var(--accent-rose), #e11d48)',
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: '800',
                borderRadius: '999px',
                minWidth: '18px',
                height: '18px',
                padding: '0 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(244, 63, 94, 0.6)',
                border: '1.5px solid #0f172a',
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Render the Notification Dropdown Panel in React Portal so it is completely immune to clipping or stacking issues */}
      {isOpen &&
        ReactDOM.createPortal(
          <>
            {/* Mobile backdrop for seamless outside-tap dismiss */}
            {panelCoords.isMobile && (
              <div
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(3px)',
                  zIndex: 9998,
                }}
              />
            )}

            {/* Notification Dropdown Panel */}
            <div
              ref={panelRef}
              role="dialog"
              aria-label="Due Date Notifications"
              className="modal-fade-in"
              style={{
                position: 'fixed',
                top: `${panelCoords.top}px`,
                ...(panelCoords.isMobile
                  ? {
                      left: '12px',
                      right: '12px',
                      width: 'calc(100vw - 24px)',
                      maxWidth: '440px',
                      margin: '0 auto',
                    }
                  : {
                      right: `${panelCoords.right}px`,
                      width: '460px',
                      maxWidth: 'calc(100vw - 32px)',
                    }),
                maxHeight: panelCoords.maxHeight,
                background: '#0c1322',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '16px',
                boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(99, 102, 241, 0.15)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '0.85rem 1.15rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.03)',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
                  <Bell size={18} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      fontWeight: '700',
                      fontSize: '0.925rem',
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Notifications
                  </span>
                  {uniqueDueBills.length > 0 && (
                    <span
                      style={{
                        background: unreadCount > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        border: unreadCount > 0 ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                        color: unreadCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '999px',
                        flexShrink: 0,
                      }}
                    >
                      {unreadCount > 0 ? `${unreadCount} new` : 'All checked'}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
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

                  {panelCoords.isMobile && (
                    <button
                      onClick={() => setIsOpen(false)}
                      title="Close panel"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <X size={17} />
                    </button>
                  )}
                </div>
              </div>

              {/* List Content */}
              <div
                style={{
                  overflowY: 'auto',
                  flex: 1,
                  maxHeight: '380px',
                  padding: '0.25rem 0',
                }}
              >
                {loading && uniqueDueBills.length === 0 ? (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <RefreshCw size={20} className="spin" style={{ margin: '0 auto 0.75rem', opacity: 0.7 }} />
                    <div>Updating notifications...</div>
                  </div>
                ) : uniqueDueBills.length === 0 ? (
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
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircle2 size={24} color="var(--accent-emerald)" />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.925rem' }}>
                        All caught up!
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        No bills in notifications.
                      </div>
                    </div>
                  </div>
                ) : (
                  uniqueDueBills.map((bill) => {
                    const isItemReadState = isItemRead(bill);

                    return (
                      <div
                        key={bill._id}
                        onClick={(e) => handleSelectBill(e, bill)}
                        style={{
                          padding: '0.85rem 1.15rem',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          background: isItemReadState ? 'transparent' : 'rgba(99, 102, 241, 0.06)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = isItemReadState ? 'transparent' : 'rgba(99, 102, 241, 0.06)')
                        }
                      >
                        {/* 1. Document Icon Container */}
                        <div
                          style={{
                            background: isItemReadState ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.15)',
                            border: isItemReadState ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            color: isItemReadState ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FileText size={19} />
                        </div>

                        {/* 2. Middle Content: Bill ID, Title, Status, Phone, Due Date */}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {/* Row 1: Bill ID Badge, Bill Title, Status Badge */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              flexWrap: 'wrap',
                            }}
                          >
                            {/* Bill No */}
                            <span
                              style={{
                                fontSize: '0.7rem',
                                color: 'var(--accent-cyan)',
                                background: 'rgba(6, 182, 212, 0.12)',
                                border: '1px solid rgba(6, 182, 212, 0.25)',
                                padding: '0.1rem 0.45rem',
                                borderRadius: '4px',
                                fontWeight: '700',
                                letterSpacing: '0.02em',
                                flexShrink: 0,
                              }}
                            >
                              Bill No : {bill.billId}
                            </span>

                            {/* Bill Name with label */}
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                minWidth: 0,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--text-muted)',
                                  fontWeight: '700',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Bill Name :
                              </span>
                              <span
                                style={{
                                  color: 'var(--text-main)',
                                  fontWeight: '700',
                                  fontSize: '0.9rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '150px',
                                }}
                                title={bill.billName}
                              >
                                {bill.billName}
                              </span>
                            </div>

                            {/* Status Badge (Checked when clicked/read) */}
                            {isItemReadState && (
                              <span
                                style={{
                                  color: 'var(--accent-emerald)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  fontSize: '0.68rem',
                                  fontWeight: '600',
                                  background: 'rgba(16, 185, 129, 0.12)',
                                  border: '1px solid rgba(16, 185, 129, 0.25)',
                                  padding: '0.08rem 0.38rem',
                                  borderRadius: '4px',
                                  flexShrink: 0,
                                }}
                              >
                                <CheckCircle2 size={11} /> Checked
                              </span>
                            )}
                          </div>

                          {/* Row 2: User ID, Phone Number & Due Date (No person/user font) */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              flexWrap: 'wrap',
                              fontSize: '0.76rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {/* User ID */}
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                            >
                              <span style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>User ID :</span>
                              <span style={{ color: 'var(--text-main)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                {bill.userId || 'N/A'}
                              </span>
                            </div>

                            {/* Phone Number */}
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                color: 'var(--text-muted)',
                              }}
                            >
                              <Phone size={12} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                              <span style={{ whiteSpace: 'nowrap' }}>{bill.phoneNumber || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Right Area: Amount Badge + Chevron */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            flexShrink: 0,
                            alignSelf: 'center',
                          }}
                        >
                          <div
                            style={{
                              color: 'var(--accent-emerald)',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              whiteSpace: 'nowrap',
                              background: 'rgba(16, 185, 129, 0.12)',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              padding: '0.22rem 0.55rem',
                              borderRadius: '6px',
                            }}
                          >
                            PKR {Number(bill.amount || 0).toLocaleString()}
                          </div>
                          <ChevronRight size={16} color="var(--text-dim)" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>,
          document.body
        )}

      {/* Render ViewBillModal safely via React Portal at document.body level */}
      {selectedBillDetails &&
        ReactDOM.createPortal(
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



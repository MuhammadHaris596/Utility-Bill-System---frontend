import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Printer,
  FileText,
  Image as ImageIcon,
  Calendar,
  User,
  Phone,
  Tag,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import PrintBillModal from '../components/PrintBillModal';
import NewBillModal from '../components/NewBillModal';
import ViewBillModal from '../components/ViewBillModal';
import EditBillModal from '../components/EditBillModal';

const OldBillList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalBills, setTotalBills] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedBillForPrint, setSelectedBillForPrint] = useState(null);
  const [selectedBillForView, setSelectedBillForView] = useState(null);
  const [selectedBillForEdit, setSelectedBillForEdit] = useState(null);
  const [isNewBillOpen, setIsNewBillOpen] = useState(false);

  const fetchBills = async (searchTerm = search, pageNum = page, limitNum = limit) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://utility-bill-system-backend.vercel.app/api/bills?search=${encodeURIComponent(searchTerm)}&page=${pageNum}&limit=${limitNum}`
      );

      if (data && Array.isArray(data.bills)) {
        setBills(data.bills);
        setTotalBills(data.totalBills || 0);
        setTotalPages(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        setBills(data);
        setTotalBills(data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching bills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills(search, page, limit);
  }, [search, page, limit]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to page 1 on limit change
  };

  const handleDeleteBill = async (id) => {
    try {
      await axios.delete(`/api/bills/${id}`);
      fetchBills(search, page, limit);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete bill');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Generate array of page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const startRecordNum = totalBills === 0 ? 0 : (page - 1) * limit + 1;
  const endRecordNum = Math.min(page * limit, totalBills);

  return (
    <div style={{
      maxWidth: '1250px',
      margin: '2rem auto',
      padding: '0 1.5rem'
    }}>
      {/* Top Header & Search bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText color="var(--primary)" size={28} />
            Utility Bill Records (Old Bills)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Total {totalBills} bill records logged in database.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search ID, name, phone, comment..."
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            onClick={() => setIsNewBillOpen(true)}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
            }}
          >
            <PlusCircle size={18} />
            New Bill
          </button>
        </div>
      </div>

      {/* Bill Table Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--glass-shadow)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading bill records...
          </div>
        ) : bills.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No bill records found matching your search.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Bill ID</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Bill Name & Price</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Customer / User</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Contact Phone</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Entry & Due Date</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Comment / Docs</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr
                    key={bill._id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Bill ID */}
                    <td
                      style={{ padding: '1rem 1.25rem', fontWeight: '700', color: 'var(--accent-cyan)', cursor: 'pointer' }}
                      onClick={() => setSelectedBillForView(bill)}
                      title="Click to view details"
                    >
                      {bill.billId}
                    </td>

                    {/* Bill Name & Price */}
                    <td
                      style={{ padding: '1rem 1.25rem', cursor: 'pointer' }}
                      onClick={() => setSelectedBillForView(bill)}
                    >
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{bill.billName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: '700', marginTop: '0.1rem' }}>
                        PKR {bill.amount ? Number(bill.amount).toLocaleString() : '0'}
                      </div>
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{bill.username}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {bill.userId}</div>
                    </td>

                    {/* Phone */}
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--accent-emerald)', fontWeight: '500' }}>
                      {bill.phoneNumber}
                    </td>

                    {/* Dates */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Entry: {formatDate(bill.billEntryDate)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>Due: {formatDate(bill.billDueDate)}</div>
                    </td>

                    {/* Comment & Docs */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {bill.comment && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontStyle: 'italic', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={bill.comment}>
                          💬 {bill.comment}
                        </div>
                      )}
                      {bill.images && bill.images.length > 0 ? (
                        <span
                          onClick={() => setSelectedBillForView(bill)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background: 'rgba(6, 182, 212, 0.15)',
                            color: 'var(--accent-cyan)',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          <ImageIcon size={14} />
                          {bill.images.length} File(s)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>No Docs</span>
                      )}
                    </td>

                    {/* ACTION BUTTONS (VIEW, EDIT, PRINT) */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        {/* VIEW BUTTON */}
                        <button
                          onClick={() => setSelectedBillForView(bill)}
                          title="View Details"
                          style={{
                            background: 'rgba(6, 182, 212, 0.15)',
                            border: '1px solid rgba(6, 182, 212, 0.4)',
                            color: 'var(--accent-cyan)',
                            padding: '0.45rem 0.75rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.25)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)'}
                        >
                          <Eye size={14} />
                          View
                        </button>

                        {/* EDIT BUTTON */}
                        <button
                          onClick={() => setSelectedBillForEdit(bill)}
                          title="Update Bill"
                          style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.4)',
                            color: 'var(--text-main)',
                            padding: '0.45rem 0.75rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'}
                        >
                          <Edit size={14} />
                          Edit
                        </button>

                        {/* PRINT BUTTON */}
                        <button
                          onClick={() => setSelectedBillForPrint(bill)}
                          title="Print Receipt"
                          style={{
                            background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
                            border: 'none',
                            color: '#fff',
                            padding: '0.45rem 0.75rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            boxShadow: '0 3px 10px rgba(99, 102, 241, 0.3)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <Printer size={14} />
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION FOOTER BAR */}
        {totalBills > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            background: 'rgba(15, 23, 42, 0.9)',
            borderTop: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.875rem',
            color: 'var(--text-muted)'
          }}>
            {/* Record Summary */}
            <div>
              Showing <strong style={{ color: 'var(--text-main)' }}>{startRecordNum}</strong> to <strong style={{ color: 'var(--text-main)' }}>{endRecordNum}</strong> of <strong style={{ color: 'var(--text-main)' }}>{totalBills}</strong> bill entries
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {/* Rows Per Page Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Rows per page:</span>
                <select
                  value={limit}
                  onChange={handleLimitChange}
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    borderRadius: '6px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.85rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Page Buttons Controls */}
              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                {/* FIRST PAGE */}
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  title="First Page"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: page === 1 ? 'var(--text-dim)' : 'var(--text-main)',
                    padding: '0.35rem 0.5rem',
                    borderRadius: '6px',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: page === 1 ? 0.4 : 1
                  }}
                >
                  <ChevronsLeft size={16} />
                </button>

                {/* PREVIOUS PAGE */}
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  title="Previous Page"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: page === 1 ? 'var(--text-dim)' : 'var(--text-main)',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    opacity: page === 1 ? 0.4 : 1
                  }}
                >
                  <ChevronLeft size={15} />
                  Prev
                </button>

                {/* NUMERIC PAGE BUTTONS */}
                {getPageNumbers().map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    style={{
                      background: pNum === page ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                      border: pNum === page ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      color: '#ffffff',
                      minWidth: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: pNum === page ? '700' : '500',
                      fontSize: '0.85rem',
                      boxShadow: pNum === page ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    {pNum}
                  </button>
                ))}

                {/* NEXT PAGE */}
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  title="Next Page"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: page === totalPages ? 'var(--text-dim)' : 'var(--text-main)',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    opacity: page === totalPages ? 0.4 : 1
                  }}
                >
                  Next
                  <ChevronRight size={15} />
                </button>

                {/* LAST PAGE */}
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  title="Last Page"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: page === totalPages ? 'var(--text-dim)' : 'var(--text-main)',
                    padding: '0.35rem 0.5rem',
                    borderRadius: '6px',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: page === totalPages ? 0.4 : 1
                  }}
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedBillForView && (
        <ViewBillModal
          bill={selectedBillForView}
          onClose={() => setSelectedBillForView(null)}
          onEdit={(billToEdit) => {
            setSelectedBillForView(null);
            setSelectedBillForEdit(billToEdit);
          }}
          onDelete={(id) => handleDeleteBill(id)}
        />
      )}

      {/* EDIT BILL MODAL */}
      {selectedBillForEdit && (
        <EditBillModal
          bill={selectedBillForEdit}
          isOpen={!!selectedBillForEdit}
          onClose={() => setSelectedBillForEdit(null)}
          onBillUpdated={() => fetchBills(search, page, limit)}
        />
      )}

      {/* PRINT VIEW MODAL */}
      {selectedBillForPrint && (
        <PrintBillModal
          bill={selectedBillForPrint}
          onClose={() => setSelectedBillForPrint(null)}
        />
      )}

      {/* NEW BILL MODAL */}
      <NewBillModal
        isOpen={isNewBillOpen}
        onClose={() => setIsNewBillOpen(false)}
        onBillCreated={() => fetchBills(search, page, limit)}
      />
    </div>
  );
};

export default OldBillList;

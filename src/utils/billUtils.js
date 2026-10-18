// Consistent Asia/Karachi date and record utilities for Utility Bill System

export const formatDatePK = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch (e) {
    return 'N/A';
  }
};

export const getTodayPK = () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
};

export const getRecordNumber = (bill) => {
  if (!bill) return '001';
  if (bill.recordNumber !== undefined && bill.recordNumber !== null) {
    const cleanNum = parseInt(String(bill.recordNumber).replace(/\D/g, ''), 10);
    if (!isNaN(cleanNum)) {
      return String(cleanNum).padStart(3, '0').slice(-3);
    }
  }
  if (!bill._id) return '001';
  let hashVal = 0;
  for (let i = 0; i < bill._id.length; i++) {
    hashVal = (hashVal << 5) - hashVal + bill._id.charCodeAt(i);
    hashVal |= 0;
  }
  const positive = (Math.abs(hashVal) % 999) + 1;
  return String(positive).padStart(3, '0');
};

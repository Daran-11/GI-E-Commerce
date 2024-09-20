// utils/formatDate.js
export function formatDateToThaiBuddhist(date) {
    const thaiYearOffset = 543;
    const dateObj = new Date(date);
    const year = dateObj.getFullYear() + thaiYearOffset;
    const month = dateObj.toLocaleString('default', { month: 'numeric' });
    const day = dateObj.toLocaleString('default', { day: 'numeric' });
  
    return `${day}/${month}/${year}`;
  }
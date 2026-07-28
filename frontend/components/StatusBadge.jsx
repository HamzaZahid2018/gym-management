import React from 'react';

const statusStyles = {
  paid: 'badge-paid',
  unpaid: 'badge-unpaid',
  late: 'badge-late',
  active: 'badge-active',
  inactive: 'badge-inactive',
  suspended: 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm',
};

export default function StatusBadge({ status, label }) {
  return (
    <span className={statusStyles[status] || 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm'}>
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

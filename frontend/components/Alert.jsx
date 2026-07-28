import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

export default function Alert({ type = 'info', message, onClose }) {
  const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };

  const icons = {
    info: FiInfo,
    success: FiCheckCircle,
    error: FiAlertCircle,
    warning: FiAlertCircle,
  };

  const Icon = icons[type];

  return (
    <div className={`${styles[type]} border rounded-lg p-4 flex items-start gap-3`}>
      <Icon className="mt-0.5 flex-shrink-0" size={20} />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
}

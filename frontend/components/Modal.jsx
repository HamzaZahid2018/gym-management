import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ isOpen, title, children, onClose, onSubmit, submitText = 'Save' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {onSubmit && (
          <div className="flex gap-3 justify-end p-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="btn-primary"
            >
              {submitText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

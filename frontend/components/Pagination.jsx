import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    }
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiChevronLeft />
      </button>

      {pages.map((page, idx) => (
        <React.Fragment key={page}>
          {idx > 0 && pages[idx - 1] !== page - 1 && (
            <span className="px-2">...</span>
          )}
          <button
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

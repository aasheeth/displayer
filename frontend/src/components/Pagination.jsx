import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // For better UX, limit the number of page buttons shown
  const MAX_VISIBLE_PAGES = 5;
  
  // Calculate the range of pages to show
  let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
  
  // Adjust the start page if we're near the end
  if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
    startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
  }
  
  // Generate page numbers to display
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      {/* First page */}
      {startPage > 1 && (
        <button
          style={{
            margin: "0 4px",
            padding: "6px 12px",
            backgroundColor: "#e0e0e0",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => onPageChange(1)}
        >
          &lt;&lt;
        </button>
      )}
      
      {/* Previous page */}
      {currentPage > 1 && (
        <button
          style={{
            margin: "0 4px",
            padding: "6px 12px",
            backgroundColor: "#e0e0e0",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt;
        </button>
      )}
      
      {/* Page numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          style={{
            margin: "0 4px",
            padding: "6px 12px",
            backgroundColor: page === currentPage ? "#007bff" : "#e0e0e0",
            color: page === currentPage ? "#fff" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      {/* Next page */}
      {currentPage < totalPages && (
        <button
          style={{
            margin: "0 4px",
            padding: "6px 12px",
            backgroundColor: "#e0e0e0",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </button>
      )}
      
      {/* Last page */}
      {endPage < totalPages && (
        <button
          style={{
            margin: "0 4px",
            padding: "6px 12px",
            backgroundColor: "#e0e0e0",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => onPageChange(totalPages)}
        >
          &gt;&gt;
        </button>
      )}
    </div>
  );
};

export default Pagination;
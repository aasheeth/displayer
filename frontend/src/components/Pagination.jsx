import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  if (totalPages <= 1) {
    return null;
  }

  const MAX_VISIBLE_PAGES = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
  if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
    startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
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
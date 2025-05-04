const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
      </div>
    );
  };
  
  export default Pagination;
  
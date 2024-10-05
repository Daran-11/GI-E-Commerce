import React from "react";
import styles from "./pagination.module.css"; // Import CSS module for pagination styles

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;
  // console.log('Total Items:', totalItems);
  // console.log('Items Per Page:', itemsPerPage);
  // console.log('Total Pages:', totalPages);
  // console.log('Current Page:', currentPage);
  
  // Handle page change within valid page range
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Render nothing if no items
  if (totalItems === 0) {
    return null; // Early return if there are no items
  }

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1} // Disable "ย้อนกลับ" when on the first page
      >
        ย้อนกลับ
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages} // Disable "ถัดไป" when on the last page
      >
        ถัดไป
      </button>
    </div>
  );
};

export default Pagination;

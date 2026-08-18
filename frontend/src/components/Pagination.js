import React from "react";
function getPageNumbers(currentPage, totalPages, siblingCount = 1){
    const totalNumbersShown = siblingCount * 2 + 5;
    if(totalPages<=totalNumbersShown){
      return Array.from({length: totalPages},(_, i) => i + 1);
    }
    const left = Math.max(currentPage - siblingCount, 1);
    const right = Math.min(currentPage + siblingCount, totalPages);
    const showLeftEllipsis = left > 2;
    const showRightEllipsis=right<totalPages - 1;
    const pages = [1];
    if (showLeftEllipsis) pages.push("...");
    for(let i=left;i<=right;i++){
      if(i!==1 && i!==totalPages){pages.push(i)}
    }
    if (showRightEllipsis) pages.push("...");
    if (totalPages !== 1) pages.push(totalPages);
    return pages;
  }

  export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages<=1){
        return null;
    }
    const pages = getPageNumbers(currentPage, totalPages);
    return(
        <nav aria-label="Pagination" className="pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage===1}
                aria-label="Previous page"
            >
                Previous
            </button>
            {pages.map((page,idx)=>
            page==="..."?(<span key={`ellipsis-${idx}`} className="pagination-ellipsis">...</span>):(
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={page === currentPage ? "active" : ""}>
                    {page}
                </button>
            )
            )}
             <button
                onClick={() => onPageChange(currentPage+1)}
                disabled={currentPage===totalPages}
                aria-label="Next page"
            >
                Next
            </button>
        </nav>

    );
  };
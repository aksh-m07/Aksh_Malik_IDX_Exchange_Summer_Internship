import React from "react";
function getPageNumbers(currentPage, totalPages, siblingCount = 1){
    // Total slots shown = first page + last page + current page + 2 sibling
    // pages on each side (siblingCount * 2) + up to 2 ellipsis slots.
    // If totalPages fits within this count, no ellipsis logic is needed at
    const totalNumbersShown = siblingCount * 2 + 5;
    if(totalPages<=totalNumbersShown){
      return Array.from({length: totalPages},(_, i) => i + 1);
    }
    // Clamp the sibling window so it never goes below page 1 or above
    // currentPage - siblingCount could go negative (or currentPage +
    // siblingCount could exceed totalPages).
    const left = Math.max(currentPage - siblingCount, 1);
    const right = Math.min(currentPage + siblingCount, totalPages);
    // An ellipsis is only needed if there's an actual gap to hide i.e.
    // more than one page number between "1" and the start of the sibling
    // window. If left were 2, there's no gap (page 2 would just show
    // normally), so the threshold is > 2, not >= 2. Same logic mirrored
    // for the right side against totalPages.
    const showLeftEllipsis = left > 2;
    const showRightEllipsis=right<totalPages - 1;
    const pages = [1];
    if (showLeftEllipsis) pages.push("...");
    // Fill in the sibling window (left..right). Skiping 1 and totalPages here
    // specifically because they're pushed separately below. Without this check,
    // they could be pushed twice if the sibling window happens to reach
    // either edge.
    for(let i=left;i<=right;i++){
    // Guards against pushing page 1 twice when totalPages is 1.
    if(i!==1 && i!==totalPages){pages.push(i)}
    }
    if (showRightEllipsis) pages.push("...");
    if (totalPages !== 1) pages.push(totalPages);
    return pages;
  }

  export default function Pagination({ currentPage, totalPages, onPageChange }) {
    // No pagination UI needed at all if there's only one page (or zero).
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
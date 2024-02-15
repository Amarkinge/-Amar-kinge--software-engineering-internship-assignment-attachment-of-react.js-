import React from 'react';
import { PagesDetails } from '../types';

interface PaginationProps {
    pages: PagesDetails;
    currentPage: number;
    onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pages, currentPage, onPageChange }) => {

    // Generate an array of page numbers
    const pageNumbers: number[] = [];
    for (let i = pages.pagesStart; i <= pages.pagesStop; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>Previous</button>
                </li>

                {pageNumbers.map((pageNumber) => (
                    <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(pageNumber)}>{pageNumber}</button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === pages.pagesStop ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>Next</button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;

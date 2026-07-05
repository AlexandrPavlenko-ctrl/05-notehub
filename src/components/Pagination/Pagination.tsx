import React from 'react';
import ReactPaginateModule from 'react-paginate';
import css from './Pagination.module.css';

const ReactPaginate = (ReactPaginateModule as unknown as { default?: React.ComponentType<unknown> }).default ?? ReactPaginateModule;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      previousLabel={'← Назад'}
      nextLabel={'Вперед →'}
      breakLabel={'...'}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      forcePage={currentPage - 1}
      containerClassName={css.paginationContainer}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.prevItem}
      previousLinkClassName={css.prevLink}
      nextClassName={css.nextItem}
      nextLinkClassName={css.nextLink}
      breakClassName={css.breakItem}
      breakLinkClassName={css.breakLink}
      activeClassName={css.activePage}
      disabledClassName={css.disabledItem}
    />
  );
};
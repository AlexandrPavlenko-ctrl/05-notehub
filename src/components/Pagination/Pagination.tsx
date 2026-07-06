import React from 'react';
import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from './Pagination.module.css';

//  СТРОГИЙ БОЙЛЕРПЛЕЙТ ВІД МЕНТОРА ДЛЯ СУМІСНОСТІ З VITE 8.x.x
type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (selectedItem: { selected: number }) => {
    // react-paginate використовує індексацію з 0, тому додаємо 1 для нашого стейту
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
      // Передаємо поточну сторінку мінус 1 (оскільки індексація з нуля)
      forcePage={currentPage - 1}
      
      // Стилі з репозиторію CSS-модулів GoIT
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

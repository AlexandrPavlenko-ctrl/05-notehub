import React, { useState } from 'react';
// 🌟 ОБОВ'ЯЗКОВО додаємо keepPreviousData в імпорт
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '../../services/noteService';

import { SearchBox } from '../SearchBox/SearchBox';
import { Pagination } from '../Pagination/Pagination';
import { NoteList } from '../NoteList/NoteList';
import { Modal } from '../Modal/Modal';
import { NoteForm } from '../NoteForm/NoteForm';

import css from './App.module.css';

export const App: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const PER_PAGE = 12;

  // 🌟 ОНОВЛЕНИЙ ЗАПИТ З БЕЗШОВНОЮ ПАГІНАЦІЄЮ
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    // 🌟 Цей рядок утримує старі нотатки на екрані, поки завантажуються дані для нової сторінки
    placeholderData: keepPreviousData, 
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 500);

  const notesList = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox globalSearch={search} onSearchChange={debouncedSearch} />
        
        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
        
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {/* loader показуємо тільки при першому завантаженні (isLoading), 
            але при перемиканні сторінок користувач бачитиме попередні дані без мерехтіння */}
        {isLoading && <div className={css.status}>Синхронізація...</div>}
        {isError && <div className={css.error}>Помилка завантаження даних.</div>}
        
        {!isLoading && !isError && notesList.length > 0 && (
          <NoteList notes={notesList} />
        )}

        {!isLoading && !isError && notesList.length === 0 && (
          <div className={css.status}>Нотаток не знайдено</div>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes, deleteNote, createNote } from '../../services/NoteService';

import { SearchBox } from '../SearchBox/SearchBox';
import { Pagination } from '../Pagination/Pagination';
import { NoteList } from '../NoteList/NoteList';
import { Modal } from '../Modal/Modal';
import { NoteForm } from '../NoteForm/NoteForm';

import css from './App.module.css';

export const App: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const PER_PAGE = 12;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

 const createMutation = useMutation<unknown, unknown, { title: string; content: string; tag: string }>({
  mutationFn: (payload) => createNote(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    setIsModalOpen(false);
    setSearch('');
    setPage(1);
  },
  onError: (error: unknown) => {
    // ВЫВОДИМ ТОЧНЫЙ ОТВЕТ СЕРВЕРА С ОШИБКОЙ ВАЛИДАЦИИ
    if (typeof error === 'object' && error && 'response' in error) {
      const err = error as { response?: { data?: unknown } };
      if (err.response && err.response.data) {
        const respData = err.response.data;
        console.error('❌ Бекенд отклонил запрос. Причина:', respData);
        const message = (respData as { message?: unknown }).message ?? respData;
        alert(`Ошибка сервера: ${JSON.stringify(message)}`);
        return;
      }
    }
    // Fallback
    const fallbackMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: unknown }).message
        : error;
    console.error('Ошибка:', fallbackMessage);
  }
});

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 500);

const handleFormSubmit = async (values: { title: string; content: string; tag: string }) => {
  // Отправляем СТРОГО то, что собрал Formik: { title, content, tag }
  await createMutation.mutateAsync(values);
};


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
        {isLoading && <div className={css.status}>Синхронізація...</div>}
        {isError && <div className={css.error}>Помилка завантаження даних.</div>}
        
        {!isLoading && !isError && notesList.length > 0 && (
          <NoteList notes={notesList} onDelete={(id) => deleteMutation.mutate(id)} />
        )}

        {!isLoading && !isError && notesList.length === 0 && (
          <div className={css.status}>Нотаток не знайдено</div>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};
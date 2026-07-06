import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService'; // Проверьте регистр буквы N/n в пути!
import {type Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      alert(`Не вдалося видалити нотатку з сервера: ${message}`);
    }
  });

  const handleDeleteClick = (id: string) => {
    if (confirm('Ви впевнені, що хочете остаточно видалити цю нотатку?')) {
      deleteMutation.mutate(id);
    }
  };

  const escapeHTML = (str: string) => {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => {
        const currentTag = note.tag || 'Todo';

        return (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{escapeHTML(note.title)}</h2>
            <p className={css.content}>{escapeHTML(note.content)}</p>
            <div className={css.footer}>
              <span className={css.tag}>{escapeHTML(currentTag)}</span>
              <button 
                className={css.button} 
                onClick={() => handleDeleteClick(note.id)}
                disabled={deleteMutation.isPending} // Блокируем кнопку на время запроса
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

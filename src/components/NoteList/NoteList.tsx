import React from 'react';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ notes, onDelete }) => {
  // Функція для безпечного екранування тексту (захист від XSS)
  const escapeHTML = (str: string) => {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => {
        // Визначаємо текст тегу. Якщо з бекенду прийшло порожнє поле, ставимо дефолтне значення 'Todo'
        const currentTag = note.tag || 'Todo';

        return (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{escapeHTML(note.title)}</h2>
            
            {/* Рендеримо контент нотатки, який тепер зберігається в полі content */}
            <p className={css.content}>{escapeHTML(note.content)}</p>
            
            <div className={css.footer}>
              {/* Відображаємо тег (Todo, Personal, Work тощо) зліва від кнопки */}
              <span className={css.tag}>{escapeHTML(currentTag)}</span>
              
              <button className={css.button} onClick={() => onDelete(note.id)}>
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

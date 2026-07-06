import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const modalRoot = document.getElementById('modal-root') || document.body;

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  
  //  ЛОГІКА БЛОКУВАННЯ СКРОЛУ ТА ЗАКРИТТЯ ПО ESCAPE
  useEffect(() => {
    if (!isOpen) return;

    // 1. Блокуємо скрол на body при відкритті модалки
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // 2. Обробник натискання клавіші Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    // 3. Функція очищення (Cleanup): спрацьовує при закритті або розмонтуванні модалки
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Повертаємо початковий стан скролу для body
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

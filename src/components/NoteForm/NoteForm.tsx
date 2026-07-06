import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import css from './NoteForm.module.css';

interface NoteFormValues {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

interface NoteFormProps {
  onCancel: () => void; // Залишаємо тільки пропс для закриття модалки
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Мінімум 3 символи')
    .max(50, 'Максимум 50 символів')
    .required("Обов'язкове поле"),
  content: Yup.string()
    .max(500, 'Максимум 500 символів'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Некоректний тег')
    .required("Обов'язкове поле"),
});

export const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  // 🌟 ПРЯМА ІНТЕГРАЦІЯ З TANSTACK QUERY ВСЕРЕДИНІ КОМПОНЕНТА
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // Автоматична інвалідація списку нотаток безпосередньо тут
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel(); // Закриваємо модальне вікно після успіху
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Не вдалося створити нотатку';
      alert(`Помилка сервера: ${message}`);
    },
  });

  const initialValues: NoteFormValues = {
    title: '',
    content: '',
    tag: 'Todo',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          // Викликаємо мутацію прямо з Formik
          await createMutation.mutateAsync({
            title: values.title.trim(),
            content: values.content.trim(),
            tag: values.tag,
          });
          resetForm();
        } catch (error) {
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field id="content" name="content" as="textarea" rows={8} className={css.textarea} />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          {Object.keys(errors).length > 0 && (
            <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Форма містить помилки валідації. Перевірте поля.
            </div>
          )}

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || createMutation.isPending}
            >
              {isSubmitting || createMutation.isPending ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

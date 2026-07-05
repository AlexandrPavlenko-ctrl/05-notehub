import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';

// Интерфейс полностью соответствует схеме бэкенда
interface NoteFormValues {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

interface NoteFormProps {
  onSubmit: (values: NoteFormValues) => Promise<void>;
  onCancel: () => void;
}

// Валидация Yup по вашим именам полей
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

export const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onCancel }) => {
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
          // Передаем чистые значения (title, content, tag) в App.tsx
          await onSubmit(values);
          resetForm(); 
        } catch (error) {
          console.error('Помилка при збереженні нотатки:', error);
        } finally {
          // Принудительно разблокируем кнопку после ответа (успех или ошибка)
          setSubmitting(false); 
        }
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form className={css.form}>
          {/* Поле Title */}
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          {/* Поле Content */}
          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content" // Чистое имя content, как требует бэкенд
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          {/* Поле Tag */}
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

          {/* Визуальный индикатор ошибок Yup, если кнопка не нажимается */}
          {Object.keys(errors).length > 0 && (
            <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Форма містить помилки валидації. Перевірте поля.
            </div>
          )}

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting} // Защита от двойного клика, отключается в finally
            >
              {isSubmitting ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

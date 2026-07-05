export interface NoteTag {
  id: string;
  name: string;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Використовуємо content замість колишнього text
  tag: string; // Використовуємо одинарний рядок tag замість колишнього масиву tags
  createdAt: string;
  updatedAt: string;
}

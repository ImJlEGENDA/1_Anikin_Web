import { create } from 'zustand';

// Типизация для TypeScript
export interface Note {
  id: number;
  title: string;
  body: string;
}

interface AppState {
  notes: Note[];
  isLoading: boolean;
  fetchNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id'>) => Promise<void>;
  updateNote: (id: number, title: string, body: string) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
}

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export const useStore = create<AppState>((set, get) => ({
  notes: [],
  isLoading: false,

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}?_limit=2`);
      const data: Note[] = await res.json();
      
      if (data[0]) {
        data[0].title = 'Первая заметка';
        data[0].body = 'Содержимое первой заметки';
      }
      if (data[1]) {
        data[1].title = 'Вторая заметка';
        data[1].body = 'Содержимое второй заметки';
      }
      
      set({ notes: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addNote: async (note) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      const newNote = await res.json();
      newNote.id = Date.now(); 
      set({ notes: [newNote, ...get().notes] });
    } catch (error) {
      console.error(error);
    }
  },

  updateNote: async (id, title, body) => {
    try {
      await fetch(`${API_URL}/${id > 100 ? 1 : id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }), // Отправляем и то, и другое
      });
      // Обновляем состояние с новым title и body
      set({ notes: get().notes.map(n => n.id === id ? { ...n, title, body } : n) });
    } catch (error) {
      console.error(error);
    }
  },

  deleteNote: async (id) => {
    try {
      await fetch(`${API_URL}/${id > 100 ? 1 : id}`, { method: 'DELETE' });
      set({ notes: get().notes.filter(n => n.id !== id) });
    } catch (error) {
      console.error(error);
    }
  }
}));
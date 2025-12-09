import { Note } from '../types';

const STORAGE_KEY = 'neuronote_data';

export const getNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load notes", error);
    return [];
  }
};

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Failed to save notes", error);
  }
};

export const createNote = (): Note => {
  return {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    tags: [],
    createdAt: Date.now(),
    lastModified: Date.now(),
  };
};

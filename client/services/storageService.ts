import { Note } from '../types';
import { apiService } from './apiService';

const STORAGE_KEY = 'neuronote_data';
const USE_API = true; // Enable API by default

export const getNotes = async (): Promise<Note[]> => {
  try {
    if (USE_API) {
      // Try to fetch from backend API first
      const notes = await apiService.getAllNotes();
      if (notes.length > 0) {
        // Save to local storage as backup
        saveNotesLocally(notes);
        return notes;
      }
    }
    // Fallback to local storage
    return getNotesLocally();
  } catch (error) {
    console.error('Failed to load notes', error);
    return getNotesLocally();
  }
};

const getNotesLocally = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load notes from local storage', error);
    return [];
  }
};

export const saveNotes = async (notes: Note[]): Promise<void> => {
  try {
    // Save to local storage
    saveNotesLocally(notes);

    if (USE_API) {
      // Sync with backend for each note
      for (const note of notes) {
        // Try to update or create on backend
        if (note.id && note.id.match(/^\d+$/)) {
          // Note ID looks like a database ID, try updating
          await apiService.updateNote(note);
        } else {
          // New note, create on backend
          const created = await apiService.createNote(note);
          if (created) {
            // Update local note with the new ID from backend
            note.id = created.id;
          }
        }
      }
      // Re-save to local storage with updated IDs
      saveNotesLocally(notes);
    }
  } catch (error) {
    console.error('Failed to save notes', error);
  }
};

const saveNotesLocally = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes to local storage', error);
  }
};

export const deleteNoteFromBackend = async (id: string): Promise<boolean> => {
  if (USE_API) {
    return await apiService.deleteNote(id);
  }
  return true;
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

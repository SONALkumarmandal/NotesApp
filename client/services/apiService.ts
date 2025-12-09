import { Note } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiNote {
  id: number;
  title: string;
  content?: string | null;
  tags: string;  // JSON string array
  createdAt: string;
  updatedAt: string;
}

// Convert API response to frontend Note format
function convertApiNoteToNote(apiNote: ApiNote): Note {
  let tagArray: string[] = [];
  try {
    const parsed = JSON.parse(apiNote.tags);
    tagArray = Array.isArray(parsed) ? parsed : [];
  } catch {
    tagArray = [];
  }

  return {
    id: String(apiNote.id),
    title: apiNote.title,
    content: apiNote.content || '',
    tags: tagArray,
    createdAt: new Date(apiNote.createdAt).getTime(),
    lastModified: new Date(apiNote.updatedAt).getTime(),
  };
}

// Convert frontend Note to API request format
function convertNoteToApiNote(note: Note): Partial<ApiNote> {
  return {
    title: note.title,
    content: note.content || null,
    tags: JSON.stringify(note.tags || []),
  };
}

export const apiService = {
  async getAllNotes(): Promise<Note[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.statusText}`);
      }

      const data = await response.json();
      return (data.data || data || []).map(convertApiNoteToNote);
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  },

  async getNoteById(id: string): Promise<Note | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch note: ${response.statusText}`);
      }

      const data = await response.json();
      return convertApiNoteToNote(data.data || data);
    } catch (error) {
      console.error('Error fetching note:', error);
      return null;
    }
  },

  async createNote(note: Note): Promise<Note | null> {
    try {
      const payload = convertNoteToApiNote(note);
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create note: ${response.statusText}`);
      }

      const data = await response.json();
      return convertApiNoteToNote(data.data || data);
    } catch (error) {
      console.error('Error creating note:', error);
      return null;
    }
  },

  async updateNote(note: Note): Promise<Note | null> {
    try {
      const payload = convertNoteToApiNote(note);
      const response = await fetch(`${API_BASE_URL}/notes/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update note: ${response.statusText}`);
      }

      const data = await response.json();
      return convertApiNoteToNote(data.data || data);
    } catch (error) {
      console.error('Error updating note:', error);
      return null;
    }
  },

  async deleteNote(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  },
};

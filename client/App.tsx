import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Assistant from './components/Assistant';
import { Note, AIView } from './types';
import { createNote, getNotes, saveNotes } from './services/storageService';
import { generateTags, summarizeNote, polishContent, generateTitle } from './services/geminiService';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [aiView, setAiView] = useState<AIView>(AIView.None);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Initial Load
  useEffect(() => {
    const loadedNotes = getNotes();
    if (loadedNotes.length > 0) {
      setNotes(loadedNotes);
      setActiveNoteId(loadedNotes[0].id);
    } else {
      handleCreateNote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistence
  useEffect(() => {
    if (notes.length > 0) {
      saveNotes(notes);
    }
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote = createNote();
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setAiView(AIView.None);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  };

  const handleUpdateNote = useCallback((updates: Partial<Note>) => {
    if (!activeNoteId) return;
    setNotes(prev => prev.map(note => 
      note.id === activeNoteId 
        ? { ...note, ...updates, lastModified: Date.now() } 
        : note
    ));
  }, [activeNoteId]);

  // AI Actions
  const handleGenerateTags = async () => {
    if (!activeNote?.content) return;
    setIsAiProcessing(true);
    try {
      const tags = await generateTags(activeNote.content);
      // Merge unique tags
      const currentTags = new Set(activeNote.tags);
      tags.forEach(t => currentTags.add(t));
      handleUpdateNote({ tags: Array.from(currentTags) });
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSummarize = async () => {
    if (!activeNote?.content) return;
    setIsAiProcessing(true);
    try {
      const summary = await summarizeNote(activeNote.content);
      // Append summary to the note for now, or could open a modal.
      // Let's append it clearly.
      const newContent = `${activeNote.content}\n\n## AI Summary\n${summary}`;
      handleUpdateNote({ content: newContent });
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handlePolish = async () => {
    if (!activeNote?.content) return;
    setIsAiProcessing(true);
    try {
      const polished = await polishContent(activeNote.content);
      handleUpdateNote({ content: polished });
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleAutoTitle = async () => {
    if (!activeNote?.content) return;
    setIsAiProcessing(true);
    try {
      const title = await generateTitle(activeNote.content);
      handleUpdateNote({ title });
    } finally {
      setIsAiProcessing(false);
    }
  }

  const insertContentAtCursor = (text: string) => {
      if(!activeNote) return;
      const newContent = activeNote.content + "\n\n" + text;
      handleUpdateNote({content: newContent});
  }

  return (
    <div className="flex h-screen w-full bg-dark text-slate-200 overflow-hidden font-sans selection:bg-primary selection:text-white">
      <Sidebar 
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
      />
      
      <main className="flex-1 relative flex">
        {activeNote ? (
          <Editor 
            note={activeNote}
            onUpdate={handleUpdateNote}
            onAutoTag={handleGenerateTags}
            onSummarize={handleSummarize}
            onPolish={handlePolish}
            onGenerateTitle={handleAutoTitle}
            onToggleChat={() => setAiView(prev => prev === AIView.Chat ? AIView.None : AIView.Chat)}
            isAiProcessing={isAiProcessing}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Select or create a note to get started
          </div>
        )}

        {aiView === AIView.Chat && activeNote && (
          <Assistant 
            noteContent={activeNote.content}
            onClose={() => setAiView(AIView.None)}
            onApplyContent={insertContentAtCursor}
          />
        )}
      </main>
    </div>
  );
}

export default App;

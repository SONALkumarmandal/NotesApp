import React, { useState } from 'react';
import { Note } from '../types';
import { IconPlus, IconSearch, IconTrash } from './Icons';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  notes, 
  activeNoteId, 
  onSelectNote, 
  onCreateNote, 
  onDeleteNote 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className="w-full md:w-80 bg-surface border-r border-subtle flex flex-col h-full">
      <div className="p-6 border-b border-subtle">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-display tracking-tight text-white">
            neuro<span className="text-primary">_note</span>
          </h1>
          <button 
            onClick={onCreateNote}
            className="p-3 bg-white text-black rounded-xl hover:bg-primary hover:scale-105 transition-all duration-200 shadow-[0_0_15px_rgba(163,230,53,0.3)]"
            title="new note"
          >
            <IconPlus className="w-5 h-5" />
          </button>
        </div>
        <div className="relative group">
          <IconSearch className="w-4 h-4 absolute left-3 top-3 text-zinc-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="find the tea..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark text-zinc-300 pl-10 pr-4 py-2.5 rounded-xl border border-subtle focus:outline-none focus:border-primary transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm font-medium">
            {searchTerm ? 'ghost town here.' : 'start cooking something.'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`group p-4 rounded-2xl cursor-pointer border transition-all duration-200 relative overflow-hidden ${
                  activeNoteId === note.id
                    ? 'bg-subtle border-zinc-600'
                    : 'bg-transparent border-transparent hover:bg-dark'
                }`}
              >
                {activeNoteId === note.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary"></div>
                )}
                <div className="flex justify-between items-start pl-2">
                  <h3 className={`font-display font-bold truncate pr-2 ${activeNoteId === note.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {note.title || 'untitled vibe'}
                  </h3>
                  <button
                    onClick={(e) => onDeleteNote(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-500 transition-opacity"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-1 truncate pl-2 font-medium opacity-80">
                  {note.content.substring(0, 50) || 'empty brain...'}
                </p>
                <div className="flex gap-1.5 mt-3 flex-wrap pl-2">
                  {note.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-dark border border-subtle text-zinc-400 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
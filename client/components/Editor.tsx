import React, { useEffect, useRef } from 'react';
import { Note } from '../types';
import { IconWand, IconTag, IconMessage } from './Icons';

interface EditorProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
  onAutoTag: () => void;
  onSummarize: () => void;
  onPolish: () => void;
  onGenerateTitle: () => void;
  onToggleChat: () => void;
  isAiProcessing: boolean;
}

const Editor: React.FC<EditorProps> = ({ 
  note, 
  onUpdate, 
  onAutoTag, 
  onSummarize, 
  onPolish,
  onGenerateTitle,
  onToggleChat,
  isAiProcessing
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [note.content]);

  return (
    <div className="flex-1 h-full flex flex-col bg-dark overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-subtle flex justify-between items-center bg-dark/50 backdrop-blur-sm z-10">
        <div className="flex gap-2">
            <button
                onClick={onGenerateTitle}
                disabled={isAiProcessing || !note.content}
                className="text-xs font-bold text-zinc-400 hover:text-primary px-3 py-1.5 rounded-full border border-subtle hover:border-primary/50 hover:bg-subtle/50 transition-all flex items-center gap-1.5 disabled:opacity-30"
            >
                <IconWand className="w-3 h-3" /> ✨ name it
            </button>
            <button
                onClick={onAutoTag}
                disabled={isAiProcessing || !note.content}
                className="text-xs font-bold text-zinc-400 hover:text-secondary px-3 py-1.5 rounded-full border border-subtle hover:border-secondary/50 hover:bg-subtle/50 transition-all flex items-center gap-1.5 disabled:opacity-30"
            >
                <IconTag className="w-3 h-3" /> # vibes
            </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPolish}
            disabled={isAiProcessing || !note.content}
            className="text-xs font-bold bg-subtle hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-full transition-colors flex items-center gap-2 disabled:opacity-30"
          >
            💅 glow up
          </button>
           <button
            onClick={onSummarize}
            disabled={isAiProcessing || !note.content}
            className="text-xs font-bold bg-subtle hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-full transition-colors disabled:opacity-30"
          >
            💀 tl;dr
          </button>
          <button
            onClick={onToggleChat}
            className="text-xs font-bold bg-white text-black hover:bg-primary px-4 py-2 rounded-full transition-all shadow-lg shadow-white/10 hover:shadow-primary/20 flex items-center gap-2 group"
          >
            <IconMessage className="w-3 h-3 group-hover:rotate-12 transition-transform" /> 
            ask bestie
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-12">
          <input
            type="text"
            value={note.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="untitled vibe"
            className="w-full bg-transparent text-5xl font-display font-bold text-white placeholder-zinc-700 border-none focus:outline-none focus:ring-0 mb-6 tracking-tight"
          />
          
          <div className="flex flex-wrap gap-2 mb-10">
            {note.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface text-secondary text-xs font-mono border border-subtle group hover:border-secondary/50 transition-colors">
                #{tag}
                <button 
                  onClick={() => onUpdate({ tags: note.tags.filter(t => t !== tag) })}
                  className="ml-1.5 text-zinc-600 hover:text-white transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
            <input 
              type="text"
              placeholder="+ add vibe"
              className="bg-transparent text-xs text-zinc-500 focus:text-primary outline-none min-w-[60px] font-mono"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.currentTarget.value.trim();
                  if (val && !note.tags.includes(val)) {
                    onUpdate({ tags: [...note.tags, val] });
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
          </div>

          <textarea
            ref={textareaRef}
            value={note.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="start yapping..."
            className="w-full bg-transparent text-zinc-300 text-lg leading-relaxed border-none focus:outline-none focus:ring-0 resize-none min-h-[500px]"
          />
        </div>
      </div>
      
      <div className="px-8 py-3 text-[10px] text-zinc-600 font-mono uppercase tracking-widest flex justify-between border-t border-subtle">
        <span>{note.content.split(/\s+/).filter(w => w.length > 0).length} words</span>
        <span>edited {new Date(note.lastModified).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    </div>
  );
};

export default Editor;
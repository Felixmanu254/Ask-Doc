import React, { useState } from 'react';
import { JOURNAL_PROMPTS } from '../constants';
import { JournalEntry } from '../types';
import { generateJournalFeedback } from '../services/geminiService';
import { RefreshCw, Book, Sparkles, Loader2 } from 'lucide-react';

interface JournalProps {
  entries: JournalEntry[];
  onSave: (entry: JournalEntry) => void;
}

const Journal: React.FC<JournalProps> = ({ entries, onSave }) => {
  const [currentPrompt, setCurrentPrompt] = useState(JOURNAL_PROMPTS[0]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const handleRefreshPrompt = () => {
    const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
    setCurrentPrompt(randomPrompt);
    setAiFeedback(null);
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    setAiFeedback(null);

    // Create entry
    const newEntry: JournalEntry = {
        id: Date.now().toString(),
        prompt: currentPrompt,
        content: content,
        timestamp: Date.now()
    };
    
    // Save via prop
    onSave(newEntry);

    // Get simple AI feedback
    try {
        const feedback = await generateJournalFeedback(content);
        setAiFeedback(feedback);
    } catch (e) {
        console.error("No feedback available", e);
    } finally {
        setIsSubmitting(false);
        // content is intentionally left until user resets or writes new, 
        // but feedback section offers "Write another entry" which clears it.
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        {/* Active Journaling Area */}
      <div className="bg-white dark:bg-sage-900 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-800 p-6 transition-colors duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-sage-600 dark:text-sage-300">
            <Book size={20} />
            <h2 className="font-semibold">Daily Reflection</h2>
          </div>
          <button
            onClick={handleRefreshPrompt}
            className="text-sage-400 hover:text-sage-600 dark:hover:text-sage-200 transition-colors"
            title="New Prompt"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="mb-6 bg-sage-50 dark:bg-sage-800 p-4 rounded-xl border border-sage-100 dark:border-sage-700">
          <p className="text-sage-800 dark:text-sage-100 font-medium text-center italic">"{currentPrompt}"</p>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting || !!aiFeedback} 
          placeholder="Start writing here..."
          className="w-full p-4 bg-white dark:bg-sage-800 border border-sage-200 dark:border-sage-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-300 min-h-[200px] text-gray-700 dark:text-gray-100 leading-relaxed resize-y mb-4"
        />

        {!aiFeedback && (
            <button
                onClick={handleSave}
                disabled={!content.trim() || isSubmitting}
                className="w-full py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 disabled:opacity-50 transition-colors font-medium flex justify-center items-center gap-2"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {isSubmitting ? 'Reflecting...' : 'Save & Reflect'}
            </button>
        )}

        {/* Feedback Section */}
        {aiFeedback && (
            <div className="bg-calm-50 dark:bg-sky-900/30 border border-calm-100 dark:border-sky-800 p-5 rounded-xl animate-fade-in mt-4">
                <div className="flex items-center gap-2 text-calm-700 dark:text-sky-300 mb-2">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Ask Doc's Thought</span>
                </div>
                <p className="text-calm-900 dark:text-sky-100 text-sm leading-relaxed">{aiFeedback}</p>
                <button 
                    onClick={() => {
                        setAiFeedback(null);
                        setContent('');
                        handleRefreshPrompt();
                    }}
                    className="mt-4 text-xs font-semibold text-calm-600 dark:text-sky-400 hover:text-calm-800 dark:hover:text-sky-200 underline"
                >
                    Write another entry
                </button>
            </div>
        )}
      </div>
      
      {/* Past Entries Preview (Mini) */}
      {entries.length > 0 && (
          <div className="space-y-3">
              <h3 className="text-sage-500 text-sm font-bold uppercase tracking-wider ml-1">Recent Entries</h3>
              {entries.slice(0, 3).map(entry => (
                  <div key={entry.id} className="bg-white dark:bg-sage-900 p-4 rounded-xl border border-sage-100 dark:border-sage-800 opacity-75 hover:opacity-100 transition-opacity">
                      <p className="text-xs text-sage-400 mb-1">{new Date(entry.timestamp).toLocaleDateString()}</p>
                      <p className="text-sm font-medium text-sage-800 dark:text-sage-200 truncate">{entry.prompt}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{entry.content}</p>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default Journal;
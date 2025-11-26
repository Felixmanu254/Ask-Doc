import React, { useState, useEffect } from 'react';
import { ViewState, MoodEntry, JournalEntry } from './types';
import ChatCompanion from './components/ChatCompanion';
import MoodTracker from './components/MoodTracker';
import Journal from './components/Journal';
import ResourceHub from './components/ResourceHub';
import Insights from './components/Insights';
import { MessageCircle, Smile, Book, Info, HeartHandshake, Lightbulb, Moon, Sun } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('companion');
  
  // Initialize from Local Storage
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
    try {
        const saved = localStorage.getItem('askdoc_moods');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to load moods", e);
        return [];
    }
  });

  const [journalHistory, setJournalHistory] = useState<JournalEntry[]>(() => {
    try {
        const saved = localStorage.getItem('askdoc_journals');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to load journals", e);
        return [];
    }
  });
  
  // Initialize dark mode from local storage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Persist Moods
  useEffect(() => {
    localStorage.setItem('askdoc_moods', JSON.stringify(moodHistory));
  }, [moodHistory]);

  // Persist Journals
  useEffect(() => {
    localStorage.setItem('askdoc_journals', JSON.stringify(journalHistory));
  }, [journalHistory]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSaveMood = (entry: MoodEntry) => {
    setMoodHistory(prev => [entry, ...prev]);
  };

  const handleSaveJournal = (entry: JournalEntry) => {
    setJournalHistory(prev => [entry, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'companion': return <ChatCompanion />;
      case 'mood': return <MoodTracker entries={moodHistory} onSave={handleSaveMood} />;
      case 'journal': return <Journal entries={journalHistory} onSave={handleSaveJournal} />;
      case 'insights': return <Insights moods={moodHistory} journals={journalHistory} />;
      case 'resources': return <ResourceHub />;
      default: return <ChatCompanion />;
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-sage-950 text-gray-800 dark:text-gray-100 font-sans selection:bg-sage-200 dark:selection:bg-sage-700 transition-colors duration-300">
      {/* Sticky Mobile/Desktop Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-sage-900/80 backdrop-blur-md border-b border-sage-200 dark:border-sage-800 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sage-700 dark:text-sage-200">
            <HeartHandshake className="text-sage-600 dark:text-sage-400" size={28} />
            <h1 className="text-xl font-bold tracking-tight">Ask Doc</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1 bg-sage-100/50 dark:bg-sage-800/50 p-1 rounded-full mr-4">
                <NavButton 
                    active={currentView === 'companion'} 
                    onClick={() => setCurrentView('companion')} 
                    icon={<MessageCircle size={18} />} 
                    label="Companion" 
                />
                <NavButton 
                    active={currentView === 'mood'} 
                    onClick={() => setCurrentView('mood')} 
                    icon={<Smile size={18} />} 
                    label="Mood" 
                />
                <NavButton 
                    active={currentView === 'journal'} 
                    onClick={() => setCurrentView('journal')} 
                    icon={<Book size={18} />} 
                    label="Journal" 
                />
                <NavButton 
                    active={currentView === 'insights'} 
                    onClick={() => setCurrentView('insights')} 
                    icon={<Lightbulb size={18} />} 
                    label="Insights" 
                />
                <NavButton 
                    active={currentView === 'resources'} 
                    onClick={() => setCurrentView('resources')} 
                    icon={<Info size={18} />} 
                    label="Resources" 
                />
            </nav>
            
            <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-sage-600 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors"
                aria-label="Toggle dark mode"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 mb-20 md:mb-0">
        <div className="animate-fade-in-up">
            {renderView()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-sage-900 border-t border-sage-200 dark:border-sage-800 px-4 py-3 flex justify-between items-center z-50 pb-safe transition-colors duration-300">
        <MobileNavIcon 
            active={currentView === 'companion'} 
            onClick={() => setCurrentView('companion')} 
            icon={<MessageCircle size={24} />} 
            label="Chat" 
        />
        <MobileNavIcon 
            active={currentView === 'mood'} 
            onClick={() => setCurrentView('mood')} 
            icon={<Smile size={24} />} 
            label="Mood" 
        />
        <MobileNavIcon 
            active={currentView === 'journal'} 
            onClick={() => setCurrentView('journal')} 
            icon={<Book size={24} />} 
            label="Journal" 
        />
        <MobileNavIcon 
            active={currentView === 'insights'} 
            onClick={() => setCurrentView('insights')} 
            icon={<Lightbulb size={24} />} 
            label="Insights" 
        />
        <MobileNavIcon 
            active={currentView === 'resources'} 
            onClick={() => setCurrentView('resources')} 
            icon={<Info size={24} />} 
            label="Help" 
        />
      </div>
    </div>
  );
}

// Helper Components for Navigation
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            active 
            ? 'bg-white dark:bg-sage-700 text-sage-800 dark:text-white shadow-sm' 
            : 'text-sage-600 dark:text-sage-300 hover:text-sage-800 dark:hover:text-white hover:bg-sage-200/50 dark:hover:bg-sage-700/50'
        }`}
    >
        {icon}
        {label}
    </button>
);

const MobileNavIcon: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 transition-colors w-16 ${
            active ? 'text-sage-700 dark:text-sage-200' : 'text-gray-400 dark:text-sage-600'
        }`}
    >
        <div className={`p-1 rounded-xl ${active ? 'bg-sage-100 dark:bg-sage-800' : ''}`}>
            {icon}
        </div>
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);

export default App;
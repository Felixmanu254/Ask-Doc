import React, { useState } from 'react';
import { MOODS } from '../constants';
import { MoodEntry, MoodType } from '../types';
import { Save } from 'lucide-react';

interface MoodTrackerProps {
  entries: MoodEntry[];
  onSave: (entry: MoodEntry) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ entries, onSave }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [note, setNote] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSave = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      intensity,
      note,
      timestamp: Date.now(),
    };

    onSave(newEntry);
    setSelectedMood(null);
    setIntensity(5);
    setNote('');
    alert("Mood logged successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-sage-900 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-800 p-6 transition-colors duration-300">
        <h2 className="text-xl font-bold text-sage-900 dark:text-white mb-6 text-center">How are you feeling right now?</h2>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8">
          {MOODS.map((m) => (
            <button
              key={m.type}
              onClick={() => setSelectedMood(m.type)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                selectedMood === m.type
                  ? `${m.color} ring-2 ring-offset-2 ring-sage-300 transform scale-105`
                  : 'bg-sage-50 dark:bg-sage-800 text-gray-500 dark:text-gray-400 hover:bg-sage-100 dark:hover:bg-sage-700'
              }`}
            >
              <span className="text-3xl mb-2">{m.emoji}</span>
              <span className="text-xs font-medium">{m.type}</span>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-sage-700 dark:text-sage-200 mb-2">
                Intensity: {intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-sage-200 dark:bg-sage-700 rounded-lg appearance-none cursor-pointer accent-sage-600"
              />
              <div className="flex justify-between text-xs text-sage-400 mt-1">
                <span>Mild</span>
                <span>Strong</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 dark:text-sage-200 mb-2">
                Add a note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 bg-sage-50 dark:bg-sage-800 border border-sage-200 dark:border-sage-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-300 text-sm text-gray-700 dark:text-gray-200"
                rows={3}
                placeholder="Why do you feel this way?"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors font-medium"
            >
              <Save size={18} />
              Log Mood
            </button>
          </div>
        )}
      </div>

      <div className="text-center">
        <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-sage-600 dark:text-sage-300 text-sm underline hover:text-sage-800 dark:hover:text-white"
        >
            {showHistory ? 'Hide History' : 'Show Previous Entries'}
        </button>
      </div>

      {showHistory && (
        <div className="space-y-3">
            {entries.length === 0 && <p className="text-center text-sage-400 text-sm">No entries yet.</p>}
            {entries.map(entry => {
                const moodData = MOODS.find(m => m.type === entry.mood);
                return (
                    <div key={entry.id} className="bg-white dark:bg-sage-900 p-4 rounded-xl border border-sage-100 dark:border-sage-800 flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{moodData?.emoji}</span>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{entry.mood} <span className="text-sage-400 font-normal text-xs">• Intensity {entry.intensity}</span></p>
                                {entry.note && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{entry.note}</p>}
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                )
            })}
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
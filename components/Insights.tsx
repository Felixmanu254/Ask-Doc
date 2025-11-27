import React, { useState } from 'react';
import { Sparkles, Loader2, BarChart3, AlertCircle, WifiOff } from 'lucide-react';
import { MoodEntry, JournalEntry } from '../types';
import { generateInsights } from '../services/geminiService';

interface InsightsProps {
  moods: MoodEntry[];
  journals: JournalEntry[];
}

const Insights: React.FC<InsightsProps> = ({ moods, journals }) => {
  const [insightData, setInsightData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsightData(null); // Clear previous result
    setErrorMessage(null);

    try {
      const result = await generateInsights(moods, journals);
      setInsightData(result);
    } catch (error: any) {
      console.error("Failed to generate insights", error);
      if (error.message === "API Key not found") {
          setErrorMessage("Configuration Error: API Key is missing. Please check your Vercel environment variables.");
      } else {
          setInsightData("I'm having trouble analyzing your data right now. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasData = moods.length > 0 || journals.length > 0;
  // Simple heuristic to detect generic service error messages returned as text
  const isGenericError = insightData?.includes("trouble analyzing") || insightData?.includes("Unable to generate");
  const isError = isGenericError || !!errorMessage;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
            <Sparkles size={24} className="text-yellow-300" />
            <h2 className="text-2xl font-bold">AI Wellness Insights</h2>
        </div>
        <p className="text-purple-100 opacity-90">Discover patterns in your emotional journey.</p>
      </div>

      <div className="bg-white dark:bg-sage-900 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-800 p-6 min-h-[300px] flex flex-col transition-colors duration-300">
        {!insightData && !isLoading && !errorMessage && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                {!hasData ? (
                    <div className="text-sage-400 dark:text-sage-600 space-y-4">
                        <BarChart3 size={48} className="mx-auto opacity-50" />
                        <p>Log some moods or journal entries to unlock personalized insights.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-4 bg-sage-50 dark:bg-sage-800 rounded-full inline-block">
                            <Sparkles size={32} className="text-purple-500" />
                        </div>
                        <div className="max-w-md">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Ready to Analyze</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Ask Doc can analyze your {moods.length} mood logs and {journals.length} journal entries to help you understand your patterns better.
                            </p>
                            <button
                                onClick={handleGenerateInsights}
                                disabled={isLoading}
                                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 mx-auto disabled:opacity-70"
                            >
                                <Sparkles size={18} />
                                Generate Insights
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}

        {isLoading && (
             <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                 <Loader2 className="animate-spin text-purple-600" size={32} />
                 <p className="text-sage-600 dark:text-sage-300 animate-pulse">Analyzing your wellness patterns...</p>
             </div>
        )}

        {errorMessage && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 mb-4">
                    <WifiOff size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Connection Issue</h3>
                <p className="text-red-600 dark:text-red-400 text-sm max-w-sm">{errorMessage}</p>
                <button 
                    onClick={handleGenerateInsights}
                    className="mt-6 px-4 py-2 bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300 rounded-lg text-sm hover:bg-sage-200 dark:hover:bg-sage-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        )}

        {insightData && !isLoading && !errorMessage && (
            <div className="animate-fade-in">
                <div className="flex justify-between items-start mb-6">
                     <h3 className={`text-xl font-bold ${isGenericError ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-100'}`}>
                        {isGenericError ? 'Analysis Failed' : 'Your Wellness Report'}
                     </h3>
                     <button 
                        onClick={handleGenerateInsights}
                        disabled={isLoading}
                        className="text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 underline flex items-center gap-1"
                     >
                        Refresh Analysis
                     </button>
                </div>
               
                <div className={`prose prose-sm max-w-none ${isGenericError ? 'text-red-600 dark:text-red-300' : 'prose-sage dark:prose-invert text-gray-700 dark:text-gray-200'}`}>
                    <div className="whitespace-pre-wrap leading-relaxed space-y-4">
                        {insightData}
                    </div>
                </div>

                {!isGenericError && (
                    <div className="mt-8 pt-4 border-t border-sage-100 dark:border-sage-800 flex items-start gap-3 bg-calm-50 dark:bg-sky-900/20 p-4 rounded-xl">
                        <AlertCircle size={20} className="text-calm-500 dark:text-sky-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-calm-700 dark:text-sky-200">
                            This analysis is generated by AI based on your logs. It is for self-reflection only and not a clinical diagnosis. 
                            Always consult with a professional for mental health concerns.
                        </p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
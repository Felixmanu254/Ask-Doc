import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { MoodEntry, JournalEntry } from "../types";

// Using standard Flash model for best balance of speed and stability
const MODEL_NAME = "gemini-2.5-flash";

let aiInstance: GoogleGenAI | null = null;

const getApiKey = (): string => {
    // List of possible environment variable keys to check
    // Browsers don't have 'process', but bundlers (Vite/Webpack) replace these strings at build time.
    const candidates = [
        'API_KEY',
        'NEXT_PUBLIC_API_KEY',
        'REACT_APP_API_KEY',
        'VITE_API_KEY',
        'GEMINI_API_KEY',
        'NEXT_PUBLIC_GEMINI_API_KEY',
        'VITE_GEMINI_API_KEY',
        'REACT_APP_GEMINI_API_KEY'
    ];

    for (const key of candidates) {
        try {
            // @ts-ignore
            if (process.env[key]) return process.env[key];
        } catch (e) {}
        
        try {
            // @ts-ignore
            if (import.meta.env && import.meta.env[key]) return import.meta.env[key];
        } catch (e) {}
    }

    // Direct checks for common specific patterns that bundlers might replace literally
    try { if (process.env.API_KEY) return process.env.API_KEY; } catch(e) {}
    try { if (process.env.NEXT_PUBLIC_API_KEY) return process.env.NEXT_PUBLIC_API_KEY; } catch(e) {}
    try { if (process.env.REACT_APP_API_KEY) return process.env.REACT_APP_API_KEY; } catch(e) {}
    // @ts-ignore
    try { if (import.meta.env.VITE_API_KEY) return import.meta.env.VITE_API_KEY; } catch(e) {}

    return '';
};

const getAIInstance = (): GoogleGenAI => {
  if (!aiInstance) {
    const apiKey = getApiKey();

    if (!apiKey) {
        console.error("Ask Doc Error: API Key is missing.");
        console.log("Troubleshooting: Ensure you have added 'API_KEY' (or 'NEXT_PUBLIC_API_KEY') to your Vercel Environment Variables and REDEPLOYED the app.");
        throw new Error("API Key not found");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const createChatSession = (): Chat => {
  const ai = getAIInstance();
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Warm and creative but stable
      maxOutputTokens: 500, // Keep responses relatively concise
      thinkingConfig: { thinkingBudget: 0 }, // optimize for lowest latency
    },
  });
};

export const generateJournalFeedback = async (entry: string): Promise<string> => {
    try {
        const ai = getAIInstance();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `The user has written the following journal entry: "${entry}".
            Provide a very brief (2-3 sentences), encouraging, and empathetic reflection on this entry.
            Do not analyze deeply, just acknowledge and validate.`,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                thinkingConfig: { thinkingBudget: 0 }, // optimize for lowest latency
            }
        });
        return response.text || "Thank you for sharing your thoughts.";
    } catch (error: any) {
        if (error.message === "API Key not found") return "Ask Doc is offline (API Key Missing).";
        console.error("Error generating journal feedback:", error);
        return "Your entry has been saved. Writing is a powerful tool for clarity.";
    }
};

export const generateInsights = async (moods: MoodEntry[], journals: JournalEntry[]): Promise<string> => {
  try {
      const ai = getAIInstance();
      
      if (moods.length === 0 && journals.length === 0) {
          return "I need a bit more information to generate insights. Please try logging your mood or writing a journal entry first so I can get to know you better.";
      }

      const moodData = moods.map(m => `- ${new Date(m.timestamp).toLocaleDateString()}: ${m.mood} (Intensity ${m.intensity}/10). Note: ${m.note}`).join('\n');
      const journalData = journals.map(j => `- ${new Date(j.timestamp).toLocaleDateString()}: Prompt: "${j.prompt}" Content: "${j.content}"`).join('\n');

      const response: GenerateContentResponse = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `Analyze the following user wellness data to identify emotional patterns and suggest coping strategies.
          
          Mood Logs:
          ${moodData}
          
          Journal Entries:
          ${journalData}
          
          Please provide a response with the following sections formatted clearly:
          1. 🌊 Emotional Patterns (Trends in mood or recurring themes)
          2. 🧭 Coping Strategies (2-3 tailored, gentle suggestions)
          3. ✨ Suggested Reflection (A specific question for their next journal entry)
          
          Keep the tone warm, empathetic, non-judgmental, and safe. Do not sound clinical. 
          Use emojis to make it friendly.
          IMPORTANT: Start by explicitly stating this is an AI observation and not a medical diagnosis.`,
          config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              thinkingConfig: { thinkingBudget: 0 }, // optimize for lowest latency
          }
      });
      return response.text || "Unable to generate insights at this time.";
  } catch (error: any) {
      if (error.message === "API Key not found") {
          throw error; // Re-throw to be handled by the component
      }
      console.error("Error generating insights:", error);
      throw error; // Re-throw generic errors to be handled by component
  }
};
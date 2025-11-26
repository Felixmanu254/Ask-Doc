import { MoodType, ResourceLink } from './types';

export const SYSTEM_INSTRUCTION = `You are Ask Doc, an AI companion designed to support mental well-being and emotional healing.
Your role is to listen with empathy, provide general information about mental health,
and guide users toward healthier habits, self-reflection, and community support.

Core Guidelines:
- Always respond with compassion, clarity, and respect.
- Never diagnose, prescribe, or replace professional medical advice.
- Encourage users to seek support from trusted people (friends, family, therapists, helplines).
- Share general strategies for emotional regulation, stress management, mindfulness, and self-care.
- Keep tone warm, non-judgmental, and empowering.
- Protect user privacy and avoid storing sensitive details unless explicitly requested.
- Focus on ethical, inclusive, and culturally sensitive communication.
- Goal: Help users feel heard, supported, and guided toward positive next steps.

IMPORTANT: You are running on a low-latency model. Keep responses concise unless asked for elaboration.`;

export const MOODS = [
  { type: MoodType.Happy, emoji: '😊', color: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100' },
  { type: MoodType.Calm, emoji: '😌', color: 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-100' },
  { type: MoodType.Neutral, emoji: '😐', color: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-100' },
  { type: MoodType.Sad, emoji: '😔', color: 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100' },
  { type: MoodType.Anxious, emoji: '😰', color: 'bg-purple-200 text-purple-800 dark:bg-purple-900/50 dark:text-purple-100' },
  { type: MoodType.Angry, emoji: '😠', color: 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-100' },
];

export const JOURNAL_PROMPTS = [
  "What is one thing you are grateful for today?",
  "Describe a moment today where you felt at peace.",
  "What is a challenge you faced today, and how did you handle it?",
  "Write about a person who makes you feel supported.",
  "What is one small act of self-care you can do right now?",
  "How is your body feeling in this present moment?",
  "What would you say to a friend who is feeling exactly how you feel now?"
];

export const RESOURCES: ResourceLink[] = [
  {
    title: "988 Suicide & Crisis Lifeline",
    description: "24/7, free and confidential support for people in distress.",
    url: "https://988lifeline.org/",
    category: "Emergency"
  },
  {
    title: "NAMI HelpLine",
    description: "Free, nationwide peer-support service providing information and resource referrals.",
    url: "https://www.nami.org/help",
    category: "Emergency"
  },
  {
    title: "Crisis Text Line",
    description: "Text HOME to 741741 to connect with a Crisis Counselor. Free 24/7 support.",
    url: "https://www.crisistextline.org/",
    category: "Emergency"
  },
  {
    title: "Mindfulness for Beginners",
    description: "A guide to getting started with mindfulness practice.",
    url: "https://www.mindful.org/meditation/mindfulness-getting-started/",
    category: "Education"
  },
  {
    title: "Sleep Foundation",
    description: "Expert information on sleep hygiene and how to improve your rest.",
    url: "https://www.sleepfoundation.org/sleep-hygiene",
    category: "Education"
  },
  {
    title: "Box Breathing Technique",
    description: "A simple breathing exercise to reduce stress.",
    url: "https://www.webmd.com/balance/what-is-box-breathing",
    category: "Tools"
  },
  {
    title: "Insight Timer",
    description: "Free app for sleep, anxiety, and stress with thousands of guided meditations.",
    url: "https://insighttimer.com/",
    category: "Tools"
  },
  {
    title: "7 Cups",
    description: "Free online text chat with a trained listener for emotional support.",
    url: "https://www.7cups.com/",
    category: "Tools"
  }
];
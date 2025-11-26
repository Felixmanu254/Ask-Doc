import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Message } from '../types';
import { createChatSession } from '../services/geminiService';
import { Chat, GenerateContentResponse } from '@google/genai';

const ChatCompanion: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello, I'm Ask Doc. I'm here to listen and support you. How are you feeling today?",
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use a ref to persist the chat session across renders without recreating it
  const chatSessionRef = useRef<Chat | null>(null);

  // Initialize chat session once
  useEffect(() => {
    if (!chatSessionRef.current) {
        try {
            chatSessionRef.current = createChatSession();
        } catch (e) {
            console.error("Failed to init chat", e);
            setMessages(prev => [...prev, {
                id: 'error-init',
                role: 'model',
                text: "I'm having trouble connecting right now. Please check your configuration.",
                timestamp: Date.now()
            }]);
        }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !chatSessionRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const resultStream = await chatSessionRef.current.sendMessageStream({
          message: userMessage.text
      });

      let fullResponseText = '';
      const responseId = (Date.now() + 1).toString();

      // Add a placeholder message for the model that we will update
      setMessages((prev) => [
        ...prev,
        {
          id: responseId,
          role: 'model',
          text: '',
          timestamp: Date.now(),
        },
      ]);

      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text;
        if (textChunk) {
            fullResponseText += textChunk;
            setMessages((prev) =>
                prev.map((msg) =>
                msg.id === responseId ? { ...msg, text: fullResponseText } : msg
                )
            );
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: "I'm sorry, I'm having trouble processing that right now. Could you try again?",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[600px] w-full max-w-2xl mx-auto bg-white dark:bg-sage-900 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-800 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="bg-sage-100 dark:bg-sage-800 p-4 border-b border-sage-200 dark:border-sage-700 flex items-center gap-3">
        <div className="p-2 bg-sage-500 rounded-full text-white">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-sage-900 dark:text-white">Ask Doc</h2>
          <p className="text-xs text-sage-600 dark:text-sage-300">Always here to listen</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sage-50/50 dark:bg-sage-950/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-calm-500 text-white' : 'bg-sage-500 text-white'
              }`}
            >
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.role === 'user'
                  ? 'bg-calm-500 text-white rounded-tr-none'
                  : 'bg-white dark:bg-sage-800 text-gray-700 dark:text-gray-200 border border-sage-100 dark:border-sage-700 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && messages[messages.length - 1].role === 'user' && (
             <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-sage-500 text-white flex items-center justify-center flex-shrink-0">
               <Bot size={16} />
             </div>
             <div className="bg-white dark:bg-sage-800 p-3 rounded-2xl rounded-tl-none border border-sage-100 dark:border-sage-700 shadow-sm">
               <Loader2 className="animate-spin text-sage-400" size={16} />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-sage-900 border-t border-sage-100 dark:border-sage-800">
        <div className="flex gap-2 items-end">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind..."
            className="flex-1 p-3 bg-sage-50 dark:bg-sage-800 border border-sage-200 dark:border-sage-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-300 resize-none h-12 max-h-32 text-gray-700 dark:text-gray-100 placeholder-sage-400 text-sm"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="p-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-2">
            Ask Doc provides general guidance and is not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default ChatCompanion;
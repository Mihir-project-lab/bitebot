'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Bot, MessageSquare } from 'lucide-react';
import { useAIChat } from '@/hooks/useAI';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ChatMessage } from '@/components/ai/ChatMessage';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AiChatPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isSending, clearChat, isInitializing } = useAIChat();

  // Reference for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages list size changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !isSending) {
      sendMessage(trimmed);
      setInput('');
    }
  };

  return (
    <PageContainer size="narrow" className="h-[calc(100vh-4rem)] flex flex-col py-6">
      <PageHeader
        title="AI Cooking Assistant"
        description="Ask culinary questions, request ingredient substitutions, scaling, or step explanations."
        action={
          messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              disabled={isSending}
              className="flex items-center gap-1 hover:text-red-600 hover:border-red-200"
            >
              <Trash2 className="h-4 w-4" />
              Clear Conversation
            </Button>
          )
        }
        className="mb-4"
      />

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto border border-zinc-200 rounded-2xl bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 mb-4 space-y-4">
        {isInitializing ? (
          <div className="space-y-4 py-10">
            <LoadingSkeleton className="h-16 w-full" />
            <LoadingSkeleton className="h-16 w-full" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-650 dark:bg-indigo-950 dark:text-indigo-400 mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Chat with Chef BiteBot
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
              Ask anything! Try: &quot;What can I substitute for eggs in chocolate chip cookies?&quot; or &quot;How do I cook steak to medium-rare?&quot;
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing Loader Indicator */}
            {isSending && (
              <div className="flex w-full items-start gap-4 p-4 rounded-xl border border-indigo-50/50 bg-indigo-50/5 dark:bg-indigo-950/5 dark:border-indigo-950/20 animate-pulse">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-650 dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-400 shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400">
                    BiteBot Assistant
                  </p>
                  <div className="flex gap-1.5 py-1">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce delay-75" />
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce delay-150" />
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce delay-225" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          placeholder="Ask Chef BiteBot..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isSending || isInitializing}
          className="flex-1"
        />
        <Button type="submit" disabled={!input.trim() || isSending || isInitializing} className="flex items-center gap-1 px-5">
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </PageContainer>
  );
}

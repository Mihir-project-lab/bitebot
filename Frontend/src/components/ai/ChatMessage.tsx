import React from 'react';
import { User, Bot } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex w-full items-start gap-4 p-4 rounded-xl border transition-colors',
        isAssistant
          ? 'bg-zinc-50 border-zinc-150/80 dark:bg-zinc-900/50 dark:border-zinc-800/80'
          : 'bg-white border-zinc-150 dark:bg-zinc-950 dark:border-zinc-900'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-semibold shadow-sm',
          isAssistant
            ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-400'
            : 'bg-zinc-50 border-zinc-200 text-zinc-650 dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-400'
        )}
      >
        {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {isAssistant ? 'BiteBot Assistant' : 'You'}
        </p>
        <div className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
}

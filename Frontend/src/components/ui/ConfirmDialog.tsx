import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onConfirm,
  isLoading = false,
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-200 bg-white p-6 shadow-xl transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-zinc-800 dark:bg-zinc-950',
            'focus:outline-none'
          )}
        >
          <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {description}
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={isLoading}>
                {cancelText}
              </Button>
            </Dialog.Close>
            <Button
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

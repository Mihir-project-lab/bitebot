'use client';

import React from 'react';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useLogin } from '@/hooks/useAuth';
import { FormInput } from '@/components/forms/FormInput';
import { Button } from '@/components/ui/Button';

// 1. Define login schema with Zod
const loginSchema = zod.object({
  email: zod
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: zod
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFields = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const methods = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFields) => {
    login(data);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Sign In to Your Account
        </h3>
        <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-550">
          Enter your details below to access the cooking suite
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="email"
            label="Email Address"
            placeholder="chef@bitebot.ai"
            type="email"
            autoComplete="email"
            disabled={isPending}
          />

          <FormInput
            name="password"
            label="Password"
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            disabled={isPending}
          />

          <Button type="submit" className="w-full mt-2" isLoading={isPending}>
            Sign In
          </Button>
        </form>
      </FormProvider>

      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline transition-colors"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

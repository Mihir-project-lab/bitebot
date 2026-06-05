'use client';

import React from 'react';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useRegister } from '@/hooks/useAuth';
import { FormInput } from '@/components/forms/FormInput';
import { Button } from '@/components/ui/Button';

// 1. Define register schema with Zod
const registerSchema = zod
  .object({
    name: zod
      .string()
      .min(1, 'Name is required')
      .max(50, 'Name must be less than 50 characters'),
    email: zod
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: zod
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: zod.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFields = zod.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();

  const methods = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: RegisterFields) => {
    register({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Create Your Account
        </h3>
        <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-550">
          Start cooking with your personal AI assistant today
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Full Name"
            placeholder="Chef Gusteau"
            type="text"
            disabled={isPending}
          />

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
            autoComplete="new-password"
            disabled={isPending}
          />

          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            type="password"
            autoComplete="new-password"
            disabled={isPending}
          />

          <Button type="submit" className="w-full mt-2" isLoading={isPending}>
            Register
          </Button>
        </form>
      </FormProvider>

      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline transition-colors"
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
}

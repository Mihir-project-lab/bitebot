import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Select, type SelectProps } from '../ui/Select';

interface FormSelectProps extends Omit<SelectProps, 'name'> {
  name: string;
  label?: string;
  helperText?: string;
}

export function FormSelect({ name, label, helperText, className, ...props }: FormSelectProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          {label}
        </label>
      )}
      <Select
        id={name}
        error={!!error}
        className={className}
        {...register(name)}
        {...props}
      />
      {errorMessage ? (
        <span className="text-xs font-medium text-red-500 animate-in fade-in duration-200">
          {errorMessage}
        </span>
      ) : helperText ? (
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{helperText}</span>
      ) : null}
    </div>
  );
}

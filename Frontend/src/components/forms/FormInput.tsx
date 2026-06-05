import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, type InputProps } from '../ui/Input';

interface FormInputProps extends Omit<InputProps, 'name'> {
  name: string;
  label?: string;
  helperText?: string;
}

export function FormInput({ name, label, helperText, className, ...props }: FormInputProps) {
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
      <Input
        id={name}
        error={!!error}
        className={className}
        {...register(name, { valueAsNumber: props.type === 'number' })}
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

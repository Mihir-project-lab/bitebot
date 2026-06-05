import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface FormMultiInputProps {
  name: string;
  type: 'ingredients' | 'steps';
  label: string;
  addButtonText?: string;
}

export function FormMultiInput({
  name,
  type,
  label,
  addButtonText = 'Add Item',
}: FormMultiInputProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const arrayErrors = errors[name] as any;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between border-b border-zinc-150 pb-2 dark:border-zinc-800">
        <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {label}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            if (type === 'ingredients') {
              append({ name: '', amount: '' });
            } else {
              append('');
            }
          }}
          className="h-8 py-1.5 px-3 flex items-center gap-1 text-xs"
        >
          <Plus className="h-3 w-3" />
          {addButtonText}
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 italic text-center py-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
          No items added yet. Click &quot;{addButtonText}&quot; to start.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => {
            const hasError = arrayErrors?.[index];

            return (
              <div key={field.id} className="flex gap-2 items-start animate-in slide-in-from-top-2 duration-150">
                {type === 'ingredients' ? (
                  <div className="flex flex-1 gap-2">
                    <div className="flex-[2] flex flex-col gap-1">
                      <Input
                        placeholder="Ingredient (e.g. Chicken breast)"
                        error={!!hasError?.name}
                        {...register(`${name}.${index}.name` as const)}
                      />
                      {hasError?.name && (
                        <span className="text-[11px] font-medium text-red-500">
                          {hasError.name.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <Input
                        placeholder="Amount (e.g. 500g)"
                        error={!!hasError?.amount}
                        {...register(`${name}.${index}.amount` as const)}
                      />
                      {hasError?.amount && (
                        <span className="text-[11px] font-medium text-red-500">
                          {hasError.amount.message}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col gap-1">
                    <Input
                      placeholder={`Step ${index + 1} description`}
                      error={!!hasError}
                      {...register(`${name}.${index}` as const)}
                    />
                    {hasError && (
                      <span className="text-[11px] font-medium text-red-500">
                        {hasError.message}
                      </span>
                    )}
                  </div>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="h-10 w-10 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {typeof arrayErrors === 'object' && arrayErrors?.root?.message && (
        <span className="text-xs font-medium text-red-500 mt-1">
          {arrayErrors.root.message}
        </span>
      )}
    </div>
  );
}

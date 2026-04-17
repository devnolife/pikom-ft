'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  /** ID input (dibutuhkan agar <label htmlFor> tepat). */
  id: string;
  label: React.ReactNode;
  /** Pesan bantuan yang selalu tampil di bawah field. */
  helperText?: React.ReactNode;
  /** Pesan error inline. Jika ada, field ditandai `aria-invalid`. */
  error?: string;
  /** Label opsional di sisi kanan (mis. "Lupa password?"). */
  rightSlot?: React.ReactNode;
  children: React.ReactElement<{
    id?: string;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
  }>;
  className?: string;
}

/**
 * FormField — wrapper <label>+<input>+<error/helper> dengan ARIA benar.
 * Clone child untuk inject id, aria-invalid, dan aria-describedby.
 */
export function FormField({
  id,
  label,
  helperText,
  error,
  rightSlot,
  children,
  className,
}: FormFieldProps) {
  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={id} className="text-fg-secondary">
          {label}
        </Label>
        {rightSlot && <span className="text-xs">{rightSlot}</span>}
      </div>
      {React.cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {helperText && !error && (
        <p id={helperId} className="text-xs text-fg-muted">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-destructive font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

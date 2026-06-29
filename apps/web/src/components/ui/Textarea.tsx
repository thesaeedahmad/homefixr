import { TextareaHTMLAttributes } from 'react';

/**
 * Textarea — a reusable, accessible multi-line field, matching Input's styling
 * and behaviour (label bound to control, optional error message).
 */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, name, ...props }: TextareaProps) {
  const fieldId = id ?? name;
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={fieldId} className="text-sm font-medium text-neutral-900">
        {label}
      </label>
      <textarea
        id={fieldId}
        name={name}
        aria-invalid={error ? true : undefined}
        className="min-h-[96px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-600 focus:border-primary-600"
        {...props}
      />
      {error && <p className="text-sm text-danger-600">{error}</p>}
    </div>
  );
}

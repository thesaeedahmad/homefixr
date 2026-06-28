import { InputHTMLAttributes } from 'react';

/**
 * Input — a reusable, accessible form field.
 *
 * Every field has a visible <label> tied to it (htmlFor/id) so it is usable by
 * screen readers and by clicking the label (accessibility, Fitts' Law). An
 * optional error message is shown below and announced via aria-invalid
 * (Help Users Recognise and Recover From Errors).
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, name, ...props }: InputProps) {
  const inputId = id ?? name;
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-900">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        aria-invalid={error ? true : undefined}
        className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-600 focus:border-primary-600"
        {...props}
      />
      {error && <p className="text-sm text-danger-600">{error}</p>}
    </div>
  );
}

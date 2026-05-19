"use client";

import React from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    const hasError = !!error;
    const inputClassName = `
      w-full px-4 py-2 border rounded-lg
      transition-colors
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:bg-gray-100 disabled:cursor-not-allowed
      ${
        hasError
          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
          : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
      }
      ${className || ""}
    `;

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={inputClassName}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="text-xs text-red-600 mt-1 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    const hasError = !!error;
    const textareaClassName = `
      w-full px-4 py-2 border rounded-lg
      transition-colors
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:bg-gray-100 disabled:cursor-not-allowed
      resize-vertical
      ${
        hasError
          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
          : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
      }
      ${className || ""}
    `;

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={textareaClassName}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="text-xs text-red-600 mt-1 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    label,
    error,
    helperText,
    required,
    options,
    className,
    ...props
  },
  ref
) => {
    const hasError = !!error;
    const selectClassName = `
      w-full px-4 py-2 border rounded-lg
      transition-colors
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:bg-gray-100 disabled:cursor-not-allowed
      bg-white
      ${
        hasError
          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
          : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400"
      }
      ${className || ""}
    `;

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={selectClassName}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={`${props.id}-error`}
            className="text-xs text-red-600 mt-1 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => {
    const hasError = !!error;
    return (
      <div>
        <div className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            className={`
              h-4 w-4 rounded
              transition-colors
              border-gray-300
              focus:outline-none focus:ring-2 focus:ring-offset-0
              focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${hasError ? "border-red-300" : ""}
              ${className || ""}
            `}
            {...props}
          />
          {label && (
            <label className="ml-3 text-sm font-medium text-gray-900">
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

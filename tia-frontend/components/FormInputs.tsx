"use client";

import React from "react";
import { AlertCircle, ChevronDown } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div>
        {label && (
          <label className="block text-base font-medium text-foreground mb-2">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 bg-card border rounded-lg text-base text-foreground placeholder:text-muted-foreground
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:border-transparent
            disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-60
            ${hasError 
              ? "border-destructive focus:ring-destructive" 
              : "border-input hover:border-muted-foreground/50"}
            ${className || ""}
          `}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="text-sm text-destructive mt-2 flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-sm text-muted-foreground mt-2">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div>
        {label && (
          <label className="block text-base font-medium text-foreground mb-2">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 bg-card border rounded-lg text-base text-foreground placeholder:text-muted-foreground
            transition-all duration-200 resize-y min-h-[120px]
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:border-transparent
            disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-60
            ${hasError 
              ? "border-destructive focus:ring-destructive" 
              : "border-input hover:border-muted-foreground/50"}
            ${className || ""}
          `}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="text-sm text-destructive mt-2 flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-sm text-muted-foreground mt-2">{helperText}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, required, options, className, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div>
        {label && (
          <label className="block text-base font-medium text-foreground mb-2">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 bg-card border rounded-lg text-base text-foreground appearance-none cursor-pointer
              transition-all duration-200 pr-10
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:border-transparent
              disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-60
              ${hasError 
                ? "border-destructive focus:ring-destructive" 
                : "border-input hover:border-muted-foreground/50"}
              ${className || ""}
            `}
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
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>
        {error && (
          <p
            id={`${props.id}-error`}
            className="text-sm text-destructive mt-2 flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-sm text-muted-foreground mt-2">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => {
    const hasError = !!error;
    
    return (
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            ref={ref}
            type="checkbox"
            className={`
              h-5 w-5 rounded border-2 cursor-pointer
              transition-all duration-200
              border-input
              checked:bg-primary checked:border-primary
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${hasError ? "border-destructive" : ""}
              ${className || ""}
            `}
            {...props}
          />
          {label && (
            <span className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors">
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="text-xs text-destructive mt-1.5 flex items-center gap-1.5 ml-8">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

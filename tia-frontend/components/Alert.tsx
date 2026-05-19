"use client";

import React from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react";

interface AlertProps {
  type: "error" | "warning" | "success" | "info";
  message: string;
  details?: string;
  onClose?: () => void;
  className?: string;
}

export function Alert({
  type,
  message,
  details,
  onClose,
  className = "",
}: AlertProps) {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
  };

  const iconStyles = {
    error: "text-red-500",
    warning: "text-amber-500",
    success: "text-emerald-500",
    info: "text-blue-500",
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div
      className={`rounded-xl border p-4 lg:p-5 flex gap-3 items-start animate-fade-in ${styles[type]} ${className}`}
      role="alert"
    >
      <div className={`shrink-0 mt-0.5 ${iconStyles[type]}`}>
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-base">{message}</p>
        {details && <p className="text-sm mt-1 opacity-80">{details}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
          aria-label="Close alert"
        >
          <X className="w-5 h-5 opacity-60" />
        </button>
      )}
    </div>
  );
}

interface InputErrorProps {
  error?: string;
  className?: string;
}

export function InputError({ error, className = "" }: InputErrorProps) {
  if (!error) return null;
  return (
    <p className={`text-sm text-destructive mt-2 flex items-center gap-1.5 ${className}`}>
      <AlertCircle className="w-4 h-4" />
      {error}
    </p>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  helperText?: string;
}

export function FormField({
  label,
  error,
  required,
  children,
  helperText,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-base font-medium text-foreground mb-2">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && <InputError error={error} />}
      {!error && helperText && (
        <p className="text-sm text-muted-foreground mt-2">{helperText}</p>
      )}
    </div>
  );
}

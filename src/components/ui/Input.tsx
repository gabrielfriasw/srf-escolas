import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  icon,
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {icon}
          </span>
        )}
        <input
          className={cn(
            "w-full rounded-xl bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600",
            "focus:border-black dark:focus:border-gray-500 focus:ring-0",
            "transition-all duration-200",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            icon && "pl-10",
            error && "border-red-500 dark:border-red-400",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
import React from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
  label?: string;
}

export const Select: React.FC<SelectProps> = ({
  children,
  icon,
  label,
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
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-gray-500 dark:text-gray-400">
            {icon}
          </span>
        )}
        <select
          className={cn(
            "w-full rounded-xl bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600",
            "focus:border-black dark:focus:border-gray-500 focus:ring-0",
            "transition-colors duration-200",
            icon && "pl-10",
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    </div>
  );
};
import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in",
      className
    )}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps> = ({ children, className }) => {
  return (
    <h3 className={cn(
      "text-lg font-medium text-gray-900 dark:text-white",
      className
    )}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
};
import React from 'react';

interface AttendanceButtonProps {
  status: 'P' | 'F';
  isActive: boolean;
  onClick: () => void;
}

export const AttendanceButton: React.FC<AttendanceButtonProps> = ({
  status,
  isActive,
  onClick,
}) => {
  const baseClasses = 'px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors';
  const activeClasses = {
    P: 'bg-green-600 text-white',
    F: 'bg-red-600 text-white',
  };
  const inactiveClasses =
    'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses[status] : inactiveClasses}`}
    >
      {status}
    </button>
  );
};
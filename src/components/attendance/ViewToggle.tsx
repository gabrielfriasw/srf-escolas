import { List, Grid } from 'lucide-react';

interface ViewToggleProps {
  view: 'list' | 'room';
  onViewChange: (view: 'list' | 'room') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
          view === 'list'
            ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600'
        }`}
      >
        <List className="h-5 w-5" />
        Lista
      </button>
      <button
        onClick={() => onViewChange('room')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
          view === 'room'
            ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600'
        }`}
      >
        <Grid className="h-5 w-5" />
        Sala
      </button>
    </div>
  );
}
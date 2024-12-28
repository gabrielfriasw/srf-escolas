import React from 'react';
import { X } from 'lucide-react';

interface PeterAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PeterAlert: React.FC<PeterAlertProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-96 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Peter Alert</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="https://m.gjcdn.net/game-header/950/599244-rpkhxk89-v4.jpg"
            alt="Peter Alert"
            className="w-full rounded-lg"
          />
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
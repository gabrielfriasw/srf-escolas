import { useState, useEffect } from 'react';

const STORAGE_KEY = 'temporary_attendance';
const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useTemporaryAttendance = (classId: string) => {
  const [temporaryAttendance, setTemporaryAttendance] = useState<Record<string, 'P' | 'F' | null>>({});

  // Load saved attendance on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { attendance, timestamp, savedClassId } = JSON.parse(savedData);
      
      // Check if data is still valid and belongs to current class
      if (
        Date.now() - timestamp < EXPIRATION_TIME &&
        savedClassId === classId
      ) {
        setTemporaryAttendance(attendance);
      } else {
        // Clear expired or invalid data
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [classId]);

  // Save attendance changes
  const updateTemporaryAttendance = (studentId: string, status: 'P' | 'F') => {
    const newAttendance = {
      ...temporaryAttendance,
      [studentId]: status,
    };
    
    setTemporaryAttendance(newAttendance);
    
    // Save to localStorage with timestamp
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      attendance: newAttendance,
      timestamp: Date.now(),
      classId,
    }));
  };

  // Clear temporary attendance
  const clearTemporaryAttendance = () => {
    setTemporaryAttendance({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    temporaryAttendance,
    updateTemporaryAttendance,
    clearTemporaryAttendance,
  };
};
import { useState, useEffect } from 'react';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { AttendanceStats } from '../types';

export const useStats = (classId: string) => {
  const { getMonthlyStats } = useAttendanceStore();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedShift, setSelectedShift] = useState('morning');
  const [monthlyData, setMonthlyData] = useState({
    labels: [] as string[],
    attendance: [] as number[],
  });

  // Get current stats with defaults
  const getCurrentStats = (): AttendanceStats => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return getMonthlyStats(classId, currentMonth, currentYear, selectedShift) || {
      month: new Date(currentYear, currentMonth).toLocaleString('pt-BR', { month: 'long' }),
      year: currentYear,
      totalAbsences: 0,
      averageAttendance: 0,
      students: []
    };
  };

  // Update monthly data when filters change
  useEffect(() => {
    const data = {
      labels: [] as string[],
      attendance: [] as number[],
    };

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const stats = getMonthlyStats(classId, date.getMonth(), date.getFullYear(), selectedShift);
      
      if (stats) {
        data.labels.push(date.toLocaleString('pt-BR', { month: 'short' }));
        data.attendance.push(stats.averageAttendance);
      }
    }

    setMonthlyData(data);
  }, [classId, selectedShift, getMonthlyStats]);

  return {
    currentStats: getCurrentStats(),
    monthlyData,
    selectedPeriod,
    selectedShift,
    setSelectedPeriod,
    setSelectedShift,
  };
};
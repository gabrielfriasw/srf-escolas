import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClassHeader } from '../../components/class/ClassHeader';
import { AddStudentForm } from '../../components/student/AddStudentForm';
import { AttendanceList } from '../../components/attendance/AttendanceList';
import { ClassroomLayout } from '../../components/ClassroomLayout';
import { EditClassModal } from '../../components/modals/EditClassModal';
import { StatsModal } from '../../components/modals/StatsModal';
import { useClassDetails } from '../../hooks/useClassDetails';
import { useClassStore } from '../../store/useClassStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useStats } from '../../hooks/useStats';
import { exportStatsToPDF } from '../../utils/pdfExport';
import { useRealtimeStats } from '../../hooks/useRealtimeStats';

export const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { updateClass } = useClassStore();
  const { fetchAttendance } = useAttendanceStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  
  const {
    classData,
    showClassroom,
    attendance,
    userRole,
    setShowClassroom,
    handleAttendanceChange,
    handleMarkAllPresent,
    handleRemoveStudent,
    handleAddIncident,
    handleSaveClassroom,
    handleSendAttendance,
  } = useClassDetails(id!);

  const {
    currentStats,
    monthlyData,
    selectedPeriod,
    selectedShift,
    setSelectedPeriod,
    setSelectedShift,
  } = useStats(id!);

  // Usar o hook de atualização em tempo real
  useRealtimeStats(id!);

  // Fetch initial attendance data
  useEffect(() => {
    if (id) {
      fetchAttendance(id);
    }
  }, [id, fetchAttendance]);

  if (!classData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
      </div>
    );
  }

  const handleEditClass = async (updates: Partial<typeof classData>) => {
    if (!id) return;
    await updateClass(id, updates);
  };

  const handleExportPDF = () => {
    exportStatsToPDF(
      currentStats,
      classData.name,
      `${currentStats.month} ${currentStats.year}`
    );
  };

  return (
    <div className="space-y-6">
      <ClassHeader
        name={classData.name}
        grade={classData.grade}
        onSendAttendance={handleSendAttendance}
        onToggleClassroom={() => setShowClassroom(!showClassroom)}
        onEdit={() => setShowEditModal(true)}
        onViewStats={() => setShowStatsModal(true)}
      />

      <EditClassModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditClass}
        classData={classData}
      />

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        classId={id!}
        stats={currentStats}
        monthlyData={monthlyData}
        onPeriodChange={setSelectedPeriod}
        onShiftChange={setSelectedShift}
        onExportPDF={handleExportPDF}
      />

      {showClassroom ? (
        <ClassroomLayout
          students={classData.students}
          onClose={() => setShowClassroom(false)}
          onSave={handleSaveClassroom}
          attendance={attendance}
          onAttendanceChange={handleAttendanceChange}
        />
      ) : (
        <>
          <AddStudentForm
            classId={id!}
            onAddStudent={() => {}}
          />

          <AttendanceList
            students={classData.students || []}
            attendance={attendance}
            onAttendanceChange={handleAttendanceChange}
            onMarkAllPresent={handleMarkAllPresent}
            onRemoveStudent={handleRemoveStudent}
            onAddIncident={handleAddIncident}
            classData={{
              name: classData.name,
              pedagogistPhone: classData.pedagogist_phone,
            }}
            userRole={userRole || 'TEACHER'}
          />
        </>
      )}
    </div>
  );
};
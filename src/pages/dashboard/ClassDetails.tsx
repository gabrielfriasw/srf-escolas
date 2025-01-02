import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClassHeader } from '../../components/class/ClassHeader';
import { AddStudentForm } from '../../components/student/AddStudentForm';
import { AttendanceList } from '../../components/attendance/AttendanceList';
import { ClassroomLayout } from '../../components/ClassroomLayout';
import { useClassDetails } from '../../hooks/useClassDetails';

export const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    classData,
    showClassroom,
    attendance,
    setShowClassroom,
    handleAttendanceChange,
    handleRemoveStudent,
    handleAddIncident,
    handleSaveClassroom,
    handleSendAttendance,
  } = useClassDetails(id!);

  if (!classData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClassHeader
        name={classData.name}
        grade={classData.grade}
        onSendAttendance={handleSendAttendance}
        onToggleClassroom={() => setShowClassroom(!showClassroom)}
        onNavigateHistory={() => navigate(`/dashboard/turma/${id}/historico`)}
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
            classId={classData.id}
            onAddStudent={() => {}}
          />

          <AttendanceList
            students={classData.students}
            attendance={attendance}
            onAttendanceChange={handleAttendanceChange}
            onRemoveStudent={handleRemoveStudent}
            onAddIncident={handleAddIncident}
            classData={{
              name: classData.name,
              pedagogistPhone: classData.pedagogist_phone,
            }}
          />
        </>
      )}
    </div>
  );
};
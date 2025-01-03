import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2 } from 'lucide-react';
import { ClassHeader } from '../../components/class/ClassHeader';
import { AddStudentForm } from '../../components/student/AddStudentForm';
import { AttendanceList } from '../../components/attendance/AttendanceList';
import { ClassroomLayout } from '../../components/ClassroomLayout';
import { EditClassModal } from '../../components/modals/EditClassModal';
import { useClassDetails } from '../../hooks/useClassDetails';
import { useClassStore } from '../../store/useClassStore';

export const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateClass } = useClassStore();
  const [showEditModal, setShowEditModal] = useState(false);
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
      <div className="flex justify-between items-center">
        <ClassHeader
          name={classData.name}
          grade={classData.grade}
          onSendAttendance={handleSendAttendance}
          onToggleClassroom={() => setShowClassroom(!showClassroom)}
          onNavigateHistory={() => navigate(`/dashboard/turma/${id}/historico`)}
        />
        
        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Edit2 className="h-5 w-5" />
          <span>Editar Turma</span>
        </button>
      </div>

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

      <EditClassModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(updates) => updateClass(id!, updates)}
        classData={classData}
      />
    </div>
  );
};
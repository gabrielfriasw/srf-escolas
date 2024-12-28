// ... imports existentes ...
import { TeacherAssignment } from '../../components/class/TeacherAssignment';

export const ClassDetails: React.FC = () => {
  // ... código existente ...

  const isDirector = user?.role === 'DIRECTOR';
  const canManageClass = isDirector || user?.role === 'COORDINATOR';

  // ... resto do código ...

  return (
    <div className="space-y-6">
      {/* ... código existente ... */}

      {isDirector && (
        <TeacherAssignment 
          classId={id!} 
          teachers={classData?.teachers || []}
        />
      )}

      {/* ... resto do código ... */}
    </div>
  );
};
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Login } from './pages/Login';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ClassList } from './pages/dashboard/ClassList';
import { NewClass } from './pages/dashboard/NewClass';
import { ClassDetails } from './pages/dashboard/ClassDetails';
import { AttendanceHistory } from './pages/dashboard/AttendanceHistory';
import { Settings } from './pages/dashboard/Settings';
import { ExamDashboard } from './pages/dashboard/exam/ExamDashboard';
import { NewExamSession } from './pages/dashboard/exam/NewExamSession';
import { ExamSessionDetails } from './pages/dashboard/exam/ExamSessionDetails';
import { useAuthStore } from './store/useAuthStore';
import { useSupabaseAuth } from './lib/supabase/hooks/useSupabaseAuth';
import { useClassesRealtime, useStudentsRealtime } from './hooks/realtime';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  // Initialize Supabase auth listener
  useSupabaseAuth();
  
  // Initialize real-time listeners
  useClassesRealtime();
  useStudentsRealtime();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<ClassList />} />
          
          {/* Rotas de Turmas */}
          <Route path="class/new" element={<NewClass />} />
          <Route path="class/:id" element={<ClassDetails />} />
          <Route path="class/:id/historico" element={<AttendanceHistory />} />
          
          {/* Rotas de Ensalamento */}
          <Route path="ensalamento" element={<ExamDashboard />} />
          <Route path="ensalamento/novo" element={<NewExamSession />} />
          <Route path="ensalamento/:id" element={<ExamSessionDetails />} />
          
          {/* Configurações */}
          <Route path="configuracoes" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
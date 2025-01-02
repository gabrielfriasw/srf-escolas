import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ClassList } from './pages/dashboard/ClassList';
import { NewClass } from './pages/dashboard/NewClass';
import { ClassDetails } from './pages/dashboard/ClassDetails';
import { Settings } from './pages/dashboard/Settings';
import { AttendanceHistory } from './pages/dashboard/AttendanceHistory';
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
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClassList />} />
          <Route path="nova-turma" element={<NewClass />} />
          <Route path="turma/:id" element={<ClassDetails />} />
          <Route path="turma/:id/historico" element={<AttendanceHistory />} />
          <Route path="configuracoes" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
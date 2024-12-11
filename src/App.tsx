import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { AttendancePage } from './components/AttendancePage';
import { Header } from './components/layout/Header';
import { useEffect } from 'react';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  return user ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  const { darkMode, user } = useStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthForm />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance/:id"
            element={
              <PrivateRoute>
                <AttendancePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
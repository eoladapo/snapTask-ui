import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { CategoryProvider } from './context/CategoryContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { Onboarding, Login, Register, Dashboard } from './pages';
import Profile from './pages/Profile';
import { ProtectedRoute, PublicRoute } from './components/routing';
import ErrorBoundary from './components/common/ErrorBoundary';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public route - Onboarding */}
        <Route path="/" element={<Onboarding />} />

        {/* Public routes - Auth pages (redirect to dashboard if authenticated) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected routes - Dashboard (redirect to login if not authenticated) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback route - redirect unknown paths to Onboarding */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <TaskProvider>
              <CategoryProvider>
                <Router>
                  <AnimatedRoutes />
                </Router>
              </CategoryProvider>
            </TaskProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import PLCs from './pages/plc/PLCs';
import PLCMonitor from './pages/plc/PLCMonitor';
import UserManagement from './pages/admin/UserManagement';
import PrivateRoute from './components/auth/PrivateRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/plcs"
              element={
                <PrivateRoute>
                  <PLCs />
                </PrivateRoute>
              }
            />
            <Route
              path="/plcs/:id/monitor"
              element={
                <PrivateRoute>
                  <PLCMonitor />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default App;
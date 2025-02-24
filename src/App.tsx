import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import PLCs from './pages/plc/PLCs';
import PLCMonitor from './pages/plc/PLCMonitor';
import UserManagement from './pages/admin/UserManagement';
import PainelEclusa from './pages/painel/PainelEclusa';
import PrivateRoute from './components/auth/PrivateRoute';
import TableManager from './pages/tables/TableManager';
import TableForm from './pages/tables/TableForm';
import ColumnManager from './pages/tables/ColumnManager';
import TagMapping from './pages/tables/TagMapping';
import Monitoramento from './pages/monitoramento/monitoramento';

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
            <Route
              path="/painel-eclusa"
              element={
                <PrivateRoute>
                  <PainelEclusa />
                </PrivateRoute>
              }
            />
            {/* Nova rota para monitoramento do sistema */}
            <Route
              path="/monitoramento"
              element={
                <PrivateRoute>
                  <Monitoramento />
                </PrivateRoute>
              }
            />
            {/* Rotas para gerenciamento de tabelas */}
            <Route
              path="/tables"
              element={
                <PrivateRoute>
                  <TableManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/tables/new"
              element={
                <PrivateRoute>
                  <TableForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/tables/:id/edit"
              element={
                <PrivateRoute>
                  <TableForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/tables/:id/columns"
              element={
                <PrivateRoute>
                  <ColumnManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/tables/:id/tag-mapping"
              element={
                <PrivateRoute>
                  <TagMapping />
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
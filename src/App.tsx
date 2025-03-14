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
// Importação corrigida do HMIPage - use exatamente o mesmo caminho que já funcionava antes
import HMIPage from './pages/Hmi/HMIPage'; // Note o 'Hmi' com H maiúsculo para corresponder à estrutura de pastas real
import Eclusa_Regua from './pages/Eclusa/Eclusa_Regua'; // Importação da página Eclusa_Regua
import PortaJusante from './pages/Eclusa/PortaJusante'; // Importação da página Porta Jusante
import PortaMontantePage from './pages/Eclusa/PortaMontante'; // Importação da página Porta Montante
import Enchimento from './pages/Eclusa/Enchimento'; // Importação da nova página Enchimento

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
            {/* Nova rota para HMI */}
            <Route
              path="/hmi"
              element={
                <PrivateRoute>
                  <HMIPage />
                </PrivateRoute>
              }
            />
            {/* Nova rota para Eclusa Régua */}
            <Route
              path="/eclusa-regua"
              element={
                <PrivateRoute>
                  <Eclusa_Regua />
                </PrivateRoute>
              }
            />
            {/* Rota para Porta Jusante */}
            <Route
              path="/porta-jusante"
              element={
                <PrivateRoute>
                  <PortaJusante />
                </PrivateRoute>
              }
            />
            {/* Rota para Porta Montante */}
            <Route
              path="/porta-montante"
              element={
                <PrivateRoute>
                  <PortaMontantePage />
                </PrivateRoute>
              }
            />
            {/* Nova rota para Sistema de Enchimento */}
            <Route
              path="/enchimento"
              element={
                <PrivateRoute>
                  <Enchimento />
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
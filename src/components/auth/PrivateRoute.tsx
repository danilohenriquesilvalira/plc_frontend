import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há token válido no localStorage
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      navigate('/login');
    }
  }, [navigate]);

  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
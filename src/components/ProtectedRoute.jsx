import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ color: '#eacece', textAlign: 'center', marginTop: '2rem' }}>Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default ProtectedRoute;
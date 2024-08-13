import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/auth" />;
  }
  return children;
};

export default ProtectedRoute;

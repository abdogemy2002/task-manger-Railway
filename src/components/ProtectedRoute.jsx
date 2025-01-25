import React, { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ element }) => {
  const { isRegistered } = useAuth();
  const hasAlerted = useRef(false);

  useEffect(() => {
    if (!isRegistered && !hasAlerted.current) {
      toast.error('You must be logged in to access this page.');
      hasAlerted.current = true; // Ensure the alert is only shown once
    }
  }, [isRegistered]);

  // Check registration status and render either the component or redirect
  return isRegistered ? element : <Navigate to="/" />;
};

export default ProtectedRoute;

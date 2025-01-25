import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/LandingPage.css';
import { useAuth } from './AuthContext'; 

const LandingPage = () => {
  const { isRegistered } = useAuth(); 

  return (
    <div className="landing-container">
      <div className="landing-content text-center">
        <h1 className="display-4">Welcome to Task Manager</h1>
        <p className="lead">Your go-to application for managing tasks efficiently.</p>
        {!isRegistered ? (
          <div className="mt-4">
            <Link to="/register" className="btn btn-light btn-lg me-3">Register</Link>
            <Link to="/login" className="btn  btn-lg">Login</Link>
          </div>
        ) : (
          <div className="mt-4">
            <Link to="/tasks" className="btn  btn-lg">View Tasks</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;

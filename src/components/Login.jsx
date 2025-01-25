import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setIsRegistered, setUsername: setAuthUsername, setUserId } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(users => {
        // Find the user with the matching name and password
        const user = users.find(u => u.name === username && u.password === password);
  
        if (user) {
          setIsRegistered(true);
          setAuthUsername(username); 
          setUserId(user.id); // Set the user ID from the database
          navigate('/tasks'); 
        } else {
          toast.error('Wrong username or password');
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        toast.error('An error occurred while logging in');
      });
  };
  
  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className='login-h1'>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="login-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="login-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

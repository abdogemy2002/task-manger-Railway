import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import List from './components/List';
import TaskDetail from './components/TaskDetail';
import AddTask from './components/AddTask';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import CompletedTasks from './components/CompletedTasks';
import LandingPage from './components/LandingPage';
import { AuthProvider} from './components/AuthContext';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import'./components/styles/App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<ProtectedRoute element={<List />} />} />
        <Route path="/task/:id" element={<ProtectedRoute element={<TaskDetail />} />} />
        <Route path="/add-task" element={<ProtectedRoute element={<AddTask />} />} />
        <Route path="/completed-tasks" element={<ProtectedRoute element={<CompletedTasks />} />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

const WrappedApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default WrappedApp;
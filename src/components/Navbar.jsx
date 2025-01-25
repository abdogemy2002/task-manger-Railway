// Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./AuthContext";
import "./styles/Navbar.css";
import { FcTodoList } from "react-icons/fc";

const Navbar = () => {
  const navigate = useNavigate();
  const { isRegistered, username, setIsRegistered, setUsername } = useAuth();

  const handleLogout = () => {
    setIsRegistered(false);
    setUsername("");
    navigate("/");
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark-custom shadow-sm">
      <div className="container">
        <FcTodoList className="small-icon" />
        <Link to="/" className="navbar-brand text-light logo-text">
          Task Manager
        </Link>
        <div className="navbar-nav-wrapper">
          <div className="navbar-nav">
            <Link to="/tasks" className="nav-link text-light">
              Tasks
            </Link>
            <Link to="/add-task" className="nav-link text-light">
              Add Task
            </Link>
            <Link to="/completed-tasks" className="nav-link text-light">
              Done Tasks
            </Link>
          </div>
          <div className="d-flex align-items-center ms-auto">
            {!isRegistered ? (
              <Link to="/register" className=" btn-custom ">
                Register
              </Link>
            ) : (
              <>
                <span className="nav-link text-light me-2">
                  Welcome, {username}
                </span>
                <button className="btn-custom"  onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

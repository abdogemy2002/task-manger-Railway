import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";
import "./styles/AddTask.css";

const AddTask = () => {
  const { userId } = useAuth();
  const [newTask, setNewTask] = useState({
    task: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    dateModified: new Date().toISOString().split("T")[0], // Defaults to today
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
    console.log(newTask);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const taskToAdd = { ...newTask, userId }; 

    try {
      const response = await axios.post(
        "http://localhost:3000/tasks",
        taskToAdd
      );

      if (response.status === 201) {
        // Check if the response status is 201 Created
        toast.success("Task added successfully!");
        navigate("/tasks"); // Redirect to tasks list after adding a task
      }
    } catch (error) {
      toast.error(
        `Error adding task: ${error.message}`
      );
    }
  };

  return (
    <div className="container mt-4">
      <h1>Add New Task</h1>
      <form onSubmit={handleAddTask}>
        <div className="mb-3">
          <label className="form-label">Task:</label>
          <input
            type="text"
            name="task"
            className="form-control"
            value={newTask.task}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            className="form-control"
            value={newTask.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Priority:</label>
          <select
            name="priority"
            className="form-select"
            value={newTask.priority}
            onChange={handleInputChange}
            required
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Due Date:</label>
          <input
            type="date"
            name="dueDate"
            className="form-control"
            value={newTask.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn ">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;

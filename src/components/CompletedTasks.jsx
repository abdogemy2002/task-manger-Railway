import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./AuthContext";

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { userId } = useAuth();

  useEffect(() => {
    fetchCompletedTasks();
  });

  const fetchCompletedTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tasks");
      const data = response.data;
      const completedTasks = data.filter(
        (task) => task.status === "Completed" && task.userId === userId 
      );
      setTasks(completedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCheckboxChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

    try {
      const response = await axios.patch(
        `http://localhost:3000/tasks/${taskId}`,
        { status: newStatus }
      );
      const updatedTask = response.data;
      // Update task list and filter tasks again
      setTasks(
        (prevTasks) =>
          prevTasks
            .map((task) => (task.id === taskId ? updatedTask : task))
            .filter(
              (task) => task.status === "Completed" && task.userId === userId
            ) 
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      // Remove deleted task from the list
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Completed Tasks</h1>
      {tasks.length ? (
        <ul className="list-group">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{task.task}</h5>

                <p>
                  Priority:
                  <span
                    className={`badge bg-${
                      task.priority === "High"
                        ? "danger"
                        : task.priority === "Medium"
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {task.priority}
                  </span>
                </p>
                <p>
                  Due Date: <span>{task.dueDate}</span>
                </p>
                <p>
                  Modified Date: <span>{task.dateModified}</span>
                </p>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={task.status === "Completed"}
                  onChange={() => handleCheckboxChange(task.id, task.status)}
                />
                <label className="ms-2">
                  {task.status === "Completed" ? "Completed" : "Mark as Done"}
                </label>
                <button
                  className="btn-custom-delete ms-2"
                  style={{ padding: "0.2rem 0.5rem", fontSize: "1rem" }}
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No completed tasks available.</p>
      )}
      <div className="mt-4">
        <Link to="/tasks" className="btn">
          Back to Task List
        </Link>
      </div>
    </div>
  );
};

export default CompletedTasks;

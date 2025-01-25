import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'; 
import { useAuth } from "./AuthContext";
import "./styles/List.css";

export default function List() {
  const [tasks, setTasks] = useState([]);
  const [sortOption, setSortOption] = useState("none");
  const [sortDirection, setSortDirection] = useState("ascending");
  const { userId } = useAuth(); 

  useEffect(() => {
    if (!userId) return; // Return early if userId is not available

    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tasks");
        const data = response.data;
        const userTasks = data.filter(
          (task) => task.userId === userId && task.status !== "Completed"
        );
        setTasks(userTasks);
        console.log("Tasks fetched:", userTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []); 

  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSortDirectionChange = (e) => {
    setSortDirection(e.target.value);
  };
  
  useEffect(() => {
    // Sort tasks whenever sortOption or sortDirection changes
    if (sortOption !== "none") {
      const sortedTasks = [...tasks];
      let compareFn;

      if (sortOption === "priority") {
        compareFn = (a, b) => {
          const priorities = { High: 1, Medium: 2, Low: 3 };
          return (
            (priorities[a.priority] - priorities[b.priority]) *
            (sortDirection === "ascending" ? 1 : -1)
          );
        };
      } else if (sortOption === "dueDate") {
        compareFn = (a, b) =>
          (new Date(a.dueDate) - new Date(b.dueDate)) *
          (sortDirection === "ascending" ? 1 : -1);
      } else if (sortOption === "modifiedDate") {
        compareFn = (a, b) =>
          (new Date(b.modifiedDate) - new Date(a.modifiedDate)) *
          (sortDirection === "ascending" ? 1 : -1);
      }

      sortedTasks.sort(compareFn);
      setTasks(sortedTasks);
    }
  }, [sortOption, sortDirection]); 

 

  const handleCheckboxChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";

    try {
      const response = await axios.patch(`http://localhost:3000/tasks/${taskId}`, { status: newStatus });
      const updatedTask = response.data;
      // Update task in the list and filter out completed tasks
      setTasks((prevTasks) =>
        prevTasks
          .map((task) => (task.id === taskId ? updatedTask : task))
          .filter((task) => task.status !== "Completed")
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
    <div className="container mt-4 main-cont">
      <h1>Task List</h1>

      {/* Sorting Options */}
      <div className="mb-3">
        <label className="form-label">Sort by:</label>
        <select
          className="form-select"
          value={sortOption}
          onChange={handleSortOptionChange}
        >
          <option value="none">None</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
          <option value="modifiedDate">Modified Date</option>
        </select>
      </div>

      {/* Sorting Direction */}
      {sortOption !== "none" && (
        <div className="mb-3">
          <label className="form-label">Sort direction:</label>
          <select
            className="form-select"
            value={sortDirection}
            onChange={handleSortDirectionChange}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      )}

      {/* Task List */}
      <ul className="list-group m-auto">
        {tasks.length ? (
          tasks.map((item) => (
            <li key={item.id} className="list-group-item">
              <Link to={`/task/${item.id}`} className="text-decoration-none">
                <h3 className="task-title">{item.task}</h3>
                <div className="task-details">
                  <hr className="underline" />
                  <p className="details">
                    Description: <span>{item.description || null}</span>
                  </p>

                  <p className="details">
                    Priority:
                    <span
                      className={`badge bg-${
                        item.priority === "High"
                          ? "danger"
                          : item.priority === "Medium"
                          ? "warning"
                          : "secondary"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </p>
                  <p className="details">
                    Due Date: <span>{item.dueDate}</span>
                  </p>
                  <p className="details">
                    Modified Date: <span>{item.dateModified}</span>
                  </p>
                </div>
              </Link>
              <div>
                <input
                  type="checkbox"
                  checked={item.status === "Completed"}
                  onChange={() => handleCheckboxChange(item.id, item.status)}
                />
                <label className="ms-2">
                   Mark as Done
                </label>
                <button
                  className="btn-custom-delete ms-2"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </ul>

      <div className="mt-4">
        <Link to="/add-task" className="btn btn-add">
          Add New Task
        </Link>
      </div>
    </div>
  );
}

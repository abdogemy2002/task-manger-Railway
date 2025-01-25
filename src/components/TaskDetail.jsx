import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/TaskDetail.css';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    task: '',
    description: '',
    priority: '',
    dueDate: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/tasks/${id}`)
      .then(response => {
        const data = response.data;
        setTask(data);
        setFormData({
          task: data.task,
          description: data.description || '',
          priority: data.priority,
          dueDate: data.dueDate
        });
      })
      .catch(error => console.error('Error fetching task:', error));
  }, [id]);

  const handleInputChange = ({ target: { name, value } }) =>
    setFormData(formData => ({ ...formData, [name]: value }));
  
  const handleSave = () => {
    axios.patch(`http://localhost:3000/tasks/${id}`, formData)
      .then(response => {
        setTask(response.data);
        setEditMode(false);
        navigate('/tasks');
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const priorities = ['High', 'Medium', 'Low'];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return task ? (
    <div className="container mt-4 task-detail-container">
      <h1>Task Details</h1>
      {editMode ? (
        <div className="task-form">
          <div className="mb-3">
            <label className="form-label">Task:</label>
            <input
              type="text"
              name="task"
              className="form-control"
              value={formData.task}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description:</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Priority:</label>
            <select
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleInputChange}
              required
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Due Date:</label>
            <input
              type="date"
              name="dueDate"
              className="form-control"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
          <button className="btn btn-secondary ms-2" onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div className="task-info">
          <h2>{task.task}</h2>
          <p>Description: <span>{task.description}</span></p>
          <p>Priority: 
            <span className={`badge bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'secondary'}`}>
              {task.priority}
            </span>
          </p>
          <p>Due Date: <span>{task.dueDate}</span></p>
          <p>Status: <span>{task.status}</span></p>
          <p>Modified Date: <span>{formatDate(task.dateModified)}</span></p>
          <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}
      <button className="btn btn-secondary mt-3" onClick={() => navigate('/tasks')}>Back to List</button>
    </div>
  ) : null; 
}

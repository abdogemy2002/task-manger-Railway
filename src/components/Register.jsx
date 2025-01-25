import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthContext';
import './styles/Login.css';
import axios from 'axios'; // Importing axios

const Register = () => {
  const navigate = useNavigate();
  const { setIsRegistered, setUserId, setUsername } = useAuth(); 

  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    }),
    onSubmit: (values) => {
      // Check if username is already taken before submitting
      axios.get('http://localhost:3000/users')
        .then(response => {
          const userExists = response.data.some(user => user.name === values.name);
          if (userExists) {
            toast.error('Username is already taken. Please choose a different one.');
            return;
          }

          // Proceed with registration if username is not taken
          axios.post('http://localhost:3000/users', values)
            .then(response => {
              setIsRegistered(true);
              setUserId(response.data.id); 
              setUsername(response.data.name); 
              toast.success('Registration successful!');
              navigate('/tasks');
            })
            .catch(error => {
              toast.error(`Error registering user: ${error.message}`);
            });
        })
        .catch(error => {
          toast.error(`Error checking username availability: ${error.message}`);
        });
    },
  });

  return (
    <div className="container mt-4">
      <h1>Register</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name ? <div className="text-danger">{formik.errors.name}</div> : null}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password ? <div className="text-danger">{formik.errors.password}</div> : null}
        </div>
        <button type="submit" className="btn">Register</button>
      </form>
      <div className="mt-3">
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;

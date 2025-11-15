import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/admin/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    navigate('/admin/shirt-view');
    console.log('Login attempt:', formData);
  };

  return (
    <div className="login-wrapper">
      <Container className="login-container">
        <div className="login-box">
          <h1 className="login-title">Admin Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formEmail">
              <Form.Label className="form-label">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="form-label">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </Form.Group>

            <Button type="submit" className="login-btn" variant="primary">
              Login
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Login;


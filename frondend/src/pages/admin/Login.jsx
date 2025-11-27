import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../Api';
import '../../assets/css/admin/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Enter your credentials');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await api.post('/admin/login', formData);
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/shirt-view');
    } catch (err) {
      const message =
        err?.response?.data?.error || 'Unable to login. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Container className="login-container">
        <div className="login-box">
          <h1 className="login-title">Admin Login</h1>
          <Form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}
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

            <Button
              type="submit"
              className="login-btn"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Login;


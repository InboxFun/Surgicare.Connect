import React, { useState } from 'react';
import { Button, Form, Container, Col, Row } from 'react-bootstrap';
import './App.css'; // Make sure to define .login-page, .login-container, etc.
import logo from './assets/surgicare_logo2.png'; // Add your logo to src/assets/
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === 'patient123' && password === 'password') {
      setError('');
      alert('Login Successful');
      navigate('/dashboard'); // Redirect to the dashboard
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100">
      <Container className="login-container">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="login-box p-4 shadow bg-white text-center">
              <img src={logo} alt="SurgiCare Logo" className="mb-3" style={{ width: '80px' }} />
              <h2 className="login-title mb-4">SurgiCare Connect</h2>

              <Form onSubmit={handleSubmit} className="text-start">
                {error && <p className="error-message text-danger">{error}</p>}

                <div className="form-inner">
                  <Form.Group controlId="username" className="mb-3">
                    <Form.Label className="text-muted">Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="soft-input"
                    />
                  </Form.Group>

                  <Form.Group controlId="password" className="mb-4">
                    <Form.Label className="text-muted">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="soft-input"
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mt-4 w-100" style={{ marginBottom: '20px' }}>
                    Login
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginPage;

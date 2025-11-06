import React, { useState, useContext } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaUserShield, FaLock } from 'react-icons/fa';

const toastStyleSuccess = {
  borderRadius: '14px',
  background: 'linear-gradient(95deg, #dfffff 45%, #cdfff7 120%)',
  color: '#099687',
  fontWeight: 800,
  fontSize: '1.08em',
  boxShadow: '0 4px 28px #38e7ee44'
};
const toastStyleError = {
  borderRadius: '14px',
  background: 'linear-gradient(98deg,#fff0ea 35%,#ffe5f5 120%)',
  color: "#be3b47",
  fontWeight: 800,
  fontSize: '1.08em',
  boxShadow: '0 4px 28px #ee444422'
};

const Login = () => {
  const [formData, setFormData] = useState({
    username: '', password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setErrors({});
    try {
      const response = await authAPI.login(formData);
      const { user, access_token, refresh_token } = response.data;
      login(user, { access_token, refresh_token });
      toast.success(
        <span>✅ Welcome back, {user.first_name || user.username}!</span>,
        { style: toastStyleSuccess, icon: false }
      );
      navigate('/');
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
        if (typeof error.response.data === 'object' && error.response.data.non_field_errors) {
          toast.error(
            <span>❌ {error.response.data.non_field_errors.join(", ")}</span>,
            { style: toastStyleError, icon: false }
          );
        }
      } else {
        toast.error(
          <span>❌ Login failed. Please try again.</span>,
          { style: toastStyleError, icon: false }
        );
      }
    } finally { 
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg,#fde6ba 0%,#fefae0 100%)'
    }} className="d-flex align-items-center justify-content-center">
      <Container>
        <Card className="shadow-lg border-0 rounded-4 overflow-hidden" style={{maxWidth: 880, margin: '2rem auto'}}>
          <Row className="g-0 align-items-stretch">
            <Col md={6} className="d-none d-md-flex bg-light p-0 align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #ffe699 0%, #fff 98%)'}}>
              <div className="p-5 w-100 text-center">
                <img
                  src="/img/login.png"
                  alt="Home Services"
                  style={{
                    width: '88%',
                    maxWidth: '340px',
                    minWidth: '220px',
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto 2rem auto',
                    borderRadius: '18px',
                    boxShadow: '0 4px 24px rgba(200,150,0,0.14)'
                  }}
                  className="mb-4"
                />
                <h2 className="fw-bold" style={{ color: '#ae8500' }}>Welcome Back!</h2>
                <div style={{ color: '#6c757d', fontSize: '1.07rem', marginTop: 12 }}>
                  Log in to book or manage your home service needs.<br />
                  Fast. Safe. Reliable.
                </div>
              </div>
            </Col>
            <Col xs={12} md={6} className="bg-white p-4 p-lg-5">
              <h2 className="fw-bold text-center mb-4" style={{letterSpacing:'1.5px'}}>Login</h2>
              <Form onSubmit={handleSubmit} autoComplete="off">
                <InputGroup className="mb-4">
                  <InputGroup.Text><FaUserShield /></InputGroup.Text>
                  <Form.Control size="lg" type="text" name="username" value={formData.username}
                    onChange={handleChange} placeholder="Username" isInvalid={!!errors.username}/>
                  <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-4">
                  <InputGroup.Text><FaLock /></InputGroup.Text>
                  <Form.Control size="lg" type="password" name="password" value={formData.password}
                    onChange={handleChange} placeholder="Password" isInvalid={!!errors.password}/>
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </InputGroup>
                {errors.non_field_errors && (
                  <Alert variant="danger">{errors.non_field_errors}</Alert>
                )}
                <Button
                  type="submit"
                  variant="warning"
                  size="lg"
                  className="w-100 fw-bold mb-2"
                  style={{
                    borderRadius: 20,
                    background: 'linear-gradient(90deg,#ffd966 0%,#ffe79f 100%)',
                    color: '#444',
                    border: 'none'
                  }}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
              <div className="text-center small pt-2">
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#e69800', fontWeight:600 }}>Sign up here</Link>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default Login;

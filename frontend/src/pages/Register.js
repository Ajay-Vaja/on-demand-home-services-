import React, { useState, useContext } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  FaUserAlt, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaUserShield
} from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', password_confirm: '',
    first_name: '', last_name: '', user_type: 'customer',
    phone_number: '', address: ''
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
    setLoading(true); setErrors({});
    try {
      const response = await authAPI.register(formData);
      const { user, access_token, refresh_token } = response.data;
      login(user, { access_token, refresh_token });
      toast.success(`Welcome to HomeServices, ${user.first_name}!`);
      navigate('/');
    } catch (error) {
      if (error.response?.data) setErrors(error.response.data);
      else toast.error('Registration failed. Please try again.');
    } finally { setLoading(false);}
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg,#fde6ba 0%,#fefae0 100%)'
    }} className="d-flex align-items-center justify-content-center">
      <Container>
        <Card className="shadow-lg border-0 rounded-4 overflow-hidden" style={{maxWidth: 980, margin: '2rem auto'}}>
          <Row className="g-0 align-items-stretch">
            {/* Left Side - Bigger Image */}
            <Col md={6} className="d-none d-md-flex bg-light p-0 align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #ffe699 0%, #fff 98%)'}}>
              <div className="p-5 w-100 text-center">
                <img
                  src="/img/home_service.png"
                  alt="Home Services"
                  style={{
                    width: '90%',           // Use nearly full width of column
                    maxWidth: '420px',      // Allow it to be really big
                    minWidth: '260px',
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto 2rem auto',
                    borderRadius: '22px',
                    boxShadow: '0 4px 24px rgba(200,150,0,0.14)'
                  }}
                  className="mb-4"
                />
                <h2 className="fw-bold" style={{ color: '#ae8500' }}>Welcome!</h2>
                <div style={{ color: '#6c757d', fontSize: '1.07rem', marginTop: 12 }}>
                  Easily book trusted home service professionals<br />
                  for all your needs. Join now!
                </div>
              </div>
            </Col>
            {/* Right Side - Form */}
            <Col xs={12} md={6} className="bg-white p-4 p-lg-5">
              <h2 className="fw-bold text-center mb-4" style={{letterSpacing:'1.5px'}}>Sign Up</h2>
              <Form onSubmit={handleSubmit} autoComplete="off">
                <Row className="mb-3 g-2">
                  <Col xs={12} md={6}>
                    <InputGroup>
                      <InputGroup.Text><FaUserAlt /></InputGroup.Text>
                      <Form.Control size="lg" type="text" name="first_name" value={formData.first_name}
                        onChange={handleChange} placeholder="First Name" isInvalid={!!errors.first_name}/>
                      <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                  <Col xs={12} md={6}>
                    <InputGroup>
                      <InputGroup.Text><FaUserAlt /></InputGroup.Text>
                      <Form.Control size="lg" type="text" name="last_name" value={formData.last_name}
                        onChange={handleChange} placeholder="Last Name" isInvalid={!!errors.last_name}/>
                      <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                </Row>
                <InputGroup className="mb-3">
                  <InputGroup.Text><FaUserShield /></InputGroup.Text>
                  <Form.Control size="lg" type="text" name="username" value={formData.username}
                    onChange={handleChange} placeholder="Username" isInvalid={!!errors.username}/>
                  <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                  <Form.Control size="lg" type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="Email address" isInvalid={!!errors.email}/>
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text><FaLock /></InputGroup.Text>
                  <Form.Control size="lg" type="password" name="password" value={formData.password}
                    onChange={handleChange} placeholder="Password" isInvalid={!!errors.password}/>
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text><FaLock /></InputGroup.Text>
                  <Form.Control size="lg" type="password" name="password_confirm" value={formData.password_confirm}
                    onChange={handleChange} placeholder="Confirm Password" isInvalid={!!errors.password_confirm}/>
                  <Form.Control.Feedback type="invalid">{errors.password_confirm}</Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text><FaUserShield /></InputGroup.Text>
                  <Form.Select name="user_type" value={formData.user_type} onChange={handleChange} size="lg">
                    <option value="customer">Customer (Book Services)</option>
                    <option value="provider">Service Provider (Offer Services)</option>
                  </Form.Select>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text><FaPhone /></InputGroup.Text>
                  <Form.Control size="lg" type="tel" name="phone_number" value={formData.phone_number}
                    onChange={handleChange} placeholder="Phone Number" />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text><FaMapMarkerAlt /></InputGroup.Text>
                  <Form.Control size="lg" as="textarea" rows={2} name="address" value={formData.address}
                    onChange={handleChange} placeholder="Address" />
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
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </Form>
              <div className="text-center small pt-2">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#e69800', fontWeight:600 }}>Login</Link>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default Register;

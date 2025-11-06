import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { servicesAPI, bookingsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

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

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    booking_date: new Date(),
    time_slot: '09:00',
    hours_requested: 1,
    special_instructions: '',
    customer_address: '',
    customer_phone: ''
  });

  const timeSlots = [
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' },
  ];

  const loadService = useCallback(async () => {
    try {
      const response = await servicesAPI.detail(serviceId);
      setService(response.data);
      setFormData(prev => ({
        ...prev,
        hours_requested: response.data.minimum_hours
      }));
    } catch (error) {
      toast.error(
        <span>❌ Service not found</span>,
        { style: toastStyleError, icon: false }
      );
      navigate('/services');
    } finally {
      setLoading(false);
    }
  }, [serviceId, navigate]);

  useEffect(() => { loadService(); }, [serviceId, loadService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, booking_date: date }));
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  const calculateTotal = () => !service ? 0 : service.price_per_hour * formData.hours_requested;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setErrors({});
    try {
      const bookingData = {
        service: parseInt(serviceId),
        booking_date: formatDate(formData.booking_date),
        time_slot: formData.time_slot,
        hours_requested: parseInt(formData.hours_requested),
        special_instructions: formData.special_instructions,
        customer_address: formData.customer_address,
        customer_phone: formData.customer_phone
      };
      const response = await bookingsAPI.create(bookingData);
      toast.success(
        <span>✅ Booking created successfully!</span>,
        { style: toastStyleSuccess, icon: false }
      );
      navigate(`/payment/${response.data.booking_id}`);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData) {
        if (typeof errorData === 'object') setErrors(errorData);
        else toast.error(
          <span>❌ {errorData.error || 'Failed to create booking'}</span>,
          { style: toastStyleError, icon: false }
        );
      } else {
        toast.error(
          <span>❌ Something went wrong. Please try again.</span>,
          { style: toastStyleError, icon: false }
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading service details..." />;

  if (!service) return (
    <Container>
      <Alert variant="danger">Service not found</Alert>
    </Container>
  );

  return (
    <div style={{background: "linear-gradient(110deg,#edfbff 0%,#f7fdff 90%)", minHeight: "100vh"}}>
      <Container className="py-4">
        <Row>
          <Col lg={8}>
            <Card style={{
              borderRadius: 18,
              border: "none",
              boxShadow: "0 6px 28px #8ee7f31e",
              background: "#fafdff"
            }}>
              <Card.Header style={{
                background: "#fafdff",
                color: "#1e4154",
                fontWeight: 800,
                fontSize: "1.48rem"
              }}>
                Book Service: {service.name}
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#205879", fontWeight: 700 }}>Booking Date</Form.Label>
                        <DatePicker
                          selected={formData.booking_date}
                          onChange={handleDateChange}
                          minDate={new Date()}
                          maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                          required
                        />
                        {errors.booking_date && (
                          <div className="text-danger small">{errors.booking_date}</div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#205879", fontWeight: 700 }}>Time Slot</Form.Label>
                        <Form.Select
                          name="time_slot"
                          value={formData.time_slot}
                          onChange={handleChange}
                          required
                          style={{fontWeight: 500, color:"#273751"}}
                        >
                          {timeSlots.map(slot => (
                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                          ))}
                        </Form.Select>
                        {errors.time_slot && (
                          <div className="text-danger small">{errors.time_slot}</div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#205879", fontWeight: 700 }}>Hours Required</Form.Label>
                        <Form.Control
                          type="number"
                          name="hours_requested"
                          value={formData.hours_requested}
                          onChange={handleChange}
                          min={service.minimum_hours}
                          max={service.maximum_hours}
                          required
                          style={{fontWeight: 600, color:"#263144"}}
                        />
                        <Form.Text className="text-muted">
                          Min: {service.minimum_hours}h, Max: {service.maximum_hours}h
                        </Form.Text>
                        {errors.hours_requested && (
                          <div className="text-danger small">{errors.hours_requested}</div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#205879", fontWeight: 700 }}>Contact Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="customer_phone"
                          value={formData.customer_phone}
                          onChange={handleChange}
                          placeholder="Your contact number"
                          required
                          style={{fontWeight: 600, color:"#263144"}}
                        />
                        {errors.customer_phone && (
                          <div className="text-danger small">{errors.customer_phone}</div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "#205879", fontWeight: 700 }}>Service Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="customer_address"
                      value={formData.customer_address}
                      onChange={handleChange}
                      placeholder="Full address where service is required"
                      required
                      style={{fontWeight: 500, color:"#263144"}}
                    />
                    {errors.customer_address && (
                      <div className="text-danger small">{errors.customer_address}</div>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "#205879", fontWeight: 700 }}>Special Instructions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="special_instructions"
                      value={formData.special_instructions}
                      onChange={handleChange}
                      placeholder="Any special requirements or instructions..."
                      style={{fontWeight: 500, color:"#263144"}}
                    />
                  </Form.Group>
                  {errors.non_field_errors && (
                    <Alert variant="danger">{errors.non_field_errors}</Alert>
                  )}
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-100"
                    style={{
                      background: "linear-gradient(93deg,#28eaf7 0%,#1baad8 97%)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize:"1.12em",
                      border: "none",
                      borderRadius: 20,
                      marginTop: 6
                    }}
                    disabled={submitting}
                  >
                    {submitting ? 'Creating Booking...' : 'Create Booking'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card style={{
              borderRadius: 18,
              border: "none",
              background: "linear-gradient(110deg,#e9fbff 70%,#eaf3fd 130%)",
              boxShadow: "0 6px 30px #36e6fa1c",
              minHeight: 330
            }}>
              <Card.Header style={{background:"#fafdff", fontSize:"1.33rem", fontWeight:800, color:"#1a69a5"}}>
                Booking Summary
              </Card.Header>
              <Card.Body>
                <h5 style={{ color:"#1f3751", fontWeight:700 }}>{service.name}</h5>
                <p className="mb-2" style={{ color: "#5880a0" }}>{service.description}</p>
                <div className="mb-2" style={{ color: "#29598d", fontWeight: 700 }}>
                  <strong>Provider:</strong> <span style={{fontWeight:500}}>{service.provider_details.full_name}</span>
                </div>
                <div className="mb-2" style={{ color: "#1d7a89", fontWeight: 700 }}>
                  <strong>Price:</strong> <span style={{fontWeight:500}}>₹{service.price_per_hour}/hour</span>
                </div>
                <div className="mb-2" style={{ color: "#1d7a89", fontWeight: 700 }}>
                  <strong>Hours:</strong> <span style={{fontWeight:500}}>{formData.hours_requested}</span>
                </div>
                <hr/>
                <div className="d-flex justify-content-between" style={{color:"#1d4e7a", fontWeight:800, fontSize:"1.19em"}}>
                  <span>Total Amount:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BookingPage;

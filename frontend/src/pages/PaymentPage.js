import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Form } from 'react-bootstrap';
import { bookingsAPI, paymentsAPI } from '../services/api';
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

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentExists, setPaymentExists] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [error, setError] = useState('');
  const [paymentId, setPaymentId] = useState('');

  const loadBookingAndCreatePayment = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const bookingResponse = await bookingsAPI.detail(bookingId);
      setBooking(bookingResponse.data);

      const paymentResponse = await paymentsAPI.createIntent(bookingId, paymentMethod);
      setPaymentId(paymentResponse.data.payment_id);

      setPaymentExists(false);
    } catch (error) {
      if (error.response?.data?.error === 'Payment already exists for this booking') {
        setPaymentExists(true);
        setError('Payment already exists for this booking');
        toast.info(
          <span>ℹ️ Payment already exists for this booking</span>,
          { style: toastStyleSuccess, icon: false }
        );
      } else {
        setError(error.response?.data?.error || 'Failed to initialize payment');
        toast.error(
          <span>❌ Failed to load booking details</span>,
          { style: toastStyleError, icon: false }
        );
      }
    } finally {
      setLoading(false);
    }
  }, [bookingId, paymentMethod]);

  useEffect(() => { loadBookingAndCreatePayment(); }, [loadBookingAndCreatePayment]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError('');
    try {
      if (!paymentId) {
        setError("Payment could not be initialized. Please refresh or try again.");
        setProcessing(false);
        return;
      }
      await paymentsAPI.confirm({ payment_id: paymentId });
      toast.success(
        <span>✅ Payment successful!</span>,
        { style: toastStyleSuccess, icon: false }
      );
      navigate('/profile?tab=bookings');
    } catch (error) {
      setError(error.response?.data?.error || 'Payment failed');
      toast.error(
        <span>❌ Payment processing failed</span>,
        { style: toastStyleError, icon: false }
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading payment details..." />;
  }

  if (!booking) {
    return (
      <Container>
        <Alert variant="danger">Booking not found</Alert>
      </Container>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(114deg,#fafdff 60%,#e1fafe 120%)",
      minHeight: "100vh",
      color: "#222757"
    }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card style={{
              borderRadius: 18,
              border: "none",
              background: "#fafdff",
              boxShadow: "0 6px 26px #48c6ff19"
            }}>
              <Card.Header style={{
                background: "#fafdff",
                borderBottom: "2px solid #ecf6fc",
                fontSize: "1.7rem",
                color: "#1a305a",
                fontWeight: 800
              }}>
                Complete Payment
              </Card.Header>
              <Card.Body>
                <div className="mb-4 p-4"
                  style={{
                    background: "linear-gradient(92deg,#e2f8ff 90%,#e5f2fc 100%)",
                    borderRadius: "14px",
                    boxShadow: "0 4px 18px #7fd2f526"
                  }}>
                  <h6 style={{ color: "#189ebb", fontWeight: 700, fontSize: "1.12em" }}>Booking Summary</h6>
                  <div className="d-flex justify-content-between mb-2" style={{ fontWeight: 600 }}>
                    <span style={{ color: "#27446b" }}>Service:</span>
                    <span style={{ color: "#234699" }}>{booking.service_details.name}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2" style={{ fontWeight: 500, color: "#245184" }}>
                    <span>Date & Time:</span>
                    <span>{booking.booking_date} at {booking.time_slot_display}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2" style={{ fontWeight: 500, color: "#245184" }}>
                    <span>Duration:</span>
                    <span>{booking.hours_requested} hours</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2" style={{ fontWeight: 500, color: "#245184" }}>
                    <span>Provider:</span>
                    <span style={{ color: "#0db7c4" }}>{booking.service_details.provider_details.full_name}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold" style={{ color: "#116fa3", fontWeight: 900, fontSize: "1.18em" }}>
                    <span>Total Amount:</span>
                    <span>₹{booking.total_amount}</span>
                  </div>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col>
                      <Form.Label style={{
                        color: "#1c517a",
                        fontWeight: 700,
                        fontSize: "1.05em"
                      }}>
                        Payment Method
                      </Form.Label>
                      <Form.Select
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value)}
                        style={{
                          background: "#f8feff",
                          color: "#214d7c",
                          fontWeight: 500
                        }}
                      >
                        <option value="upi">UPI</option>
                        <option value="wallet">Digital Wallet</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  {error && (
                    <Alert variant="danger">{error}</Alert>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 my-2"
                    style={{
                      background: "linear-gradient(93deg,#28eaf7 0%,#1baad8 97%)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1.19em",
                      border: "none",
                      borderRadius: 17
                    }}
                    disabled={processing || paymentExists || !paymentId}
                  >
                    {processing ? 'Processing Payment...' : `Pay ₹${booking.total_amount}`}
                  </Button>
                  {paymentExists && (
                    <Alert variant="success" className="mt-2">
                      Payment for this booking has already been completed. Thank you!
                    </Alert>
                  )}

                  <div className="text-center mt-2">
                    <small className="text-secondary" style={{ fontWeight: 600 }}>
                      🔒 Your payment information is secure and encrypted
                    </small>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PaymentPage;

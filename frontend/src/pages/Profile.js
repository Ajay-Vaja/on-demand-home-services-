import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Nav } from 'react-bootstrap';
import { AuthContext } from '../App';
import { bookingsAPI, servicesAPI } from '../services/api';
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

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const statsResponse = await bookingsAPI.stats();
      setStats(statsResponse.data);
      const bookingsResponse = await bookingsAPI.myBookings();
      setBookings(bookingsResponse.data);
      if (user.user_type === 'provider') {
        const servicesResponse = await servicesAPI.myServices();
        setServices(servicesResponse.data);
      }
      toast.success(
        <span>✅ Dashboard loaded successfully!</span>,
        { style: toastStyleSuccess, icon: false, toastId: "dashboard-success" }
      );
    } catch (error) {
      toast.error(
        <span>❌ Failed to load dashboard data</span>,
        { style: toastStyleError, icon: false, toastId: "dashboard-error" }
      );
    } finally {
      setLoading(false);
    }
  }, [user.user_type]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.updateStatus(bookingId, { status: newStatus });
      toast.success(
        <span>✅ Booking status updated</span>,
        { style: toastStyleSuccess, icon: false }
      );
      loadDashboardData();
    } catch (error) {
      toast.error(
        <span>❌ Failed to update status</span>,
        { style: toastStyleError, icon: false }
      );
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'info',
      in_progress: 'primary',
      completed: 'success',
      cancelled: 'danger'
    };
    return (
      <Badge bg={variants[status] || 'secondary'} style={{ fontSize: "1em", padding: "0.48em 1.13em", letterSpacing: "0.03em" }}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div style={{ background: "linear-gradient(120deg,#f8fdff 0%,#edfcff 97%)", minHeight: '100vh', color: "#203142" }}>
      <Container className="py-4">
        <Row>
          {/* Sidebar Navigation */}
          <Col lg={3}>
            <Card style={{
              borderRadius: 17,
              boxShadow: "0 5px 22px #90e7fa18",
              border: "none",
              background: "#f3f8fd"
            }}>
              <Card.Header style={{ background: '#fafdff', fontSize: "1.38rem", color: "#193b63", fontWeight: 700, border: 0, letterSpacing: ".02em" }}>
                Dashboard
              </Card.Header>
              <Card.Body>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'dashboard'}
                      onClick={() => setActiveTab('dashboard')}
                      style={{
                        borderRadius: "16px",
                        fontWeight: 600,
                        fontSize: "1.18em",
                        color: activeTab === 'dashboard' ? "#048075" : "#2199cf",
                        background: activeTab === 'dashboard'
                          ? "linear-gradient(97deg,#b3fcfc 15%,#55ebfa 99%)"
                          : undefined,
                        marginBottom: 8
                      }}
                    >
                      Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'bookings'}
                      onClick={() => setActiveTab('bookings')}
                      style={{
                        borderRadius: "16px",
                        fontWeight: 600,
                        fontSize: "1.18em",
                        color: activeTab === 'bookings' ? "#048075" : "#2696c9",
                        background: activeTab === 'bookings'
                          ? "linear-gradient(97deg,#b3fcfc 15%,#55ebfa 99%)"
                          : undefined,
                        marginBottom: 8
                      }}
                    >
                      My Bookings
                    </Nav.Link>
                  </Nav.Item>
                  {user.user_type === 'provider' && (
                    <Nav.Item>
                      <Nav.Link
                        active={activeTab === 'services'}
                        onClick={() => setActiveTab('services')}
                        style={{
                          borderRadius: "16px",
                          fontWeight: 600,
                          fontSize: "1.18em",
                          color: activeTab === 'services' ? "#048075" : "#23b2b7",
                          background: activeTab === 'services'
                            ? "linear-gradient(97deg,#b3fcfc 15%,#55ebfa 99%)"
                            : undefined,
                          marginBottom: 8
                        }}
                      >
                        My Services
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'profile'}
                      onClick={() => setActiveTab('profile')}
                      style={{
                        borderRadius: "16px",
                        fontWeight: 600,
                        fontSize: "1.18em",
                        color: activeTab === 'profile' ? "#048075" : "#2e75b2",
                        background: activeTab === 'profile'
                          ? "linear-gradient(97deg,#b3fcfc 15%,#55ebfa 99%)"
                          : undefined,
                        marginBottom: 2
                      }}
                    >
                      Profile
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          {/* Main Content */}
          <Col lg={9}>
            {/* Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="mb-4" style={{
                  fontWeight: 800,
                  fontSize: "2.16rem",
                  color: "#1e3b52",
                  letterSpacing: ".014em"
                }}>
                  Welcome, {user.first_name || user.username}!
                </h2>
                <Row className="mb-4">
                  <Col md={3}>
                    <Card style={{ borderRadius: 17, border: "none", boxShadow: "0 3px 16px #8fd6f25c" }}>
                      <Card.Body className="text-center">
                        <h3 className="fw-bold mb-1" style={{ color: "#1a86db", fontSize: "2.1rem" }}>
                          {stats.total_bookings || 0}
                        </h3>
                        <p className="mb-0" style={{ color: "#31465a", fontWeight: 600, fontSize: "1.11em" }}>Total Bookings</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card style={{ borderRadius: 17, border: 'none', boxShadow: "0 3px 16px #b8f2ce5c" }}>
                      <Card.Body className="text-center">
                        <h3 className="fw-bold mb-1" style={{ color: "#28c793", fontSize: "2.1rem" }}>
                          {stats.completed_bookings || 0}
                        </h3>
                        <p className="mb-0" style={{ color: "#366d52", fontWeight: 600, fontSize: "1.11em" }}>Completed</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card style={{ borderRadius: 17, border: 'none', boxShadow: "0 3px 16px #ffe0965c" }}>
                      <Card.Body className="text-center">
                        <h3 className="fw-bold mb-1" style={{ color: "#ffd958", fontSize: "2.1rem" }}>
                          {stats.pending_bookings || 0}
                        </h3>
                        <p className="mb-0" style={{ color: "#7e6724", fontWeight: 600, fontSize: "1.11em" }}>Pending</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card style={{ borderRadius: 17, border: 'none', boxShadow: "0 3px 16px #9debf85c" }}>
                      <Card.Body className="text-center">
                        <h3 className="fw-bold mb-1" style={{ color: "#18cbe6", fontSize: "2.1rem" }}>
                          {stats.completion_rate || 0}%
                        </h3>
                        <p className="mb-0" style={{ color: "#267489", fontWeight: 600, fontSize: "1.11em" }}>Success Rate</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Card style={{
                  borderRadius: 17, border: "none",
                  boxShadow: "0 5px 25px #4b8ee223"
                }}>
                  <Card.Header style={{ background: "#fafdff", fontWeight: 800, fontSize: "1.19em", color: "#2c567a" }}>
                    Recent Activity
                  </Card.Header>
                  <Card.Body>
                    {bookings.length > 0 ? (
                      <Table responsive hover>
                        <thead>
                          <tr style={{ color: '#23446b', fontSize: "1.04em", fontWeight: 700 }}>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.slice(0, 5).map(booking => (
                            <tr key={booking.id} style={{ fontWeight: 600 }}>
                              <td>{booking.service_details.name}</td>
                              <td>{booking.booking_date}</td>
                              <td>{getStatusBadge(booking.status)}</td>
                              <td style={{ color: "#2a6698" }}>₹{booking.total_amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p className="text-secondary" style={{ fontWeight: 700 }}>No recent activity</p>
                    )}
                  </Card.Body>
                </Card>
              </div>
            )}
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <Card style={{ borderRadius: 18, border: "none", boxShadow: "0 2px 16px #93d6ff0c" }}>
                <Card.Header style={{ background: "#fafdff", color: "#13617c", fontWeight: 800, fontSize: "1.12em" }}>
                  My Bookings
                </Card.Header>
                <Card.Body>
                  {bookings.length > 0 ? (
                    <Table responsive hover>
                      <thead>
                        <tr style={{ fontWeight: 700, color: '#2b4b53' }}>
                          <th>Service</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(booking => (
                          <tr key={booking.id} style={{ fontWeight: 600 }}>
                            <td>{booking.service_details.name}</td>
                            <td>{booking.booking_date} {booking.time_slot_display}</td>
                            <td>{getStatusBadge(booking.status)}</td>
                            <td style={{ color: "#2065a3" }}>₹{booking.total_amount}</td>
                            <td>
                              {user.user_type === 'provider' && booking.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="me-2"
                                    style={{
                                      fontWeight: 700,
                                      background: "linear-gradient(93deg,#16f1c1 0%,#0bdffc 95%)",
                                      color: "#134d3d",
                                      border: "none",
                                      borderRadius: "12px",
                                      padding: "6px 20px",
                                      fontSize: "1em",
                                      boxShadow: "0 2px 9px #b6f7f740,0 0 1.5px #99fefa55",
                                      transition: "box-shadow 0.15s,transform 0.11s",
                                      letterSpacing: ".01em"
                                    }}
                                    onMouseOver={e => { e.target.style.boxShadow = '0 4px 16px #21ffe47a,0 2px 11px #86fcff44'; }}
                                    onMouseOut={e => { e.target.style.boxShadow = '0 2px 9px #b6f7f740,0 0 1.5px #99fefa55'; }}
                                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    style={{
                                      fontWeight: 700,
                                      background: "linear-gradient(93deg,#fc8e9e 0%,#ff3636 100%)",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: "12px",
                                      padding: "6px 20px",
                                      fontSize: "1em",
                                      boxShadow: "0 2px 11px #f5c3c640,0 0 1.5px #ffa5a555",
                                      transition: "box-shadow 0.15s,transform 0.11s",
                                      letterSpacing: ".01em"
                                    }}
                                    onMouseOver={e => { e.target.style.boxShadow = '0 4px 16px #fb6e6e61,0 2px 11px #ffaaa877'; }}
                                    onMouseOut={e => { e.target.style.boxShadow = '0 2px 11px #f5c3c640,0 0 1.5px #ffa5a555'; }}
                                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                  >
                                    Decline
                                  </Button>
                                </>
                              )}
                              {user.user_type === 'provider' && booking.status === 'confirmed' && (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                >Complete</Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-secondary" style={{ fontWeight: 700 }}>No bookings found</p>
                  )}
                </Card.Body>
              </Card>
            )}
            {/* Services Tab (Provider Only) */}
            {activeTab === 'services' && user.user_type === 'provider' && (
              <Card style={{ borderRadius: 18, border: "none", boxShadow: "0 2px 14px #b7f6e845" }}>
                <Card.Header style={{ background: "#fafdff", color: "#138c7f", fontWeight: 800, fontSize: "1.12em" }}>
                  My Services
                </Card.Header>
                <Card.Body>
                  {services.length > 0 ? (
                    <Table responsive hover>
                      <thead>
                        <tr style={{ fontWeight: 700, color: '#10636c' }}>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price/Hour</th>
                          <th>Rating</th>
                          <th>Bookings</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map(service => (
                          <tr key={service.id} style={{ fontWeight: 600 }}>
                            <td>{service.name}</td>
                            <td>{service.category_display}</td>
                            <td style={{ color: "#18a39b" }}>₹{service.price_per_hour}</td>
                            <td>
                              {typeof service.rating === 'number' && !isNaN(service.rating)
                                ? service.rating.toFixed(1)
                                : 'N/A'}
                            </td>
                            <td>{service.total_bookings}</td>
                            <td>
                              <Badge bg={service.is_available ? 'success' : 'secondary'}>
                                {service.is_available ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-secondary" style={{ fontWeight: 700 }}>No services added yet</p>
                  )}
                </Card.Body>
              </Card>
            )}
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card style={{ borderRadius: 18, border: "none", boxShadow: "0 2px 14px #b7f6e845" }}>
                <Card.Header style={{ background: "#fafdff", color: "#297cc1", fontWeight: 800, fontSize: "1.18em" }}>
                  Profile Information
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p style={{ fontWeight: 700, fontSize: "1.08em" }}>
                        <span style={{ color: "#1760a7" }}>Name:</span>
                        {" "}{user.first_name} {user.last_name}
                      </p>
                      <p style={{ fontWeight: 700, fontSize: "1.08em" }}>
                        <span style={{ color: "#1760a7" }}>Username:</span>
                        {" "}{user.username}
                      </p>
                      <p style={{ fontWeight: 700, fontSize: "1.08em" }}>
                        <span style={{ color: "#1760a7" }}>Email:</span>
                        {" "}{user.email}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p style={{ fontWeight: 700, fontSize: "1.08em" }}>
                        <span style={{ color: "#1760a7" }}>User Type:</span>
                        {" "}{user.user_type}
                      </p>
                      <p style={{ fontWeight: 700, fontSize: "1.08em" }}>
                        <span style={{ color: "#1760a7" }}>Phone:</span>
                        {" "}{user.phone_number || 'Not provided'}
                      </p>
                      <p style={{ fontWeight: 700, fontSize: "1.08em" }}>
                        <span style={{ color: "#1760a7" }}>Address:</span>
                        {" "}{user.address || 'Not provided'}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;

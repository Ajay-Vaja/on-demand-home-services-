import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaSearch, FaStar, FaUserShield, FaTools } from 'react-icons/fa';

const Home = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { loadHomeData(); }, []);
  const loadHomeData = async () => {
    try {
      const servicesResponse = await servicesAPI.list({ ordering: '-rating' });
      setFeaturedServices((servicesResponse.data.results || servicesResponse.data).slice(0, 6));
      const statsResponse = await servicesAPI.stats();
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/services?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }

  return (
    <div style={{ background: "#f2f7fa" }}>
      {/* Hero Section */}
      <section className="py-5" style={{
        background: 'linear-gradient(107deg, #41c4fa 60%, #a6f6c3 100%)',
        color: '#192940',
        borderBottom: '2px solid #b1e4fd'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h1 className="display-4 fw-bold mb-3"
                style={{
                  color: "#192940",
                  textShadow: '0 0 12px #eaefeff0,0 3px 24px #71ddff33',
                  fontSize: 'clamp(2.3rem,6vw,4.0rem)'
                }}>
                Book <span style={{ color: '#0b384f', background: 'linear-gradient(90deg,#fafdff 60%,#bdf6f1 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textShadow:"none", fontWeight: 800 }}>
                  Trusted Home Services
                </span>
              </h1>
              <p className="lead mb-4 shadow-sm" style={{
                fontSize: '1.23rem',
                color: "#134853",
                fontWeight: 500,
                textShadow: '0 1.8px 10px #d3f8ffc6'
              }}>
                Find and book reliable professionals for all your home needs—from cleaning to repairs, we've got you covered.
              </p>
              <Form onSubmit={handleSearch}>
                <InputGroup size="lg" className="shadow rounded-pill" style={{
                  overflow: 'hidden',
                  background: '#f9feff',
                  border: '1.7px solid #b9f8fe'
                }}>
                  <Form.Control
                    type="text"
                    placeholder="Search for services…"
                    value={searchQuery}
                    style={{
                      background: "#f9feff",
                      border: "none",
                      color: "#144046",
                      fontWeight: 500,
                      fontSize: "1.13rem"
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="fw-bold"
                    style={{
                      background: 'linear-gradient(90deg,#26f0d5 0%,#13a2fa 100%)',
                      color: '#11354c',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: "1.14rem"
                    }}
                  >
                    <FaSearch style={{ marginBottom: 2 }} /> Search
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col lg={5} className="d-flex flex-column align-items-center">
              <img
                src="/img/homepage.png"
                alt="Home Service Illustration"
                style={{
                  width: '82%', maxWidth: 340, minWidth: 210, margin: '24px 0 18px 0',
                  boxShadow: '0 1px 16px 0 #62f6ff4a', borderRadius: 21
                }} />
              <h4 style={{
                color: "#19587c",
                fontWeight: 700,
                textShadow: '0 2px 14px #e9f8ff'
              }}>
                Your Home, Our Priority
              </h4>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Stats Section */}
      <section className="py-5" style={{
        background: 'linear-gradient(120deg,#eafcff 0%,#d8fae3 100%)',
        borderBottom: '1.5px solid #c0f3f157'
      }}>
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <Card className="border-0 bg-transparent">
                <Card.Body>
                  <h2 style={{ color: '#2b97be', fontWeight: 800 }}>
                    <FaTools className="mb-2" /> {stats.total_services || 0}+
                  </h2>
                  <p style={{ fontSize: '1.12rem', color: "#256680", fontWeight: 600 }}>Services Available</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 bg-transparent">
                <Card.Body>
                  <h2 style={{ color: '#23aa7c', fontWeight: 800 }}>
                    <FaUserShield className="mb-2" /> {stats.total_providers || 0}+
                  </h2>
                  <p style={{ fontSize: '1.12rem', color: "#297869", fontWeight: 600 }}>Trusted Providers</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 bg-transparent">
                <Card.Body>
                  <h2 style={{ color: '#2676cf', fontWeight: 800 }}>
                    <FaStar className="mb-2" /> {stats.average_rating || 4.8}
                  </h2>
                  <p style={{ fontSize: '1.12rem', color: "#3480ac", fontWeight: 600 }}>Average Rating</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Services */}
      <section className="py-5" style={{ background: "#f5fcff" }}>
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center mb-3 fw-bold" style={{
                fontSize: '2.2rem',
                color:'#153750',
                textShadow:"0 1px 10px #eafcff"
              }}>
                Featured Services
              </h2>
              <p className="text-center" style={{ fontSize: '1.11rem', color:"#36516a", fontWeight: 600 }}>
                Top-rated services from our trusted professionals
              </p>
            </Col>
          </Row>
          <Row>
            {featuredServices.map(service => (
              <Col lg={4} md={6} key={service.id} className="mb-4">
                <ServiceCard service={service} />
              </Col>
            ))}
          </Row>
          <Row>
            <Col className="text-center">
              <Button as={Link} to="/services"
                className="rounded-pill px-4 py-2 shadow fw-bold btn-featured-main"
                style={{
                  fontSize: '1.22rem',
                  border: 'none',
                  background: 'linear-gradient(91deg,#44f0e8 0%,#249ffc 99%)',
                  color: '#1b3b38',
                  boxShadow: "0 7px 30px #79ebef60",
                  letterSpacing: ".01em",
                  fontWeight: 800
                }}>
                View All Services
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Card, InputGroup } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaSearch, FaList, FaRupeeSign } from 'react-icons/fa';
import { toast } from 'react-toastify';

const toastStyleError = {
  borderRadius: '14px',
  background: 'linear-gradient(98deg,#fff0ea 35%,#ffe5f5 120%)',
  color: "#be3b47",
  fontWeight: 800,
  fontSize: '1.08em',
  boxShadow: '0 4px 28px #ee444422'
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || ''
  });

  useEffect(() => { loadCategories(); }, []);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(searchParams.entries());
      const response = await servicesAPI.list(params);
      setServices(response.data.results || response.data);
    } catch (error) {
      toast.error(
        <span>❌ Error loading services</span>,
        { style: toastStyleError, icon: false }
      );
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => { loadServices(); }, [searchParams, loadServices]);

  const loadCategories = async () => {
    try {
      const response = await servicesAPI.categories();
      setCategories(response.data);
    } catch (error) {
      toast.error(
        <span>❌ Error loading categories</span>,
        { style: toastStyleError, icon: false }
      );
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  return (
    <div style={{
      background: "linear-gradient(108deg,#faf7fd 70%,#e8e2ff 120%)",
      minHeight: "100vh",
      color: "#212245"
    }}>
      <Container className="py-5">
        <Row>
          {/* Sidebar */}
          <Col lg={3} className="mb-4">
            <Card style={{
              background: "linear-gradient(120deg,#f8f4ff 70%,#ece3f9 130%)",
              borderRadius: 20, border: "none", boxShadow: "0 7px 24px #baadfa25"
            }}>
              <Card.Header style={{
                background: "transparent", border: "none",
                fontWeight: 800, letterSpacing: ".04em"
              }}>
                <span style={{
                  color: "#7248b5", fontWeight: 900, fontSize: "1.17rem"
                }}>
                  <FaSearch style={{ marginRight: 8 }} />
                  Filter Services
                </span>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label style={{
                      color: "#402c60",
                      fontWeight: 700,
                      fontSize: "1.04rem"
                    }}>Search</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search services..."
                        style={{
                          borderRadius: "18px 0 0 18px",
                          background: "#f6f0fa",
                          color: "#271844",
                          fontWeight: 500
                        }}
                      />
                      <InputGroup.Text style={{ background: "#f6f0fa", color: "#4a3170" }}>
                        <FaSearch />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label style={{
                      color: "#402c60", fontWeight: 700, fontSize: "1.04rem"
                    }}>Category</Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{
                        background: "#f6f0fa",
                        color: "#4a3170"
                      }}>
                        <FaList />
                      </InputGroup.Text>
                      <Form.Select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        style={{
                          borderRadius: "0 18px 18px 0",
                          background: "#f6f0fa",
                          color: "#32225e",
                          fontWeight: 500
                        }}>
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label style={{
                          color: "#453061", fontWeight: 700
                        }}>Min Price (₹/hr)</Form.Label>
                        <InputGroup>
                          <InputGroup.Text style={{
                            background: "#f6f0fa",
                            color: "#6740b3"
                          }}>
                            <FaRupeeSign />
                          </InputGroup.Text>
                          <Form.Control
                            type="number"
                            name="min_price"
                            value={filters.min_price}
                            onChange={handleFilterChange}
                            placeholder="0"
                            style={{
                              background: "#f6f0fa",
                              color: "#34255c",
                              fontWeight: 500,
                              borderRadius: "18px"
                            }}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label style={{
                          color: "#453061", fontWeight: 700
                        }}>Max Price (₹/hr)</Form.Label>
                        <InputGroup>
                          <InputGroup.Text style={{
                            background: "#f6f0fa",
                            color: "#6740b3"
                          }}>
                            <FaRupeeSign />
                          </InputGroup.Text>
                          <Form.Control
                            type="number"
                            name="max_price"
                            value={filters.max_price}
                            onChange={handleFilterChange}
                            placeholder="10000"
                            style={{
                              background: "#f6f0fa",
                              color: "#34255c",
                              fontWeight: 500,
                              borderRadius: "18px"
                            }}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold" style={{
                color: "#432773",
                letterSpacing: "0.7px",
                fontSize: "2.18rem",
                textShadow: "0 2px 13px #ece5f9"
              }}>
                Available Services
              </h2>
              <small className="text-secondary" style={{
                fontWeight: 600, color: "#8c81ac", fontSize: "1.01rem"
              }}>
                {services.length} services found
              </small>
            </div>
            {loading ? (
              <LoadingSpinner text="Loading services..." />
            ) : services.length > 0 ? (
              <Row>
                {services.map(service => (
                  <Col lg={6} md={8} key={service.id} className="mb-5">
                    <ServiceCard service={service} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="shadow-sm mt-5">
                <Card.Body className="text-center py-5">
                  <h5 style={{ color: "#a23781", fontWeight: 800 }}>No Services Found</h5>
                  <p className="text-muted" style={{ fontWeight: 600 }}>
                    Try adjusting your filters to see more results.
                  </p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Services;

import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const ServiceCard = ({ service }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{
          color: i <= rating ? '#3fd0fd' : '#d3e8f9',
          fontSize: '1.16em',
          textShadow: i <= rating ? '0 1px 5px #80e8ff88' : undefined
        }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <Card
      className="h-100 shadow"
      style={{
        borderRadius: 22,
        background: "linear-gradient(120deg, #fafdff 75%, #e2f7ff 120%)",
        boxShadow: "0 8px 38px #b7eafc21,0 1.5px 18px #08c8d90f",
        border: "none",
        paddingBottom: 6,
        transition: "box-shadow 0.18s"
      }}
    >
      <Card.Body className="d-flex flex-column px-4 py-4">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <Card.Title
            className="h5 mb-0"
            style={{
              color: "#15314b",
              fontWeight: 700,
              letterSpacing: "0.02em",
              fontSize: "1.25em"
            }}>
            {service.name}
          </Card.Title>
          <span>
            <Badge
              style={{
                background: "linear-gradient(90deg,#48c6ef 0%,#6fefd3 90%)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 22,
                fontSize: "1em",
                minWidth: "92px",
                boxShadow: '0 2px 13px #8fe8ec28'
              }}
              className="px-3 py-2"
            >
              {service.category_display}
            </Badge>
          </span>
        </div>
        <Card.Text className="text-muted my-2" style={{ minHeight: 52, fontSize: "1.04rem" }}>
          {service.description.length > 80 ? (
            <>{service.description.substring(0, 76)}...</>
          ) : service.description}
        </Card.Text>
        <div className="mb-3" style={{ fontSize: "1.02em" }}>
          <span style={{ color: "#77a3c2" }}>by </span>
          <strong style={{ color: "#0a84c2" }}>
            {service.provider_details.full_name ||
              service.provider_details.username}
          </strong>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: "1.01em" }}>
          <div>
            {renderStars(service.rating)}
            <small className="text-muted ms-1" style={{ fontSize: 12 }}>
              ({service.total_bookings} bookings)
            </small>
          </div>
          <div className="text-end">
            <div style={{
              color: "#0fbade",
              fontWeight: 700,
              fontSize: "1.13rem",
              letterSpacing: "0.5px"
            }}>
              {formatPrice(service.price_per_hour)}
              <span style={{ color: "#6ad7fd", fontSize: "0.98em", fontWeight: 500 }}>/hr</span>
            </div>
            <small className="text-muted" style={{ fontSize: "0.93em" }}>
              Min: {service.minimum_hours}h
            </small>
          </div>
        </div>
        {service.service_area && (
          <div className="mb-2 d-flex align-items-center">
            <FaMapMarkerAlt className="me-1" style={{ color: '#4cc9ff', fontSize: '1.09em' }} />
            <small style={{ color: "#137cab" }}>{service.service_area}</small>
          </div>
        )}
        <div className="mt-auto">
          <Button
            as={Link}
            to={`/booking/${service.id}`}
            size="lg"
            style={{
              width: "100%",
              borderRadius: 33,
              background: "linear-gradient(90deg,#0fbcfa 0%,#59e4d1 97%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.14em",
              border: "none",
              boxShadow: "0 2px 16px #b5e9ff60,0 0.5px 8px #44c1d566",
              letterSpacing: "0.5px",
              transition: "background 0.17s, color 0.17s"
            }}
            onMouseOver={e => {
              e.target.style.background='linear-gradient(90deg,#14d9ee 8%,#1fd9cc 91%)';
              e.target.style.color='#fff';
            }}
            onMouseOut={e => {
              e.target.style.background='linear-gradient(90deg,#0fbcfa 0%,#59e4d1 97%)';
              e.target.style.color='#fff';
            }}
          >
            Book Now
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ServiceCard;

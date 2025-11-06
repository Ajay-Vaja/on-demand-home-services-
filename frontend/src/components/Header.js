import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [homeHover, setHomeHover] = useState(false);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) await authAPI.logout(refreshToken);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/');
      toast.success(
        <div>
          <span role="img" aria-label="logout">👋</span> 
          <span style={{ color: '#13eec5', fontWeight: 800, marginLeft: 6 }}>Logged out. See you soon!</span>
        </div>,
        {
          style: {
            borderRadius: '12px',
            background: 'linear-gradient(92deg, #eafffb 60%, #d2fffc 100%)',
            padding: '2px 14px',
            color: '#137a63',
            fontWeight: 700,
            fontSize: '1.01em',
            boxShadow: "0 2px 18px #8bffe277"
          },
          icon: false // hides default checkmark
        }
      );
    }
  };

  return (
    <Navbar expand="lg" className="sticky-top p-0" style={{
      background: "rgba(28,35,46,0.94)",
      borderBottom: "3px solid #25e7e08e",
      boxShadow: "0 2px 20px 0 #21bad965"
    }}>
      <Container fluid className="px-4 py-2 d-flex align-items-center">
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2">
          <span
            style={{
              fontSize: 32,
              display: "inline-block",
              transform: homeHover
                ? "rotate(-8deg) scale(1.22) translateY(-12%)"
                : "rotate(-10deg) scale(1)",
              filter: homeHover
                ? "drop-shadow(0 6px 32px #36ffd2b6)"
                : "drop-shadow(0 4px 8px #23e3e088)",
              transition: "all .29s cubic-bezier(.27,1.6,.45,1.03)",
              cursor: "pointer"
            }}
            onMouseEnter={() => setHomeHover(true)}
            onMouseLeave={() => setHomeHover(false)}
          >
            🏠
          </span>
          <span style={{
            fontWeight: 700,
            fontSize: '1.38rem',
            letterSpacing: '1px',
            color: 'white',
            textShadow: '0 2px 18px #59f0e1'
          }}>
            Home
            <span style={{
              color: '#1ff0ba',
              fontWeight: 700,
              filter: 'drop-shadow(0 0 6px #13ffe633)'
            }}>Services</span>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" style={{
          border: "none",
          background: "#23e3e038"
        }} />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-4 gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "nav-link" +
                (isActive ? " nav-link-active" : "")
              }
              end
              style={({ isActive }) => ({
                fontWeight: 700,
                color: isActive ? "#1ff0ba" : "#eafaff",
                background: isActive ? "rgba(37,236,210,0.17)" : "none",
                boxShadow: isActive ? "0 1px 20px 0 #23f1f055" : "none",
                padding: "7px 22px",
                borderRadius: "24px",
                fontSize: "1.11rem",
                letterSpacing: "0.03em",
                marginRight: "7px",
                transition: "all 0.12s"
              })}
            >Home</NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                "nav-link" +
                (isActive ? " nav-link-active" : "")
              }
              style={({ isActive }) => ({
                fontWeight: 700,
                color: isActive ? "#1ff0ba" : "#b9bfd3",
                background: isActive ? "rgba(37,236,210,0.19)" : "none",
                boxShadow: isActive ? "0 1px 18px 0 #33dff099" : "none",
                padding: "7px 22px",
                borderRadius: "24px",
                fontSize: "1.09rem",
                letterSpacing: "0.03em",
                marginRight: "7px",
                transition: "all 0.12s"
              })}
            >Services</NavLink>
          </Nav>
          <Nav className="ms-auto d-flex align-items-center gap-2">
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  style={{
                    background: 'rgba(242,255,255,0.86)',
                    color: "#223d53",
                    fontWeight: 700,
                    boxShadow: '0 2px 14px #2efde235, 0 1px 7px #4fbfa011',
                    border: "1.3px solid #11e8dc55",
                    borderRadius: "20px",
                    padding: "7px 22px",
                    letterSpacing: ".01em"
                  }}>
                  {user.first_name || user.username}
                  <span style={{
                    marginLeft: 11,
                    background: "#16efd8",
                    color: "#264c61",
                    padding: ".36em 1.4em",
                    fontWeight: 700,
                    fontSize: "0.93rem",
                    borderRadius: "11px",
                    verticalAlign: 'bottom',
                    boxShadow: "0 1px 7px #60f0df28"
                  }}>
                    {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{
                  marginTop: 8,
                  minWidth: 188,
                  borderRadius: "17px",
                  background: "rgba(236,255,255,0.97)",
                  boxShadow: "0 7px 32px #4ad9e238"
                }}>
                  <Dropdown.Item as={Link} to="/profile" style={{
                    fontWeight: 700,
                    color: "#2889c7"
                  }}>
                    Profile & Dashboard
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    style={{
                      fontWeight: 700, color: "#e43a5e"
                    }}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  style={{
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    padding: "8px 2.3em",
                    border: "2px solid #2df0ec",
                    background: "rgba(11,23,43,0.11)",
                    color: "#20e5e1",
                    borderRadius: "23px",
                    marginRight: "7px",
                    boxShadow: "0 0 15px #13ffe633",
                    letterSpacing: ".01em"
                  }}
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  style={{
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    padding: "8px 2.3em",
                    border: "2px solid #2df0ec",
                    background: "rgba(15,68,98,0.10)",
                    color: "#1afae3",
                    borderRadius: "23px",
                    boxShadow: "0 0 16px #23fad940",
                    letterSpacing: ".01em"
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

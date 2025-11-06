import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Auth Context
export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, tokens) => {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Elements stripe={stripePromise}>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route 
                  path="/login" 
                  element={!user ? <Login /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/register" 
                  element={!user ? <Register /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/booking/:serviceId" 
                  element={user ? <BookingPage /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/payment/:bookingId" 
                  element={user ? <PaymentPage /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/profile" 
                  element={user ? <Profile /> : <Navigate to="/login" />} 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </Elements>
    </AuthContext.Provider>
  );
}

export default App;

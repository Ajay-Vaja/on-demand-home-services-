import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// REQUEST INTERCEPTORS: Add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTORS: Auto-refresh and relogin
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          return api(original);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// ------------------------- API GROUPS -------------------------

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: (refreshToken) => api.post('/auth/logout/', { refresh_token: refreshToken }),
  profile: () => api.get('/auth/profile/'),
};

// Services API
export const servicesAPI = {
  list: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/services/?${queryString}`);
  },
  detail: (id) => api.get(`/services/${id}/`),
  create: (serviceData) => api.post('/services/create/', serviceData),
  myServices: () => api.get('/services/my/'),
  categories: () => api.get('/services/categories/'),
  stats: () => api.get('/services/stats/'),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings/', bookingData),
  myBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/bookings/my/?${queryString}`);
  },
  detail: (id) => api.get(`/bookings/${id}/`),
  updateStatus: (id, statusData) => api.put(`/bookings/${id}/status/`, statusData),
  stats: () => api.get('/bookings/stats/'),
};

// Payments API
export const paymentsAPI = {
  createIntent: (bookingId, paymentMethod) =>
    api.post('/payments/create/', { booking_id: bookingId, payment_method: paymentMethod }),
  confirm: (payload) =>
    api.post('/payments/confirm/', payload),
  myPayments: () => api.get('/payments/my/'),
  status: (bookingId) => api.get(`/payments/booking/${bookingId}/`),
};

export default api;


import axios from 'axios';

// ✅ FIX: trim() removes spaces AND trailing slash
// "https://backend.vercel.app/" → "https://backend.vercel.app"
// Then we add /api ourselves → no double slash ever
const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_URL = raw.trim().replace(/\/$/, ''); // remove trailing slash

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = user?.role === 'customer' ? '/customer-login' : '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  registerStaff: (data) => api.post('/auth/register-staff', data),
  login: (data) => api.post('/auth/login', data),
  sendOtp: (data) => api.post('/auth/customer/send-otp', data),
  verifyOtp: (data) => api.post('/auth/customer/verify-otp', data),
  me: () => api.get('/auth/me'),
  submitStaffApplication: (data) => api.post('/auth/staff-applications', data),
  getStaffApplications: () => api.get('/auth/staff-applications'),
  approveStaffApplication: (id) => api.patch(`/auth/staff-applications/${id}/approve`),
  rejectStaffApplication: (id) => api.patch(`/auth/staff-applications/${id}/reject`),
  getStaff: () => api.get('/auth/staff'),
  toggleStaff: (id) => api.patch(`/auth/staff/${id}/toggle`),
  deleteStaff: (id) => api.delete(`/auth/staff/${id}`),
};

export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status, note) =>
    api.patch(`/orders/${id}/status`, { status, note }),
  delete: (id) => api.delete(`/orders/${id}`),
  getDashboard: () => api.get('/orders/dashboard'),
  getStaffDashboard: () => api.get('/orders/staff-dashboard'),
  getMyOrders: () => api.get('/orders/my-orders'),
  getGarmentPrices: () => api.get('/orders/garment-prices'),
};

export default api;

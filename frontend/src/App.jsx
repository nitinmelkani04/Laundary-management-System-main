import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import StaffApplicationPage from "./pages/StaffApplicationPage";
import DashboardPage from "./pages/DashboardPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import StaffManagementPage from "./pages/StaffManagementPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import MyOrdersPage from "./pages/MyOrdersPage";

// ── Must be logged in ─────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// ── Staff or Admin only ───────────────────────────────
const StaffRoute = ({ children }) => {
  const { isAuthenticated, isStaffOrAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isStaffOrAdmin) return <Navigate to="/my-orders" replace />;
  return children;
};

// ── Admin only ────────────────────────────────────────
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

// ── Customer only ─────────────────────────────────────
const CustomerRoute = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  if (!isAuthenticated) return <Navigate to="/customer-login" replace />;
  if (!isCustomer) return <Navigate to="/dashboard" replace />;
  return children;
};

// ── Redirect logged-in users away from login ─────────
const GuestRoute = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={isCustomer ? "/my-orders" : "/dashboard"} replace />;
  }
  return children;
};

// ── Admin = full dashboard, Staff = limited dashboard ─
const SmartDashboard = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <DashboardPage /> : <StaffDashboardPage />;
};

const App = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<HomePage />} />
    <Route path="/join-staff" element={<StaffApplicationPage />} />
    <Route
      path="/login"
      element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      }
    />
    <Route
      path="/customer-login"
      element={
        <GuestRoute>
          <CustomerLoginPage />
        </GuestRoute>
      }
    />

    {/* Customer */}
    <Route
      path="/my-orders"
      element={
        <CustomerRoute>
          <MyOrdersPage />
        </CustomerRoute>
      }
    />

    {/* Staff + Admin */}
    <Route
      path="/dashboard"
      element={
        <StaffRoute>
          <SmartDashboard />
        </StaffRoute>
      }
    />
    <Route
      path="/orders"
      element={
        <StaffRoute>
          <OrdersPage />
        </StaffRoute>
      }
    />
    <Route
      path="/orders/new"
      element={
        <StaffRoute>
          <CreateOrderPage />
        </StaffRoute>
      }
    />
    <Route
      path="/orders/:id"
      element={
        <StaffRoute>
          <OrderDetailPage />
        </StaffRoute>
      }
    />

    {/* Admin only */}
    <Route
      path="/staff"
      element={
        <AdminRoute>
          <StaffManagementPage />
        </AdminRoute>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;

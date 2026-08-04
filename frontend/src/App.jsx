import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminDashboard from "./pages/admin/Dashboard";
import ResidentDashboard from "./pages/resident/Dashboard";
import SecurityDashboard from "./pages/security/SecurityDashboard";
import VisitorEntry from "./pages/security/VisitorEntry";
import Delivery from "./pages/security/Delivery";
import VisitorHistory from "./pages/security/VisitorHistory";
import SecurityProfile from "./pages/security/Profile";
import Unauthorized from "./pages/Unauthorized";
import MyApartment from "./pages/resident/MyApartment";
import ComplaintHistory from "./pages/resident/ComplaintHistory";
import ResidentComplaints from "./pages/resident/Complaints";
import ResidentPayments from "./pages/resident/Payments";
import ResidentVisitors from "./pages/resident/Visitors";
import Notifications from "./pages/resident/Notifications";
import ResidentProfile from "./pages/resident/Profile";
import Residents from "./pages/admin/residents";
import Flats from "./pages/admin/Flats";
import Complaints from "./pages/admin/Complaints";
import Payments from "./pages/admin/Payments";
import Visitors from "./pages/admin/Visitors";
import Settings from "./pages/admin/Settings";
import Buildings from "./pages/admin/Buildings";
import Maintenance from "./pages/admin/Maintenance";
import Notices from "./pages/admin/Notices";
import Reports from "./pages/admin/Reports";
import DeveloperDashboard from "./pages/developer/Dashboard";

function App() {

  return (

    <BrowserRouter>

  <Routes>

    <Route
      path="/"
      element={<Navigate to="/login" replace />}
    />

    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/forgot-password"
      element={<ForgotPassword />}
    />

    <Route
      path="/unauthorized"
      element={<Unauthorized />}
    />

    <Route element={<ProtectedRoute allowedRoles={[1, 2, 3, 4]} />}>

      <Route element={<AppLayout />}>

        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/buildings"
          element={<Buildings />}
        />

        <Route
          path="/admin/residents"
          element={<Residents />}
        />

        <Route
          path="/admin/flats"
          element={<Flats />}
        />

        <Route
          path="/admin/complaints"
          element={<Complaints />}
        />

        <Route
          path="/admin/maintenance"
          element={<Maintenance />}
        />

        <Route
          path="/admin/payments"
          element={<Payments />}
        />

        <Route
          path="/admin/visitors"
          element={<Visitors />}
        />

        <Route
          path="/admin/settings"
          element={<Settings />}
        />

        <Route
          path="/admin/notices"
          element={<Notices />}
        />

        <Route
          path="/admin/reports"
          element={<Reports />}
        />

        <Route
          path="/resident"
          element={<Navigate to="/resident/dashboard" replace />}
        />

        <Route
          path="/resident/dashboard"
          element={<ResidentDashboard />}
        />

        <Route
          path="/resident/my-apartment"
          element={<MyApartment />}
        />

        <Route
          path="/resident/complaint-history"
          element={<ComplaintHistory />}
        />

        <Route
          path="/resident/complaints"
          element={<ResidentComplaints />}
        />

        <Route
          path="/resident/payments"
          element={<ResidentPayments />}
        />

        <Route
          path="/resident/visitors"
          element={<ResidentVisitors />}
        />

        <Route
          path="/resident/notifications"
          element={<Notifications />}
        />

        <Route
          path="/resident/profile"
          element={<ResidentProfile />}
        />

        <Route
          path="/security"
          element={<Navigate to="/security/dashboard" replace />}
        />

        <Route
          path="/security/dashboard"
          element={<SecurityDashboard />}
        />

        <Route
          path="/security/visitor-entry"
          element={<VisitorEntry />}
        />

        <Route
          path="/security/delivery"
          element={<Delivery />}
        />

        <Route
          path="/security/visitor-history"
          element={<VisitorHistory />}
        />

        <Route
          path="/security/profile"
          element={<SecurityProfile />}
        />

        <Route
          path="/developer"
          element={<Navigate to="/developer/dashboard" replace />}
        />

        <Route
          path="/developer/dashboard"
          element={<DeveloperDashboard />}
        />

      </Route>

    </Route>

    <Route
      path="*"
      element={<h1>404 - Page Not Found</h1>}
    />

  </Routes>

</BrowserRouter>
  );

}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ResidentLayout from '../layouts/ResidentLayout';
import SecurityLayout from '../layouts/SecurityLayout';

import Dashboard from '../pages/admin/Dashboard';
import Buildings from '../pages/admin/Buildings';
import Residents from '../pages/admin/residents';
import Flats from '../pages/admin/Flats';
import Complaints from '../pages/admin/Complaints';
import Maintenance from '../pages/admin/Maintenance';
import Visitors from '../pages/admin/Visitors';
import Payments from '../pages/admin/Payments';
import Notices from '../pages/admin/Notices';
import Reports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';

import App from '../App.jsx';
import ResidentDashboard from '../pages/resident/Dashboard.jsx';
import MyApartment from '../pages/resident/MyApartment';
import ComplaintHistory from '../pages/resident/ComplaintHistory';
import ResidentComplaints from '../pages/resident/Complaints';
import ResidentPayments from '../pages/resident/Payments';
import ResidentVisitors from '../pages/resident/Visitors';
import Notifications from '../pages/resident/Notifications';
import ResidentProfile from '../pages/resident/Profile';

import SecurityDashboard from '../pages/security/SecurityDashboard';
import VisitorEntry from '../pages/security/VisitorEntry';
import Delivery from '../pages/security/Delivery';
import VisitorHistory from '../pages/security/VisitorHistory';
import Visitors from '../pages/security/Visitors';
import SecurityProfile from '../pages/security/Profile';

import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="buildings" element={<Buildings />} />
          <Route path="residents" element={<Residents />} />
          <Route path="flats" element={<Flats />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="payments" element={<Payments />} />
          <Route path="notices" element={<Notices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/resident" element={<ResidentLayout />}>
          <Route index element={<ResidentDashboard />} />
          <Route path="dashboard" element={<ResidentDashboard />} />
          <Route path="MyApartment" element={<MyApartment />} />
          <Route path="ComplaintHistory" element={<ComplaintHistory />} />
          <Route path="complaints" element={<ResidentComplaints />} />
          <Route path="payments" element={<ResidentPayments />} />
          <Route path="visitors" element={<ResidentVisitors />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<ResidentProfile />} />
        </Route>

        <Route path="/security" element={<SecurityLayout />}>
          <Route index element={<SecurityDashboard />} />
          <Route path="dashboard" element={<SecurityDashboard />} />
          <Route path="VisitorEntry" element={<VisitorEntry />} />
          <Route path="Delivery" element={<Delivery />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="VisitorHistory" element={<VisitorHistory />} />
          <Route path="profile" element={<SecurityProfile />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

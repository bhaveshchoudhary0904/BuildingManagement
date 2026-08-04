import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <h1>Admin Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default AdminLayout;

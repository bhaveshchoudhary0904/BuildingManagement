import React from 'react';
import { Outlet } from 'react-router-dom';

const SecurityLayout = () => {
  return (
    <div className="security-layout">
      <h1>Security Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default SecurityLayout;

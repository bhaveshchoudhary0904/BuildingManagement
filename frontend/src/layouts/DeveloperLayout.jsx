import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const DeveloperLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="developer-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Developer Portal</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/developer/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/developer/buildings">Buildings</Link>
          </li>
          <li>
            <Link to="/developer/admins">Admins</Link>
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DeveloperLayout;

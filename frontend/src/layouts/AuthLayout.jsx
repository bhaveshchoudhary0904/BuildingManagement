import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

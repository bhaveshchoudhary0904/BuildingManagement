import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-slate-200 px-6 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="text-lg font-semibold text-slate-900">NestOS</div>
        <div className="flex items-center gap-4 text-slate-600">
          <NavLink className={({ isActive }) => isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600'} to="/">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600'} to="/login">
            Login
          </NavLink>
          <NavLink className={({ isActive }) => isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600'} to="/forgot-password">
            Forgot Password
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

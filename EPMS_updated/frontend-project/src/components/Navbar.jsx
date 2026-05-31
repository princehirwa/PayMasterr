import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/employees', label: 'Employee', icon: '👤' },
  { path: '/departments', label: 'Department', icon: '🏢' },
  { path: '/salaries', label: 'Salary', icon: '💰' },
  { path: '/reports', label: 'Reports', icon: '📊' },
];

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center text-sm font-bold">PM</div>
            <span className="font-bold text-lg hidden sm:block">PayMaster EPMS</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink key={item.path} to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${isActive ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`
                }>
                <span>{item.icon}</span>{item.label}
              </NavLink>
            ))}
          </div>

          {/* User / Logout */}
          <div className="flex items-center gap-3">
            <span className="text-blue-200 text-sm hidden sm:block">👋 {user?.username}</span>
            <button onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1">
              <span>🚪</span><span className="hidden sm:inline">Logout</span>
            </button>
            {/* Mobile menu toggle */}
            <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 pb-3 px-4">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 py-2.5 px-3 rounded-lg my-0.5 text-sm font-medium ${isActive ? 'bg-blue-900 text-white' : 'text-blue-200 hover:text-white'}`
              }>
              <span>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

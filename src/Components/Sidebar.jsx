import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Sidebar() {
  const navItems = [
    { text: 'Dashboard', to: '/dashboard' },
    { text: 'Advertisements', to: '/admanage' },
    { text: 'Schemes', to: '/schema' },
    { text: 'Settings', to: '/settings' },
    { text: 'UserAssign', to: '/userassign' },
    { text: 'Reports', to: '/reports' },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-[#1c2530] text-white pt-6 px-0 shadow-md z-[1000]">
      {/* Logo Section */}
      <div className="flex justify-center mb-6">
        <img
          src={logo}
          alt="SLT Logo"
          className="w-36 mt-2"
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-[#2e3b4a] mb-2"></div>

      {/* Navigation List */}
      <ul className="space-y-1">
        {navItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.to}
              className="block py-2 px-4 rounded hover:bg-[#2e3b4a] text-sm font-medium"
              style={{ color: "white" }}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;

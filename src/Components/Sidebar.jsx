import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

// You can use react-icons or similar for icons, here using emoji as placeholders
const navItems = [
  { text: 'Dashboard', to: '/dashboard', icon: '🏠' },
  { text: 'Advertisements', to: '/admanage', icon: '📢' },
  { text: 'Schemes', to: '/schema', icon: '📋' },
  { text: 'Settings', to: '/settings', icon: '⚙️' },
  { text: 'UserAssign', to: '/userassign', icon: '👤' },
  { text: 'Reports', to: '/reports', icon: '📊' },
];

function Sidebar() {
  return (
    <div className="h-screen fixed left-0 top-0 bg-[#1c2530] text-white pt-6 px-0 shadow-md z-[1000] 
      w-16 md:w-64 transition-all duration-200">
      {/* Logo Section */}
      <div className="flex justify-center mb-6">
        <img
          src={logo}
          alt="SLT Logo"
          className="w-10 md:w-36 mt-2 transition-all duration-200"
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
              className="flex items-center py-2 px-2 md:px-4 rounded hover:bg-[#2e3b4a] text-sm font-medium"
              style={{ color: "white" }}
            >
              <span className="text-lg mr-0 md:mr-3">{item.icon}</span>
              <span className="hidden md:inline">{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;

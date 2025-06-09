import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileIcon from '../assets/profile.png';

function Navbar() {
  const [dark, setDark] = useState(() => {
    // Persist theme in localStorage
    const stored = localStorage.getItem('theme');
    return stored ? stored === 'dark' : true;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const navItems = [
    { text: 'Profile', to: '/profile', icon: profileIcon },
  ];

  return (
    <nav className={`w-full ${dark ? "bg-[#1c2530] text-white" : "bg-white text-[#1c2530]"} px-4 shadow-md transition-colors duration-300`}>
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center ml-auto gap-4">
          {/* Toggle Switch */}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>Light</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dark}
                onChange={() => setDark((v) => !v)}
                className="sr-only peer"
              />
              <div className={`w-9 h-5 ${dark ? "bg-gray-600" : "bg-gray-200"} rounded-full peer peer-checked:bg-blue-600 transition`}></div>
              <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition peer-checked:translate-x-4`}></div>
            </label>
            <span className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>Dark</span>
          </div>
          {/* Navigation Links */}
          <ul className="flex space-x-2 ml-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  className={`py-2 px-4 rounded hover:${dark ? "bg-[#2e3b4a]" : "bg-gray-200"} text-sm font-medium flex items-center gap-2`}
                  style={{ color: dark ? "white" : "#1c2530" }}
                >
                  <img src={item.icon} alt="" className="w-5 h-5" />
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
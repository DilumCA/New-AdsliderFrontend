import React, { useState } from "react";

const CustNavBar = () => {
  const [theme, setTheme] = useState("light");
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-cyan-50 via-blue-100 to-green-50 shadow border-b">
      <div className="flex items-center px-8 py-3">
        {/* Logo */}
        <img src="src/assets/logo.png" alt="SLT-Mobitel" className="h-10 mr-8" />

        {/* Top Tabs */}
        <div className="flex gap-8 flex-1">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-t-md border-b-2 border-blue-600 shadow-sm">
            Personal
          </button>
          <button className="px-6 py-2 text-blue-700 font-semibold hover:text-blue-900 transition">
            Business
          </button>
          <button className="px-6 py-2 text-blue-700 font-semibold hover:text-blue-900 transition">
            Support
          </button>
          <button className="px-6 py-2 text-blue-700 font-semibold hover:text-blue-900 transition">
            About Us
          </button>
        </div>

        {/* Theme Switch */}
        <div className="flex items-center gap-2 mr-6">
          <span className="text-blue-700 text-sm">Light</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => setTheme(theme === "light" ? "dark" : "light")}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-blue-200 rounded-full peer peer-checked:bg-blue-600 transition"></div>
            <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition peer-checked:translate-x-4`}></div>
          </label>
          <span className="text-blue-700 text-sm">Dark</span>
        </div>

        {/* Login Dropdown */}
        <div className="relative mr-6">
          <button
            className="text-blue-700 font-semibold flex items-center gap-1"
            onClick={() => setLoginOpen((v) => !v)}
          >
            Login
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {loginOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
              <a href="#" className="block px-4 py-2 hover:bg-blue-50 text-sm text-blue-700">Customer</a>
              <a href="#" className="block px-4 py-2 hover:bg-blue-50 text-sm text-blue-700">Admin</a>
            </div>
          )}
        </div>
      </div>
      {/* Bottom Navigation */}
      <div className="flex items-center px-8 py-2 border-t bg-gradient-to-r from-cyan-50 via-blue-100 to-green-50">
        <div className="flex gap-7 flex-1">
          <div className="font-semibold text-blue-800 cursor-pointer hover:text-blue-600 transition">
            Internet <span className="ml-1">&#9662;</span>
          </div>
          <div className="font-semibold text-blue-800 cursor-pointer hover:text-blue-600 transition">
            PEOTV <span className="ml-1">&#9662;</span>
          </div>
          <div className="font-semibold text-blue-800 cursor-pointer hover:text-blue-600 transition">
            Telephone <span className="ml-1">&#9662;</span>
          </div>
          <div className="font-semibold text-blue-800 cursor-pointer hover:text-blue-600 transition">
            Gaming &amp; Cloud <span className="ml-1">&#9662;</span>
          </div>
          <div className="font-semibold text-blue-800 cursor-pointer hover:text-blue-600 transition">
            IDD <span className="ml-1">&#9662;</span>
          </div>
          <div className="font-semibold text-blue-800 cursor-pointer hover:text-blue-600 transition">
            eTeleshop <span className="ml-1">&#9662;</span>
          </div>
          <div className="font-semibold text-blue-800 cursor-pointer hover:text-blue-600 transition">
            Promotions
          </div>
          <div className="font-semibold text-blue-800 cursor-pointer hover:text-blue-600 transition">
            Virtual Teleshop
          </div>
        </div>
        {/* Pay Bill Button */}
        <button className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold rounded shadow transition">
          PAY YOUR BILL
        </button>
        
      </div>
    </nav>
  );
};

export default CustNavBar;
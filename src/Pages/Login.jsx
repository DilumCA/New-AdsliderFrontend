import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // For API requests
import fiberCharacter from "../assets/fiber-charactor.png";
import sltmobitelLogo from "../assets/sltmobitel-logo.png";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false); // State to toggle between Admin and User
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate(); // For navigation

  const handleTabClick = (mode) => {
    setIsAdmin(mode === "admin"); // Set mode based on the clicked tab
    setError(""); // Clear error when switching tabs
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        username,
        password,
      });

      const userData = response.data;

      // Save user data to localStorage
      localStorage.setItem("userData", JSON.stringify(userData));

      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/dashboard"); // Redirect to admin dashboard
      } else if (userData.role === "customer") {
        navigate("/customerhomes"); // Redirect to customer home
      } else {
        setError("Invalid role");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04285E] flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row bg-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-lg w-full max-w-5xl">
        {/* Left: Promo */}
        <div className="bg-gradient-to-b from-[#1a1f71] to-[#04285E] text-white p-8 md:w-1/2 flex flex-col justify-center items-center gap-4">
          <h2 className="text-2xl font-bold text-center mb-4">
            ✨ GET A LIFE WITH <span className="text-yellow-400">FIBRE</span>
          </h2>
          <img src={fiberCharacter} alt="Fibre Character" className="w-28" />
          <ul className="space-y-3 text-sm text-center font-medium">
            <li className="bg-[#4B0082]/40 border border-[#7B68EE] py-2 px-4 rounded-full">
              The best value Home Wi-Fi Packages
            </li>
            <li className="bg-[#4B0082]/40 border border-[#7B68EE] py-2 px-4 rounded-full">
              300 Mbps Download Speed
            </li>
            <li className="bg-[#4B0082]/40 border border-[#7B68EE] py-2 px-4 rounded-full">
              Free Internet from Midnight to 7 a.m.
            </li>
          </ul>
          <p className="mt-4 text-yellow-400 text-xs text-center">
            from <br />
            <span className="font-bold">Sri Lanka’s fastest and widest fibre network</span>
          </p>
          <img src={sltmobitelLogo} alt="SLT Mobitel" className="w-32 mt-4" />
        </div>

        {/* Right: Login Form */}
        <div className="bg-[#0F2D5C] text-white p-8 md:w-1/2">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div
              className={`px-4 py-2 cursor-pointer ${
                !isAdmin ? "border-b-2 border-yellow-400 text-yellow-400" : "text-gray-400"
              }`}
              onClick={() => handleTabClick("user")}
            >
              User Login
            </div>
            <div
              className={`px-4 py-2 cursor-pointer ${
                isAdmin ? "border-b-2 border-yellow-400 text-yellow-400" : "text-gray-400"
              }`}
              onClick={() => handleTabClick("admin")}
            >
              Admin Login
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium">
                {isAdmin ? "Admin ID" : "User ID"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={isAdmin ? "Admin ID" : "Email or mobile number"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white text-black text-sm"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white text-black text-sm"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between items-center text-sm">
              <a href="#" className="text-blue-400 hover:underline">
                Forgot Password?
              </a>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center"
                disabled={loading}
              >
                {loading && <span className="loader mr-2"></span>}
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
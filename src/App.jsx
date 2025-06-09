import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Advertisements from './Pages/Advertisements.jsx';
import Schema from './Pages/Schema.jsx';
import UserAssign from './Pages/UserAssign.jsx';
import Login from './Pages/Login.jsx';
import CustomerHome from './Pages/CustomerHome.jsx';
import CustomerHomes from './Pages/CustomerHomepage.jsx';
import Profile from './Pages/Profile.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';

function App() {
  return (
  <>
        <Toaster position="top-right" />
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard/>} />
        <Route path='/dashboard' element={<AdminDashboard/>} />
        <Route path="/userassign" element={<UserAssign />} />
        <Route path="/customerhome" element={<CustomerHome />} />
        <Route path="/admanage" element={<Advertisements />} />
        <Route path="/schema" element={<Schema />} />
        <Route path="/customerhomes" element={<CustomerHomes />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
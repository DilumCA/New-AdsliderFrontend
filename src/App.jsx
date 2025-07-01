import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Advertisements from './Pages/Advertisements.jsx';
import Schema from './Pages/Schema.jsx';
import UserAssign from './Pages/UserAssign.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import Request from './Pages/Request.jsx';

function App() {
  return (
  <>
        <Toaster position="top-right" />
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path='/dashboard' element={<AdminDashboard />} />
        <Route path="/userassign" element={<UserAssign />} />
        <Route path="/admanage" element={<Advertisements />} />
        <Route path="/schema" element={<Schema />} />
        <Route path="/request" element={<Request />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
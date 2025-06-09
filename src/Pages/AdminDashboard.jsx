import React from 'react'
import Sidebar from '../Components/Sidebar.jsx'
import Navbar from '../Components/Navbar.jsx'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function AdminDashboard() {
  // Dummy data for charts
  const barData = {
    labels: ['Advertisements', 'Schemes', 'Users'],
    datasets: [
      {
        label: 'Count',
        data: [12, 4, 8],
        backgroundColor: ['#2563eb', '#16a34a', '#facc15'],
      },
    ],
  };

  const doughnutData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        label: 'User Status',
        data: [8, 2],
        backgroundColor: ['#2563eb', '#d1d5db'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-50 bg-white">
          <Navbar />
        </div>
        <div className="p-6 flex-1">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-3xl font-bold text-blue-700">12</span>
              <span className="text-gray-600 mt-2">Total Advertisements</span>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-3xl font-bold text-green-600">4</span>
              <span className="text-gray-600 mt-2">Active Schemes</span>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-3xl font-bold text-yellow-600">8</span>
              <span className="text-gray-600 mt-2">Registered Users</span>
            </div>
          </div>
        
          {/* Statistics Overview with Charts */}
         <div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-xl font-semibold mb-4">Statistics Overview</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Bar Chart Card */}
    <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center">
      <span className="font-semibold mb-2">Entity Counts</span>
      <div className="w-full" style={{ height: 220 }}>
        <Bar
          data={barData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
          }}
        />
      </div>
    </div>
    {/* Doughnut Chart Card */}
    <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center">
      <span className="font-semibold mb-2">User Status</span>
      <div className="w-full flex justify-center" style={{ height: 220 }}>
        <Doughnut
          data={doughnutData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
          }}
        />
      </div>
      
    </div>
    
  </div>
    {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <ul className="divide-y divide-gray-200">
              <li className="py-2 flex justify-between">
                <span>New advertisement added: <span className="font-semibold">Fiber Promo</span></span>
                <span className="text-gray-400 text-sm">2 hours ago</span>
              </li>
              <li className="py-2 flex justify-between">
                <span>User <span className="font-semibold">user@slt.com</span> assigned to Scheme 2</span>
                <span className="text-gray-400 text-sm">5 hours ago</span>
              </li>
              <li className="py-2 flex justify-between">
                <span>Scheme <span className="font-semibold">Scheme 4</span> updated</span>
                <span className="text-gray-400 text-sm">1 day ago</span>
              </li>
            </ul>
          </div>
</div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
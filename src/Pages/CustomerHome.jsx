import React from 'react'

function CustomerHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to the Customer Home Page</h1>
      <p className="mb-4">Here you can find your advertisements and manage your account.</p>
      <button className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white font-semibold px-4 py-2 rounded shadow transition">
        View My Advertisements
      </button>
    </div>
  )
}

export default CustomerHome

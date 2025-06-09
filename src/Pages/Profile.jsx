import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const adminProfile = {
  name: "Mr.Janaka",
  email: "janaka@slt.com",
  role: "Administrator",
  phone: "+94 77 123 4567",
  joined: "2024-01-15",
  department: "IT & Network Operations",
  location: "Colombo, Sri Lanka",
  status: "Active",
  lastLogin: "2025-06-01 09:42 AM",
  avatar: "https://ui-avatars.com/api/?name=Mr.Janaka&background=0D8ABC&color=fff"
};

const Profile = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-50 bg-white">
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
          <div className="bg-white rounded-lg shadow-md p-8 mt-10 w-full max-w-md">
            <div className="flex flex-col items-center">
              <img
                src={adminProfile.avatar}
                alt="Admin Avatar"
                className="w-24 h-24 rounded-full mb-4 border-4 border-blue-200 shadow"
              />
              <h2 className="text-2xl font-bold mb-1">{adminProfile.name}</h2>
              <span className="text-sm text-blue-700 font-semibold mb-2">{adminProfile.role}</span>
              <span className="text-xs text-gray-400 mb-4">{adminProfile.department}</span>
              <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mb-2">
                {adminProfile.status}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800">{adminProfile.email}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">Phone:</span>
                <span className="text-gray-800">{adminProfile.phone}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">Location:</span>
                <span className="text-gray-800">{adminProfile.location}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">Joined:</span>
                <span className="text-gray-800">{adminProfile.joined}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-600 font-medium">Last Login:</span>
                <span className="text-gray-800">{adminProfile.lastLogin}</span>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-3">
              <button className="button-blue px-6 py-2 rounded text-white bg-blue-700 hover:bg-blue-800 font-semibold shadow">
                Edit Profile
              </button>
              <button className="px-6 py-2 rounded text-blue-700 border border-blue-700 hover:bg-blue-50 font-semibold shadow">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import { useState } from "react";
import Sidebar from "../Components/Sidebar.jsx";
import Navbar from "../Components/Navbar.jsx";

// Dummy data for users and Schemes
const Scheme_LIST = ["Scheme 1", "Scheme 2", "Scheme 3", "Scheme 4"];
const INITIAL_USERS = [
  { id: 1, name: "Alice", email: "alice@email.com", Schemes: ["Scheme 1"] },
  { id: 2, name: "Bob", email: "bob@email.com", Schemes: ["Scheme 2"] },
  { id: 3, name: "Charlie", email: "charlie@email.com", Schemes: ["Scheme 1"] }
];

const UserAssign = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState("Scheme 1");

  const handleAssignClick = (user) => {
    setAssigningId(user.id);
    setSelectedScheme(user.Schemes && user.Schemes.length > 0 ? user.Schemes[0] : "Scheme 1");
  };

  const handleSchemeChange = (Scheme) => {
    setSelectedScheme(Scheme);
  };

  const handleSave = (userId) => {
    // Always assign at least "Scheme 1"
    const SchemeToSave = selectedScheme || "Scheme 1";
    setUsers(prev =>
      prev.map(u =>
        u.id === userId ? { ...u, Schemes: [SchemeToSave] } : u
      )
    );
    setAssigningId(null);
    setSelectedScheme("Scheme 1");
  };

  const handleCancel = () => {
    setAssigningId(null);
    setSelectedScheme("Scheme 1");
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-50 bg-white">
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col ml-4">
          <div className="sticky top-16 z-40 bg-white pb-2">
            <h1 className="text-2xl font-bold mb-2 pt-2">User Management</h1>
            <h2 className="text-xl font-semibold mb-0 mt-0">User List</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-0">
            <div className="overflow-x-auto">
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="min-w-full bg-white border border-gray-200 text-center rounded-lg overflow-hidden">
                  <thead className="sticky top-0 z-10 bg-white">
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 border-b text-center">Name</th>
                      <th className="py-3 px-4 border-b text-center">Email</th>
                      <th className="py-3 px-4 border-b text-center">Assigned Scheme</th>
                      <th className="py-3 px-4 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b text-center">{user.name}</td>
                        <td className="py-3 px-4 border-b text-center">{user.email}</td>
                        <td className="py-3 px-4 border-b text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              user.Schemes[0] === "Scheme 1"
                                ? "bg-blue-700 text-white font-bold"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.Schemes[0]}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          <button
                            className="button-blue px-2 py-1 rounded text-white bg-blue-700 hover:bg-blue-800"
                            onClick={() => handleAssignClick(user)}
                          >
                            Assign Scheme
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Assign Scheme Popup */}
          {assigningId !== null && (
            <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
                <h3 className="text-lg font-semibold mb-4">Assign Scheme</h3>
                <div className="mb-4 flex flex-col gap-2">
                  {Scheme_LIST.map((Scheme) => (
                    <label key={Scheme} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="Scheme"
                        value={Scheme}
                        checked={selectedScheme === Scheme}
                        onChange={() => handleSchemeChange(Scheme)}
                      />
                      <span className={Scheme === "Scheme 1" ? "font-bold text-blue-700" : ""}>
                        {Scheme}
                        {Scheme === "Scheme 1" && " (Default)"}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button className="button-gray px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="button-blue px-4 py-2 rounded text-white bg-blue-700 hover:bg-blue-800" onClick={() => handleSave(assigningId)}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAssign;
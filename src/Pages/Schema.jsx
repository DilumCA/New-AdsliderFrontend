import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../Components/Sidebar.jsx";
import Navbar from "../Components/Navbar.jsx";
import AddNewSchemeForm from "../Components/AddNewSchemeForm.jsx";
import toast from 'react-hot-toast';

const Schema = () => {
  const [open, setOpen] = useState(false);
  const [editScheme, setEditScheme] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch schemes from backend
  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/schemes');
      setSchemes(res.data);
    } catch (err) {
      console.error("Failed to fetch schemes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  // Handler for opening the modal for edit
  const handleEditClick = (scheme) => {
    setEditScheme(scheme);
    setOpen(true);
  };

  // Handler for saving (add or update)
 const handleSave = async (schemeData) => {
  if (editScheme && editScheme._id) {
    try {
      await axios.put(`http://localhost:5000/api/schemes/${editScheme._id}`, schemeData);
      await fetchSchemes();
      toast.success("Scheme updated successfully!");
    } catch (err) {
      toast.error("Failed to update scheme");
    }
  } else {
    try {
      await axios.post('http://localhost:5000/api/schemes', schemeData);
      await fetchSchemes();
      toast.success("Scheme added successfully!");
    } catch (err) {
      toast.error("Failed to add scheme");
    }
  }
  setOpen(false);
  setEditScheme(null);
};

  // Handler for deleting a scheme
const [confirmDelete, setConfirmDelete] = useState({ open: false, scheme: null });

  // ...fetchSchemes, useEffect, handleEditClick, handleSave...

  // Open modal for confirmation
  const handleDelete = (scheme) => {
    setConfirmDelete({ open: true, scheme });
  };

  // Confirm delete action
  const confirmDeleteScheme = async () => {
    const scheme = confirmDelete.scheme;
    setConfirmDelete({ open: false, scheme: null });
    try {
      await axios.delete(`http://localhost:5000/api/schemes/${scheme._id}`);
      await fetchSchemes();
      toast.success("Scheme deleted!");
    } catch (err) {
      toast.error("Failed to delete scheme");
    }
  };
  // Filter schemes by search term
  const filteredSchemes = schemes.filter(s =>
    (s.schemeTitle || s.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
         {/* Delete Confirmation Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <p className="mb-4 text-lg">
              Are you sure you want to delete scheme "<b>{confirmDelete.scheme.schemeTitle || confirmDelete.scheme.title}</b>"?
            </p>
            <div className="flex gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={confirmDeleteScheme}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setConfirmDelete({ open: false, scheme: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-50 bg-white">
          <Navbar />
        </div>
        {open && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm"
            onClick={() => { setOpen(false); setEditScheme(null); }}
            style={{ transition: "background 0.2s" }}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative overflow-y-auto"
              style={{ maxHeight: "90vh" }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => { setOpen(false); setEditScheme(null); }}
                aria-label="Close"
              >
                &times;
              </button>
              <AddNewSchemeForm
                editScheme={editScheme}
                onCancel={() => { setOpen(false); setEditScheme(null); }}
                onSave={handleSave}
              />
            </div>
          </div>
        )}
        {/* Content after Navbar with left margin */}
        <div className="flex-1 flex flex-col ml-4">
          {/* Sticky Title & Search */}
          <div className="sticky top-16 z-40 bg-white pb-2">
            <h1 className="text-2xl font-bold mb-2 pt-2">Scheme Management</h1>
            <div className="mb-0">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search by Title:
              </label>
              <div className="flex">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    id="search"
                    className="border border-gray-300 rounded px-4 py-2 w-full pr-10"
                    placeholder="Search Schemes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <img
                    src="./src/assets/loupe.png"
                    alt="Search"
                    className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  />
                </div>
                <div className="flex-1 flex justify-end items-center ml-4 pr-4 pb-2">
                  <button
                    className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white font-semibold px-4 py-2 rounded shadow transition"
                    onClick={() => setOpen(true)}
                  >
                    + New Scheme
                  </button>
                </div>
              </div>
            </div>
            <hr className="my-0 border-gray-300" />
            <h2 className="text-xl font-semibold mb-0 mt-0">Scheme List</h2>
          </div>
          {/* Scrollable Table Content */}
          <div className="flex-1 overflow-y-auto px-4 py-0">
            {/* Scheme Table */}
            <div className="overflow-x-auto">
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <table className="min-w-full bg-white border border-gray-200 text-center rounded-lg overflow-hidden">
  <thead className="sticky top-0 z-10 bg-white">
    <tr className="bg-gray-100">
      <th className="py-3 px-4 border-b text-center">Title</th>
      <th className="py-3 px-4 border-b text-center">Description</th>
      <th className="py-3 px-4 border-b text-center">Scheme Tags</th>
      <th className="py-3 px-4 border-b text-center">Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredSchemes.map((scheme) => (
      <tr key={scheme._id}>
        <td className="py-3 px-4 border-b text-center">{scheme.schemeTitle || scheme.title}</td>
        <td className="py-3 px-4 border-b text-center">{scheme.description}</td>
        <td className="py-3 px-4 border-b text-center">
          <div className="flex flex-wrap gap-1 justify-center">
            {Array.isArray(scheme.schemeTags) && scheme.schemeTags.length > 0
              ? scheme.schemeTags.map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))
              : <span className="text-gray-400 text-xs">No Tags</span>
            }
          </div>
        </td>
        <td className="py-3 px-4 border-b text-center">
          <div className="flex justify-center gap-2">
            <button
              className="button-blue flex items-center justify-center"
              title="Edit"
              style={{ minWidth: 32, minHeight: 32 }}
              onClick={() => handleEditClick(scheme)}
            >
              <img
                src="./src/assets/pen.png"
                alt="Edit"
                className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[22px] max-h-[22px]"
                style={{ width: 22, height: 22 }}
              />
            </button>
            <button
              className="button-red flex items-center justify-center"
              title="Delete"
              style={{ minWidth: 32, minHeight: 32 }}
              onClick={() => handleDelete(scheme)}
            >
              <img
                src="./src/assets/delete.png"
                alt="Delete"
                className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[22px] max-h-[22px]"
                style={{ width: 22, height: 22 }}
              />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schema;
import { useState, useEffect } from 'react';
import Sidebar from "../Components/Sidebar.jsx";
import Navbar from "../Components/Navbar.jsx";
import NewAdvertisementForm from "../Components/NewAdvertisementForm.jsx";
import toast, { Toaster } from 'react-hot-toast';
import loupe from '../assets/loupe.png';
import pen from '../assets/pen.png';
import deleteIcon from '../assets/delete.png';

const Advertisements = () => {
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [editAd, setEditAd] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [advertisements, setAdvertisements] = useState([]);
  const [imagePopup, setImagePopup] = useState({ open: false, ad: null });

  // Fetch advertisements from backend
 // Define fetchAds function
   const fetchAds = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    fetch(`${baseUrl}/newadvertisements`)
      .then(res => res.json())
      .then(data => setAdvertisements(data))
      .catch(() => setAdvertisements([]));
  };

  // Fetch advertisements from backend on mount
  useEffect(() => {
    fetchAds();
  }, []);

  const filteredAds = advertisements.filter(ad =>
    (ad.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Delete advertisement
  // Custom confirm dialog (simple version)
  const [confirmDelete, setConfirmDelete] = useState({ open: false, adId: null });

  const handleDelete = async (adId) => {
    setConfirmDelete({ open: true, adId });
  };

  const confirmDeleteAd = async () => {
    const adId = confirmDelete.adId;
    setConfirmDelete({ open: false, adId: null });
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/newadvertisements/${adId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete advertisement");
      fetchAds();
      toast.success("Advertisement deleted!");
    } catch (err) {
      toast.error("Error deleting advertisement: " + err.message);
    }
  };
  return (
    <div className="flex min-h-screen">
               {/* <Toaster position="bottom-right" /> */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-50 bg-white">
          <Navbar />
        </div>
        {adModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm"
            onClick={() => setAdModalOpen(false)}
            style={{ transition: "background 0.2s" }}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative overflow-y-auto"
              style={{ maxHeight: "90vh" }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setAdModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
             <NewAdvertisementForm
  editAd={editAd}
  onCancel={() => setAdModalOpen(false)}
  onSuccess={() => {
    setAdModalOpen(false);
    fetchAds(); // Refresh the table after create/update
  }}
/>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-4">
          {/* Sticky Title & Search */}
          <div className="sticky top-16 z-40 bg-white pb-2">
            <h1 className="text-2xl font-bold mb-2 pt-2">Advertisement Management</h1>
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
                    placeholder="Search advertisements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <img
                    src={loupe}
                    alt="Search"
                    className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  />
                </div>
                <div className="flex-1 flex justify-end items-center ml-4 pr-4 pb-2">
                  <button
                    className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white font-semibold px-4 py-2 rounded shadow transition"
                    onClick={() => {
                      setEditAd(null);
                      setAdModalOpen(true);
                    }}
                  >
                    + New Advertisement
                  </button>
                </div>
              </div>
            </div>
            <hr className="my-0 border-gray-300" />
            <h2 className="text-xl font-semibold mb-0 mt-0">Advertisement List</h2>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto px-4 py-0">
            <div className="overflow-x-auto">
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="min-w-full bg-white border border-gray-200 text-center rounded-lg overflow-hidden">
                  <thead className="sticky top-0 z-10 bg-white">
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 border-b text-center">Image</th>
                      <th className="py-3 px-4 border-b text-center">Title</th>
                      <th className="py-3 px-4 border-b text-center">Description</th>
                      <th className="py-3 px-4 border-b text-center">Start Date</th>
                      <th className="py-3 px-4 border-b text-center">End Date</th>
                      <th className="py-3 px-4 border-b text-center">Schemes</th>
                      <th className="py-3 px-4 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAds.map((ad) => (
                      <tr key={ad._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b text-center">
                          {ad.advertisementURL ? (
                            <img
                              src={ad.advertisementURL}
                              alt={ad.title}
                              className="w-16 h-10 object-cover mx-auto rounded cursor-pointer hover:scale-105 transition"
                              onClick={() => setImagePopup({ open: true, ad })}
                            />
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                        </td>
                        <td className="py-3 px-4 border-b font-semibold text-center">{ad.title}</td>
                        <td className="py-3 px-4 border-b text-center">{ad.description}</td>
                        <td className="py-3 px-4 border-b text-center">
                          {ad.startDate ? new Date(ad.startDate).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {ad.selectedSchemes && ad.selectedSchemes.length > 0
                              ? ad.selectedSchemes.map(tag => (
                                  <span
                                    key={tag}
                                    className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))
                              : <span className="text-gray-400 text-xs">No Schemes</span>
                            }
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              className="button-blue flex items-center justify-center"
                              title="Edit"
                              style={{ minWidth: 32, minHeight: 32 }}
                              onClick={() => {
                                setEditAd(ad);
                                setAdModalOpen(true);
                              }}
                            >
                              <img
                               img src={pen}
                                alt="Edit"
                                className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[22px] max-h-[22px]"
                                style={{ width: 22, height: 22 }}
                              />
                            </button>
                          <button
        className="button-red flex items-center justify-center"
        title="Delete"
        style={{ minWidth: 32, minHeight: 32 }}
        onClick={() => handleDelete(ad._id)}
      >
         <img
        src={deleteIcon}
        alt="Delete"
        className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[22px] max-h-[22px]"
        style={{ width: 22, height: 22 }}
      />
      </button>
      {/* ... */}

      {/* Confirmation Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <p className="mb-4 text-lg">Are you sure you want to delete this advertisement?</p>
            <div className="flex gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={confirmDeleteAd}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setConfirmDelete({ open: false, adId: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Image Popup */}
          {imagePopup.open && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg p-8 relative flex flex-col items-center">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={() => setImagePopup({ open: false, ad: null })}
                  aria-label="Close"
                >
                  &times;
                </button>
                <img
                  src={imagePopup.ad.advertisementURL}
                  alt={imagePopup.ad.title}
                  className="w-[500px] max-w-full h-auto object-contain rounded shadow mb-3"
                />
                <span className="font-semibold text-base">{imagePopup.ad.title}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Advertisements;
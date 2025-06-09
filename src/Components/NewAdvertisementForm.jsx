import React, { useState, useEffect } from 'react'
import ImageCropperModal from './ImageCropperModal'
import toast from 'react-hot-toast';

function NewAdvertisementForm({ editAd, onCancel, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [advertisementFile, setAdvertisementFile] = useState(null);
  const [cropModal, setCropModal] = useState({ open: false, id: null, src: null });
  const [previews, setPreviews] = useState({ advertisementURL: null });
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [selectedSchemes, setSelectedSchemes] = useState([]);

  // Fetch schemes from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/schemes')
      .then(res => res.json())
      .then(data => setSchemes(data))
      .catch(() => setSchemes([]));
  }, []);

  // Prefill form fields when editing
  useEffect(() => {
    if (editAd) {
      setTitle(editAd.title || '');
      setDescription(editAd.description || '');
      setStartDate(editAd.startDate ? editAd.startDate.slice(0, 10) : '');
      setEndDate(editAd.endDate ? editAd.endDate.slice(0, 10) : '');
      setPreviews({ advertisementURL: editAd.advertisementURL || null });
      setSelectedSchemes(editAd.selectedSchemeIds || []);
      setAdvertisementFile(null); // Don't prefill file input for security reasons
    } else {
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setPreviews({ advertisementURL: null });
      setSelectedSchemes([]);
      setAdvertisementFile(null);
    }
  }, [editAd]);

  // Handle file input and open crop modal
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAdvertisementFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropModal({ open: true, id: "advertisementURL", src: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle crop complete
  const handleCropComplete = (croppedBlob, previewUrl) => {
    setPreviews({ advertisementURL: previewUrl });
    const croppedFile = new File([croppedBlob], "cropped.jpg", { type: "image/jpeg" });
    setAdvertisementFile(croppedFile);
    setCropModal({ open: false, id: null, src: null });
  };

  const handleSchemeChange = (scheme) => {
    setSelectedSchemes(prev =>
      prev.includes(scheme)
        ? prev.filter(s => s !== scheme)
        : [...prev, scheme]
    );
  };

  // CREATE or UPDATE logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);

    selectedSchemes.forEach(id => formData.append('selectedSchemeIds', id));
    schemes
      .filter(s => selectedSchemes.includes(s._id))
      .forEach(s => formData.append('selectedSchemes', s.schemeTitle || s.title));

    if (advertisementFile) {
      formData.append('advertisementURL', advertisementFile);
    }

      try {
      let url = 'http://localhost:5000/api/newadvertisements';
      let method = 'POST';
    
      if (editAd && editAd._id) {
        url = `http://localhost:5000/api/newadvertisements/${editAd._id}`;
        method = 'PUT';
      }
    
      const res = await fetch(url, {
        method,
        body: formData,
      });
    
      if (!res.ok) throw new Error(editAd ? 'Failed to update advertisement' : 'Failed to create advertisement');
      toast.success(editAd ? 'Advertisement updated successfully!' : 'Advertisement created successfully!');
      if (onSuccess) onSuccess(); 
      if (onCancel) onCancel();
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        {editAd ? "Edit Advertisement" : "Create New Advertisement"}
      </h2>
      {cropModal.open && (
        <ImageCropperModal
          open={cropModal.open}
          imageSrc={cropModal.src}
          onClose={() => setCropModal({ open: false, id: null, src: null })}
          onCropComplete={handleCropComplete}
          aspect={2.5}
        />
      )}
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Enter advertisement title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            required
            placeholder="Enter advertisement description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          ></textarea>
        </div>
        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {/* Advertisement Upload */}
        <div>
          <label htmlFor="advertisementURL" className="block text-sm font-medium text-gray-700">
            Advertisement Image:
          </label>
          <input
            type="file"
            id="advertisementURL"
            name="advertisementURL"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            onChange={handleFileChange}
            required={!editAd}
            accept="image/*"
          />
          {previews.advertisementURL && (
            <img
              src={previews.advertisementURL}
              alt="Advertisement Preview"
              className="mt-2 w-full h-auto rounded-md"
            />
          )}
        </div>
        {/* Select Schemes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Schemes</label>
          <div className="mt-2 grid grid-cols-1 gap-3">
            {schemes.length === 0 && (
              <div className="text-gray-400 text-sm">No schemes available.</div>
            )}
            {schemes.map((scheme) => (
              <label
                key={scheme._id}
                htmlFor={`scheme-${scheme._id}`}
                className="flex items-start gap-3 border rounded p-3 hover:bg-blue-50 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={`scheme-${scheme._id}`}
                  checked={selectedSchemes.includes(scheme._id)}
                  onChange={() => {
                    setSelectedSchemes(prev =>
                      prev.includes(scheme._id)
                        ? prev.filter(id => id !== scheme._id)
                        : [...prev, scheme._id]
                    );
                  }}
                  className="mt-1 accent-blue-600"
                />
                <div>
                  <div className="font-semibold text-blue-800">{scheme.schemeTitle || scheme.title}</div>
                  <div className="text-gray-600 text-sm mb-1">{scheme.description}</div>
                  <div className="flex flex-wrap gap-1">
                    {scheme.schemeTags && scheme.schemeTags.length > 0 ? (
                      scheme.schemeTags.map(tag => (
                        <span
                          key={tag}
                          className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">No Tags</span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow transition hover:bg-gray-400"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white font-semibold px-4 py-2 rounded shadow transition"
            disabled={loading}
          >
            {loading
              ? (editAd ? "Updating..." : "Creating...")
              : (editAd ? "Update Advertisement" : "Create Advertisement")}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewAdvertisementForm
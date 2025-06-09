import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ageRanges = ["18-25", "26-35", "36-45", "46-60", "60+"];
const districts = [
  "Ampara","Anuradhapura","Badulla","Batticaloa","Colombo","Galle","Gampaha","Hambantota","Jaffna","Kalutara","Kandy","Kegalle","Kilinochchi", "Kurunegala",   "Mannar","Matale","Matara","Monaragala", "Mullaitivu","Nuwara Eliya","Polonnaruwa","Puttalam","Ratnapura","Trincomalee","Vavuniya"
];
const connectionTypes = ["3G", "4G", "5G", "Fiber"];
const planTypes = ["Prepaid", "Postpaid"];

function AddNewSchemeForm({ onCancel, onSave, editScheme }) {
  // If editing, prefill fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAgeRanges, setSelectedAgeRanges] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedPlanType, setSelectedPlanType] = useState([]);
  const [selectedConnections, setSelectedConnections] = useState([]);
  const [customTags, setCustomTags] = useState([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editScheme) {
      setTitle(editScheme.schemeTitle || editScheme.title || "");
      setDescription(editScheme.description || "");
      setSelectedAgeRanges(editScheme.ageRange || editScheme.agerange || []);
      setSelectedDistricts(editScheme.districts || []);
      setSelectedPlanType(editScheme.planType || editScheme.plantype || []);
      setSelectedConnections(editScheme.connectionTypes || editScheme.connectiontype || []);
      // Extract custom tags (those not matching Age:/District:/Plan:/Connection:)
      if (editScheme.schemeTags) {
        const builtInTags = [
          ...ageRanges.map(a => `Age:${a}`),
          ...districts.map(d => `District:${d}`),
          ...planTypes.map(p => `Plan:${p}`),
          ...connectionTypes.map(c => `Connection:${c}`)
        ];
        setCustomTags(editScheme.schemeTags.filter(tag => !builtInTags.includes(tag)));
      } else {
        setCustomTags([]);
      }
    } else {
      setTitle("");
      setDescription("");
      setSelectedAgeRanges([]);
      setSelectedDistricts([]);
      setSelectedPlanType([]);
      setSelectedConnections([]);
      setCustomTags([]);
    }
    setCustomTagInput("");
    setError("");
  }, [editScheme]);

  // Handlers
  const handleSelectAllDistricts = () => {
    if (selectedDistricts.length === districts.length) {
      setSelectedDistricts([]);
    } else {
      setSelectedDistricts(districts);
    }
  };

  const handleDistrictChange = (district) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  };

  const handlePlanTypeChange = (e) => {
    const value = e.target.value;
    if (value === "Prepaid,Postpaid") {
      setSelectedPlanType(["Prepaid", "Postpaid"]);
    } else if (value) {
      setSelectedPlanType([value]);
    } else {
      setSelectedPlanType([]);
    }
  };

  const handleSelectAllConnections = () => {
    if (selectedConnections.length === connectionTypes.length) {
      setSelectedConnections([]);
    } else {
      setSelectedConnections(connectionTypes);
    }
  };

  const handleConnectionChange = (type) => {
    setSelectedConnections((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Custom tag handlers
  const handleCustomTagInputChange = (e) => {
    setCustomTagInput(e.target.value);
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    const tag = customTagInput.trim();
    if (tag && !customTags.includes(tag)) {
      setCustomTags([...customTags, tag]);
      setCustomTagInput("");
    }
  };

  const handleRemoveCustomTag = (tag) => {
    setCustomTags(customTags.filter(t => t !== tag));
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  if (!title.trim()) {
    toast.error("Title is required.");
    setError("Title is required.");
    return;
  }

  setLoading(true);

  // Compose schemeTags for search/filtering (including custom tags)
   const schemeTags = [
    ...selectedAgeRanges.map(a => `Age:${a}`),
    ...selectedDistricts.map(d => `District:${d}`),
    ...selectedPlanType.map(p => `Plan:${p}`),
    ...selectedConnections.map(c => `Connection:${c}`),
    ...customTags
  ];

  try {
    if (onSave) {
      await onSave({
        schemeTitle: title,
        schemeTags,
        ageRange: selectedAgeRanges,
        districts: selectedDistricts,
        planType: selectedPlanType,
        connectionTypes: selectedConnections,
        description,
      });
      //toast.success(editScheme ? "Scheme updated successfully!" : "Scheme created successfully!");
    }
  } catch (err) {
    toast.error("Failed to save scheme.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          {editScheme ? "Edit Scheme" : "Add New Scheme"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter scheme title"
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
           
              placeholder="Enter scheme description"
            ></textarea>
          </div>
          {/* Age Range Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ageRanges.map((range, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`ageRange-${index}`}
                    value={range}
                    checked={selectedAgeRanges.includes(range)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAgeRanges((prev) => [...prev, range]);
                      } else {
                        setSelectedAgeRanges((prev) =>
                          prev.filter((selected) => selected !== range)
                        );
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`ageRange-${index}`} className="ml-2 text-sm text-gray-700">
                    {range}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* District Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="selectAllDistricts"
                  checked={selectedDistricts.length === districts.length}
                  onChange={handleSelectAllDistricts}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="selectAllDistricts" className="ml-2 text-sm text-gray-700">
                  All
                </label>
              </div>
              {districts.map((district, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`district-${index}`}
                    checked={selectedDistricts.includes(district)}
                    onChange={() => handleDistrictChange(district)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`district-${index}`} className="ml-2 text-sm text-gray-700">
                    {district}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* Plan Type Dropdown */}
          <div>
            <label htmlFor="planType" className="block text-sm font-medium text-gray-700 mb-1">
              Plan Type
            </label>
            <select
              id="planType"
              name="planType"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedPlanType.join(",")}
              onChange={handlePlanTypeChange}
            
            >
              <option value="">Select Plan Type</option>
              <option value="Prepaid">Prepaid</option>
              <option value="Postpaid">Postpaid</option>
              <option value="Prepaid,Postpaid">Both (Prepaid/Postpaid)</option>
            </select>
          </div>
          {/* Connection Type Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Connection Type</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="selectAllConnections"
                  checked={selectedConnections.length === connectionTypes.length}
                  onChange={handleSelectAllConnections}
                  disabled={selectedPlanType.length === 1 && selectedPlanType[0] === "Prepaid"}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="selectAllConnections" className="ml-2 text-sm text-gray-700">
                  All
                </label>
              </div>
              {connectionTypes.map((type, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`connection-${index}`}
                    checked={selectedConnections.includes(type)}
                    onChange={() => handleConnectionChange(type)}
                    disabled={selectedPlanType.length === 1 && selectedPlanType[0] === "Prepaid" && type === "Fiber"}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`connection-${index}`} className="ml-2 text-sm text-gray-700">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* Custom Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Tags</label>
            <div className="flex gap-2 mb-2">
             <input
  type="text"
  value={customTagInput}
  onChange={handleCustomTagInputChange}
  onKeyDown={e => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTag(e);
    }
  }}
  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  placeholder="Enter a custom tag and press Add"
/>
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                disabled={!customTagInput.trim()}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {customTags.map((tag, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomTag(tag)}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
                    title="Remove tag"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          {/* Error Message */}
          {error && <div className="text-red-600 text-sm">{error}</div>}
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
              {loading ? (editScheme ? "Updating..." : "Creating...") : (editScheme ? "Update Scheme" : "Create Scheme")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewSchemeForm;
import React, { useState, useEffect } from "react";
import AdSlider from "./AdSlider";

const SchemeAdsExplorer = () => {
  const [schemes, setSchemes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSchemes, setLoadingSchemes] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoadingSchemes(true);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseUrl}/api/schemes`);
        const data = await res.json();
        setSchemes(Array.isArray(data) ? data : []);
      } catch {
        setSchemes([]);
      } finally {
        setLoadingSchemes(false);
      }
    };
    fetchSchemes();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const fetchAds = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    setAds([]);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/newadvertisements/schemes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      setAds(Array.isArray(data) ? data : []);
    } catch {
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const sliderAds = ads.map(ad => ({
    id: ad._id,
    image: ad.advertisementURL,
    title: ad.title,
    description: ad.description,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-8 my-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Find Advertisements by Scheme</h2>
      <div className="mb-6">
        {loadingSchemes ? (
          <div className="text-gray-500">Loading schemes...</div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {schemes.map(scheme => (
              <label key={scheme._id} className="flex items-center gap-2 border rounded px-3 py-2 cursor-pointer hover:bg-blue-50">
                <input
                  type="checkbox"
                  value={scheme._id}
                  checked={selectedIds.includes(scheme._id)}
                  onChange={() => handleCheckboxChange(scheme._id)}
                  className="accent-blue-600"
                />
                <span>{scheme.schemeTitle || scheme.title}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={fetchAds}
        disabled={selectedIds.length === 0 || loading}
        className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded shadow transition"
      >
        {loading ? "Loading..." : "Show Advertisements"}
      </button>
      {ads.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {ads.map((ad) => (
              <div key={ad._id} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col">
                <img
                  src={ad.advertisementURL}
                  alt={ad.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-bold text-blue-700 mb-1">{ad.title}</h3>
                <p className="text-gray-700 mb-2">{ad.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {ad.selectedSchemes?.map((scheme) => (
                    <span
                      key={scheme}
                      className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
                    >
                      {scheme}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  {ad.startDate && (
                    <span>
                      <b>Start:</b> {new Date(ad.startDate).toLocaleDateString()}{" "}
                    </span>
                  )}
                  {ad.endDate && (
                    <span>
                      <b>End:</b> {new Date(ad.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* AdSlider at the bottom */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4 text-blue-700 text-center">Slider View</h3>
            <AdSlider advertisements={sliderAds} />
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-center mt-8">
          {loading
            ? "Fetching advertisements..."
            : "Select one or more schemes and click 'Show Advertisements'."}
        </div>
      )}
    </div>
  );
};

export default SchemeAdsExplorer;

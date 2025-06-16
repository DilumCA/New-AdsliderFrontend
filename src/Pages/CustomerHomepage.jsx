import React, { useEffect, useState } from "react";
import CustNavBar from "../Components/CustNavBar";
import AdSlider from "../Components/AdSlider";

const CustomerHomepage = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get userId from localStorage
  let userId = null;
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    userId = userData?._id || null;
  } catch {
    userId = null;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setAdvertisements([]);
      return;
    }
    const fetchAds = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/user/${userId}/advertisements`);
        const data = await res.json();
       console.log("Received data from backend:", data); // backend data is logged here
        // Filter ads with aiRelevance > 50
        const filteredAds = (data.advertisements || []).filter(ad => ad.aiRelevance > 50);
        setAdvertisements(
          filteredAds.map(ad => ({
            id: ad._id,
            image: ad.adURL,
            title: ad.title,
            description: ad.description,
            aiRelevance: ad.aiRelevance,
            aiReason: ad.aiReason,
          }))
        );
      } catch (err) {
        setAdvertisements([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [baseUrl, userId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CustNavBar />
      <div className="w-full flex-1 flex flex-col items-center p-0 m-0">
        <div className="w-full">
          {loading ? (
            <div className="text-center py-10">Loading advertisements...</div>
          ) : advertisements.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No relevant advertisements found.</div>
          ) : (
            <AdSlider advertisements={advertisements} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHomepage;
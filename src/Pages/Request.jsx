import React, { useState } from "react";

const Request = () => {
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [ads, setAds] = useState([]);
  const [loadingSchemas, setLoadingSchemas] = useState(false);
  const [loadingAds, setLoadingAds] = useState(false);

  // Simulated API call to fetch schemas
  const requestSchemas = async () => {
    setLoadingSchemas(true);
    // Simulate delay
    setTimeout(() => {
      const fakeSchemaData = [
        { id: "1", name: "Sports", tags: ["football", "cricket"] },
        { id: "2", name: "Tech", tags: ["ai", "gadgets"] },
        { id: "3", name: "Fashion", tags: ["clothes", "shoes"] },
      ];
      setSchemas(fakeSchemaData);
      setLoadingSchemas(false);
    }, 1000);
  };

  // Simulated API call to fetch ads based on selected schema
  const requestAds = async () => {
    if (!selectedSchema) return;
    setLoadingAds(true);
    // Simulate delay
    setTimeout(() => {
      const fakeAdData = [
        { id: "a1", title: `Ad 1 for ${selectedSchema}` },
        { id: "a2", title: `Ad 2 for ${selectedSchema}` },
      ];
      setAds(fakeAdData);
      setLoadingAds(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Advertisement Request Panel
      </h1>

      {/* Request Schemas Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={requestSchemas}
          disabled={loadingSchemas}
          className={`px-6 py-2 rounded text-white transition ${
            loadingSchemas
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loadingSchemas ? "Loading Schemas..." : "Request Schemas"}
        </button>
      </div>

      {/* Schema Table */}
      {schemas.length > 0 && (
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full bg-white shadow rounded border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left border-b">ID</th>
                <th className="py-3 px-4 text-left border-b">Scheme Name</th>
                <th className="py-3 px-4 text-left border-b">Tags</th>
              </tr>
            </thead>
            <tbody>
              {schemas.map((schema) => (
                <tr key={schema.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{schema.id}</td>
                  <td className="py-2 px-4 border-b font-medium text-gray-700">
                    {schema.name}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    {schema.tags.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Schema Selection and Request Ads */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
        <select
          value={selectedSchema}
          onChange={(e) => setSelectedSchema(e.target.value)}
          className="w-64 px-4 py-2 border border-gray-300 rounded shadow text-gray-700"
        >
          <option value="">Select a Schema</option>
          {schemas.map((schema) => (
            <option key={schema.id} value={schema.name}>
              {schema.name}
            </option>
          ))}
        </select>
        <button
          onClick={requestAds}
          disabled={!selectedSchema || loadingAds}
          className={`px-6 py-2 text-white rounded transition ${
            !selectedSchema || loadingAds
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loadingAds ? "Loading Ads..." : "Request Ads"}
        </button>
      </div>

      {/* Advertisements */}
      {ads.length > 0 && (
        <div className="bg-white max-w-lg mx-auto p-6 rounded shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Advertisements
          </h2>
          <ul className="space-y-3 list-disc list-inside text-gray-700">
            {ads.map((ad) => (
              <li key={ad.id}>{ad.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Request;

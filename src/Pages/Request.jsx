import React, { useState } from "react";
import SchemeAdsExplorer from "../Components/SchemeAdsExplorer";

const Request = () => {
  const [schemas, setSchemas] = useState([]);
  const [loadingSchemas, setLoadingSchemas] = useState(false);

  // Fetch schemas from backend
  const requestSchemas = async () => {
    setLoadingSchemas(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/schemes`);
      const data = await res.json();
      setSchemas(Array.isArray(data) ? data : []);
    } catch (err) {
      setSchemas([]);
    } finally {
      setLoadingSchemas(false);
    }
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
                <th className="py-3 px-4 text-left border-b">Description</th>
              </tr>
            </thead>
            <tbody>
              {schemas.map((schema) => (
                <tr key={schema._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{schema._id}</td>
                  <td className="py-2 px-4 border-b font-medium text-gray-700">
                    {schema.schemeTitle}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    {schema.schemeTags && schema.schemeTags.length > 0
                      ? schema.schemeTags.join(", ")
                      : "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-600">
                    {schema.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Place SchemeAdsExplorer here */}
      <div className="max-w-4xl mx-auto">
        <SchemeAdsExplorer />
      </div>
    </div>
  );
};

export default Request;
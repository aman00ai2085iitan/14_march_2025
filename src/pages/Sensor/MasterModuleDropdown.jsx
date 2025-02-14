import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material"; // Import CircularProgress

const MasterModule = ({ selectedMasterId, setSelectedMasterId }) => {
  const [MasterIds, setMasterIds] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to hold error messages

  useEffect(() => {
    const fetchMasterIds = async () => {
      try {
        const response = await fetch(
          "https://smartcoachez.com/rail/public/api/fetch-master"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data.data)) {
          setMasterIds(data.data); // Store fetched data in state
        } else {
          throw new Error("API response data is not an array");
        }
      } catch (error) {
        console.error("Error fetching Master IDs:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading when fetch is complete
      }
    };

    fetchMasterIds();
  }, []);

  return (
    <div className="dropdown-group">
      <label htmlFor="Master-id">Master ID:</label>

      {loading ? (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <CircularProgress color="primary" size={40} /> {/* Loader */}
        </div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : (
        <select
          id="Master-id"
          value={selectedMasterId}
          onChange={(e) => setSelectedMasterId(e.target.value)}
        >
          <option value="">Select a Master ID</option>
          {MasterIds.map((Master) => (
            <option key={Master.id} value={Master.id}>
              {Master.id} - {Master.module_make} {/* ID and Module Make */}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default MasterModule;

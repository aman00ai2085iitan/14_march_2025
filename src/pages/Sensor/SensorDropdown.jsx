import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material"; // Import CircularProgress from Material-UI

const SensorDropdown = ({ selectedCoachId, setSelectedCoachId }) => {
  const [coachNumbers, setCoachNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoachNumbers = async () => {
      try {
        const response = await fetch(
          "https://smartcoachez.com/rail/public/api/coaches"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setCoachNumbers(
            data.map((coach, index) => ({
              id: index + 1,
              number: coach.coach_number,
            }))
          );
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachNumbers();
  }, []);

  return (
    <div className="dropdown-group">
      <label htmlFor="coach-id">Select a Coach</label>

      {loading ? (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <CircularProgress color="primary" size={40} />
        </div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : (
        <select
          id="coach-id"
          value={selectedCoachId}
          onChange={(e) => setSelectedCoachId(e.target.value)}
        >
          <option value="">Select a Coach Number</option>
          {coachNumbers.map((coach) => (
            <option key={coach.id} value={coach.id}>
              {coach.id} - {coach.number}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SensorDropdown;

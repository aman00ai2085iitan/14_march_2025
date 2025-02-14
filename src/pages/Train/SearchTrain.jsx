import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SearchTrain = ({ trainNumber, onClose, onFetchSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [trainData, setTrainData] = useState(null);

  const handleFetchTrain = async () => {
    if (!trainNumber) {
      toast.error("Train number is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://smartcoachez.com/rail/public/api/train/by-number', {
        train_number: trainNumber,
      });

      if (response.data.success) {
        setTrainData(response.data.data);
        onFetchSuccess(response.data.data); // Pass the fetched data back to the parent
      } else {
        toast.error("Train not found.");
      }
    } catch (error) {
      console.error("Error fetching train data:", error);
      toast.error("Failed to fetch train data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-train-modal">
      <button onClick={handleFetchTrain} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Train"}
      </button>
      {trainData && (
        <div className="train-details">
          <h3>Train Details</h3>
          <p><strong>Train Number:</strong> {trainData.train_number}</p>
          <p><strong>Train Name:</strong> {trainData.train_name}</p>
          <p><strong>Departure Station:</strong> {trainData.departure_station}</p>
          <p><strong>Destination Station:</strong> {trainData.destination_station}</p>
          <p><strong>Number of Coaches:</strong> {trainData.number_of_coaches}</p>
          <p><strong>Line:</strong> {trainData.line}</p>
          <p><strong>Created By:</strong> {trainData.created_by}</p>
          <p><strong>Last Updated At:</strong> {trainData.last_updated_at}</p>
          <p><strong>Created At:</strong> {trainData.created_at}</p>
          <p><strong>Updated At:</strong> {trainData.updated_at}</p>
        </div>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default SearchTrain;
// ViewTrain.jsx
import React from 'react';
import './ViewTrain.css'; // Optional: Add styles for the modal


import ViewIcon from '../../assets/images/view.jpeg'; // Import view icon
const ViewTrain = ({ trainData, onClose }) => {
  if (!trainData) return null; // If no train data, return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Train Details</h2>
        <p><strong>Train Number:</strong> {trainData.train_number}</p>
        <p><strong>Train Name:</strong> {trainData.train_name}</p>
        <p><strong>Departure Station:</strong> {trainData.departure_station}</p>
        <p><strong>Destination Station:</strong> {trainData.destination_station}</p>
        <p><strong>Number of Coaches:</strong> {trainData.number_of_coaches}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ViewTrain;
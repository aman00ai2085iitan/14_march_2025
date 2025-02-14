import React from 'react';
import './Modal.css'; // Add your modal styles here

const Modal = ({ isOpen, onClose, trainDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Train Details</h2>
        {trainDetails ? (
          <div>
            <p><strong>Train Number:</strong> {trainDetails.train_number}</p>
            <p><strong>Train Name:</strong> {trainDetails.train_name}</p>
            {/* Add more details as needed */}
          </div>
        ) : (
          <p>No details available.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
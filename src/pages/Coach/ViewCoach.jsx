import React from 'react';
import './ViewCoach.css'; // Import your CSS for styling

const ViewCoach = ({ isOpen, onClose, coachData }) => {
  if (!isOpen) return null;

  return (
    <div className="view-coach-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Coach Details</h2>
        <div className="coach-details">
          <p><strong>Coach Number:</strong> {coachData.coach_number}</p>
          <p><strong>Make:</strong> {coachData.make}</p>
          <p><strong>Type:</strong> {coachData.type}</p>
          <p><strong>Created At:</strong> {new Date(coachData.created_at).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(coachData.updated_at).toLocaleString()}</p>
          <h3>Master Modules</h3>
          {coachData.masterModules && coachData.masterModules.map((module, index) => (
            <div key={index} className="master-module">
              <h4>Master Module {index + 1}</h4>
              <p><strong>Module ID:</strong> {module.moduleId}</p>
              <p><strong>Make/Model:</strong> {module.moduleMake}</p>
              <p><strong>Firmware Version:</strong> {module.firmwareVersion}</p>
              <p><strong>Serial Number:</strong> {module.serialNumber}</p>
              <p><strong>Installation Date:</strong> {new Date(module.installationDate).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {module.location}</p>
              <p><strong>Placement Type:</strong> {module.placementType}</p>
              <p><strong>SIM Number:</strong> {module.simNumber}</p>
              <p><strong>Service Provider:</strong> {module.serviceProvider}</p>
              <p><strong>Activation Date:</strong> {new Date(module.activationDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {module.status}</p>
              <p><strong>Selected Systems:</strong> {module.selectedSystems.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewCoach;
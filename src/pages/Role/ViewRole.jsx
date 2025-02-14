// ViewRole.js
import React from 'react';
import './ViewRole.css'; // Create a CSS file for styling the modal

const ViewRole = ({ user, onClose }) => {
  if (!user) return null; // If no user is provided, return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>User Details</h2>
        <div className="modal-body">
          <p><strong>Full Name:</strong> {user.name}</p>
          <p><strong>Email ID:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phone}</p>
          <p><strong>Job Role:</strong> {user.role}</p>

          <p><strong>Enrollment NO :</strong> {user.enrollment}</p>
          <p><strong>Phone :</strong> {user.phone}</p>
          <p><strong>Zone:</strong> {user.zone_name}</p>
      
          <p><strong>Company Name:</strong> {user.company}</p>
          <p><strong>Created :</strong> {user.created_at}</p>
          <p><strong>Updated :</strong> {user.updated_at}</p>
          <p><strong>Updated By:</strong> {user.updated_by}</p>
        </div>
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ViewRole;
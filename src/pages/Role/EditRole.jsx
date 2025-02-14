// EditRole.js
import React, { useState, useEffect } from 'react';
import './EditRole.css'; // Create a CSS file for styling the modal

const EditRole = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    emailId: '',
    phoneNumber: '',
    role: 'Manager',
    privilege: 'Viewer',
    companyName: '',
    railwayZone: 'Zone A',
    trainsAssigned: '',
    division: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name,
        emailId: user.email,
        phoneNumber: user.phone,
        role: user.role,
        privilege: user.privilege,
        companyName: user.company,
        railwayZone: user.zone_name,
        trainsAssigned: user.trainsAssigned || '',
        division: user.division || '',
      });
    }
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit User Details</h2>
        <div className="modal-body">
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Email ID</label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option>Manager</option>
              <option>Engineer</option>
              <option>Technician</option>
            </select>
          </div>
          <div>
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Privilege</label>
            <select
              name="privilege"
              value={formData.privilege}
              onChange={handleInputChange}
            >
              <option>Owner</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
          </div>
          <div>
            <label>Railway Zone</label>
            <select
              name="railwayZone"
              value={formData.railwayZone}
              onChange={handleInputChange}
            >
              <option>Zone A</option>
              <option>Zone B</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>Save</button>
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EditRole;
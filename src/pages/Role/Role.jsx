import React, { useState, useEffect } from 'react';
import './Role.css';

function Role() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRolesData();
  }, []);

  const fetchRolesData = async () => {
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleSaveConfiguration = () => {
    console.log('Saving configuration...');
  };

  const handleResetToDefault = () => {
    console.log('Resetting to default...');
  };

  return (
    <div className="role-container">
      <div className="header-section">
        <h2 className="role-title">Role Configuration</h2>
        <div className="breadcrumb">Dashboard / Role Configuration</div>
         </div><h4>Role Configuration</h4>
      <div className="role-form">
        <div className="form-row">
          <label htmlFor="fullName">Full Name:</label>
          <input type="text" id="fullName" />
        </div>
        <div className="form-row">
          <label htmlFor="emailId">Email ID:</label>
          <input type="text" id="emailId" />
        </div>
        <div className="form-row">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input type="text" id="phoneNumber" />
        </div>
        <div className="form-row">
          <label htmlFor="employeeType">Type of Employee:</label>
          <select id="employeeType">
            <option value="Indian Railways Employee">Indian Railways Employee</option>
            <option value="External Consultant">External Consultant</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="companyName">Company Name:</label>
          <input type="text" id="companyName" />
        </div>
        <div className="form-row">
          <label htmlFor="privilege">Privilege:</label>
          <select id="privilege">
            <option value="Owner">Owner</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="jobRole">Job Role:</label>
          <select id="jobRole">
            <option value="Train Manager">Train Manager</option>
            <option value="Station Master">Station Master</option>
          </select>
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={handleResetToDefault}>
            Reset to Default
          </button>
          <button className="btn btn-primary" onClick={handleSaveConfiguration}>
            Save Configuration
          </button>
        </div>
      </div>

      <h2 className="records-title">Records</h2>
      <table className="records-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email ID</th>
            <th>Phone Number</th>
            <th>Job Role</th>
            <th>Company Name</th>
            <th>Created By</th>
            <th>Updated At</th>
            <th>Updated By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.fullName}</td>
              <td>{role.email}</td>
              <td>{role.phoneNumber}</td>
              <td>{role.jobRole}</td>
              <td>{role.companyName}</td>
              <td>{role.createdBy}</td>
              <td>{role.updatedAt}</td>
              <td>{role.updatedBy}</td>
              <td>
                <button className="action-btn edit">Edit</button>
                <button className="action-btn delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Role;

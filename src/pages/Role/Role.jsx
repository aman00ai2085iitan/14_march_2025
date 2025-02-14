import React, { useState, useEffect } from 'react';
import './Role.css';
import DeleteIcon from '../../assets/images/delete.jpg';
import EditIcon from '../../assets/images/edit.jpg';
import View from '../../assets/images/view.jpeg';
import ViewRole from './ViewRole'; // Import the ViewRole component
import EditRole from './EditRole'; // Import the EditRole component

function Role() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    emailId: '',
    phoneNumber: '',
    password: '',
    role: 'Manager',
    privilege: 'Viewer',
    companyName: '',
    railwayZone: 'Zone A',
    trainsAssigned: '',
    division: '',
    trainId: 1,
    coachId: 2
  });
  const [selectedUser , setSelectedUser ] = useState(null); // State for the selected user
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for view modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal visibility

  const divisions = [
    { name: 'Mumbai (CST)', status: 'green' },
    { name: 'Bhusawal', status: 'yellow' },
    { name: 'Pune', status: 'green' },
    { name: 'Solapur', status: 'yellow' },
    { name: 'Nagpur', status: 'red' }
  ];

  const trains = [
    'Select Train Assigned',
    '12115: Siddheshwar Express (Mumbai CST to Solapur)',
    '12051: Jan Shatabdi Express (Dadar to Madgaon)',
    '12626: Kerala Express (New Delhi to Trivandrum)',
    '12952: Mumbai Rajdhani Express (Delhi to Mumbai)',
    '12953: August Kranti Rajdhani (Delhi to Mumbai)'
  ];

  useEffect(() => {
    fetchRolesData();
    fetchUsersData();
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

  const fetchUsersData = async () => {
    try {
      const response = await fetch('https://smartcoachez.com/rail/public/api/users');
      const data = await response.json();
      console.log('Fetched users data:', data);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTrainChange = (event) => {
    const selectedTrain = event.target.value;
    setFormData(prevState => ({
      ...prevState,
      trainsAssigned: selectedTrain !== 'Select Train Assigned' ? selectedTrain : ''
    }));
  };

  const handleDivisionChange = (event) => {
    setFormData(prevState => ({
      ...prevState,
      division: event.target.value
    }));
  };

  const handleSaveConfiguration = async () => {
    console.log('Saving configuration:', formData);
  
    try {
      const response = await fetch('http://smartcoachez.com/rail/public/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.emailId,
          phone: formData.phoneNumber,
          password: formData.password,
          role: formData.role,
          privilege: formData.privilege,
          company: formData.companyName,
          zone_name: formData.railwayZone,
          train_id: formData.trainId,
          coach_id: formData.coachId
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const newRole = await response.json();
      setRoles((prevRoles) => [...prevRoles, newRole]);

      handleResetToDefault();
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration');
    }
  };

  const handleResetToDefault = () => {
    setFormData({
      fullName: '',
      emailId: '',
      phoneNumber: '',
      password: '',
      role: 'Manager',
      privilege: 'Viewer',
      companyName: '',
      railwayZone: 'Zone A',
      trainsAssigned: '',
      division: '',
      trainId: 1,
      coachId: 2
    });
  };

  const handleViewUser  = (user) => {
    setSelectedUser (user);
    setIsViewModalOpen(true); // Open the view modal
  };

  const handleEditUser  = (user) => {
    setSelectedUser (user);
    setIsEditModalOpen(true); // Open the edit modal
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser (null); // Clear the selected user
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser (null); // Clear the selected user
  };

  const handleSaveEdit = async (updatedUser ) => {
    try {
      const response = await fetch(`https://smartcoachez.com/rail/public/api/users/${updatedUser .id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser ),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedUser  = await response.json(); // Corrected variable name
      setUsers((prevUsers) => prevUsers.map(user => user.id === updatedUser .id ? updatedUser  : user));
      alert('User  updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  return (
    <div className="role-container">
      <div className="header">
        <h2>Role Configuration</h2>
        <div className="breadcrumb">Dashboard / Role Configuration</div>
      </div>

      <div className="role-form">
        <h3>Role Configuration</h3>
        <div className="form-row">
          <div>
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="Enter full name" 
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Email ID</label>
            <input 
              type="email" 
              name="emailId"
              placeholder="Enter email ID" 
              value={formData.emailId}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input 
              type="text" 
              name="phoneNumber"
              placeholder="Enter phone number" 
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="Enter password" 
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Company Name</label>
            <input 
              type="text" 
              name="companyName"
              placeholder="Enter company name" 
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
        </div>

        <div className="form-row">
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
          <div>
            <label>Trains Assigned</label>
            <select 
              value={formData.trainsAssigned || 'Select Train Assigned'}
              onChange={handleTrainChange}
              className="form-control"
            >
              {trains.map((train, index) => (
                <option key={index} value={train}>
                  {train}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Division</label>
            <select 
              value={formData.division || ''}
              onChange={handleDivisionChange}
              className="form-control"
            >
              <option value="">Select Division</option>
              {divisions.map((division, index) => (
                <option 
                  key={index} 
                  value={division.name}
                  className={`status-option-${division.status}`}
                >
                  {division.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleResetToDefault}
          >
            Reset to Default
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSaveConfiguration}
          >
            Save Configuration
          </button>
        </div>
      </div>

      <div className="records-container">
        <h2>Records</h2>
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
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email || 'N/A'}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{user.role || 'N/A'}</td>
                <td>{user.company || 'N/A'}</td>
                <td>{user.created_by || 'N/A'}</td>
                <td>{user.updated_at || 'N/A'}</td>
                <td>{user.updated_by || 'N/A'}</td>
                <td>
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="action-icon"
                    onClick={() => handleEditUser (user)} // Open edit modal with user data
                  />
                  <img
                    src={DeleteIcon}
                    alt="Delete"
                    className="action-icon"
                    onClick={() => deleteSavedRole(index)}
                  />
                  <img
                    src={View}
                    alt="View"
                    className="action-icon"
                    onClick={() => handleViewUser (user)} // Open view modal with user data
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isViewModalOpen && (
        <ViewRole user={selectedUser } onClose={closeViewModal} /> // Render the view modal
      )}
      {isEditModalOpen && (
        <EditRole user={selectedUser } onClose={closeEditModal} onSave={handleSaveEdit} /> // Render the edit modal
      )}
    </div>
  );
}

export default Role;
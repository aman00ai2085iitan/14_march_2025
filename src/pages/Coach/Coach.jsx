import React, { useState } from 'react';
import './Coach.css';
import DeleteIcon from '../../assets/images/delete.jpg';
import EditIcon from '../../assets/images/edit.jpg';

const Coach = () => {
  const [coachData, setCoachData] = useState({
    coachUniqueNo: '',
    makeOfCoach: '',
    typeOfCoach: '',
    lastUpdated: '',
    byUser: '',
    systems: [],
  });

  const [records, setRecords] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoachData({ ...coachData, [name]: value });
  };

  const handleSystemChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setCoachData({ ...coachData, systems: [...coachData.systems, name] });
    } else {
      setCoachData({
        ...coachData,
        systems: coachData.systems.filter((system) => system !== name),
      });
    }
  };

  const handleSave = () => {
    const newRecord = {
      ...coachData,
      lastUpdated: new Date().toLocaleString(),
      byUser: 'Current User', // Replace with actual user information
    };

    setRecords([...records, newRecord]);
    setCoachData({
      coachUniqueNo: '',
      makeOfCoach: '',
      typeOfCoach: '',
      lastUpdated: '',
      byUser: '',
      systems: [],
    });
  };

  const handleDelete = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  return (
    <div className="coach-page">
      <h2>Coach Configuration System</h2>

      <h3>Add New Coach</h3>

      {/* First Line: 4 Inputs */}
      <div className="form-group first-line-inputs">
        <div className="input-group">
          <label>Coach Unique No</label>
          <input
            type="text"
            name="coachUniqueNo"
            placeholder="Enter coach number"
            value={coachData.coachUniqueNo}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label>Make of Coach</label>
          <input
            type="text"
            name="makeOfCoach"
            placeholder="Make of Coach"
            value={coachData.makeOfCoach}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          
          <label>Type of Coach</label>
          <div className="typebox">
          <select
            name="typeOfCoach"
            value={coachData.typeOfCoach}
            onChange={handleInputChange}
            id="typeofCoach"
            aria-label="Select type of Coach"
          >
            <option value="">Select Type</option>
            <option value="LHB">LHB</option>
            <option value="ICF">ICF</option>
          </select>
          </div>
        </div>
      </div>

      <h3>Selected Systems</h3>
<div className="checkbox-container">
  {[
    "Water Level",
    "Diesel Level",
    "Hot Axle",
    "BC Pressure",
    "BP Pressure",
    "TP Pressure",
    "Brake Binding",
    "Chain Pulling",
    "FSDS Bypass",
    "AC Monitoring",
    "Panic Button",
    "Toilet Occupancy",
  ].map((system, index) => (
    <label key={index} className="checkbox-item">
      <input
        type="checkbox"
        name={system}
        checked={coachData.systems.includes(system)}
        onChange={handleSystemChange}
      />
      {system} {system.includes("Indicator") ? "" : "Sensors"}
    </label>
  ))}
</div>


      <button className="add-coach-button" onClick={handleSave}>
        + Add
      </button>

      <h2 >Coach Records</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Coach Unique No</th>
              <th>Make of Coach</th>
              <th>Type of Coach</th>
              <th>Selected Systems</th>
              <th>Created By</th>
              <th>Last Update Date/Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{record.coachUniqueNo}</td>
                <td>{record.makeOfCoach}</td>
                <td>{record.typeOfCoach}</td>
                <td className="systems-column">
                  {record.systems.join(', ').replaceAll(',', ', ')}
                </td>
                <td>{record.byUser}</td>
                <td>{record.lastUpdated}</td>
                <td>
                  <img
                    src={EditIcon} // Replace with the path to your edit icon
                    alt="Edit"
                    className="action-icon"
                    onClick={() => handleEdit(index)} // Replace with your edit handler if needed
                  />
                  <img
                    src={DeleteIcon} // Replace with the path to your delete icon
                    alt="Delete"
                    className="action-icon"
                    onClick={() => handleDelete(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coach;

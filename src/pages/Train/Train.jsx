import React, { useState } from 'react';
import './Train.css';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '../../assets/images/delete.jpg'
import EditIcon from '../../assets/images/edit.jpg'

const TrainConfig = () => {
  const [coaches, setCoaches] = useState([]);
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [numberOfCoaches, setNumberOfCoaches] = useState(0); // Track the number of coaches
  const [savedCoaches, setSavedCoaches] = useState([]);
  const navigate = useNavigate();

  // Update number of coaches and create new coach diagram entries
  const handleNumberOfCoachesChange = (e) => {
    const number = e.target.value;
    setNumberOfCoaches(number);

    // Generate coaches based on the number, all initially "unconfigured"
    const newCoaches = [];
    for (let i = 0; i < number; i++) {
      newCoaches.push({
        id: Date.now() + i, // Ensure each coach has a unique ID
        uniqueId: '',
        displayId: `C${i + 1}`,
        position: '',
        status: 'unconfigured', // All coaches start as unconfigured
      });
    }
    setCoaches(newCoaches);
  };

  // Function to handle when a coach is configured (filled in details and saved)
  const handleSaveAllCoaches = () => {
    // Update status to 'configured' only if all fields are filled for each coach
    setCoaches((prevCoaches) =>
      prevCoaches.map((coach) =>
        coach.uniqueId && coach.displayId && coach.position // Check if all fields are filled
          ? { ...coach, status: 'configured' }
          : coach
      )
    );
  };

  const addCoach = () => {
    setCoaches([...coaches, { id: Date.now(), uniqueId: '', displayId: '', position: '', status: 'unconfigured' }]);
  };

  const removeCoach = (id) => {
    setCoaches(coaches.filter((coach) => coach.id !== id));
  };

  const updateCoach = (id, field, value) => {
    setCoaches((prevCoaches) =>
      prevCoaches.map((coach) =>
        coach.id === id ? { ...coach, [field]: value } : coach
      )
    );
  };

  const handleTrainNumberChange = (e) => {
    setTrainNumber(e.target.value);
  };

  const handleSave = () => {
    const allCoachesConfigured = coaches.every(
      (coach) => coach.uniqueId && coach.displayId && coach.position
    );

    if (allCoachesConfigured) {
      // Update all coaches to be "configured"
      const updatedCoaches = coaches.map((coach) => ({
        ...coach,
        status: 'configured',
      }));

      // Save the train record with the updated coaches
      setSavedCoaches((prevSavedCoaches) => [
        ...prevSavedCoaches,
        { trainNumber, trainName, coaches: updatedCoaches },
      ]);

      // Reset coaches
      setCoaches([]);
      alert('All coaches are saved and configured successfully!');
    } else {
      alert('Please fill in all the details for each coach before saving.');
    }
  };

  const deleteSavedCoach = (index) => {
    const updatedSavedCoaches = [...savedCoaches];
    updatedSavedCoaches.splice(index, 1);
    setSavedCoaches(updatedSavedCoaches);
  };

  return (
    <div className="train-config">
      <div className="breadcrumb">
        <span>Dashboard</span> / <span>Train Configuration</span>
      </div>
      <h1>Train Configuration</h1>

      <div className="train-details">
        <h2>Train Details</h2>
        <p>Enter train number to fetch details automatically</p>
        <div className="train-details-row">
          <div className="train-number-container">
            <label className="train-number-label">Train Number</label>
            <input
              type="text"
              placeholder="Train Number"
              value={trainNumber}
              onChange={handleTrainNumberChange}
              className="train-number-input"
            />
            </div>
            <div className="fetch-button-container"> 
            <button className="fetch-button-container">Fetch Details</button>
          </div>
        </div>
        <div className="train-details-grid">
          <div className="form-group">
            <label>Train Name</label>
            <input
              type="text"
              placeholder="Train Name"
              value={trainName}
              onChange={(e) => setTrainName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Departure Station</label>
            <input type="text" placeholder="Departure Station" />
          </div>
          <div className="form-group">
            <label>Destination Station</label>
            <input type="text" placeholder="Destination Station" />
          </div>
          <div className="form-group">
            <label>Number of Coaches</label>
            <input
              type="number"
              value={numberOfCoaches}
              onChange={handleNumberOfCoachesChange}
              placeholder="Number of Coaches"
            />
          </div>
          <div className="form-group">
            <label>Line</label>
            <select>
              <option value="UP">UP</option>
              <option value="DOWN">DOWN</option>
            </select>
          </div>
        </div>

        <div className="coach-diagram">
          {coaches.map((coach) => (
            <span key={coach.id} className={`coach-icon ${coach.status}`}>
              {coach.displayId}
            </span>
          ))}
        </div>

        <div className="coach-legend">
          <span className="coach-icon configured"></span>
          <span>Configured ({coaches.filter((coach) => coach.status === 'configured').length})</span>
          <span className="coach-icon unconfigured"></span>
          <span>Unconfigured ({coaches.filter((coach) => coach.status === 'unconfigured').length})</span>
        </div>
      </div>

      <div className="coach-configuration">
        <h2>Coach Configuration</h2>
        <table className="coach-config-table">
          <thead>
            <tr>
              <th>Unique ID</th>
              <th>Display ID</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coaches.map((coach, index) => (
              <tr key={coach.id}>
                <td>
                  <input
                    type="text"
                    placeholder="Coach Unique ID"
                    value={coach.uniqueId}
                    onChange={(e) => updateCoach(coach.id, 'uniqueId', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Coach Display ID"
                    value={coach.displayId}
                    onChange={(e) => updateCoach(coach.id, 'displayId', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Position"
                    value={coach.position}
                    onChange={(e) => updateCoach(coach.id, 'position', e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="delete-coach-button"
                    onClick={() => removeCoach(coach.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-coach-button" onClick={addCoach}>
          Add Coach
        </button>
      </div>

      <div className="actions">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>

      <div className="saved-coaches">
        <h2>Train Records</h2>
        {savedCoaches.length > 0 ? (
          <table className="saved-coach-table">
            <thead>
              <tr>
                <th>Train Number</th>
                <th>Train Name</th>
                <th>Number of Coaches</th>
                <th>Created by</th>
                <th>Last Updated by</th>
                <th>Last update Date Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedCoaches.map((savedCoach, index) => (
                <tr key={index}>
                  <td>{savedCoach.trainNumber}</td>
                  <td>{savedCoach.trainName}</td>
                  <td>{savedCoach.coaches.filter((coach) => coach.status === 'configured').length}</td>
                  <td>{}</td>
                  <td>{savedCoach.lastUpdated}</td>
                  <td>
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
    onClick={() => deleteSavedCoach(index)}
  />
</td>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No saved coaches yet.</p>
        )}
      </div>
    </div>
  );
};

export default TrainConfig;

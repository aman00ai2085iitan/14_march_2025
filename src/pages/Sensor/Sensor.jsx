import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './Sensor.css';
import DeleteIcon from '../../assets/images/delete.jpg';
import EditIcon from '../../assets/images/edit.jpg';
import View from '../../assets/images/view.jpeg';
import SensorDropdown from './SensorDropdown';
import MasterModule from './MasterModuleDropdown';
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications

const Sensor = () => {
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [sensorConfigurations, setSensorConfigurations] = useState({});
  const [sensorRecords, setSensorRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSystem, setFilterSystem] = useState('');
  const [filterCreator, setFilterCreator] = useState('');
  const [sortByDate, setSortByDate] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState("");
  const [selectedMasterId, setSelectedMasterId] = useState("");
  const [coaches, setCoaches] = useState([]); // State for coaches
  const [masters, setMasters] = useState([]); // State for master modules

  const sensors = [
    { name: "Water Level", numSensors: 2 },
    { name: "BC Pressure", numSensors: 1 },
    { name: "Diesel Level", numSensors: 2 },
    { name: "Hot Axle", numSensors: 8 },
    { name: "BP Pressure", numSensors: 1 },
    { name: "FP Pressure", numSensors: 1 },
    { name: "Brake Binding", numSensors: 8 },
    { name: "Chain Pulling", numSensors: 1 },
    { name: "FSDS Bypass", numSensors: 1 },
    { name: "AC Monitoring", numSensors: 1 },
    { name: "Panic Button", numSensors: 1 },
    { name: "Toilet Occ", numSensors: 6 },
  ];

  useEffect(() => {
    // Load initial sample data
    setSensorRecords([]);
    fetchCoaches();
    fetchMasters();
  }, []);

  const fetchCoaches = async () => {
    try {
      const response = await axios.get('https://smartcoachez.com/rail/public/api/coaches'); // Adjust the endpoint as necessary
      setCoaches(response.data); // Assuming the response contains an array of coaches
    } catch (error) {
      console.error("Error fetching coaches:", error);
    }
  };

  const fetchMasters = async () => {
    try {
      const response = await axios.get('https://smartcoachez.com/rail/public/api/masters'); // Adjust the endpoint as necessary
      setMasters(response.data); // Assuming the response contains an array of master modules
    } catch (error) {
      console.error("Error fetching masters:", error);
    }
  };

  const handleSensorSelect = (sensorName) => {
    if (selectedSensors.includes(sensorName)) {
      setSelectedSensors(selectedSensors.filter((s) => s !== sensorName));
      delete sensorConfigurations[sensorName];
    } else {
      setSelectedSensors([...selectedSensors, sensorName]);
      setSensorConfigurations({
        ...sensorConfigurations,
        [sensorName]: {
          sensors: Array.from({ length: sensors.find((s) => s.name === sensorName).numSensors }, () => ({
            sensorID: '',
            sensorMake: '',
            installationDate: '',
            placement: '',
            comments: '',
          })),
        },
      });
    }
  };

  const handleSensorConfigChange = (sensorName, sensorIndex, field, value) => {
    setSensorConfigurations((prevConfigs) => ({
      ...prevConfigs,
      [sensorName]: {
        ...prevConfigs[sensorName],
        sensors: prevConfigs[sensorName].sensors.map((sensor, index) =>
          index === sensorIndex ? { ...sensor, [field]: value } : sensor
        ),
      },
    }));
  };

  const handleSaveConfiguration = async () => {
    if (!selectedCoachId.trim()) {
      toast.error("Coach No. is required."); // Show error toast
      return;
    }

    if (!selectedMasterId.trim()) {
      toast.error("Master ID is required."); // Show error toast
      return;
    }

    if (selectedSensors.length === 0) {
      toast.error("Please select at least one sensor."); // Show error toast
      return;
    }

    try {
      for (const sensorName of selectedSensors) {
        const sensorConfigs = sensorConfigurations[sensorName].sensors;

        for (const sensor of sensorConfigs) {
          const payload = {
            coach_id: selectedCoachId,
            master_id: selectedMasterId,
            sensor_name: sensorName,
            placement: sensor.placement,
            location: sensor.comments, // Assuming comments is the location
            sensor_no: sensorConfigs.length, // Total number of sensors
            sensor_type: selectedSensors.map(sensor => sensor.replace(" ", "_")), // Ensure valid sensor types
            installed_on: sensor.installationDate,
          };

          // Debugging: Log the payload to check values
          console.log("Payload being sent:", payload);

          // Send POST request to the API
          const response = await axios.post('https://smartcoachez.com/rail/public/api/sensors/store', payload);
          console.log("Response from API:", response.data);
        }
      }

      toast.success("Data saved successfully!"); // Show success toast
      // Optionally, reset the form or state here
      setSensorRecords([]); // Clear records or handle as needed
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again."); // Show error toast
      if (error.response) {
        console.error("API response:", error.response.data);
      }
    }
  };

  const handleEditRecord = (index) => {
    const updatedRecords = [...sensorRecords];
    updatedRecords[index].lastUpdatedBy = "Admin"; // Assuming the admin is the one editing for now
    setSensorRecords(updatedRecords);
  };

  const handleDeleteRecord = (index) => {
    const updatedRecords = [...sensorRecords];
    updatedRecords.splice(index, 1);
    setSensorRecords(updatedRecords);
  };

  const filteredRecords = sensorRecords.filter((record) => {
    return (
      record.coachNo.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filterSystem || record.systemName === filterSystem) &&
      (!filterCreator || record.createdBy === filterCreator)
    );
  });

  const sortedRecords = sortByDate
    ? [...filteredRecords].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    : filteredRecords;

  return (
    <div className="sensor-config-container">
      <header className="sensor-config-header">
        <h1>Sensor Configuration</h1>
        <div className="header-controls">
          {/* Coach ID Dropdown */}
          <SensorDropdown
            selectedCoachId={selectedCoachId}
            setSelectedCoachId={setSelectedCoachId}
            coaches={coaches} // Pass the coaches data
          />

          {/* Master Module Dropdown */}
          <MasterModule
            selectedMasterId={selectedMasterId}
            setSelectedMasterId={setSelectedMasterId}
            masters={masters} // Pass the masters data
          />
        </div>
      </header>

      <div className="sensor-grid">
        {sensors.map((sensor) => (
          <div key={sensor.name} className="sensor-item">
            <label htmlFor={sensor.name} className="sensor-label">
              <div className="sensor-details">
                <div className="sensor-checkbox">
                  <input
                    type="checkbox"
                    id={sensor.name}
                    checked={selectedSensors.includes(sensor.name)}
                    onChange={() => handleSensorSelect(sensor.name)}
                  />
                </div>
                <h3 className="sensor-name">{sensor.name}</h3>
                <div className="sensor-status">
                  {selectedSensors.includes(sensor.name)
                    ? `${sensor.numSensors} sensor${sensor.numSensors > 1 ? 's' : ''} active`
                    : 'Not configured'}
                </div>
                <div
                  className={`status-indicator ${
                    selectedSensors.includes(sensor.name) ? 'active' : 'inactive'
                  }`}
                ></div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {selectedSensors.map((sensorName) => (
        <div key={sensorName} className="sensor-config-section">
          <h2>{sensorName} Configuration</h2>
          <div className="sensor-total-num">
            <label>No. of Sensors</label>
            <input type="text" value={sensorConfigurations[sensorName]?.sensors?.length} readOnly />
          </div>
          <div className="sensor-config-textbox">
            {sensorConfigurations[sensorName]?.sensors?.map((sensor, index) => (
              <div key={index} className="sensor-config-row">
                <h6>Sensor {index + 1}</h6>
                <label>Sensor ID</label>
                <input
                  type="text"
                  value={sensor.sensorID}
                  onChange={(e) => handleSensorConfigChange(sensorName, index, 'sensorID', e.target.value)}
                />
                <label>Sensor Make</label>
                <input
                  type="text"
                  value={sensor.sensorMake}
                  onChange={(e) => handleSensorConfigChange(sensorName, index, 'sensorMake', e.target.value)}
                />
                <label>Installation Date</label>
                <input
                  type="date"
                  value={sensor.installationDate}
                  onChange={(e) => handleSensorConfigChange(sensorName, index, 'installationDate', e.target.value)}
                />
                <label>Placement</label>
                <input
                  type="text"
                  value={sensor.placement}
                  className="sensor-placement"
                  onChange={(e) => handleSensorConfigChange(sensorName, index, 'placement', e.target.value)}
                />
                <label>Location</label>
                <input
                  type="text"
                  value={sensor.comments}
                  className="sensor-comments"
                  onChange={(e) => handleSensorConfigChange(sensorName, index, 'comments', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="sort-button" onClick={handleSaveConfiguration}>
        Save
      </button>

      <section className="sensor-records">
        <h2>Sensor Records Management</h2>
        <div className="records-controls">
          <input
            type="text"
            placeholder="Search coach..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select value={filterSystem} onChange={(e) => setFilterSystem(e.target.value)}>
            <option value="">All Systems</option>
            {sensors.map((sensor) => (
              <option key={sensor.name} value={sensor.name}>
                {sensor.name} Sensors
              </option>
            ))}
          </select>
          <select value={filterCreator} onChange={(e) => setFilterCreator(e.target.value)}>
            <option value="">All Creators</option>
            {[...new Set(sensorRecords.map((record) => record.created_by))].map((creator) => (
              <option key={creator} value={creator}>
                {creator}
              </option>
            ))}
          </select>
          <button className="sort-button" onClick={() => setSortByDate(!sortByDate)}>
            {sortByDate ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        <table className="records-table">
          <thead>
            <tr>
              <th>Coach No</th>
              <th>System Name</th>
              <th>No. of Sensors</th>
              <th>Created By</th>
              <th>Last Updated</th>
              <th>Last Updated by</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.coach_number}</td>
                <td>{record.sensor_type}</td>
                <td>{record.sensor_no}</td>
                <td>{record.created_by}</td>
                <td>{new Date(record.created_at).toLocaleString()}</td>
                <td>{record.lastUpdatedBy || 'N/A'}</td>
                <td>
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="action-icon"
                    onClick={() => handleEditRecord(index)}
                  />
                  <img
                    src={DeleteIcon}
                    alt="Delete"
                    className="action-icon"
                    onClick={() => handleDeleteRecord(index)}
                  />
                  <img
                    src={View}
                    alt="View"
                    className='action-icon'
                    onClick={() => console.log('View record', index)} // Replace with your view handler
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
};

export default Sensor;
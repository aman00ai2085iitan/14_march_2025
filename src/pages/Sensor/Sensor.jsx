import React, { useState, useEffect } from 'react';
import './Sensor.css';

const Sensor = () => {
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [sensorConfigurations, setSensorConfigurations] = useState({});
  const [sensorRecords, setSensorRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSystem, setFilterSystem] = useState('');
  const [filterCreator, setFilterCreator] = useState('');
  const [sortByDate, setSortByDate] = useState(false);
  const [coachNo, setCoachNo] = useState(''); // State to store entered Coach No.

  const sensors = [
    { name: "Water Level", numSensors: 2 },
    { name: "Diesel Level", numSensors: 2 },
    { name: "Hot Axle", numSensors: 8 },
    { name: "Brake Binding", numSensors: 8 },
    { name: "BC Pressure Indicator", numSensors: 1 },
    { name: "BP Pressure Indicator", numSensors: 1 },
    { name: "TP Pressure Indicator", numSensors: 1 },
    { name: "Chain Pulling Indicator", numSensors: 1 },
    { name: "FSDS", numSensors: 1 },
    { name: "AC Monitoring System", numSensors: 1 },
    { name: "Panic", numSensors: 1 },
  ];

  useEffect(() => {
    // Load initial sample data
    setSensorRecords([]);
  }, []);

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
            location: '',
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

  const handleSaveConfiguration = () => {
    if (!coachNo.trim()) {
      alert("Coach No. is required.");
      return;
    }

    if (selectedSensors.length === 0) {
      alert("Please select at least one sensor.");
      return;
    }

    const updatedRecords = selectedSensors.map((sensorName) => {
      const sensorData = sensors.find((sensor) => sensor.name === sensorName);
      return {
        coachNo,
        systemName: sensorName,
        noOfSensors: sensorData?.numSensors || 0,
        createdBy: "Admin", // Set default creator
        lastUpdated: new Date().toISOString(),
      };
    });

    setSensorRecords((prevRecords) => [...prevRecords, ...updatedRecords]);
    setCoachNo('');
  };

  const handleUpdateRecord = (id) => {
    // Update record logic
    setSensorRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id ? { ...record, lastUpdated: new Date().toISOString(), createdBy: "Admin" } : record
      )
    );
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setSensorRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
    }
  };

  const handleEditRecord = (id) => {
    setIsEditing(id);
  };

  const handleSaveEdit = (id, updatedData) => {
    setSensorRecords((prevRecords) =>
      prevRecords.map((record) => (record.id === id ? { ...record, ...updatedData } : record))
    );
    setIsEditing(null);
  };

  const handleViewRecord = (record) => {
    alert(`
      Coach No: ${record.coachNo}
      System Name: ${record.systemName}
      No. of Sensors: ${record.noOfSensors}
      Created By: ${record.createdBy}
      Last Updated: ${record.lastUpdated}
      
    `);
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSystemFilterChange = (e) => {
    setFilterSystem(e.target.value);
  };

  const handleCreatorFilterChange = (e) => {
    setFilterCreator(e.target.value);
  };

  const handleSortByDateClick = () => {
    setSortByDate(!sortByDate);
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
    <div className="sensor-container">
      <h2>Sensor Configuration</h2>

      <div className="coach-no-save">
        <input
          type="text"
          placeholder="Enter Coach No."
          value={coachNo}
          onChange={(e) => setCoachNo(e.target.value)}
        />
        <button onClick={handleSaveConfiguration}>Save Configuration</button>
      </div>

      <div className="sensor-list">
        {sensors.map((sensor) => (
          <div key={sensor.name} className="sensor-item">
            <input
              type="checkbox"
              id={sensor.name}
              checked={selectedSensors.includes(sensor.name)}
              onChange={() => handleSensorSelect(sensor.name)}
            />
            <label htmlFor={sensor.name}>{sensor.name}</label>
          </div>
        ))}
      </div>

      {selectedSensors.map((sensorName) => (
        <div key={sensorName} className="sensor-config">
          <h3>{sensorName} Configuration</h3>
          <div className="sensor-table">
            <table>
              <thead>
                <tr>
                  <th>Sensor ID</th>
                  <th>Sensor Make</th>
                  <th>Installation Date</th>
                  <th>Placement</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {sensorConfigurations[sensorName]?.sensors?.map((sensor, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={sensor.sensorID}
                        onChange={(e) =>
                          handleSensorConfigChange(sensorName, index, 'sensorID', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={sensor.sensorMake}
                        onChange={(e) =>
                          handleSensorConfigChange(sensorName, index, 'sensorMake', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={sensor.installationDate}
                        onChange={(e) =>
                          handleSensorConfigChange(sensorName, index, 'installationDate', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={sensor.placement}
                        onChange={(e) =>
                          handleSensorConfigChange(sensorName, index, 'placement', e.target.value)
                        }
                      >
                        <option value="">Select Placement</option>
                        <option value="Front Right">Front Right</option>
                        <option value="Front Left">Front Left</option>
                        <option value="Rear Right">Rear Right</option>
                        <option value="Rear Left">Rear Left</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={sensor.location}
                        onChange={(e) =>
                          handleSensorConfigChange(sensorName, index, 'location', e.target.value)
                        }
                      >
                        <option value="">Select Location</option>
                        <option value="Bogie 1">Bogie 1</option>
                        <option value="Bogie 2">Bogie 2</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <h2>Sensor Records Management</h2>

      <div className="record-controls">
        <input
          type="text"
          placeholder="Search coach..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select value={filterSystem} onChange={handleSystemFilterChange}>
          <option value="">All Systems</option>
          {sensors.map((sensor) => (
            <option key={sensor.name} value={sensor.name}>
              {sensor.name} Sensors
            </option>
          ))}
        </select>
        <select value={filterCreator} onChange={handleCreatorFilterChange}>
          <option value="">All Creators</option>
          {[...new Set(sensorRecords.map((record) => record.createdBy))].map((creator) => (
            <option key={creator} value={creator}>
              {creator}
            </option>
          ))}
        </select>
        <button onClick={handleSortByDateClick}>Sort by Date</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Coach No</th>
            <th>System Name</th>
            <th>No. of Sensors</th>
            <th>Created By</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.coachNo}</td>
              <td>{record.systemName}</td>
              <td>{record.noOfSensors}</td>
              <td>{record.createdBy}</td>
              <td>{record.lastUpdated}</td>
              <td><button onClick={() => handleEditRecord(record.id)}>Edit</button>
                <button onClick={() => handleViewRecord(record)}>View</button>
                <button onClick={() => handleDeleteRecord(record.id)}>Delete</button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sensor;

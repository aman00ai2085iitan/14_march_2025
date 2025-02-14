import React, { useState, useEffect } from 'react';
import './Coach.css';
import DeleteIcon from '../../assets/images/delete.jpg';
import EditIcon from '../../assets/images/edit.jpg';
import ViewIcon from '../../assets/images/view.jpeg'; // Import view icon
import axios from 'axios'; // Import axios
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import Modal from './Modal.jsx'; // Import the Modal component
import ViewCoach from './ViewCoach.jsx'; // Import the ViewCoach component
import SensorDropdown from './SensorDropdown'; // Import the SensorDropdown component
import { Pagination } from 'react-bootstrap'; // Import Bootstrap Pagination

const Coach = () => {
  const [formData, setFormData] = useState({
    coachUniqueNo: '',
    makeOfCoach: 'ICF',
    typeOfCoach: 'LWFAC: A/C First Class Coach (EOG)',
    numberOfMasterModule: '1',
    masterModules: [
      {
        masterModuleId: '',
        masterModuleMake: '',
        firmwareVersion: '',
        serialNumber: '',
        installationDate: new Date(),
        location: '',
        placementType: 'Internal',
        simNumber: '',
        serviceProvider: 'Airtel',
        activationDate: new Date(),
        status: 'Active',
        selectedSystems: []
      },
    ]
  });

  const [allCoaches, setAllCoaches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for view modal
  const [currentCoach, setCurrentCoach] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedCoachId, setSelectedCoachId] = useState(null); // State for selected coach ID
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5); // Number of records per page

  // Fetch coach records from the API
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get('https://smartcoachez.com/rail/public/api/coaches');
        setAllCoaches(response.data); // Assuming response.data is an array of coach records
      } catch (error) {
        console.error("Error fetching coach records:", error);
        toast.error('Failed to fetch coach records. Please try again.'); // Toast notification
      }
    };

    fetchCoaches();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Calculate the current records to display
  const indexOfLastCoach = currentPage * recordsPerPage;
  const indexOfFirstCoach = indexOfLastCoach - recordsPerPage;
  const currentCoaches = allCoaches.slice(indexOfFirstCoach, indexOfLastCoach);

  // Calculate total pages
  const totalPages = Math.ceil(allCoaches.length / recordsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMasterModuleChange = (moduleIndex, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedModules = [...prev.masterModules];
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        [name]: value
      };
      return {
        ...prev,
        masterModules: updatedModules
      };
    });
  };

  const handleNumberOfModulesChange = (e) => {
    const numberOfModules = parseInt(e.target.value, 10);
    setFormData(prev => {
      const updatedModules = [...prev.masterModules];
      while (updatedModules.length < numberOfModules) {
        updatedModules.push({
          masterModuleId: '',
          masterModuleMake: '',
          firmwareVersion: '',
          serialNumber: '',
          installationDate: new Date(),
          location: '',
          placementType: 'Internal',
          simNumber: '',
          serviceProvider: 'Airtel',
          activationDate: new Date(),
          status: 'Active',
          selectedSystems: []
        });
      }
      while (updatedModules.length > numberOfModules) {
        updatedModules.pop();
      }
      return {
        ...prev,
        numberOfMasterModule: e.target.value,
        masterModules: updatedModules
      };
    });
  };

  const handleCheckboxChange = (moduleIndex, system) => {
    setFormData(prevData => {
      const updatedModules = [...prevData.masterModules];
      const currentModule = updatedModules[moduleIndex];
      
      const updatedSystems = currentModule.selectedSystems.includes(system)
        ? currentModule.selectedSystems.filter(s => s !== system)
        : [...currentModule.selectedSystems, system];
      
      updatedModules[moduleIndex] = {
        ...currentModule,
        selectedSystems: updatedSystems
      };
      
      return {
        ...prevData,
        masterModules: updatedModules
      };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const payload = {
      train_id: 1,
      device_id: 2,
      coach_number: formData.coachUniqueNo,
      make: formData.makeOfCoach,
      type: formData.typeOfCoach,
      position: 3,
      masterModules: formData.masterModules.map(module => ({
        moduleId: module.masterModuleId,
        moduleMake: module.masterModuleMake,
        firmwareVersion: module.firmwareVersion,
        serialNumber: module.serialNumber,
        installationDate: module.installationDate,
        location: module.location,
        placementType: module.placementType,
        simNumber: module.simNumber,
        serviceProvider: module.serviceProvider,
        activationDate: module.activationDate,
        status: module.status,
        selectedSystems: module.selectedSystems
      })),
    };

    try {
      // Check if the coach already exists
      const existingCoach = allCoaches.find(coach => coach.coach_number === formData.coachUniqueNo);
      if (existingCoach) {
        // Update existing coach
        const response = await axios.put(`http://smartcoachez.com/rail/public/api/update-coach/${existingCoach.id}`, payload);
        console.log("Update response:", response.data);
        setAllCoaches(allCoaches.map(coach => (coach.id === existingCoach.id ? { ...existingCoach, ...payload } : coach)));
        toast.success('Coach details updated successfully!'); // Toast notification
      } else {
        // Create new coach
        const response = await axios.post('http://smartcoachez.com/rail/public/api/add-coach', payload);
        console.log("Save response:", response.data);
        setAllCoaches([...allCoaches, { ...payload, id: response.data.id }]); // Assuming response.data contains the new coach ID
        toast.success('Coach details saved successfully!'); // Toast notification
      }

      // Reset form data
      setFormData({
        coachUniqueNo: '',
        makeOfCoach: 'ICF',
        typeOfCoach: 'LWFAC: A/C First Class Coach (EOG)',
        numberOfMasterModule: '1',
        masterModules: [{
          masterModuleId: '',
          masterModuleMake: '',
          firmwareVersion: '',
          serialNumber: '',
          installationDate: new Date(),
          location: '',
          placementType: 'Internal',
          simNumber: '',
          serviceProvider: 'Airtel',
          activationDate: new Date(),
          status: 'Active',
          selectedSystems: []
        }]
      });
    } catch (error) {
      console.error("Save error:", error.response ? error.response.data : error);
      toast.error('Failed to save coach details. Please try again.'); // Toast notification
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coach) => {
    setCurrentCoach(coach);
    setFormData({
      coachUniqueNo: coach.coach_number,
      makeOfCoach: coach.make,
      typeOfCoach: coach.type,
      numberOfMasterModule: coach.masterModules.length.toString(),
      masterModules: coach.masterModules
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const updatedCoach = {
      ...currentCoach,
      coach_number: formData.coachUniqueNo,
      make: formData.makeOfCoach,
      type: formData.typeOfCoach,
      masterModules: formData.masterModules
    };

    try {
      await axios.put(`http://smartcoachez.com/rail/public/api/update-coach/${currentCoach.id}`, updatedCoach);
      setAllCoaches(allCoaches.map(coach => (coach.id === currentCoach.id ? updatedCoach : coach)));
      toast.success('Coach details updated successfully!'); // Toast notification
    } catch (error) {
      console.error("Update error:", error);
      toast.error('Failed to update coach details. Please try again.'); // Toast notification
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setCurrentCoach(null);
    }
  };

  const handleDelete = (index) => {
    setAllCoaches(allCoaches.filter((_, i) => i !== index));
    toast.success('Coach details deleted successfully!'); // Toast notification
  };

  const handleView = (coach) => {
    setCurrentCoach(coach);
    setIsViewModalOpen(true); // Open view modal
  };

  return (
    <div className="coach-page">
      <h2>Coach Configuration System</h2>

      <h3>Add New Coach</h3>
      <div className="form-group first-line-inputs">
        <div className="input-row">
          <SensorDropdown
            selectedCoachId={selectedCoachId}
            setSelectedCoachId={setSelectedCoachId}
            coaches={allCoaches} // Pass the coaches data
          />
          <div className="input-group">
            <label>Make of Coach</label>
            <input
              type="text"
              name="makeOfCoach"
              placeholder="Make of Coach"
              value={formData.makeOfCoach}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>Type of Coach</label>
            <div className="typebox">
              <select
                name="typeOfCoach"
                value={formData.typeOfCoach}
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
          <div className="input-group">
            <label>Number of Master Module</label>
            <select
              name="numberOfMasterModule"
              value={formData.numberOfMasterModule}
              onChange={handleNumberOfModulesChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>
      </div>

      <h3>Master Module Management</h3>
      <div className="master-module-section">
        {formData.masterModules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="master-module">
            <h4>Master Module {moduleIndex + 1}</h4>
            <div className="module-parameters">
              <div className="form-row">
                <div className="form-group">
                  <label>Master Module ID</label>
                  <input
                    type="text"
                    name="masterModuleId"
                    placeholder="Enter Module ID"
                    value={module.masterModuleId}
                    onChange={(e) => handleMasterModuleChange(moduleIndex, e)}
                  />
                </div>
                <div className="form-group">
                  <label>Master Module Make/Model</label>
                  <input
                    type="text"
                    name="masterModuleMake"
                    placeholder="Enter Make/Model"
                    value={module.masterModuleMake}
                    onChange={(e) => handleMasterModuleChange(moduleIndex, e)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Firmware Version</label>
                  <input
                    type="text"
                    name="firmwareVersion"
                    placeholder="Enter Firmware Version"
                    value={module.firmwareVersion}
                    onChange={(e) => handleMasterModuleChange(moduleIndex, e)}
                  />
                </div>
                <div className="form-group">
                  <label>Serial Number</label>
                  <input
                    type="text"
                    name="serialNumber"
                    placeholder="Enter Serial Number"
                    value={module.serialNumber}
                    onChange={(e) => handleMasterModuleChange(moduleIndex, e)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Installation Date</label>
                  <input
                    type="date"
                    name="installationDate"
                    value={module.installationDate.toISOString().split('T')[0]}
                    onChange={(e) => handleMasterModuleChange(moduleIndex, e)}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter Location"
                    value={module.location}
                    onChange={(e) => handleMasterModuleChange(moduleIndex, e)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Placement Type</label>
                  <select
                    name="placementType"
                    value={module.placementType}
                    onChange={(e) => handleMasterModuleChange(moduleIndex, e)}
                  >
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                  </select>
                </div>
              </div>

              <div className="sim-card-section">
                <h3>SIM Card Management</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>SIM Number</label>
                    <input
                      type="text"
                      name="simNumber"
                      placeholder="Enter SIM Number"
                      value={module.simNumber}
                      onChange={(e) => handleMasterModuleChange(moduleIndex, e)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Service Provider</label>
                    <select
                      name="serviceProvider"
                      value={module.serviceProvider}
                      onChange={(e) => handleMasterModuleChange(moduleIndex, e)}
                    >
                      <option value="Airtel">Airtel</option>
                      <option value="Jio">Jio</option>
                      <option value="Vi">Vi</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Activation Date</label>
                    <input
                      type="date"
                      name="activationDate"
                      value={module.activationDate.toISOString().split('T')[0]}
                      onChange={(e) => handleMasterModuleChange(moduleIndex, e)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={module.status}
                      onChange={(e) => handleMasterModuleChange(moduleIndex, e)}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="systems-section">
                <h3>Selected Systems</h3>
                <div className="checkbox-container">
                  {[
                    "Water Level Indicator",
                    "Diesel Level Indicator",
                    "Hot Axle Indicator",
                    "BC Pressure Indicator",
                    "BP Pressure Indicator",
                    "FP Pressure Indicator",
                    "Break Binding Indicator",
                    "Chain Pulling Indicator",
                    "FSDS Bypass Indicator",
                    "AC Monitoring System",
                    "Panic Button",
                    "Toilet Occupancy",
                  ].map((system, index) => (
                    <label key={index} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={module.selectedSystems.includes(system)}
                        onChange={() => handleCheckboxChange(moduleIndex, system)}
                      />
                      <span>{system}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="save-button" onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save Configuration'}
      </button>
      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <h2>Coach Records</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Coach Number</th>
              <th>Make</th>
              <th>Type</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCoaches.map((coach, index) => (
              <tr key={index}>
                <td>{coach.coach_number}</td>
                <td>{coach.make}</td>
                <td>{coach.type}</td>
                <td>{new Date(coach.created_at).toLocaleString()}</td>
                <td>{new Date(coach.updated_at).toLocaleString()}</td>
                <td>
                  <img
                    src={EditIcon}
                    alt="Edit"
                    className="action-icon"
                    onClick={() => handleEdit(coach)}
                  />
                  <img
                    src={DeleteIcon}
                    alt="Delete"
                    className="action-icon"
                    onClick={() => {
                      handleDelete(index);
                    }}
                  />
                  <img
                    src={ViewIcon}
                    alt="View"
                    className="action-icon"
                    onClick={() => handleView(coach)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Pagination.Prev 
            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} 
            style={{ marginRight: '10px' }} 
          />
          
          <span style={{ margin: '0 10px' }}>
            Prev Page {currentPage} of {totalPages}
          </span>
          
          <Pagination.Next 
            onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} 
            style={{ marginLeft: '10px' }} 
          />
        </div>
      </div>
      
      {/* Modal for editing coach */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coachData={currentCoach || {}}
        onSave={handleUpdate}
      />

      {/* Modal for viewing coach details */}
      <ViewCoach
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        coachData={currentCoach || {}}
      />

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default Coach;
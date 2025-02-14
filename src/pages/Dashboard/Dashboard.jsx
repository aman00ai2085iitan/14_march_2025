import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import TrainConfig from "../../assets/images/trainconfig.jpg";
import Alerts from "../../assets/images/alerts.jpg";
import Righttick from "../../assets/images/Righttick.jpg";
import Sensor from "../../assets/images/Sensoricon.jpg";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import ViewDetail from './ViewDetail'; // Import the ViewDetail component

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [waterLevelAlert, setWaterLevelAlert] = useState({});
  const [dieselAlert, setDieselAlert] = useState({});
  const [toast, setToast] = useState({ visible: false, message: "", color: "white" });
  const [selectedTrainNumber, setSelectedTrainNumber] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    {
      label: "Active Trains",
      value: 24,
      icon: <img src={TrainConfig} alt="Train Icon" className="train-icon" />,
    },
    {
      label: "New Alerts",
      value: 10,
      icon: <img src={Alerts} alt="Alerts Icon" className="alerts-icon" />,
    },
    {
      label: "Resolution Rate",
      value: "98%",
      icon: <img src={Righttick} alt="Resolution Icon" className="resolution-icon" />,
    },
    {
      label: "Active Users",
      value: 1284,
      icon: <img src={Sensor} alt="Users Icon" className="users-icon" />,
    },
  ];

  const trainData = [
    {
      trainNumber: "12459",
      trainName: "New Delhi - Amritsar Express",
      route: "New Delhi ➝ Amritsar",
      status: "Healthy",
      coaches: 17,
    },
    {
      trainNumber: "12903",
      trainName: "Golden Temple Mail",
      route: "Mumbai ➝ Ahmedabad",
      status: "Critical",
      coaches: 22,
    },
    {
      trainNumber: "12906",
      trainName: "Paschim Express",
      route: "Mumbai ➝ Surat",
      status: "Healthy",
      coaches: 22,
    },
    {
      trainNumber: "12910",
      trainName: "Garibrath Express",
      route: "Bandra Terminus ➝ Nizamuddin",
      status: "Warning",
      coaches: 22,
    },
    {
      trainNumber: "12125",
      trainName: "Pragti Express",
      route: "Mumbai ➝ Pune",
      status: "Healthy",
      coaches: 18,
    },
  ];

  const alerts = [
    { type: "AC Monitoring Alert", details: "Temperature high - 30°C", time: "Just now", color: "red" },
    { type: "Emergency Brake Alert", details: "Emergency brake applied", time: "Just now", color: "orange" },
    { type: "FP Pressure Alert", details: "Pressure malfunction detected", time: "10 mins ago", color: "red" },
    { type: "BP Pressure Alert", details: "Pressure leakage detected", time: "7 mins ago", color: "orange" },
    { type: "Hot Axle Alert", details: "High Axle temperature detected - 58°C", time: "3 mins ago", color: "orange" },
    { type: "Panic Button Alert", details: "Emergency initiated", time: "18 mins ago", color: "orange" },
  ];

  const handleViewDetails = (trainNumber) => {
    setSelectedTrainNumber(trainNumber);
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTrainNumber(null);
  };

  const filteredTrainData = trainData.filter((train) => {
    if (statusFilter === "all") return true;
    return train.status.toLowerCase() === statusFilter;
  }).filter((train) => {
    return train.trainNumber.includes(searchTerm) || train.trainName.includes(searchTerm);
  });

  // Google Maps configuration
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: 18.9647, // Latitude for Mumbai Central Railway Headquarters
    lng: 72.8258, // Longitude for Mumbai Central Railway Headquarters
  };

  // Color mapping for alert levels
  const alertColorMapping = {
    Critical: "red",
    Moderate: "yellow",
    Average: "orange",
    High: "green",
    Best: "violet",
  };

  // Function to generate random water level alert
  const generateRandomWaterLevelAlert = () => {
    const levels = [
      { level: "Critical", percentage: 5 },
      { level: "Moderate", percentage: 25 },
      { level: "Average", percentage: 50 },
      { level: "High", percentage: 80 },
      { level: "Best", percentage: 100 },
    ];
    const randomIndex = Math.floor(Math.random() * levels.length);
    return levels[randomIndex];
  };

  // Function to generate random diesel level alert
  const generateRandomDieselAlert = () => {
    const levels = [
      { level: "Critical", percentage: 5 },
      { level: "Moderate", percentage: 25 },
      { level: "Average", percentage: 50 },
      { level: "High", percentage: 70 },
      { level: "Best", percentage: 90 },
    ];
    const randomIndex = Math.floor(Math.random() * levels.length);
    return levels[randomIndex];
  };

  useEffect(() => {
    const updateWaterLevelAlert = () => {
      const newAlert = generateRandomWaterLevelAlert();
      setWaterLevelAlert({
        type: "WL1 Alert",
        details: `Water level ${newAlert.level} - ${newAlert.percentage}%`,
        time: "Just now",
        color: alertColorMapping[newAlert.level],
      });
      // Show toast notification for water level
      setToast({ visible: true, message: `Water level ${newAlert.level} - ${newAlert.percentage}%`, color: alertColorMapping[newAlert.level] });
    };

    const updateDieselAlert = () => {
      const newAlert = generateRandomDieselAlert();
      setDieselAlert({
        type: "DLI Alert",
        details: `Diesel level ${newAlert.level} - ${newAlert.percentage}%`,
        time: "Just now",
        color: alertColorMapping[newAlert.level],
      });
      // Show toast notification for diesel level
      setToast((prev) => ({
        visible: true,
        message: `Diesel Level -/Train No:12114 : ${newAlert.level} - ${newAlert.percentage}%`,
        
        color: alertColorMapping[newAlert.level],
      }));
    };

    updateWaterLevelAlert(); // Initial call
    updateDieselAlert(); // Initial call

    const interval = setInterval(() => {
      updateWaterLevelAlert();
      updateDieselAlert();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Hide toast notification after 3 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, message: "", color: "white" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Welcome, Kalpit Tiwari!</h1>
      </header>

      <div className="stats-section">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <p>{stat.label}</p>
            <h2>{stat.value.toLocaleString()}</h2>
          </div>
        ))}
      </div>

      <div className="train-status">
        <h2>Track Sensor Status by Train & Coach</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search trains..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="healthy">Healthy</option>
          </select>
        </div>

        <table className="train-table">
          <thead>
            <tr>
              <th>Train Number</th>
              <th>Train Name</th>
              <th>Route</th>
              <th>Status</th>
              <th>Coaches</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainData.map((train, index) => (
              <tr key={index}>
                <td>{train.trainNumber}</td>
                <td>{train.trainName}</td>
                <td>{train.route}</td>
                <td className={train.status.toLowerCase()}>{train.status}</td>
                <td>{train.coaches}</td>
                <td>
                  <button
                    className="details-button"
                    onClick={() => handleViewDetails(train.trainNumber)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="map-section">
        <h2>Mumbai Central Railway Headquarters</h2>
       <iframe
          src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d30186.646415708183!2d72.80552991932915!3d18.96099256205756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3be7cf557c589521%3A0xea3e72080a7f21c5!2sMumbai%20Central%20railway%20station%20building%2C%20Mumbai%20Central%20Railway%20Station%20Building%2C%20Mumbai%20Central%2C%20Mumbai%2C%20Maharashtra%20400008!3m2!1d18.969538999999997!2d72.819329!5e0!3m2!1sen!2sin!4v1739171511839!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="alerts-section">
        <h2>Active Alerts</h2>
        <div className="alerts-grid">
          {alerts.map((alert, index) => (
            <div key={index} className="alert-card" style={{ backgroundColor: alert.color }}>
              <h3>{alert.type}</h3>
              <p>{alert.details}</p>
              <span>{alert.time}</span>
            </div>
          ))}
          {/* Display the diesel alert with color coding */}
          <div className="alert-card" style={{ backgroundColor: dieselAlert.color }}>
            <h3>{dieselAlert.type}</h3>
            <p>{dieselAlert.details}</p>
            <span>{dieselAlert.time}</span>
          </div>
          {/* Display the random water level alert with color coding */}
          <div className="alert-card" style={{ backgroundColor: waterLevelAlert.color }}>
            <h3>{waterLevelAlert.type}</h3>
            <p>{waterLevelAlert.details}</p>
            <span>{waterLevelAlert.time}</span>
          </div>
        </div>
      </div>

      {/* Modal for Train Details */}
      {isModalOpen && (
        <ViewDetail trainNumber={selectedTrainNumber} onClose={closeModal} />
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className="toast-notification" style={{ backgroundColor: toast.color }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
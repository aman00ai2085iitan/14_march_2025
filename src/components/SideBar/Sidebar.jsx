import React, { useState } from "react";
import logo2 from "../../assets/images/logo2.jpg";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import setting from '../../assets/images/setting.jpg';
import reports from '../../assets/images/reports.jpg';

export default function Sidebar() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // State to track sidebar minimization
  const [isNightMode, setIsNightMode] = useState(false); // State to track night mode

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized); // Toggle the minimized state
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode); // Toggle the night mode state
  };

  return (
    <aside className={`sidebar ${isFullScreen ? 'fullscreen' : ''} ${isMinimized ? 'minimized' : ''} ${isNightMode ? 'night-mode' : ''}`}>
      {/* Logo Section */}
      {!isMinimized && (
        <div className="sidebar-logo">
          <img src={logo2} alt="PisolveLogo" className="logo-image" />
        </div>
      )}

      {/* Configurations Title */}
      <div className="sidebar-title">Configurations</div>

      {/* Button Container for Toggle Buttons */}
      <div className="button-container">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className={`fas ${isMinimized ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
        </button>

        <button className="sidebar-button" onClick={toggleFullScreen}>
          <i className={`fas ${isFullScreen ? 'fa-compress' : 'fa-expand'}`}></i>
        </button>

      </div>

    
   
       
 {/* Sidebar Menu Items */}
 <div className="sidebar-buttons">
        <Link to="/dashbaord">   
          <button className="sidebar-button" onClick={() => console.log("Dashboard Config clicked")}>
            <img src={setting} alt="Dashboard Config" className="sidebar-icon" />
            {!isMinimized && 'Dashboard '}
            
          </button>
        </Link>

        <Link to="/train">
          <button className="sidebar-button" onClick={() => console.log("Train Config clicked")}>
            <img src={setting} alt="Train Config" className="sidebar-icon" />
            {!isMinimized && 'Train Config'}
          </button>
        </Link>

        <Link to="/coach">
          <button className="sidebar-button" onClick={() => console.log("Coach Config clicked")}>
            <img src={setting} alt="Coach Config" className="sidebar-icon" />
            {!isMinimized && 'Coach Config'}
          </button>
        </Link>

        <Link to="/sensor">
          <button className="sidebar-button" onClick={() => console.log("Sensor Config clicked")}>
            <img src={setting} alt="Sensor Config" className="sidebar-icon" />
            {!isMinimized && 'Sensor Config'}
          </button>
        </Link>

        <Link to="/role"> 
          <button className="sidebar-button" onClick={() => console.log("Role Config clicked")}>
            <img src={setting} alt="Role Config" className="sidebar-icon" />
            {!isMinimized && 'Role Config'}
          </button>
        </Link>

        <button
          className="sidebar-button"
          onClick={() => console.log("Reports clicked")}
        >
          <img src={reports} alt="Logo" className="sidebar-icon" />
          {!isMinimized && 'Reports'}
        </button>

        <button className="sidebar-button" onClick={() => console.log("Settings clicked")}>
          <img src={setting} alt="Settings" className="sidebar-icon" />
          {!isMinimized && 'Settings'}
        </button>
      </div>
    </aside>
  );
}
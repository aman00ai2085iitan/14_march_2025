import React from "react";
import logo2 from "../../assets/images/logo2.jpg";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import setting from '../../assets/images/setting.jpg'
import Dashboard from '../../assets/images/Dashboard.jpg'
import reports from '../../assets/images/reports.jpg'
import Trainconfig from '../../assets/images/Trainconfig.jpg'
import { Target, Train } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <img src={logo2} alt="PisolveLogo" className="logo-image" />
      </div>

      {/* Configurations Title */}
      <div className="sidebar-title">Configurations</div>

      {/* Sidebar Menu Items */}
      <div className="sidebar-buttons">
        <button
          className="sidebar-button"
          onClick={() => console.log("Dashboard clicked")}
        >
        <img src={Dashboard} alt="Logo" className="sidebar-icon" />
  
            Dashboard
                </button>
       
                <Link to="/train">
  <button className="sidebar-button" onClick={() => console.log("Train Config clicked")}>
    <img src={setting} alt="Train Config" className="sidebar-icon" />
    Train Config
  </button>
</Link>

<Link to="/sensor">
  <button className="sidebar-button" onClick={() => console.log("Sensor Config clicked")}>
    <img src={setting} alt="Sensor Config" className="sidebar-icon" />
    Sensor Config
  </button>
</Link>

<Link to="/coach">
  <button className="sidebar-button" onClick={() => console.log("Coach Config clicked")}>
    <img src={setting} alt="Coach Config" className="sidebar-icon" />
    Coach Config
  </button>
</Link>


       <Link to="/role"> 
        <button
          className="sidebar-button"
          onClick={() => console.log("Role Config clicked")}
        >
        <img src={setting} alt="Logo" className="sidebar-icon" />
          Role Config
          
        </button>
        </Link>


        <button
          className="sidebar-button"
          onClick={() => console.log("Reports clicked")}
        >
         <img src={reports} alt="Logo" className="sidebar-icon" />
          Reports
         
        </button>
        <button
          className="sidebar-button"
          onClick={() => console.log("Settings clicked")}
        >
        <img src={setting} alt="Logo" className="sidebar-icon" />
          Settings
          
        </button>
      </div>
    </aside>
  );
}
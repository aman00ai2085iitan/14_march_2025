import React from "react";
import "./Header.css"; // CSS file for styling
import logo from "../../assets/images/logo3.jpg"; // Replace with your actual logo
import { Link } from "react-router-dom";
import AdminUser from "../../assets/images/AdminUser.png"
function Header() {
  return (
    <div className="header">
      {/* Logo */}
      <div className="header-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Navigation Links */}
      <nav className="header-nav">
        <Link to="/train">Train Configuration</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/settings">Settings</Link>
      </nav>

      {/* Header User Section */}
      <div className="header-user-section">
        {/* Notification Section */}
        <div className="notification-section">
          <button className="bell-icon-button" onClick={() => alert("Notification clicked")}>
            🔔
          </button>
        </div>

        {/* User Profile Section */}
        <div className="user-profile-section">
          <img
            src={AdminUser}
            alt="AdminUser"
            className="user-avatar"
          />
          <button className="user-name-button"
          onClick={()=>alert("Admin user button clicked")}>Admin User</button>
        </div>
      </div>
    </div>
  );
}

export default Header;

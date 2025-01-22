// Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../SideBar/Sidebar";

const Layout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

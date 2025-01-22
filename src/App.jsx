import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import LoginPage from "./components/Login/LoginPage";
import Train from "./pages/Train/Train";
import Layout from "./components/Layout.jsx/Layout";
import Role from "./pages/Role/Role";
import Dashboard from "./pages/Dashboard/Dashboard";
import Coach from "./pages/Coach/Coach"
import Sensor from "./pages/Sensor/Sensor";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Layout Wrapper */}
        <Route element={<Layout />}>
        
          <Route path="/train" element={<Train />} />
          <Route path="/sensor"element={<Sensor/>}/>
          <Route path="/coach"element={<Coach/>}/>
          <Route path="/role" element={<Role/>} />
        
  
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
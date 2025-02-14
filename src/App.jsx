import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import LoginPage from "./components/Login/LoginPage";
import Signup from "./components/Signup/Signup";
import Train from "./pages/Train/Train";
import Layout from "./components/Layout.jsx/Layout";
import Role from "./pages/Role/Role";
import Dashboard from "./pages/Dashboard/Dashboard";
import Coach from "./pages/Coach/Coach"
import Sensor from "./pages/Sensor/Sensor";
import NotFound from "./pages/notfound";
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Layout Wrapper */}
        <Route element={<Layout />}>
        <Route path="/dashbaord" element={<Dashboard />} />
          <Route path="/train" element={<Train />} />
          <Route path="/sensor"element={<Sensor/>}/>
          <Route path="/coach"element={<Coach/>}/>
          <Route path="/role" element={<Role/>} />
          <Route path="*" element={<NotFound/>} />
        
  
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
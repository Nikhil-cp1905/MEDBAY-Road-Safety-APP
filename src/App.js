import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Alert from "./Alert";
import NavigationMap from "./NavigationMap"; 
import EmergencyMap from "./EmergencyMap"; 
import ConfirmationPage from "./ConfirmationPage";
import Form from "./form";
import Home from "./Home";
import Helpform from "./helpform";
import Login from "./login";
import Profile from "./profile";
import Helplogin from "./helplogin";
import HelpProfile from "./helpprofile";
import axios from "axios";


function App() {
  const [alerts, setAlerts] = useState([
    { type: "Fire alert", distance: "7km", location: "Mello cafe\ntrs", icon: "🔥" },
    { type: "Medical alert", distance: "12km", location: "St. Joseph\ncollege", icon: "🚑" },
    { type: "Medical centre", distance: "2km", location: "SRM global\nhospital", icon: "🛡️" },
    { type: "Accident Alert", distance: "16km", location: "NH-34\nDIVIDER HIT", icon: "🚑" },
  ]);

  const handleAlertSubmit = (updatedAlert) => {
    // Use EmailJS or similar service to send alert notification
    // Update the list of alerts
    setAlerts(alerts.map(alert => alert.location === updatedAlert.location ? updatedAlert : alert));
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<Alert alerts={alerts} onSubmit={handleAlertSubmit} />} 
          />
          <Route path="/navigation" element={<NavigationMap />} />
          <Route path="/emergency" element={<EmergencyMap />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
         <Route path="/form" element={<Form />} />
         <Route path="/home" element={<Home />} />
         <Route path="/helpform" element={<Helpform />} />
 <Route path="/profile/:aadhaar_number" element={<Profile />} />
 <Route path="/login" element={<Login />} />
<Route path="/helplogin" element={<Helplogin />} />
<Route path="/helpprofile" element={<HelpProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

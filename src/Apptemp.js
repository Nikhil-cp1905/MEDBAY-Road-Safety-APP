import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import EmergencyMap from './EmergencyMap';
import NavigationMap from './NavigationMap';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EmergencyMap />} />
          <Route path="/navigation" element={<NavigationMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

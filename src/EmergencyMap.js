import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EmergencyMap.css';

const EmergencyMap = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(coords);
          initializeMap(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Chennai coordinates if location access is denied
          initializeMap({ lat: 12.9073, lng: 80.1538 });
        }
      );
    }
  }, []);

  const initializeMap = (coords) => {
    const mapInstance = L.map('emergency-map').setView([coords.lat, coords.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance);

    // Add marker for the accident location
    L.marker([coords.lat, coords.lng])
      .addTo(mapInstance)
      .bindPopup('Accident Location')
      .openPopup();
  };

  const handleRequestAccept = () => {
    if (!currentLocation) return;

    // Navigate to NavigationMap with hospital coordinates and accident location
    navigate('/navigation', {
      state: {
        startCoords: currentLocation, // Accident location
        endCoords: { lat: 12.9816, lng: 77.5846 }, // Example hospital coordinates
      },
    });
  };

  return (
    <div className="emergency-container">
      <h1 className="medbay-title">MEDBAY</h1>
      <div className="map-container">
        <h2 className="map-title">Map View</h2>
        <div id="emergency-map"></div>
      </div>

      {/* Victim details */}
      <div className="details-container">
        <div className="details-section">
          <h3>VICTIM</h3>
          <p><strong>Pavithra</strong></p>
          <p>9999510009</p>
          <p>Female</p>
          <p>Blood- B+ve</p>
          <p>pavinikki@gmail.com</p>
        </div>
        <div className="details-section">
          <h3>VEHICLE</h3>
          <p><strong>MG HECTOR</strong></p>
          <p>AIRBAGS-6</p>
          <p>SPEED - 130KM</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="action-buttons">
        <button className="action-btn accept" onClick={handleRequestAccept}>
          REQUEST ACCEPT?
        </button>
        <button className="action-btn condition">CONDITION</button>
        <button className="action-btn direction">
          <span>12.9073 N</span>
          <br />
          <span>80.1538 E</span>
        </button>
      </div>
    </div>
  );
};

export default EmergencyMap;


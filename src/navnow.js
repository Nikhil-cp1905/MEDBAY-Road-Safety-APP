import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './NavigationMap.css';
import axios from 'axios';

const NavigationMap = () => {
  const location = useLocation();
  const { state } = location;
  const hospitalCoords = state?.hospitalCoords || { lat: 12.9816, lng: 77.5846 };
  const accidentCoords = state?.accidentCoords || { lat: 12.9073, lng: 80.1538 };
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [routeCoords, setRouteCoords] = useState([]);
  const [status, setStatus] = useState('Loading path...');
  const [errorMessage, setErrorMessage] = useState('');
  const [pathNodes, setPathNodes] = useState([]); // Store path node coordinates

  useEffect(() => {
    const mapElement = document.getElementById('navigation-map');
    if (!mapElement) {
      console.error("Map container element not found");
      return;
    }

    let mapInstance;
    try {
      if (!mapElement._leaflet_id) {
        mapInstance = L.map('navigation-map').setView([hospitalCoords.lat, hospitalCoords.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(mapInstance);
      }
    } catch (error) {
      console.error("Error initializing the map:", error);
    }

    const getPath = async () => {
      try {
        const response = await axios.get(`/api/path?hospitalLat=${hospitalCoords.lat}&hospitalLng=${hospitalCoords.lng}&accidentLat=${accidentCoords.lat}&accidentLng=${accidentCoords.lng}`);
        const pathCoords = response.data.path; // Access the 'path' property from the response
        const distance = response.data.distance;  // Access distance from the response
        const time = response.data.time;        // Access time from the response

        if (pathCoords && Array.isArray(pathCoords)) {
          console.log("Path Coordinates:", pathCoords); // Log to console
            setPathNodes(pathCoords); // Set the path nodes

          setDistance(distance.toFixed(2));
          setTime(time.toFixed(0));
          setStatus('Path displayed');
          setRouteCoords(pathCoords);
        } else {
          setStatus('Invalid path data received');
          setErrorMessage('Path data is not an array.');
          console.error("Invalid path data:", pathCoords);
        }

      } catch (error) {
        console.error("Error getting path:", error);
        setStatus('Error getting path');
        setErrorMessage(error.response?.data?.error || 'Unknown error');
      }
    };

    getPath();

    L.marker([hospitalCoords.lat, hospitalCoords.lng])
      .addTo(mapInstance)
      .bindPopup('Start: Hospital')
      .openPopup();

    L.marker([accidentCoords.lat, accidentCoords.lng])
      .addTo(mapInstance)
      .bindPopup('End: Accident Location');


    if (routeCoords.length > 0) {
      L.polyline(routeCoords, { color: 'green', weight: 5 }).addTo(mapInstance);
    }
        // Add markers for each node in the path
    pathNodes.forEach(coord => {
      L.marker(coord).addTo(mapInstance).bindPopup("Path Node").openPopup();
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [hospitalCoords, accidentCoords, routeCoords, pathNodes]); // Add pathNodes to the dependency array


  return (
        <div className="navigation-container">
      <h1 className="medbay-title">Navigation</h1>
      <div id="navigation-map" className="map"></div>
      <div className="info-container">
        <h2 className="destination-title">TIME TILL DESTINATION</h2>
        <div className="metrics">
          <p className="distance">{distance} km</p>
          <p className="time">{time} mins</p>
        </div>
        <p className="path-type">FASTEST AND SHORTEST PATH</p>
        <p className="alert-message">--alerted nearby cars to vacate--</p>
        <p className="status">{status}</p>
        {errorMessage && <p className="error-message">Error: {errorMessage}</p>}
        <div className="notification-buttons">
          {/* Notification buttons */}
        </div>
        <div className="destination-status">
          {/* Destination status */}
        </div>
      </div>
    </div>

  );
};

export default NavigationMap;

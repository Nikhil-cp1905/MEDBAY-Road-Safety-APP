import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GpsComponent = ({ setStartCoords }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const successHandler = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setStartCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const errorHandler = (error) => {
      setError(`Error getting geolocation data: ${error.message}`);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  }, [setStartCoords]);

  return (
    <div>
      <h2>GPS Data</h2>
      {error && <p>{error}</p>}
      {location && (
        <ul>
          <li>Latitude: {location.latitude}</li>
          <li>Longitude: {location.longitude}</li>
        </ul>
      )}
    </div>
  );
};

const MapComponent = ({ startCoords, pathCoords }) => {
  const mapRef = useRef(null); // Ref for map container
  const mapInstance = useRef(null); // Ref for map instance

  useEffect(() => {
    // Initialize the map only once
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([startCoords.lat, startCoords.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);
    }
  }, [startCoords]);

  useEffect(() => {
    if (mapInstance.current && pathCoords.length > 0) {
      // Clear previous paths if any
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Polyline) {
          mapInstance.current.removeLayer(layer);
        }
      });

      // Log pathCoords to check their validity
      console.log('Path Coordinates:', pathCoords);

      // Mark start location and plot path if valid pathCoords
      if (pathCoords && pathCoords.length > 0) {
        L.marker([startCoords.lat, startCoords.lng]).addTo(mapInstance.current).bindPopup('Start Location');
        L.polyline(pathCoords, { color: 'blue' }).addTo(mapInstance.current);
      } else {
        console.error('Invalid or empty path coordinates');
      }
    }
  }, [pathCoords, startCoords]);

  return <div ref={mapRef} id="map" style={{ height: '500px' }} />;
};

const App = () => {
  const [startCoords, setStartCoords] = useState({ lat: 0, lng: 0 });
  const [pathCoords, setPathCoords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPathData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/path', {
          params: {
            startLat: startCoords.lat,
            startLng: startCoords.lng,
            endLat: 12.8752256,  // Replace with crash location or dynamic goal location
            endLng: 77.7198208, // Replace with crash location or dynamic goal location
          },
        });

        if (response.data && response.data.length > 0) {
          console.log('Received path data:', response.data);
          setPathCoords(response.data);
        } else {
          setError('No path data available');
        }
      } catch (error) {
        console.error('Error fetching path data:', error);
        setError('Error fetching path data');
      }
    };

    if (startCoords.lat && startCoords.lng) {
      fetchPathData();
    }
  }, [startCoords]);

  return (
    <div>
      <h1>Pathfinding and Crash Location Visualization</h1>
      <GpsComponent setStartCoords={setStartCoords} />
      {error && <p>{error}</p>}
      <MapComponent startCoords={startCoords} pathCoords={pathCoords} />
    </div>
  );
};

export default App;



import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EmergencyMap.css';

const EmergencyMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Markers data array
  const markersData = [
    { id: 1, lat: 12.9718666, lng: 77.5947086 },
  { id: 2, lat: 12.9711293, lng: 77.5972453 },
  { id: 3, lat: 12.9712107, lng: 77.5977577 },
  { id: 4, lat: 12.9711156, lng: 77.5979786 },
  { id: 5, lat: 12.9709406, lng: 77.5986007 },
  { id: 6, lat: 12.9707439, lng: 77.5992959 },
  { id: 7, lat: 12.9703215, lng: 77.6007346 },
  { id: 8, lat: 12.968, lng: 77.6003351 },
  { id: 9, lat: 12.9694188, lng: 77.6024023 },
  { id: 10, lat: 12.9709016, lng: 77.6048071 },
  { id: 11, lat: 12.9714821, lng: 77.6060749 },
  { id: 12, lat: 12.9712951, lng: 77.6069817 },
  { id: 13, lat: 12.9700672, lng: 77.6065559 },
  { id: 14, lat: 12.9697089, lng: 77.6064587 },
  { id: 15, lat: 12.9692413, lng: 77.6063318 },
  { id: 16, lat: 12.9687603, lng: 77.6062306 },
  { id: 17, lat: 12.9684729, lng: 77.6062026 },
  { id: 18, lat: 12.9682994, lng: 77.6062235 },
  { id: 19, lat: 12.9678954, lng: 77.6063762 },
  { id: 20, lat: 12.9662452, lng: 77.6068229 },
  { id: 21, lat: 12.9579884, lng: 77.6060574 },
  { id: 22, lat: 12.9548804, lng: 77.6055294 },
  { id: 23, lat: 12.9527737, lng: 77.6052629 },
  { id: 24, lat: 12.9519389, lng: 77.6051887 },
  { id: 25, lat: 12.9507334, lng: 77.6055577 },
  { id: 26, lat: 12.9497453, lng: 77.605956 },
  { id: 27, lat: 12.9448752, lng: 77.607426 },
  { id: 28, lat: 12.9440457, lng: 77.6076406 },
  { id: 29, lat: 12.9440003, lng: 77.6076548 },
  { id: 30, lat: 12.943729, lng: 77.6077356 },
  { id: 31, lat: 12.9432486, lng: 77.6078802 },
  { id: 32, lat: 12.943057, lng: 77.607935 },
  { id: 33, lat: 12.9419843, lng: 77.608325 },
  { id: 34, lat: 12.9411862, lng: 77.6087485 },
  { id: 35, lat: 12.9387817, lng: 77.6100247 },
  { id: 36, lat: 12.9369075, lng: 77.6110193 },
  { id: 37, lat: 12.9344551, lng: 77.6123658 },
  { id: 38, lat: 12.934367, lng: 77.6124105 },
  { id: 39, lat: 12.9324651, lng: 77.6134413 },
  { id: 40, lat: 12.9325038, lng: 77.6135402 },
  { id: 41, lat: 12.9313406, lng: 77.6140453 },
  { id: 42, lat: 12.9298694, lng: 77.6149477 },
  { id: 43, lat: 12.9295715, lng: 77.6151658 },
  { id: 44, lat: 12.9262516, lng: 77.6171742 }, 
    { id: 45, lat: 12.9260375, lng: 77.6172816 },
    { id: 46, lat: 12.9234501, lng: 77.6188855 },
    { id: 47, lat: 12.9232773, lng: 77.6189926 },
    { id: 48, lat: 12.9227458, lng: 77.6193219 },
    { id: 49, lat: 12.9212099, lng: 77.6202961 },
    { id: 50, lat: 12.9210808, lng: 77.620374 },
    { id: 51, lat: 12.9200598, lng: 77.6209846 },
    { id: 52, lat: 12.9194475, lng: 77.6214053 },
    { id: 53, lat: 12.918505, lng: 77.6221845 },
    { id: 54, lat: 12.9178046, lng: 77.6243804 },
    { id: 55, lat: 12.9176822, lng: 77.6243834 },
    { id: 56, lat: 12.917375, lng: 77.6267832 },
    { id: 57, lat: 12.9167973, lng: 77.629253 },
    { id: 58, lat: 12.9165803, lng: 77.6322725 },
    { id: 59, lat: 12.9165763, lng: 77.632322 },
    { id: 60, lat: 12.9163386, lng: 77.6350673 },
    { id: 61, lat: 12.9175032, lng: 77.6410422 },
    { id: 62, lat: 12.9198785, lng: 77.6430337 },
    { id: 63, lat: 12.9221021, lng: 77.6449327 },
    { id: 64, lat: 12.9240607, lng: 77.6473465 },
    { id: 65, lat: 12.9241578, lng: 77.6475553 },
    { id: 66, lat: 12.9237933, lng: 77.6543918 },
    { id: 67, lat: 12.921278, lng: 77.6629056 },
    { id: 68, lat: 12.9211189, lng: 77.6635896 },
    { id: 69, lat: 12.9208114, lng: 77.6648463 },
    { id: 70, lat: 12.9209421, lng: 77.6656134 },
    { id: 71, lat: 12.9211461, lng: 77.6659924 },
    { id: 72, lat: 12.9212738, lng: 77.6662615 },
    { id: 73, lat: 12.9248645, lng: 77.6741134 },
    { id: 74, lat: 12.9276205, lng: 77.679761 },
    { id: 75, lat: 12.928109, lng: 77.6807901 },
    { id: 76, lat: 12.9285307, lng: 77.6817242 },
    { id: 77, lat: 12.9297494, lng: 77.6844068 },
    { id: 78, lat: 12.9298529, lng: 77.6846223 },
    { id: 79, lat: 12.9301214, lng: 77.6851397 },
    { id: 80, lat: 12.9299821, lng: 77.6852486 },
    { id: 81, lat: 12.928198, lng: 77.6859811 },
    { id: 82, lat: 12.9281928, lng: 77.6860847 },
    { id: 83, lat: 12.9282696, lng: 77.6866357 },
    { id: 84, lat: 12.9282395, lng: 77.6868802 }
  ];

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -20],
  });

  useEffect(() => {
    // Only initialize if map doesn't exist
    if (!mapInstanceRef.current && mapRef.current) {
      // Calculate center coordinates
      const centerCoords = {
        lat: (Math.max(...markersData.map(m => m.lat)) + Math.min(...markersData.map(m => m.lat))) / 2,
        lng: (Math.max(...markersData.map(m => m.lng)) + Math.min(...markersData.map(m => m.lng))) / 2
      };

      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView([centerCoords.lat, centerCoords.lng], 12);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add polyline connecting all points
      const polylinePoints = markersData.map(marker => [marker.lat, marker.lng]);
      L.polyline(polylinePoints, { color: 'blue', weight: 2, opacity: 0.6 })
        .addTo(mapInstanceRef.current);

      // Add markers
      markersData.forEach((marker) => {
        L.marker([marker.lat, marker.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`Node ${marker.id}`)
          .on('mouseover', function(e) {
            this.openPopup();
          })
          .on('mouseout', function(e) {
            this.closePopup();
          });
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array since we want this to run once

  const handleRequestAccept = () => {
    navigate('/navigation', {
      state: {
        startCoords: markersData[0],
        endCoords: markersData[markersData.length - 1],
      },
    });
  };

  return (
    <div className="emergency-container">
<header>
<button className="back-btn" onClick={() => navigate("/home")}>🏠</button>
      <h1 className="medbay-title">MEDBAY</h1>
</header>
      <div className="map-container">
        <h2 className="map-title">Map View</h2>
        <div ref={mapRef} id="emergency-map" style={{ height: "500px", width: "100%" }}></div>
      </div>
      <h2 className="destination-title">TIME TILL DESTINATION</h2>
      <div className="metrics">
        <p className="distance">2 km</p>
        <p className="time">10 mins</p>
      </div>
      <p className="path-type">FASTEST AND SHORTEST PATH</p>
      <p className="alert-message">--alerted nearby cars to vacate--</p>
      <div className="notification-buttons">{/* Notification buttons */}</div>
      <div className="destination-status">{/* Destination status */}</div>
    </div>

  );
};

export default EmergencyMap;

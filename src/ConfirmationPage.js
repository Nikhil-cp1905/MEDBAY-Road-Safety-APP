import React from "react";
import { useNavigate } from 'react-router-dom';

const ConfirmationPage = ({ requestDetails }) => {
  // Example data (replace or fetch this dynamically in real scenarios)
  const details = requestDetails || {
    userName: "John Doe",
    ambulanceNumber: "AMB-1234",
    estimatedTime: "12 mins",
    driverName: "Rahul Kumar",
    driverPhone: "+91 98765 43210",
    status: "Accepted",
    hospitalName: "City Hospital",
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f0f8ff", minHeight: "100vh", padding: "20px" }}>
      <div style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}>
        <h1 style={{ color: "#1e90ff", marginBottom: "10px" }}>MedBay</h1>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>Ambulance Request Confirmed</h2>
        <p style={{ color: "#4a4a4a", marginBottom: "30px" }}>
          Your request has been accepted. Here's the confirmation:
        </p>
        <div style={{ textAlign: "left", lineHeight: "1.8em", fontSize: "16px" }}>
          <p><strong>Name:</strong> {details.userName}</p>
          <p><strong>Ambulance Number:</strong> {details.ambulanceNumber}</p>
          <p><strong>Estimated Arrival Time:</strong> {details.estimatedTime}</p>
          <p><strong>Driver Name:</strong> {details.driverName}</p>
          <p><strong>Driver Phone:</strong> {details.driverPhone}</p>
          <p><strong>Status:</strong> <span style={{ color: "green", fontWeight: "bold" }}>{details.status}</span></p>
          <p><strong>Hospital:</strong> {details.hospitalName}</p>
        </div>
        <button
          style={{
            marginTop: "30px",
            padding: "15px 30px",
            background: "#1e90ff",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => alert("Please stay safe!")}
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;

import React, { useState } from "react";
import "./Alert.css";
import { FiBell } from "react-icons/fi";
import ModalComponent from "./ModalComponent";
import axios from "axios";
import { sendAlertEmail } from "./emailService"; // Import EmailJS service
import { useNavigate } from "react-router-dom";

const initialAlerts = [
  { type: "Fire alert", distance: "7km", location: "Mello cafe\ntrs", icon: "🔥" },
  { type: "Medical alert", distance: "12km", location: "St. joseph\ncollege", icon: "🚑" },
  { type: "Medical centre", distance: "2km", location: "SRM global\nhospital", icon: "🛡️" },
  { type: "Accident Alert", distance: "16km", location: "NH-34\nDIVIDER HIT", icon: "🚑" },
];

const Alert = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isAddAlert, setIsAddAlert] = useState(false);

  // Open the modal to update or add alerts
  const handleAlertClick = (alert) => {
    setCurrentAlert(alert);
    setIsAddAlert(false);
    setIsModalOpen(true);
  };

  const handleAddAlertClick = () => {
    setCurrentAlert({ type: "", location: "", details: "", recipientEmail: "" });
    setIsAddAlert(true);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentAlert(null);
  };

  // Form submission: sends data to backend and sends an email via EmailJS
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const alertDetails = {
      type: form.type.value,
      location: form.location.value,
      details: form.details.value,
      recipientEmail: "cppavithra05@gmail.com", // Placeholder for the recipient email
    };

    try {
      // Sending data to the backend (SQL database)
      await axios.post("http://localhost:5000/send_alert", alertDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Send email via EmailJS
      await sendAlertEmail(alertDetails);

      if (isAddAlert) {
        setAlerts([...alerts, alertDetails]); // Add new alert
      } else {
        setAlerts(alerts.map((alert) => (alert.location === currentAlert.location ? alertDetails : alert)));
      }

      handleModalClose();
    } catch (error) {
      console.error("Failed to send alert:", error);
      alert("There was an error processing the alert.");
    }
  };

  return (
    <div className="alert-container">
      <header>
        <button className="back-btn" onClick={() => navigate("/home")}>🏠</button>
        <h1>Alerts</h1>
        <FiBell className="bell-icon" />
      </header>

      <div className="alert-list">
        {alerts.map((alert, index) => (
          <div key={index} className="alert-card" onClick={() => handleAlertClick(alert)}>
            <div className="alert-info">
              <h2>{alert.type}</h2>
              <p>{alert.distance}</p>
              <p className="location">{alert.location}</p>
            </div>
            <span className="alert-icon">{alert.icon}</span>
          </div>
        ))}
      </div>

      <button className="add-alert-btn" onClick={handleAddAlertClick}>
        ADD ALERTS <span className="plus-icon">+</span>
      </button>

      {isModalOpen && (
        <ModalComponent isOpen={isModalOpen} onRequestClose={handleModalClose}>
          <form onSubmit={handleFormSubmit}>
            <h2>{isAddAlert ? "Add New Alert" : "Update Alert"}</h2>
            <label>
              Alert Type:
              <input type="text" name="type" defaultValue={currentAlert?.type} required />
            </label>
            <label>
              Location:
              <input type="text" name="location" defaultValue={currentAlert?.location} required />
            </label>
            <label>
              Details:
              <textarea name="details" defaultValue={currentAlert?.details} required />
            </label>
            <button type="submit">Submit</button>
          </form>
        </ModalComponent>
      )}
    </div>
  );
};

export default Alert;


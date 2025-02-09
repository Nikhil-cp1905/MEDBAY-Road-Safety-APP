import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { sendAlertEmail } from "./emailService";  // Ensure this is set up correctly
import ModalComponent from "./ModalComponent"; // Adjust the path if needed
import { FiBell } from "react-icons/fi";

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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const alertDetails = {
      type: form.type.value,
      location: form.location.value,
      details: form.details.value,
      recipientEmail: "cppavithra05@gmail.com",  // or any dynamic email
    };

    try {
      // Send alert data to the backend to store it in the database
      const response = await axios.post("http://localhost:5000/send_alert", alertDetails, {
        headers: {
          'Content-Type': 'application/json', // Make sure the content type is correct
        },
      });

      // If the alert is successfully saved in the database
      if (response.status === 201) {
        // Send the email via EmailJS
        await sendAlertEmail(alertDetails);
        alert("Alert sent successfully!");

        // Update the alert list in the UI
        if (isAddAlert) {
          setAlerts([...alerts, alertDetails]);  // Add new alert
        } else {
          setAlerts(alerts.map((alert) => (alert.location === currentAlert.location ? alertDetails : alert)));
        }

        handleModalClose();
      }
    } catch (error) {
      console.error("Error submitting alert:", error);
      alert("Error registering. Please try again.");
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


import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import ambulance from "./images/ambulance.png"; // Ensure this image exists in your project

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="image-container">
        <img src={ambulance} alt="ambulance" className="home-image" />
      </div>

      <h1 className="title">MEDBAY</h1>
      <p className="subtitle">SWIFT AID ALWAYS</p>

      <div className="button-container">
        {/* Login Section */}
        <p className="section-title">LOGIN</p>
        <div className="split-button">
          <button className="split-btn left" onClick={() => navigate("/login")}>
            AS USER
          </button>
          <button className="split-btn right" onClick={() => navigate("/helplogin")}>
            AS HELP
          </button>
        </div>

        {/* Sign In Section */}
        <p className="section-title">SIGN IN</p>
        <div className="split-button">
          <button className="split-btn left" onClick={() => navigate("/form")}>
            AS USER
          </button>
          <button className="split-btn right" onClick={() => navigate("/helpform")}>
            AS HELP
          </button>
        </div>

        <button className="btn emergency-btn" onClick={() => navigate("/")}>
          EMERGENCY
        </button>
      </div>
    </div>
  );
};

export default Home;


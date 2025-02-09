import React, { useState } from "react";
import axios from "axios";
import "./login.css"; // Ensure to create this CSS file for styling
import { FaUser, FaLock } from "react-icons/fa";
import header from "./images/header.png";
import home from "./images/home.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [aadhaar_number, setAadhaarNumber] = useState("");
  const [error, setError] = useState("");
   const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;

    if (!aadhaarRegex.test(aadhaar_number)) {
      setError("Invalid Aadhaar number format.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        aadhaar_number,
      });

      if (response.data.user) {
        window.location.href = `/profile/${aadhaar_number}`;
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
          <header>
        <button className="back-btn" onClick={() => navigate("/home")}>🏠︎</button>
<h1>   </h1>     
 </header>

 <img src={header} alt="Decorative Plants" className="header-image" />
        <h1 className="title">Sign Up</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Enter Aadhaar Number"
              value={aadhaar_number}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input type="password" placeholder="Password" required />
          </div>
          <button type="submit" className="submit-btn">Next</button>
        </form>
        {error && <p className="error-message">{error}</p>}
         <p className="footer-text">New here? <a href="/form">Sign up</a></p>
      </div>
    </div>
  );
};

export default LoginPage;


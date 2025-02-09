import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { FaUser, FaLock } from "react-icons/fa";
import header from "./images/header.png"; // Ensure this image exists in your project

const HelpLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const handleChange = (e) => {  // Add a handleChange function
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!emailRegex.test(formData.email)) {
            setError("Invalid email format.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/helplogin", formData);

            if (response.data.success) {
                navigate(`/helpprofile?email=${encodeURIComponent(formData.email)}`); // Use formData.email
            } else {
                setError("Invalid email or password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error("Login Error:", err); // Log the error for debugging
            if (err.response) {
                console.error("Response Data:", err.response.data);
                console.error("Response Status:", err.response.status);
                console.error("Response Headers:", err.response.headers);
            } else if (err.request) {
                console.error("Request:", err.request);
            }
        }
    };   
 
  return (
    <div className="login-container">
      <div className="login-card">
          <header>
        <button className="back-btn" onClick={() => navigate("/home")}>🏠︎</button>
<h1>   </h1>
      </header>

        <img src={header} alt="Header" className="header-image" />
        <h1 className="title">Help Login</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="footer-text">New here? <a href="/helpform">Sign up</a></p>
      </div>
    </div>
  );
};

export default HelpLogin;


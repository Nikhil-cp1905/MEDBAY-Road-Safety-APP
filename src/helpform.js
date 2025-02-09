import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./form.css";
import helpImage from "./images/help.png"; // Ensure this image exists in your project

const HelpSignup = () => {
  const navigate = useNavigate(); // For redirection after signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    locationplace: "",
    helptype: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Regular expressions for validation
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const passwordMinLength = 6;

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(emailRegex)) newErrors.email = "Enter a valid email address";
    if (!formData.phone.match(phoneRegex)) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!formData.locationplace.trim()) newErrors.locationplace = "Location is required";
    if (!formData.helptype) newErrors.helptype = "Please select a help type";
    if (formData.password.length < passwordMinLength) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate form before proceeding
  if (!validateForm()) return;

  try {
    // Make the POST request with the form data
    const response = await axios.post("http://localhost:5000/helpform", formData, {
      headers: {
        'Content-Type': 'application/json',  // Ensure this is set for JSON payload
      },
    });

    // Check if the response is successful and has a message
    if (response.status === 201) {
      alert(response.data.message);  // Show success message
      navigate("/helplogin");  // Redirect to login page after successful registration
    } else {
      setErrors({ general: "Error registering. Please try again." });  // Set general error if status is not 201
    }
  } catch (error) {
    // Handle errors here
    console.error("Error during registration:", error);  // Log the error for debugging

    // If the error has a response (meaning it's from the backend), show that error message
    if (error.response) {
      setErrors({ general: error.response.data.error || "Error registering. Please try again." });
    } else {
      // If no response from backend, show a network error
      setErrors({ general: "Network error. Please try again." });
    }
  }
};


  return (
    <div className="form-container">
      <h1 className="form-title">MEDBAY - Help Registration</h1>
      <div className="image-container">
        <img src={helpImage} alt="Help Logo" className="help-image" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label><b>Name</b></label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="input-group">
          <label><b>Email</b></label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input-group">
          <label><b>Phone</b></label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>

        <div className="input-group">
          <label><b>Location</b></label>
          <input type="text" name="locationplace" value={formData.locationplace} onChange={handleChange} />
          {errors.locationplace && <p className="error">{errors.locationplace}</p>}
        </div>

        <div className="input-group">
  <label><b>Help-Type</b></label>
  <input 
    type="text" 
    name="helptype" 
    value={formData.helptype} 
    onChange={handleChange} 
    placeholder="Enter Help Type" 
  />
  {errors.helptype && <p className="error">{errors.helptype}</p>}
</div>

        <div className="input-group">
          <label><b>Password</b></label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {errors.general && <p className="error">{errors.general}</p>}

        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
};

export default HelpSignup;


import React, { useState } from "react";
import axios from "axios";
import "./form.css"; // Ensure this file is properly linked

const FormPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ecnumber: "",
    ecuser: "",
    vehicle_number: "",
    aadhaar_number: "",
    bloodtype: "",
    gender: "",
    dob: "",
    medical_info: "",
  });

  const [errors, setErrors] = useState({});

  // Regular expressions for validation
  const phoneRegex = /^[6-9]\d{9}$/;
  const aadhaarRegex = /^\d{12}$/;
  const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
  const bloodTypeRegex = /^(A|B|AB|O)[+-]$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(emailRegex)) newErrors.email = "Invalid email format";
    if (!formData.phone.match(phoneRegex)) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!formData.ecnumber.match(phoneRegex)) newErrors.ecnumber = "Enter a valid 10-digit emergency contact";
    if (!formData.ecuser.trim()) newErrors.ecuser = "Emergency contact name is required";
    if (!formData.vehicle_number.match(vehicleRegex)) newErrors.vehicle_number = "Invalid vehicle number (e.g., MH12AB1234)";
    if (!formData.aadhaar_number.match(aadhaarRegex)) newErrors.aadhaar_number = "Invalid Aadhaar number (12 digits)";
    if (!formData.bloodtype.match(bloodTypeRegex)) newErrors.bloodtype = "Invalid blood type (A+, B-, O+)";
    if (!formData.gender) newErrors.gender = "Please select a gender";
    if (!formData.dob) newErrors.dob = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:5000/submit", formData);
      alert(response.data.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        ecnumber: "",
        ecuser: "",
        vehicle_number: "",
        aadhaar_number: "",
        bloodtype: "",
        gender: "",
        dob: "",
        medical_info: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">MEDBAY</h1>
      <h1>USER-SIGNUP</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="input-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input-group">
          <label>Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>

        <div className="input-group">
          <label>Emergency Contact Number</label>
          <input type="tel" name="ecnumber" value={formData.ecnumber} onChange={handleChange} />
          {errors.ecnumber && <p className="error">{errors.ecnumber}</p>}
        </div>

        <div className="input-group">
          <label>Emergency Contact Name</label>
          <input type="text" name="ecuser" value={formData.ecuser} onChange={handleChange} />
          {errors.ecuser && <p className="error">{errors.ecuser}</p>}
        </div>

        <div className="input-group">
          <label>Vehicle Number</label>
          <input type="text" name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} />
          {errors.vehicle_number && <p className="error">{errors.vehicle_number}</p>}
        </div>

        <div className="input-group">
          <label>Aadhaar Number</label>
          <input type="text" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} />
          {errors.aadhaar_number && <p className="error">{errors.aadhaar_number}</p>}
        </div>

        <div className="input-group">
          <label>Blood Type</label>
          <input type="text" name="bloodtype" value={formData.bloodtype} onChange={handleChange} />
          {errors.bloodtype && <p className="error">{errors.bloodtype}</p>}
        </div>

        <div className="input-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>

        <div className="input-group">
          <label>Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          {errors.dob && <p className="error">{errors.dob}</p>}
        </div>

        <div className="input-group">
          <label>Additional Medical Info</label>
          <textarea name="medical_info" value={formData.medical_info} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default FormPage;


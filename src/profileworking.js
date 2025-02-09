import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './profile.css';
import profile from "./images/profile.png";


const ProfilePage = () => {
  const { aadhaar_number } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/profile/${aadhaar_number}`);
        setProfile(response.data.profile);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("User not found. Please check the Aadhaar number.");
        } else {
          setError("An error occurred while fetching the profile.");
        }
      }
    };

    fetchProfile();
  }, [aadhaar_number]);

  const handleEmergency = () => {
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/form");
  };

  return (
    <div className="profile-card">
      {/* Profile Image */}
      <div className="profile-image">
        <img
          src={profile}
          alt="Profile"
          className="profile-img"
        />
      </div>

      {/* MEDBAY Text */}
      <div className="medbay-text">
        <h2>MEDBAY</h2>
      </div>

      {/* Buttons Section */}
      <div className="profile-buttons">
        <button onClick={handleEmergency} className="profile-button">
          Emergency
        </button>
        <button onClick={handleEditProfile} className="profile-button">
          Edit Profile
        </button>
      </div>

      {/* Profile Details */}
      <div className="profile-bottom">
        {error && <p className="error">{error}</p>}
        {profile ? (
          <div className="profile-bottom-details">
            <div className="profile-bottom-field">
              <label>Name</label>
              <p>{profile.name}</p>
            </div>
            <div className="profile-bottom-field">
              <label>Email</label>
              <p>{profile.email}</p>
            </div>
            <div className="profile-bottom-field">
              <label>Phone</label>
              <p>{profile.phone}</p>
            </div>
            <div className="profile-bottom-field">
              <label>Vehicle Number</label>
              <p>{profile.vehicle_number}</p>
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;


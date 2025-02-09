import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const HelpProfile = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); // Get email from query params
  const [profile, setProfile] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");
  console.log("🚀 HelpProfile ID:", email);
 const encodedEmail = encodeURIComponent(email);
console.log("🔍 Encoded Email:", encodedEmail); 
  useEffect(() => {
    const fetchProfileAndAlerts = async () => {
      try {
        if (!email) {
          setError("No email provided.");
          return;
        }

        // Step 1: Fetch Help User Profile using Email
        const profileResponse = await axios.get(`http://127.0.0.1:5000/helpprofile?email=${encodeURIComponent(email)}`);
        const userProfile = profileResponse.data.help_profile;
        setProfile(userProfile);

        // Step 2: Fetch Alerts Matching Help Type
        if (userProfile && userProfile.helptype) {
                    const alertsResponse = await axios.get(`http://127.0.0.1:5000/alerts?type=${encodeURIComponent(userProfile.helptype)}`);
console.log("The helptype is:",userProfile.helptype );                    
setAlerts(alertsResponse.data.alerts);
                } else if (userProfile === null) {
                    setError("Error loading profile. Please try again.");
                }
      } catch (err) {
        setError("Error fetching data. Please try again.");
      }
    };

    fetchProfileAndAlerts();
  }, [email]);

return (
  <div className="profile-container">
    <h1 className="profile-title">Help User Profile</h1>
    
    {error && <p className="error-message">{error}</p>}

    {profile ? (
      <div className="profile-card">
        <h2>{profile.name}</h2>
        <p><strong>Help Type:</strong> {profile.helptype}</p>
      </div>
    ) : (
      !error && <p>Loading profile...</p>  // Show loading message if there's no error and no profile
    )}

    <h2>Matching Alerts</h2>
    <div className="alert-list">
      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <div key={index} className="alert-card">
            <h3>{alert.type}</h3>
            <p><strong>Location:</strong> {alert.location}</p>
            <p><strong>Details:</strong> {alert.details}</p>
          </div>
        ))
      ) : (
        <p>No alerts available for this help type.</p>  // Show when no alerts are found
      )}
    </div>
  </div>

);
};
export default HelpProfile;


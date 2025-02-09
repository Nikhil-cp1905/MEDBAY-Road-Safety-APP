import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const HelpProfile = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const [profile, setProfile] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchProfileAndAlerts = async () => {
            setLoading(true); // Set loading to true
            try {
                if (!email) {
                    setError("No email provided.");
                    return;
                }

                const profileResponse = await axios.get(`http://127.0.0.1:5000/helpprofile?email=${encodeURIComponent(email)}`);
                const userProfile = profileResponse.data.help_profile;
                setProfile(userProfile);

                if (userProfile && userProfile.helptype) {
                    const alertsResponse = await axios.get(`http://127.0.0.1:5000/alerts?type=${encodeURIComponent(userProfile.helptype)}`);
                    setAlerts(alertsResponse.data.alerts);
                } else if (userProfile === null) {
                    setError("Error loading profile. Please try again.");
                }

            } catch (err) {
                setError("Error fetching data. Please try again.");
                console.error("Profile/Alerts Error:", err); // Log the error
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        fetchProfileAndAlerts();
        const checkForAlert = async () => {
            const controller = new AbortController(); // Create an AbortController
            const signal = controller.signal; // Get the signal

            try {
                const response = await axios.get("http://127.0.0.1:5000/alertsautomatic", { signal }); // Pass the signal to axios
                if (response.data === 1 || response.data === "1") {
                    alert("Emergency Alert Detected!");
                    // Or redirect: navigate("/alertauto");
                }
            } catch (error) {
                if (error.name === 'AbortError') {  // Check if it's an abort error
                    console.log('Fetch aborted'); // Log if the fetch was aborted
                    return; // Don't set error or display anything if AbortError
                }
                console.error("Alert Check Error:", error);
            }
        };

        const intervalId = setInterval(checkForAlert, 5000);

        return () => {
            clearInterval(intervalId); // Clear the interval
            // Abort any pending requests:
            const controller = new AbortController();
            controller.abort();
        }; // Clean up on unmount
    }, [email, navigate]);// Add navigate to the dependency array

    return (
        <div className="profile-container">
            <h1 className="profile-title">Help User Profile</h1>

            {error && <p className="error-message">{error}</p>}

            {loading ? ( // Show loading message while data is fetching
                <p>Loading profile...</p>
            ) : profile ? (
                <div className="profile-card">
                    <h2>{profile.name}</h2>
                    <p><strong>Help Type:</strong> {profile.helptype}</p>
                    {/* ... other profile details */}
                </div>
            ) : null} {/* Don't display anything if no profile and no error */}

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
                    <p>No alerts available for this help type.</p>
                )}
            </div>
        </div>
    );
};

export default HelpProfile;

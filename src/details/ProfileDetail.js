import React, { useEffect, useState } from 'react';
import { useAuth } from '../authentication/AuthContext'; // Assuming you have an auth context
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const ProfileDetail = () => {
  const { authState } = useAuth(); // Access the auth context to get the token
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch the profile details when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://multivendorapp-user-service.onrender.com/profile', {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setProfileData(response.data); // Assuming the response contains the profile data
      } catch (error) {
        setError(error.response ? error.response.data.message : 'Failed to load profile');
      }
    };

    fetchProfile();
  }, [authState.token]);

  // Render loading or error messages if necessary
  if (!profileData && !error) {
    return <p>Loading profile...</p>;
  }

  const handleEditProfile = () => {
    // Navigate to the '/create-profile' route when the edit button is clicked
    navigate('/edit-profile');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-black">Profile Details</h2>

      {/* Show error message if there's an error */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Profile details display */}
      {profileData && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-medium text-lg text-black">Name:</h3>
            <p className="text-lg text-black">{profileData.name}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-medium text-lg text-black">Gender:</h3>
            <p className="text-lg text-black">{profileData.gender}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-medium text-lg text-black">Street:</h3>
            <p className="text-lg text-black">{profileData.street}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-medium text-lg text-black">Postal Code:</h3>
            <p className="text-lg text-black">{profileData.postalCode}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-medium text-lg text-black">City:</h3>
            <p className="text-lg text-black">{profileData.city}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-medium text-lg text-black">Country:</h3>
            <p className="text-lg text-black">{profileData.country}</p>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-4">
            <button
              onClick={handleEditProfile}
              className="w-full p-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;

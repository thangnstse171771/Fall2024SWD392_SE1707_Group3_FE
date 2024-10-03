import React, { useState } from "react";
import "./PondProfile.scss";

const PondProfileInfo = () => {
  const [profile, setProfile] = useState({
    pondName: "Pond 1",
    pondSize: "10m",
    pondImage: "https://cdn11.bigcommerce.com/s-c81ee/product_images/uploaded_images/ridersuperone-1-.jpg",
    pondDepth: "4m",
    pondVolume: "10k Litters",
    pondNumber: "3",
    pondCapacity: "5",
  });

  // To handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // To handle the form submission (like saving the updated profile)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", profile);
    // Implement save logic here (e.g., API call to update profile)
  };

  return (
    <div className="pond-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group pond-name-edit">
          <label>Pond Name:</label>
          <input
            type="text"
            name="name"
            value={profile.pondName}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group pond-size-edit">
          <label>Pond Size:</label>
          <input
            type="text"
            name="name"
            value={profile.pondSize}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group pond-image-edit">
          <label>Pond Image:</label>
          <input
            type="text"
            name="name"
            value={profile.pondImage}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group pond-depth-edit">
          <label>Pond Depth:</label>
          <input
            type="text"
            name="name"
            value={profile.pondDepth}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group pond-volume-edit">
          <label>Pond Volume:</label>
          <input
            type="text"
            name="name"
            value={profile.pondVolume}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group pond-number-edit">
          <label>Pond Number:</label>
          <input
            type="text"
            name="name"
            value={profile.pondNumber}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group pond-capacity-edit">
          <label>Pond Capacity:</label>
          <input
            type="text"
            name="name"
            value={profile.pondCapacity}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="submit-pond-edit-button">
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default PondProfileInfo;

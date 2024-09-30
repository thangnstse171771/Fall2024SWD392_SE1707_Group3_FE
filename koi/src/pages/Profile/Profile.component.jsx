import React, { useState } from "react";
import "./Profile.scss";
import profileAvatar from "../../assets/profile_avatar.png";
import KoiBackground from "../../assets/Koi_Profile_Background.jpg";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "Son Tung",
    surname: "MTP",
    email: "email@example.com",
    phone: "+84 912345678",
    nationalCode: "",
    dateOfBirth: "",
    city: "",
    country: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("editProfile");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "editProfile":
        return (
          <div className="form-section">
            <h3>Edit Profile</h3>
            {Object.keys(userInfo).map((key) => (
              <div className="form-group" key={key}>
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  type={key === "dateOfBirth" ? "date" : "text"}
                  name={key}
                  value={userInfo[key]}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            ))}
            <div className="profile-footer">
              {isEditing ? (
                <button onClick={handleEdit} className="save-btn">
                  Save
                </button>
              ) : (
                <button onClick={handleEdit} className="edit-btn">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        );
      case "notifications":
        return <h3>Notifications Section</h3>;
      case "choosePlan":
        return <h3>Choose Plan Section</h3>;
      case "passwordSecurity":
        return <h3>Password & Security Section</h3>;
      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <img src={KoiBackground} alt="KoiBackground" className="koi-background" />
      <div className="profile-content">
        <div className="sidebar">
          <div className="profile-pic">
            <img src={profileAvatar} alt="User Avatar" />
          </div>
          <ul>
            <li onClick={() => setActiveSection("editProfile")}>
              Edit Profile
            </li>
            <li onClick={() => setActiveSection("notifications")}>
              Notifications
            </li>
            <li onClick={() => setActiveSection("choosePlan")}>Choose Plan</li>
            <li onClick={() => setActiveSection("passwordSecurity")}>
              Password & Security
            </li>
          </ul>
        </div>
        <div className="form-area">
          <h2>
            {userInfo.firstName} {userInfo.surname}
          </h2>
          <p>Your account is ready, you can now apply for advice.</p>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;

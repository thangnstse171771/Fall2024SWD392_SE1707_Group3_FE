import React, { useState, useEffect } from "react";
import "./Profile.scss";
import profileAvatar from "../../assets/profile_avatar.png";
import KoiBackground from "../../assets/Koi_Profile_Background.jpg";
import api from "../../config/axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgress, Alert } from "@mui/material";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    userPhoneNumber: "",
    userAddress: "",
    userStatus: "",
    usertype: "",
    image: null,
  });

  const [userId, setUserId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    userPhoneNumber: "",
    userAddress: "",
    image: "",
  });
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserId(parsedUserInfo.userId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      api
        .get(`/api/user/${userId}`)
        .then((response) => {
          const data = response.data;
          setUserInfo({
            username: data.username,
            email: data.email,
            userPhoneNumber: data.userPhoneNumber,
            userAddress: data.userAddress,
            userStatus: data.userStatus,
            usertype: data.usertype,
            image: data.image || profileAvatar,
          });
          setUpdatedInfo({
            userPhoneNumber: data.userPhoneNumber,
            userAddress: data.userAddress,
            image: data.image || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = async () => {
    if (!file) {
      setImageUploadError("Please select an image.");
      return;
    }

    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Image upload failed");
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUpdatedInfo((prevState) => ({
            ...prevState,
            image: downloadURL,
          }));
          setImageUploadProgress(null);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/api/user/update/${userId}`,
        updatedInfo,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setUserInfo((prevState) => ({
          ...prevState,
          userPhoneNumber: updatedInfo.userPhoneNumber,
          userAddress: updatedInfo.userAddress,
          image: updatedInfo.image || prevState.image,
        }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="profile-container">
      <img src={KoiBackground} alt="KoiBackground" className="koi-background" />
      <div className="profile-content">
        <div className="sidebar">
          <div className="profile-pic">
            <img src={userInfo.image} alt="User Avatar" />
          </div>
          <ul>
            <li>View Profile</li>
          </ul>
        </div>

        <div className="form-area">
          <h2>{userInfo.username}</h2>
          <p>User Type: {userInfo.usertype}</p>
          <p>Email: {userInfo.email}</p>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="userPhoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="userPhoneNumber"
                  name="userPhoneNumber"
                  value={updatedInfo.userPhoneNumber || ""}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="userAddress">Address</label>
                <input
                  type="text"
                  id="userAddress"
                  name="userAddress"
                  value={updatedInfo.userAddress || ""}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                />
              </div>
              <div className="upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="upload-input"
                />
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={imageUploadProgress}
                  className="upload-button"
                >
                  {imageUploadProgress ? (
                    <div className="upload-progress">
                      <CircularProgress
                        variant="determinate"
                        value={imageUploadProgress}
                      />
                    </div>
                  ) : (
                    "Upload Image"
                  )}
                </button>
              </div>

              {imageUploadError && (
                <div className="error-message">
                  <Alert message={imageUploadError} type="error" showIcon />
                </div>
              )}

              {updatedInfo.image && (
                <div className="image-preview">
                  <img src={updatedInfo.image} alt="Profile" />
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p>
                <strong>Phone:</strong> {userInfo.userPhoneNumber}
              </p>
              <p>
                <strong>Address:</strong> {userInfo.userAddress}
              </p>
              <p>
                <strong>Status:</strong> {userInfo.userStatus}
              </p>
              <div className="edit-btn">
                <button onClick={() => setIsEditing(true)} className="btn-edit">
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./PondProfile.scss";
import api from "../../config/axios";

const PondProfileInfo = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState({
    pondName: "",
    pondImage: "",
    pondSize: "",
    pondDepth: "",
    pondVolume: "",
    pondDrains: "",
    pondAeroCapacity: "",
    maxCapacity: "",
    remainingCapacity: "",
    currentKoiCount: "",
  });

  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("token");

  const fetchPondDetails = async () => {
    try {
      const response = await api.get(`/api/pond/getPondById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pondData = response.data.data;

      setProfile({
        pondName: pondData.pondName,
        pondImage: pondData.pondImage,
        pondSize: pondData.pondSize,
        pondDepth: pondData.pondDepth,
        pondVolume: pondData.pondVolume,
        pondDrains: pondData.pondDrains,
        pondAeroCapacity: pondData.pondAeroCapacity,
        maxCapacity: pondData.maxCapacity,
        remainingCapacity: pondData.remainingCapacity,
        currentKoiCount: pondData.currentKoiCount,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pond data.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(
        `/api/pond/updatePond/${id}`,
        {
          pondName: profile.pondName,
          pondImage: profile.pondImage,
          pondSize: parseFloat(profile.pondSize),
          pondDepth: parseFloat(profile.pondDepth),
          pondVolume: parseFloat(profile.pondVolume),
          pondDrains: parseInt(profile.pondDrains),
          pondAeroCapacity: parseInt(profile.pondAeroCapacity),
          maxCapacity: parseInt(profile.maxCapacity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Pond updated successfully!");
        fetchPondDetails();
      } else {
        throw new Error("Failed to update pond.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update pond.");
      toast.error("Failed to update pond.");
    }
  };

  useEffect(() => {
    fetchPondDetails();
  }, []);

  return (
    <div className="pond-profile-info">
      {error ? (
        <div>
          <h3>Error: {error}</h3>
        </div>
      ) : (
        <>
          <img
            className="koi-profile-img"
            src={
              profile.pondImage ||
              "https://cdn11.bigcommerce.com/s-c81ee/product_images/uploaded_images/ridersuperone-1-.jpg"
            }
            alt={profile.pondName}
          />
          <div className="pond-form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group pond-name-edit">
                <label>Pond Name:</label>
                <input
                  type="text"
                  name="pondName"
                  value={profile.pondName}
                  onChange={handleInputChange}
                  placeholder="Pond Name"
                />
              </div>
              <div className="form-group pond-image-edit">
                <label>Pond Image:</label>
                <input
                  type="text"
                  name="pondImage"
                  value={profile.pondImage}
                  onChange={handleInputChange}
                  placeholder="Pond Image"
                />
              </div>
              <div className="form-group pond-size-edit">
                <label>Pond Size (m²):</label>
                <input
                  type="number"
                  name="pondSize"
                  value={profile.pondSize}
                  onChange={handleInputChange}
                  placeholder="Pond Size"
                />
              </div>
              <div className="form-group pond-depth-edit">
                <label>Pond Depth (m):</label>
                <input
                  type="number"
                  name="pondDepth"
                  value={profile.pondDepth}
                  onChange={handleInputChange}
                  placeholder="Pond Depth"
                />
              </div>
              <div className="form-group pond-volume-edit">
                <label>Pond Volume (m³):</label>
                <input
                  type="number"
                  name="pondVolume"
                  value={profile.pondVolume}
                  onChange={handleInputChange}
                  placeholder="Pond Volume"
                />
              </div>
              <div className="form-group pond-drains-edit">
                <label>Pond Drains:</label>
                <input
                  type="number"
                  name="pondDrains"
                  value={profile.pondDrains}
                  onChange={handleInputChange}
                  placeholder="Pond Drains"
                />
              </div>
              <div className="form-group pond-capacity-edit">
                <label>Pond Aero Capacity (m³/hour):</label>
                <input
                  type="number"
                  name="pondAeroCapacity"
                  value={profile.pondAeroCapacity}
                  onChange={handleInputChange}
                  placeholder="Pond Aero Capacity"
                />
              </div>
              <div className="submit-pond-edit-button">
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default PondProfileInfo;

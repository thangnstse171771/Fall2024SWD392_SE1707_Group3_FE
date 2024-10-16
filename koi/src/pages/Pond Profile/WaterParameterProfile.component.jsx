import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";
import "./WaterParameterProfile.scss";

const WaterParameterProfile = () => {
  const { id } = useParams();
  const [parameterProfile, setParameterProfile] = useState({});
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("token");

  const fetchWaterParameterById = async () => {
    setError(null);

    try {
      const response = await api.get(
        `/api/waterPara/pond/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setParameterProfile(response.data);
    } catch (error) {
      setError("Failed to fetch ponds.");
      console.error("Error fetching ponds:", error);
    }
  };

  useEffect(() => {
    fetchWaterParameterById();
  }, []);

  return (
    <div>
      <table className="water-parameter-profile-table">
        <thead className="water-parameter-profile-table-head">
          <tr>
            <th>Temperature (°C)</th>
            <th>Salt Level (%)</th>
            <th>Ph Level (mg/L)</th>
            <th>Oxygen Level (mg/L)</th>
            <th>Nitrite (mg/L)</th>
            <th>Nitrate (mg/L)</th>
            <th>Phosphate (mg/L)</th>
          </tr>
        </thead>
        <tbody className="water-parameter-profile-table-body">
          <tr>
            <th>{parameterProfile.temperature}</th>
            <th>{parameterProfile.pondSaltLevel}</th>
            <th>{parameterProfile.pondPHLevel}</th>
            <th>{parameterProfile.pondOxygenLevel}</th>
            <th>{parameterProfile.pondNitrite}</th>
            <th>{parameterProfile.pondNitrate}</th>
            <th>{parameterProfile.pondPhosphate}</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WaterParameterProfile;

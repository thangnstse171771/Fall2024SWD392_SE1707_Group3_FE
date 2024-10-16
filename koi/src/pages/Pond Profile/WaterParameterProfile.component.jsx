import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";
import "./WaterParameterProfile.scss";
import AddWaterParameterProfile from "./AddWaterParameterProfile.component";
import { toast } from "react-toastify";

const WaterParameterProfile = () => {
  const { id } = useParams();
  const [parameterProfile, setParameterProfile] = useState({});
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addParameter, setAddParameter] = useState({
    pondId: id,
    temperature: "",
    pondSaltLevel: "",
    pondPHLevel: "",
    pondOxygenLevel: "",
    pondNitrite: "",
    pondNitrate: "",
    pondPhosphate: "",
  });

  const showPopup = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setAddParameter({
      pondId: id,
      temperature: "",
      pondSaltLevel: "",
      pondPHLevel: "",
      pondOxygenLevel: "",
      pondNitrite: "",
      pondNitrate: "",
      pondPhosphate: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddParameter({
      ...addParameter,
      [name]: value,
    });
  };

  const fetchWaterParameterById = async () => {
    setError(null);

    try {
      const response = await api.get(`/api/waterPara/pond/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParameterProfile(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch water parameter."
      );
      console.error("Error fetching ponds:", error);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      await api.post(
        "/api/waterPara/createWaterParameter",
        {
          pondId: id,
          temperature: parseFloat(values.temperature),
          pondSaltLevel: parseFloat(values.pondSaltLevel),
          pondPHLevel: parseFloat(values.pondPHLevel),
          pondOxygenLevel: parseFloat(values.pondOxygenLevel),
          pondNitrite: parseFloat(values.pondNitrite),
          pondNitrate: parseFloat(values.pondNitrate),
          pondPhosphate: parseFloat(values.pondPhosphate),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOpen(false); // Close modal after successful submission
      toast.success("Parameter Created Successfully!");
      fetchWaterParameterById(); // Refresh water parameters
    } catch (error) {
      console.error("Error creating water parameter:", error);
      setError("Failed to create water parameter.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterParameterById();
  }, []);

  return (
    <div>
      {error ? (
        <div>
          <h3>{error}</h3>
          <button onClick={showPopup} className="add-pond-button">
            Add
          </button>
          <AddWaterParameterProfile
            open={open}
            onSubmit={handleSubmit}
            handleCancel={handleCancel}
            handleInputChange={handleInputChange}
            addParameter={addParameter}
            loading={loading}
          />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default WaterParameterProfile;

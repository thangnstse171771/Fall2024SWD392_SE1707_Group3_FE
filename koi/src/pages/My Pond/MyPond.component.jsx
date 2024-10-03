import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MyPond.scss";

import { Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddPondPopup from "./AddPondPopup.component";
import api from "../../config/axios";

function MyPond() {
  const [pond1Data, setPond1Data] = useState([]);
  const [open, setOpen] = useState(false);
  const [pondData, setPondData] = useState({
    pondName: "",
    pondImage: "",
    pondSize: "",
    pondDepth: "",
    pondVolume: "",
    pondDrains: "",
    pondAeroCapacity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const showPopup = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setPondData({
      pondName: "",
      pondImage: "",
      pondSize: "",
      pondDepth: "",
      pondVolume: "",
      pondDrains: "",
      pondAeroCapacity: "",
    });
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPondData({
      ...pondData,
      [name]: value,
    });
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = sessionStorage.getItem("token"); // Retrieve token from sessionStorage

    try {
      const response = await api.post(
        "/api/pond/createPond",
        {
          pondName: values.pondName,
          pondImage: values.pondImage,
          pondSize: parseFloat(values.pondSize),
          pondDepth: parseFloat(values.pondDepth),
          pondVolume: parseFloat(values.pondVolume),
          pondDrains: parseInt(values.pondDrains),
          pondAeroCapacity: parseInt(values.pondAeroCapacity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Pond Created Successfully");
        // Optionally, fetch updated pond data or add the new pond to state
      } else {
        throw new Error("Failed to create pond.");
      }

      // Reset pond data after successful submission
      handleCancel();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create pond. Please try again."
      );
      console.error("Error creating pond:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPond1Data = async () => {
      try {
        const response = await fetch(
          "https://66fa93b3afc569e13a9c472e.mockapi.io/api/KoiLake/Lake"
        );
        const data = await response.json();
        setPond1Data(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPond1Data();
  }, []);

  return (
    <div className="my-pond-page">
      <div className="my-pond-page-header">
        <div>
          <h1>Ponds</h1>
        </div>
        <div>
          <button onClick={showPopup} className="add-pond-button">
            Add Pond
          </button>
          <AddPondPopup
            open={open}
            onSubmit={handleSubmit}
            handleCancel={handleCancel}
            pondData={pondData}
            handleInputChange={handleInputChange}
            loading={loading}
          />
        </div>
      </div>
      <div className="my-pond-page-body">
        <table className="pond-table">
          <thead className="pond-table-head">
            <tr>
              <th>Pond Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="pond-table-body">
            {pond1Data.map((pond) => (
              <tr key={pond.id}>
                <td>{pond.pondName}</td>
                <td className="lake-action-buttons">
                  <Link to='/pond-profile'>
                    <Button
                      size="large"
                      className="edit-lake-button"
                      icon={<EditOutlined />}
                    />
                  </Link>
                  <Button
                    size="large"
                    className="delete-lake-button"
                    icon={<DeleteOutlined />}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyPond;

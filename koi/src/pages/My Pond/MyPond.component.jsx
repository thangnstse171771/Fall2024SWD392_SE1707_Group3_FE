import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MyPond.scss";

import { Button, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddPondPopup from "./AddPondPopup.component";
import api from "../../config/axios";
import { toast } from "react-toastify";

function MyPond() {
  const token = sessionStorage.getItem("token");
  const [pondList, setPondList] = useState([]);
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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Pond Created Successfully!");
        setSuccess("Pond Created Successfully");
        fetchPondList();
      } else {
        throw new Error("Failed to create pond.");
      }
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

  const fetchPondList = async () => {
    setError(null);

    try {
      const response = await api.get("/api/pond/getAllPondsByUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPondList(response.data.data);
    } catch (error) {
      setError("Failed to fetch ponds.");
      console.error("Error fetching ponds:", error);
    }
  };

  const handleDelete = async (pondId) => {
    try {
      await api.delete(`/api/pond/deletePondByOwner/${pondId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPondList();
      toast.success("Pond Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting pond:", error);
    }
  };

  const handleDeleteConfirmation = (pondId) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this pond?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => handleDelete(pondId),
    });
  };

  useEffect(() => {
    fetchPondList();
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
            {pondList.length > 0 ? (
              pondList.map((pond) => (
                <tr key={pond.id}>
                  <td>{pond.pondName}</td>
                  <td className="lake-action-buttons">
                    <Link to="/pond-profile">
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
                      onClick={() => handleDeleteConfirmation(pond.pondId)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No ponds found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyPond;

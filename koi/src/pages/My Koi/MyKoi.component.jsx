import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Avatar, Card, Pagination, Input } from "antd";
import AddKoiFishPopup from "./AddKoiFishPopup.component";
import api from "../../config/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MyKoi.scss";

const { Meta } = Card;

const MyKoi = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [koiData, setKoiData] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoiData = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await api.get("/api/koi/getAllKoiByUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const activeKoi = response.data.data.filter(
            (koi) => koi.status === "active"
          );
          setKoiData(activeKoi);
        }
      } catch (error) {
        console.error("Error fetching Koi data:", error);
      }
    };

    const fetchPondData = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await api.get("/api/pond/getAllPondsByUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) setPonds(response.data.data);
      } catch (error) {
        console.error("Error fetching pond data:", error);
      }
    };

    fetchKoiData();
    fetchPondData();
  }, []);

  const showPopup = () => setOpen(true);
  const handleCancel = () => setOpen(false);

  const handleDelete = async (fishId) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.put(
        `/api/koi/deleteKoiByUser/${fishId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setKoiData(koiData.filter((koi) => koi.fishId !== fishId));
        toast.success("Koi fish deleted successfully.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteConfirmation = (fishId) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this Koi fish?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => handleDelete(fishId),
    });
  };

  const handleSubmit = async (newKoi) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(
        "/api/koi/addKoi",
        { ...newKoi },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        setKoiData([...koiData, { id: response.data.id, ...newKoi }]);
        setOpen(false);
        toast.success("Koi fish added successfully.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredKoi = koiData.filter((koi) =>
    koi.koiName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastKoi = currentPage * itemsPerPage;
  const currentKoi = filteredKoi.slice(
    indexOfLastKoi - itemsPerPage,
    indexOfLastKoi
  );

  return (
    <div className="koi-container">
      <ToastContainer />
      <div className="my-fish-page-header">
        <h1>Koi Fish Collection</h1>
        <button onClick={showPopup} className="add-koi-button">
          Add Koi Fish
        </button>
      </div>
      <AddKoiFishPopup
        open={open}
        onSubmit={handleSubmit}
        handleCancel={handleCancel}
        ponds={ponds}
      />
      <div className="koi-search">
        <Input
          type="text"
          placeholder="Search for Koi..."
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="koi-grid">
        {currentKoi.length === 0 ? (
          <p>You need to add pond before add koi</p>
        ) : (
          currentKoi.map((koi) => (
            <Card
              key={koi.fishId}
              className="koi-card"
              cover={
                <img
                  className="koi-card-image"
                  alt={koi.koiName}
                  src={koi.koiImage}
                />
              }
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => navigate(`/manage-koi/my-koi/${koi.fishId}`)}
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDeleteConfirmation(koi.fishId)}
                />,
              ]}
            >
              <Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                }
                title={koi.koiName}
                description={`Gender: ${koi.koiGender}, Breed: ${koi.koiBreed}`}
              />
            </Card>
          ))
        )}
      </div>
      {filteredKoi.length > 0 && (
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={filteredKoi.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default MyKoi;

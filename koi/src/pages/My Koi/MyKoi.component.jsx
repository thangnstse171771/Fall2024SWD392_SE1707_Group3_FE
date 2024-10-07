import React, { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Avatar, Card, Pagination, Input } from "antd";
import AddKoiFishPopup from "./AddKoiFishPopup.component";
import api from "../../config/axios";
import "./MyKoi.scss";

const { Meta } = Card;

const MyKoi = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [koiData, setKoiData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchKoiData = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const response = await api.get("/api/koi/getAllKoi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setKoiData(response.data.data);
        } else {
          console.error("Failed to fetch Koi data.");
        }
      } catch (error) {
        console.error("Error fetching Koi data:", error);
      }
    };

    fetchKoiData();
  }, []);

  const showPopup = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDelete = async (fishId) => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await api.delete(`/api/koi/deleteKoi/${fishId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedKoiData = koiData.filter((koi) => koi.fishId !== fishId);
        setKoiData(updatedKoiData);
        console.log("Koi fish deleted successfully.");
      } else {
        console.error("Failed to delete Koi.");
      }
    } catch (error) {
      console.error("Error deleting Koi:", error);
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
        {
          koiName: newKoi.koiName,
          koiImage: newKoi.koiImage,
          koiGender: newKoi.koiGender,
          koiBreed: newKoi.koiBreed,
          koiOrigin: newKoi.koiOrigin,
          price: newKoi.price,
          currentPondId: newKoi.currentPondId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const addedKoi = { id: response.data.id, ...newKoi };
        setKoiData([...koiData, addedKoi]);
        setOpen(false);
      } else {
        throw new Error("Failed to add Koi.");
      }
    } catch (error) {
      console.error("Error adding Koi:", error);
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
  const indexOfFirstKoi = indexOfLastKoi - itemsPerPage;
  const currentKoi = filteredKoi.slice(indexOfFirstKoi, indexOfLastKoi);

  return (
    <div className="koi-container">
      <div className="my-fish-page-header">
        <h1>Koi Fish</h1>
        <button onClick={showPopup} className="add-koi-button">
          Add Koi Fish
        </button>
      </div>
      <AddKoiFishPopup
        open={open}
        onSubmit={handleSubmit}
        handleCancel={handleCancel}
      />

      <div className="koi-search">
        <Input
          type="text"
          placeholder="Tìm kiếm cá koi..."
          onChange={handleSearch}
        />
      </div>

      <div className="koi-grid">
        {currentKoi.map((koi) => (
          <Card
            key={koi.fishId}
            className="koi-card"
            cover={<img alt={koi.koiName} src={koi.koiImage} />}
            actions={[
              <EditOutlined key="edit" />,
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
              description={`Gender: ${koi.koiGender}, Breed ID: ${koi.koiBreed}, Origin: ${koi.koiOrigin}, Price: $${koi.price}`}
            />
          </Card>
        ))}
      </div>

      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={filteredKoi.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
    </div>
  );
};

export default MyKoi;

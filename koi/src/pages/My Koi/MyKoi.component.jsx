import React, { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, Card, Pagination, Input } from "antd";
import AddKoiFishPopup from "./AddKoiFishPopup.component";
import api from "../../config/axios"; // Ensure your axios setup is correct
import "./MyKoi.scss";

const { Meta } = Card;

const MyKoi = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [koiData, setKoiData] = useState([
    {
      id: 1,
      koiName: "Golden Dragon",
      koiImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzcBtmj3RHFskdPjhXC6Fn3E7Cvh4N1v9yBw&s",
      koiGender: "Male",
      koiBreed: 1,
      koiOrigin: 12.5,
      price: 100,
    },
    {
      id: 2,
      koiName: "Silver Shimmer",
      koiImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzcBtmj3RHFskdPjhXC6Fn3E7Cvh4N1v9yBw&s",
      koiGender: "Female",
      koiBreed: 2,
      koiOrigin: 15.0,
      price: 150,
    },
    {
      id: 3,
      koiName: "Emerald Jewel",
      koiImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzcBtmj3RHFskdPjhXC6Fn3E7Cvh4N1v9yBw&s",
      koiGender: "Male",
      koiBreed: 1,
      koiOrigin: 10.0,
      price: 120,
    },
    {
      id: 4,
      koiName: "Mystic Blue",
      koiImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzcBtmj3RHFskdPjhXC6Fn3E7Cvh4N1v9yBw&s",
      koiGender: "Female",
      koiBreed: 3,
      koiOrigin: 8.5,
      price: 80,
    },
    {
      id: 5,
      koiName: "Crimson Beauty",
      koiImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzcBtmj3RHFskdPjhXC6Fn3E7Cvh4N1v9yBw&s",
      koiGender: "Male",
      koiBreed: 2,
      koiOrigin: 9.5,
      price: 90,
    },
    {
      id: 6,
      koiName: "Crimson Beauty",
      koiImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzcBtmj3RHFskdPjhXC6Fn3E7Cvh4N1v9yBw&s",
      koiGender: "Male",
      koiBreed: 2,
      koiOrigin: 9.5,
      price: 90,
    },
    {
      id: 7,
      koiName: "Crimson Beauty",
      koiImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzcBtmj3RHFskdPjhXC6Fn3E7Cvh4N1v9yBw&s",
      koiGender: "Male",
      koiBreed: 2,
      koiOrigin: 9.5,
      price: 90,
    },
  ]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showPopup = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = async (newKoi) => {
    const token = sessionStorage.getItem("token"); // Retrieve token from sessionStorage

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
        const addedKoi = { id: response.data.id, ...newKoi }; // Assume the API returns the new koi ID
        setKoiData([...koiData, addedKoi]);
        setOpen(false);
      } else {
        throw new Error("Failed to add Koi.");
      }
    } catch (error) {
      console.error("Error adding Koi:", error);
      // Handle error as needed (e.g., show a notification)
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
            key={koi.id}
            className="koi-card"
            cover={<img alt={koi.koiName} src={koi.koiImage} />}
            actions={[
              <EditOutlined key="edit" />,
              <DeleteOutlined key="delete" />,
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

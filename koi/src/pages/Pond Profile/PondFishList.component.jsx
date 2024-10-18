import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { Modal, Avatar, Card, Pagination, Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import "./PondFishList.scss";

const { Meta } = Card;

const PondFishList = () => {
  const token = sessionStorage.getItem("token");
  const { id: currentPondId } = useParams();;
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [koiList, setKoiList] = useState([]);

  const fetchKoiList = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get("/api/koi/getAllKoiByUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKoiList(response.data.data);
    } catch (error) {
      console.error("Error fetching Koi data:", error);
    }
  };

  useEffect(() => {
    fetchKoiList();
  }, []);

  const filteredKoi = koiList
    .filter((koi) => koi.currentPondId === Number(currentPondId)) // Filter by pondId
    .filter((koi) =>
      koi.koiName.toLowerCase().includes(searchTerm.toLowerCase())
    ); // Additional filter by search term

  // Pagination logic
  const indexOfLastKoi = currentPage * itemsPerPage;
  const indexOfFirstKoi = indexOfLastKoi - itemsPerPage;
  const currentKoi = filteredKoi.slice(indexOfFirstKoi, indexOfLastKoi);

  return (
    <div className="pond-fish-list-container">
      <div className="koi-grid">
        {currentKoi.map((koi) => (
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
                // onClick={() => navigate(`/manage-koi/my-koi/${koi.fishId}`)}
              />,
              <DeleteOutlined
                key="delete"
                // onClick={() => handleDeleteConfirmation(koi.fishId)}
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
      <div className="pagination-container">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={filteredKoi.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default PondFishList;

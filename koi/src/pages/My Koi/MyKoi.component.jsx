import React, { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, Card, Pagination } from "antd";
import AddKoiFishPopup from "./AddKoiFishPopup.component";
import "./MyKoi.scss";

const { Meta } = Card;

const MyKoi = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [koiData, setKoiData] = useState([
    {
      id: 1,
      name: "Koi A",
      image:
        "https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg",
      details: "Cá koi màu đỏ và trắng, rất đẹp.",
    },
    {
      id: 2,
      name: "Koi B",
      image:
        "https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg",
      details: "Cá koi màu vàng, rất khỏe mạnh.",
    },
    {
      id: 3,
      name: "Koi C",
      image:
        "https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg",
      details: "Cá koi màu đen, thích nghi tốt.",
    },
    {
      id: 4,
      name: "Koi D",
      image:
        "https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg",
      details: "Cá koi màu cam, rất hiền hòa.",
    },
    {
      id: 5,
      name: "Koi E",
      image:
        "https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg",
      details: "Cá koi màu xanh, rất ấn tượng.",
    },
    {
      id: 6,
      name: "Koi F",
      image:
        "https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg",
      details: "Cá koi bướm, có kích thước lớn.",
    },
    {
      id: 7,
      name: "Koi G",
      image:
        "https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg",
      details: "Cá koi màu trắng, rất đẹp.",
    },
    {
      id: 8,
      name: "Koi H",
      image:
        "https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg",
      details: "Cá koi đuôi dài, sống khỏe.",
    },
    {
      id: 9,
      name: "Koi I",
      image:
        "https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg",
      details: "Cá koi màu tím, rất hiếm.",
    },
    {
      id: 10,
      name: "Koi J",
      image:
        "https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg",
      details: "Cá koi đa sắc, rất đẹp mắt.",
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

  const handleSubmit = (newKoi) => {
    const newKoiWithId = { id: koiData.length + 1, ...newKoi };
    setKoiData([...koiData, newKoiWithId]);
    setOpen(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredKoi = koiData.filter((koi) =>
    koi.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastKoi = currentPage * itemsPerPage;
  const indexOfFirstKoi = indexOfLastKoi - itemsPerPage;
  const currentKoi = filteredKoi.slice(indexOfFirstKoi, indexOfLastKoi);

  return (
    <div className="koi-container">
      <div className="my-fish-page-header">
        <div>
          <h1>Koi Fish</h1>
        </div>
        <div>
          <button onClick={showPopup} className="add-koi-button">
            Add Koi Fish
          </button>
        </div>
      </div>
      <AddKoiFishPopup
        open={open}
        onSubmit={handleSubmit}
        handleCancel={handleCancel}
      />

      <div className="koi-search">
        <input
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
            cover={<img alt={koi.name} src={koi.image} />}
            actions={[
              <EditOutlined key="edit" />,
              <DeleteOutlined key="delete" />,
            ]}
          >
            <Meta
              avatar={
                <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
              }
              title={koi.name}
              description={koi.details}
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

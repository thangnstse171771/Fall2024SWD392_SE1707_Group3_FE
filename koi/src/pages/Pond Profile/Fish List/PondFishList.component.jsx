import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { Modal, Avatar, Card, Pagination, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./PondFishList.scss";
import AddFishInProfile from "./AddFishInProfile.component";

const { Meta } = Card;

const PondFishList = ({ onFishAdded }) => {
  const token = sessionStorage.getItem("token");
  const { id: currentPondId } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [koiList, setKoiList] = useState([]);
  const navigate = useNavigate();

  const userType = localStorage.getItem("usertype");

  const fetchKoiList = async () => {
    try {
      const response = await api.get("/api/koi/getAllKoiByUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKoiList(response.data.data);
    } catch (error) {
      console.error("Error fetching Koi data:", error);
    }
  };

  const showPopup = () => {
    setOpen(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      await api.post(
        "/api/koi/addKoi",
        {
          ...values,
          currentPondId: Number(currentPondId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchKoiList();
      toast.success("Koi fish added successfully!");
      setOpen(false);
      onFishAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add koi fish!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fishId) => {
    try {
      await api.put(
        `/api/koi/deleteKoiByUser/${fishId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchKoiList();
      toast.success("Koi fish deleted successfully!");
      onFishAdded();
    } catch (error) {
      console.error("Error deleting Koi fish:", error);
      toast.error("Failed to delete Koi fish.");
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

  useEffect(() => {
    fetchKoiList();
  }, []);

  const filteredKoi = koiList
    .filter((koi) => koi.currentPondId === Number(currentPondId))
    .filter((koi) => koi.status === "active");

  const indexOfLastKoi = currentPage * itemsPerPage;
  const indexOfFirstKoi = indexOfLastKoi - itemsPerPage;
  const currentKoi = filteredKoi.slice(indexOfFirstKoi, indexOfLastKoi);

  return (
    <div>
      {filteredKoi.length > 0 ? (
        <div>
          <div>
            {userType === "Customer" && (
              <div className="fish-list-profile-actions-button-group">
                <h3>Actions</h3>
                <Button
                  size="large"
                  className="add-fish-button"
                  icon={<PlusOutlined />}
                  onClick={showPopup}
                />
                <AddFishInProfile
                  open={open}
                  onSubmit={handleSubmit}
                  onCancel={() => setOpen(false)}
                  loading={loading}
                />
              </div>
            )}
          </div>
          <div className="pond-fish-list-container">
            <div className="fish-list-grid">
              {currentKoi.map((koi) => (
                <Card
                  key={koi.fishId}
                  className="fish-list-card"
                  cover={
                    <img
                      className="fish-list-card-image"
                      alt={koi.koiName}
                      src={koi.koiImage}
                    />
                  }
                  actions={[
                    <EditOutlined
                      key="edit"
                      onClick={() =>
                        navigate(`/manage-koi/my-koi/${koi.fishId}`)
                      }
                    />,
                    <div>
                      {userType === "Customer" && (
                        <DeleteOutlined
                          key="delete"
                          onClick={() => handleDeleteConfirmation(koi.fishId)}
                        />
                      )}
                    </div>,
                  ]}
                >
                  <Meta
                    avatar={
                      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                    }
                    title={koi.koiName}
                    description={`Gender: ${koi.koiGender}, Breed: ${koi.koiBreed}, Origin: ${koi.koiOrigin}`}
                  />
                </Card>
              ))}
            </div>
            <div className="pagination-list-container">
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={filteredKoi.length}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h3>There are no fishes in this pond.</h3>
          <div className="add-button-wrapper">
            {userType === "Customer" && (
              <Button
                className="plus-parameter-profile-button"
                icon={<PlusCircleOutlined style={{ fontSize: "40px" }} />}
                onClick={showPopup}
              />
            )}
            <AddFishInProfile
              open={open}
              onSubmit={handleSubmit}
              onCancel={() => setOpen(false)}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PondFishList;

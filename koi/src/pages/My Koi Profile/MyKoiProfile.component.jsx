import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Col, Row, Spin, Divider } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import KoiInformation from "./KoiInformation/KoiInformation";
import KoiHealth from "./KoiHealth/KoiHealth";
import KoiRecord from "./KoiRecord/KoiRecord";
import "./MyKoiProfile.scss";

const MyKoiProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [koi, setKoi] = useState(null);
  const [ponds, setPonds] = useState([]);

  useEffect(() => {
    const fetchKoiData = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const response = await api.get(`/api/koi/getKoiFishById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setKoi(response.data.data);
        } else {
          toast.error("Koi not found.");
        }
      } catch (error) {
        toast.error("Error fetching Koi data.");
        console.error("Error fetching Koi data:", error);
      }
    };

    const fetchPondData = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const response = await api.get("/api/pond/getAllPondsByUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setPonds(response.data.data);
        } else {
          toast.error("Error fetching pond data.");
        }
      } catch (error) {
        toast.error("Error fetching pond data.");
        console.error("Error fetching pond data:", error);
      }
    };

    fetchKoiData();
    fetchPondData();
  }, [id]);

  const handleUpdateKoi = async (values) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.put(
        `/api/koi/updateKoi/${koi.fishId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setKoi({ ...koi, ...values });
        toast.success(response.data.message || "Koi updated successfully!");
      } else {
        toast.error(response.data.message || "Update failed!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error updating Koi.";
      toast.error(errorMessage);
    }
  };

  if (!koi) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="koi-profile-page">
      <div className="koi-profile-header">
        <img
          src={koi.koiImage}
          alt={koi.koiName}
          className="koi-profile-image"
        />
        <h1>{koi.koiName}</h1>
      </div>
      <Divider style={{ borderColor: "#7cb305" }}>Koi Info</Divider>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card className="koi-profile-card">
            <KoiInformation
              koi={koi}
              onUpdate={handleUpdateKoi}
              ponds={ponds}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="koi-profile-card">
            <KoiHealth koi={koi} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="koi-profile-card">
            <KoiRecord koi={koi} />
          </Card>
        </Col>
      </Row>
      <Button
        type="primary"
        onClick={() => navigate(-1)}
        className="back-button"
      >
        Back
      </Button>
    </div>
  );
};

export default MyKoiProfile;

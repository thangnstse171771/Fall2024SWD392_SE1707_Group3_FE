import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin, Divider } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import KoiInformation from "./KoiInformation/KoiInformation";
import KoiHealth from "./KoiHealth/KoiHealth";
import KoiRecord from "./KoiRecord/KoiRecord";
import KoiTransfer from "./KoiTransfer/KoiTransfer"; // Import KoiTransfer
import "./MyKoiProfile.scss";

const MyKoiProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [koi, setKoi] = useState(null);

  const userType = localStorage.getItem("usertype");
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
        console.log(response.data);

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
      <div className="koi-profile__loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="koi-profile">
      <div className="koi-profile__body">
        <Divider style={{ borderColor: "#7cb305" }}>Koi Info</Divider>
        <div className="koi-profile__section koi-profile__section--info">
          <Card className="koi-profile__card">
            <KoiInformation
              koi={koi}
              onUpdate={handleUpdateKoi}
              ponds={ponds}
            />
          </Card>
        </div>

        <Divider style={{ borderColor: "#7cb305" }}>Koi Health</Divider>
        <div className="koi-profile__section koi-profile__section--health">
          <Card className="koi-profile__card">
            <KoiHealth koi={koi} />
          </Card>
        </div>

        <Divider style={{ borderColor: "#7cb305" }}>Koi Record</Divider>
        <div className="koi-profile__section koi-profile__section--record">
          <Card className="koi-profile__card">
            <KoiRecord koi={koi} />
          </Card>
        </div>

        <Divider style={{ borderColor: "#7cb305" }}>Koi Transfer</Divider>
        {userType === "Customer" && (
          <div className="koi-profile__section koi-profile__section--transfer">
            <Card className="koi-profile__card">
              <KoiTransfer koi={koi} ponds={ponds} />{" "}
            </Card>
          </div>
        )}
      </div>
      <Button
        type="primary"
        onClick={() => navigate(-1)}
        className="koi-profile__back-button"
      >
        Back
      </Button>
    </div>
  );
};

export default MyKoiProfile;

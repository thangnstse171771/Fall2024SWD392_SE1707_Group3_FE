import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import api from "../../config/axios";
import { toast } from "react-toastify";
import "./RecommendationsList.scss";

const { Meta } = Card;

const RecommendationsList = () => {
  const [ponds, setPonds] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAllPondsByUser = async () => {
    try {
      const response = await api.get("/api/pond/getAllPondsByUser");
      setPonds(response.data.data);
    } catch (error) {
      setError("Failed to fetch ponds");
      console.log("Failed to fetch ponds:", error);
    }
  };

  useEffect(() => {
    fetchAllPondsByUser();
  }, []);

  return (
    <div className="recommend-list-page">
      <div className="recommend-list-header">
        <h1>Recommendations</h1>
      </div>
      <div className="recommend-list-body">
        <div className="pond-grid">
          {ponds
            .filter((pond) => pond.status === "active")
            .map((pond) => (
              <Card
                hoverable
                // onClick={() => navigate(`/manage-koi/my-koi/${pond.pondId}`)}
                key={pond.pondId}
                className="pond-card"
                cover={
                  <img
                    className="pond-card-image"
                    alt={pond.pondName}
                    src={pond.pondImage}
                  />
                }
              >
                <Meta
                  title= {pond.pondName}
                />
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsList;

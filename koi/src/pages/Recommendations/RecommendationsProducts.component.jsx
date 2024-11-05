import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import "./RecommendationsProducts.scss";
import api from "../../config/axios";

import EmptyIcon from "../../assets/icons8-empty-100.png";

const { Meta } = Card;

const RecommendationsProducts = () => {
  const { id } = useParams();
  const [pond, setPond] = useState({});
  const [productRecommend, setProductRecommend] = useState([]);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("token");

  const fetchWaterParaDetail = async () => {
    try {
      const response = await api.get(`/api/waterPara/pond/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPond(response.data);
      const parameter = response.data;
      return parameter.waterParameterId;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const fetchProductRecommend = async (waterParameterId) => {
    try {
      const response = await api.get(
        `/api/productRecommends/getProductRecommendByWaterParameterId/${waterParameterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const product = response.data;
      const filteredProducts = product.filter(
        (recommend) => recommend.Product !== null
      );
      setProductRecommend(filteredProducts);
    } catch (error) {
      setError(error.response?.data?.message);
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const waterParameterId = await fetchWaterParaDetail();
      if (waterParameterId) {
        fetchProductRecommend(waterParameterId);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="recommend-product-page">
      <h1 className="recommend-product-list-header">Recommended Products</h1>

      {productRecommend.length > 0 ? (
        <div className="recommend-product-list-grid">
          {productRecommend.map((recommend) => (
            <Card
              hoverable
              key={recommend.Product.productId}
              cover={
                <img
                  className="recommend-product-card-image"
                  alt={recommend.Product.productName}
                  src={recommend.Product.image}
                />
              }
              className="recommend-product-card"
            >
              <Meta
                title={recommend.Product.productName}
                description={`Price: ${
                  recommend.Product.productPrice || "N/A"
                }`}
              />
            </Card>
          ))}
        </div>
      ) : (
        <div className="no-recommend-product-container">
          <div className="no-recommend-group">
            <img src={EmptyIcon} />
            <p className="no-recommend-product-notify">
              No recommended products for this pond
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsProducts;

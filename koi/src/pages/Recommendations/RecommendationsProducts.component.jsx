import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "./RecommendationsProducts.scss";
import api from "../../config/axios";

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
      const parameter = response.data;
      setPond(parameter);
      return parameter.waterParameterId;
    } catch (error) {
      toast.error(error.response?.data?.message);
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
      <h1>Recommended Products for {pond.Pond?.pondName || "Unknown Pond"}</h1>
      <div className="product-list">
        {productRecommend.length > 0 ? (
          productRecommend.map((recommend) => (
            <div key={recommend.Product.productId} className="product-item">
              <h2>{recommend.Product.productName}</h2>
              <p>Price: ${recommend.Product.productPrice || "N/A"}</p>
            </div>
          ))
        ) : (
          <p>No recommended products available</p>
        )}
      </div>
    </div>
  );
};

export default RecommendationsProducts;

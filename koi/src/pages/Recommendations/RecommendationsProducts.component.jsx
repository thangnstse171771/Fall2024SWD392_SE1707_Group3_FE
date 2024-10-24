import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "./RecommendationsProducts.scss";
import api from "../../config/axios";

const RecommendationsProducts = () => {
  const { id } = useParams();
  const [waterPara, setWaterPara] = useState([]);
  const [productRecommendId, setProductRecommendId] = useState([]);
  const [productList, setProductList] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
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
      setWaterPara(parameter);
      return parameter.waterParameterId;
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log("Error: ", error);
    }
  };

  const fetchProductRecommendId = async (waterParameterId) => {
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
      setProductRecommendId(product);
    } catch (error) {
      // toast.error(error.response?.data?.message);
      setError(error.response?.data?.message);
      console.log("Error: ", error);
    }
  };

  const fetchProductList = async () => {
    try {
      const response = await api.get(`/api/products/getAllProducts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const list = response.data;
      setProductList(list);
    } catch (error) {
      toast.error(error.response?.data?.message);
      setError(error.response?.data?.message);
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const waterParameterId = await fetchWaterParaDetail();
      if (waterParameterId) {
        fetchProductRecommendId(waterParameterId);
      }
    };
    fetchData();
    fetchProductList();
  }, [id]);

  useEffect(() => {
    if (productRecommendId.length > 0 && productList.length > 0) {
      const recommended = productRecommendId.map((rec) =>
        productList.find((product) => product.productId === rec.productId)
      );
      setRecommendedProducts(recommended);
    }
  }, [productRecommendId, productList]);

  return (
    <div className="recommend-product-page">
      <h1>Recommended Products</h1>
      <div className="product-list">
        {recommendedProducts.length > 0 ? (
          recommendedProducts.map((product) => (
            <div key={product.productId} className="product-item">
              <h2>{product.productName}</h2>
              <p>{product.productDescription}</p>
              <p>Price: ${product.productPrice}</p>
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

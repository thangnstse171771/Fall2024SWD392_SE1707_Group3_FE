import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import "./RecommendationsProducts.scss";
import api from '../../config/axios';

const RecommendationsProducts = () => {
  const { id } = useParams();
  const [waterPara, setWaterPara] = useState([]);
  const [productRecommend, setProductRecommend] = useState([]);
  const [productList, setProductList] = useState([]);
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
      toast.error(error.response?.data?.message)
      console.log("Error: ", error)
    }
  };

  const fetchProductRecommend = async (waterParameterId) => {
    try {
      const response = await api.get(`/api/productRecommends/getProductRecommendByWaterParameterId/${waterParameterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const product = response.data;
      setProductRecommend(product);
    } catch (error) {
      toast.error(error.response?.data?.message)
      setError(error.response?.data?.message)
      console.log("Error: ", error)
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
      toast.error(error.response?.data?.message)
      setError(error.response?.data?.message)
      console.log("Error: ", error)
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

    fetchProductList();
  }, [id]);

  return (
    <div className="recommend-product-page">RecommendationsProducts.component</div>
  )
}

export default RecommendationsProducts;
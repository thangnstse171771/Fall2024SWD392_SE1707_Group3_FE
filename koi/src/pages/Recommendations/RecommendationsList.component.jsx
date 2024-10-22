import React, { useState, useEffect } from "react";
import "./RecommendationsList.scss";
import api from "../../config/axios";
import { toast } from "react-toastify";

const RecommendationsList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/products/getAllProducts");
      setProducts(response.data);
    } catch (error) {
      setError("Failed to fetch products");
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="recommend-list-page">
      <div className="recommend-list-header">
        <h1>Recommendations</h1>
      </div>
      <div className="recommend-list-body">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li key={product.productId}>
                <h2>{product.productName}</h2>
                <p>{product.productDescription}</p>
                <p>Price: ${product.productPrice}</p>
                <p>Seller: {product.User.username}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecommendationsList;

import React, { useEffect, useState } from "react";
import api from "../../config/axios";

const ProductCard = ({ product }) => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "300px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        textAlign: "center",
        backgroundColor: "#fff",
        padding: "15px",
      }}
    >
      <img
        src={product.image}
        alt={product.productName} // Use productName for the alt text
        style={{
          width: "100%",
          height: "200px", // Fixed height to ensure a uniform card size
          objectFit: "contain", // Ensures the entire image fits within the container
          borderRadius: "10px 10px 0 0",
        }}
      />
      <h3 style={{ margin: "10px 0" }}>{product.productName}</h3>
      <p style={{ color: "#888", fontSize: "18px" }}>${product.productPrice}</p>
      {/* Removed Add to Cart button */}
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products/getAllProducts");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
};

export default ProductCard;

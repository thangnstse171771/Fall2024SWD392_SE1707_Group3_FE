import React from "react";

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
        alt={product.name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "10px 10px 0 0",
        }}
      />
      <h3 style={{ margin: "10px 0" }}>{product.name}</h3>
      <p style={{ color: "#888", fontSize: "18px" }}>${product.price}</p>
      <button
        style={{
          backgroundColor: "#008CBA",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

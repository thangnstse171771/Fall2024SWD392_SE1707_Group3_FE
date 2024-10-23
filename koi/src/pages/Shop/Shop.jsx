import React, { useState } from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import Filter from "./Filter";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import anhbia from "../../assets/anhbia.jpg";
import "./Shop.css";

// Dữ liệu sản phẩm mẫu
const products = [
  {
    id: 1,
    name: "Product 1",
    category: "Electronics",
    price: 100,
    image: anhbia,
  },
  {
    id: 2,
    name: "Product 2",
    category: "Clothes",
    price: 200,
    image: anhbia,
  },
  {
    id: 3,
    name: "Product 3",
    category: "Electronics",
    price: 300,
    image: anhbia,
  },
  {
    id: 4,
    name: "Product 4",
    category: "Shoes",
    price: 400,
    image: anhbia,
  },
  // Thêm nhiều sản phẩm ở đây...
];

const Shop = () => {
  const [filteredCategory, setFilteredCategory] = useState("All");

  // Cấu hình cho carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Lọc sản phẩm theo category
  const filteredProducts =
    filteredCategory === "All"
      ? products
      : products.filter((product) => product.category === filteredCategory);

  return (
    <div style={{ padding: "20px" }}>
      {/* Carousel */}
      <div style={{ marginBottom: "20px" }}>
        <Slider {...sliderSettings}>
          <div>
            <img
              src={anhbia}
              alt="Banner 1"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
          <div>
            <img
              src={anhbia}
              alt="Banner 2"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
          <div>
            <img
              src={anhbia}
              alt="Banner 3"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
        </Slider>
      </div>

      {/* Bộ lọc */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Filter setFilteredCategory={setFilteredCategory} />
      </div>

      {/* Danh sách sản phẩm */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Allow items to wrap to the next line
          justifyContent: "flex-start", // Align items to the left
          gap: "20px", // Adds space between cards
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              flex: "0 1 calc(25% - 20px)", // Each card takes up 25% width with a gap
              marginBottom: "20px", // Adds margin at the bottom for spacing
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;

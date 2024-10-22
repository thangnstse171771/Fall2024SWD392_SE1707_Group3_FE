import React, { useState } from "react";

const Filter = ({ setFilteredCategory }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories] = useState([
    "All",
    "Electronics",
    "Clothes",
    "Shoes",
    "Accessories",
    "Sports",
    "Toys",
    "Books",
    "Home Appliances",
    "Beauty Products",
  ]); // Hardcoded category list

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // Căn giữa trên trang
        padding: "20px", // Thêm padding nếu cần
      }}
    >
      <div
        style={{
          width: "35%", // Độ dài cố định của thanh trượt
          overflowX: "auto", // Cho phép cuộn ngang
          whiteSpace: "nowrap", // Để danh mục không bị xuống dòng
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px",
          scrollbarWidth: "none", // Ẩn thanh cuộn trên Firefox
        }}
        className="custom-scrollbar" // Sử dụng class để ẩn thanh cuộn
      >
        {/* Render the categories */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setFilteredCategory(category);
            }}
            style={{
              minWidth: "100px", // Độ dài tối thiểu của mỗi nút
              padding: "10px 15px",
              margin: "0 5px",
              backgroundColor: activeCategory === category ? "red" : "#fff",
              color: activeCategory === category ? "#fff" : "#000",
              border: "1px solid #ddd",
              borderRadius: "20px",
              cursor: "pointer",
              whiteSpace: "nowrap", // Ngăn không cho nội dung xuống dòng
            }}
          >
            {category}
          </button>
        ))}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            display: none; // Ẩn thanh cuộn trên Chrome, Safari và Edge
          }
        `}</style>
      </div>
    </div>
  );
};

export default Filter;

// const fetchCategories = async () => {
//   try {
//     const response = await api.get("/api/categories/getAllCategories", {
//       headers: {
//         accept: "application/json",
//       },
//     });
//
//     if (response.data && response.data.data) {
//       const fetchedCategories = response.data.data;
//       setCategories(["All", ...fetchedCategories]); // Adding "All" to the beginning
//     } else {
//       console.error("No categories found.");
//     }
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//   }
// };

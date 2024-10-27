import React, { useState, useEffect } from "react";
import api from "../../config/axios"; // Đảm bảo đường dẫn đúng đến api

const Filter = ({ setFilteredCategory }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState([]); // State để lưu danh sách danh mục
  const [loading, setLoading] = useState(true); // State để kiểm soát trạng thái tải

  // Hàm để lấy danh mục từ API
  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories/getAllCategories", {
        headers: {
          accept: "application/json",
        },
      });

      if (response.data && Array.isArray(response.data)) {
        // Chỉnh sửa để lưu categoryId và categoryName
        const fetchedCategories = response.data.map((category) => ({
          id: category.categoryId, // categoryId
          name: category.categoryName, // categoryName
        }));

        setCategories([{ id: "All", name: "All" }, ...fetchedCategories]); // Thêm "All" vào đầu danh sách
      } else {
        console.error("No categories found.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // Đặt trạng thái tải là false sau khi hoàn thành
    }
  };

  // Sử dụng useEffect để gọi fetchCategories khi component được mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <div
        style={{
          width: "35%",
          overflowX: "auto",
          whiteSpace: "nowrap",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px",
          scrollbarWidth: "none",
        }}
        className="custom-scrollbar"
      >
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          categories.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => {
                setActiveCategory(name);
                setFilteredCategory(id); // Lưu categoryId để lọc
              }}
              style={{
                minWidth: "100px",
                padding: "10px 15px",
                margin: "0 5px",
                backgroundColor: activeCategory === name ? "red" : "#fff",
                color: activeCategory === name ? "#fff" : "#000",
                border: "1px solid #ddd",
                borderRadius: "20px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </button>
          ))
        )}
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

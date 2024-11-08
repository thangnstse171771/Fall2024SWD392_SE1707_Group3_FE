import React, { useState, useEffect } from "react";
import { Modal, Button, List, Typography } from "antd";
import { CircularProgress } from "@mui/material";
import api from "../../../config/axios";

const ViewRecommendByCategory = ({ isOpen, onClose, categoryId }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/categories/getCategoryById/${categoryId}`
      );
      setProducts(response.data.Products); // Access the 'Products' array within the response
    } catch (error) {
      console.error("Error fetching products by category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Products in Category"
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {loading ? (
        <CircularProgress />
      ) : products.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={products}
          renderItem={(product) => (
            <List.Item>
              <List.Item.Meta
                description={
                  <Typography.Text>
                    {product.productName}
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Typography.Text>
          No products available for this category.
        </Typography.Text>
      )}
    </Modal>
  );
};

export default ViewRecommendByCategory;

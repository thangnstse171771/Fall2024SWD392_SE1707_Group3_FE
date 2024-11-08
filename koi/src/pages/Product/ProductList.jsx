import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Button, message, Modal, Form, Input, InputNumber, Select } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import noImage from "../../assets/noimage.jpg";

import { app } from "../../firebase";

const storage = getStorage(app); // Initialize Firebase storage
const { Option } = Select;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(noImage);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null); // Define error state

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories/getAllCategories");
      const fetchedCategories = response.data.map((category) => ({
        id: category.categoryId,
        name: category.categoryName,
      }));
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/products/getAllProducts");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
      setError("Failed to fetch product data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenModal = () => {
    form.resetFields();
    setImagePreview(noImage);
    setImageFile(null); // Reset image file
    setIsModalVisible(true);
  };

  const handleCloseModal = () => setIsModalVisible(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `products/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef); // Return the image URL
  };

  const handleFormSubmit = async (values) => {
    const userId = localStorage.getItem("userId");
    let imageUrl = noImage;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const payload = {
      ...values,
      userId,
      isActive: "waiting",
      image: imageUrl,
    };

    try {
      await api.post("/api/products/createProduct", payload);
      message.success("Product created successfully!");
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      message.error("Failed to create product. Please try again.");
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await api.post(`/api/products/updateProductActiveStatus/${productId}`, {
        isActive: "inactive",
      });
      message.success("Product removed successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Failed to remove product:", error);
      message.error("Failed to remove product. Please try again.");
    }
  };

  if (loading) return <CircularProgress style={{ margin: "20px auto" }} />;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <Button
        type="primary"
        onClick={handleOpenModal}
        style={{
          marginBottom: 16,
          backgroundColor: "rgb(180,0,0)",
          borderColor: "rgb(180,0,0)",
        }}
      >
        Create New Product
      </Button>

      <TableContainer component={Paper}>
        <Table aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{ fontWeight: "bold", color: "rgb(180,0,0)" }}
                align="center"
              >
                PRODUCT ID
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "rgb(180,0,0)" }}
                align="left"
              >
                PRODUCT NAME
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "rgb(180,0,0)" }}
                align="left"
              >
                DESCRIPTION
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "rgb(180,0,0)" }}
                align="center"
              >
                PRICE
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "rgb(180,0,0)" }}
                align="center"
              >
                STATUS
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "rgb(180,0,0)" }}
                align="center"
              >
                USERNAME
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "rgb(180,0,0)" }}
                align="center"
              >
                ACTION
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell align="center">{product.productId}</TableCell>
                <TableCell align="left">{product.productName}</TableCell>
                <TableCell align="left">{product.productDescription}</TableCell>
                <TableCell align="center">{product.productPrice}</TableCell>
                <TableCell
                  align="center"
                  style={{ color: "Green", fontWeight: "bold" }}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </TableCell>
                <TableCell align="center">{product.User.username}</TableCell>
                <TableCell align="center">
                  <Button
                    style={{ color: "rgb(180,0,0)" }}
                    onClick={() =>
                      navigate(`/ProductDetails/${product.productId}`)
                    }
                  >
                    View
                  </Button>
                  {localStorage.getItem("usertype") === "Manager" && (
                    <Button
                      style={{ color: "red", marginLeft: "8px" }}
                      onClick={() => handleRemoveProduct(product.productId)}
                    >
                      Remove
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        title="Create New Product"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={1000}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: "1" }}>
            <Form form={form} onFinish={handleFormSubmit} layout="vertical">
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select
                  placeholder="Select a category"
                  style={{ width: "100%" }}
                >
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="productName"
                label="Product Name"
                rules={[
                  { required: true, message: "Please enter product name" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="productDescription"
                label="Description"
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="productPrice"
                label="Price"
                rules={[
                  { required: true, message: "Please enter price" },
                  {
                    validator: (_, value) => {
                      if (value < 1) {
                        return Promise.reject(
                          new Error("Product Price can't be less than 1!")
                        );
                      }
                      if (value > 9999) {
                        return Promise.reject(
                          new Error("Product price can't exceed 9999!")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  marginTop: "16px",
                  backgroundColor: "rgb(180,0,0)",
                  borderColor: "rgb(180,0,0)",
                }}
              >
                Submit
              </Button>
            </Form>
          </div>
          <div style={{ flex: "1", textAlign: "center" }}>
            <img
              src={imagePreview}
              alt="Product Preview"
              style={{
                width: "100%",
                maxWidth: "300px",
                maxHeight: "300px",
                objectFit: "contain",
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: "16px" }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

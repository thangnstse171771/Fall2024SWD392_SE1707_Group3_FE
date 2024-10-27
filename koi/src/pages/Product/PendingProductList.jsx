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
import {
  Button,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Select, // Import Select for category options
} from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

const { Option } = Select; // Destructure Option from Select

export default function PendingProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]); // State để lưu danh sách danh mục
  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories/getAllCategories", {
        headers: {
          accept: "application/json",
        },
      });

      if (response.data && Array.isArray(response.data)) {
        const fetchedCategories = response.data.map((category) => ({
          id: category.categoryId, // Assuming categoryId is present
          name: category.categoryName,
        }));
        setCategories(fetchedCategories); // Lưu danh sách danh mục
      } else {
        console.error("No categories found.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // Đặt trạng thái tải là false sau khi hoàn thành
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/products/getAllProductsOrigin");
      console.log(response.data);

      setProducts(response.data);
    } catch (error) {
      setError("Failed to fetch product data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Call fetchCategories to load categories on component mount
  }, []);

  const handleOpenModal = () => {
    form.resetFields();
    setImagePreview(null);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => setIsModalVisible(false);

  const handleImageUrlChange = (e) => setImagePreview(e.target.value);

  const handleFormSubmit = async (values) => {
    const userId = localStorage.getItem("userId");
    const payload = {
      ...values,
      userId,
      isActive: false, // Set isActive to false by default
    };
    console.log(payload);
    try {
      await api.post("/api/products/createProduct", payload);
      message.success("Product created successfully!");
      fetchProducts(); // Refresh product list
      handleCloseModal();
    } catch (error) {
      message.error("Failed to create product. Please try again.");
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
                      style={{ color: "rgb(180,0,0)" }}
                      onClick={() =>
                        navigate(`/ProductDetails/${product.productId}`)
                      }
                    >
                      Review
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for creating new product */}
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
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="image"
                label="Image URL"
                rules={[{ required: true, message: "Please enter image URL" }]}
              >
                <Input onChange={handleImageUrlChange} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: "rgb(180,0,0)",
                    borderColor: "rgb(180,0,0)",
                  }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div style={{ flex: "1" }}>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

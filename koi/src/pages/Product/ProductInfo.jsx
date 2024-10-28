import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Switch, Spin, Alert } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import noImage from "../../assets/noimage.jpg";

const ProductInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(noImage);
  const labelStyle = { fontWeight: "bold", color: "rgb(255,0,0)" };

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/products/getProductById/${id}`, {
        headers: { accept: "application/json" },
      });
      setProfile(response.data.data);
      setBackgroundImg(response.data.image || noImage);
      form.setFieldsValue(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load product data.");
      toast.error("Failed to load product data.");
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const updatedProduct = {
        userId: userId,
        productName: values.productName,
        productDescription: values.productDescription,
        productPrice: values.productPrice,
        isActive: "waiting",
        image: values.image,
      };
      await api.put(`/api/products/updateProduct/${id}`, updatedProduct);
      toast.success("Product updated successfully!");
      setLoading(false);
      navigate("/ManageWorkplace");
    } catch (error) {
      toast.error("Failed to update product.");
      setLoading(false);
    }
  };

  const handleStatusChange = (checked) => {
    form.setFieldsValue({ isActive: checked });
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  // Hàm xử lý khi nhấn nút Approve
  const handleApprove = async () => {
    setLoading(true);
    try {
      await api.patch(`/api/products/updateProductActiveStatus/${id}`, {
        isActive: "active",
      });
      toast.success("Product approved successfully!");
      setLoading(false);
      fetchProductDetails();

      navigate("/ManageWorkplace");
    } catch (error) {
      toast.error("Failed to approve product.");
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấn nút Reject
  const handleReject = async () => {
    setLoading(true);
    try {
      await api.patch(`/api/products/updateProductActiveStatus/${id}`, {
        isActive: "inActive",
      });
      toast.success("Product rejected successfully!");
      setLoading(false);
      fetchProductDetails();

      navigate("/ManageWorkplace");
    } catch (error) {
      toast.error("Failed to reject product.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  return (
    <div className="product-info">
      {error ? (
        <Alert message={error} type="error" />
      ) : (
        <Spin spinning={loading} tip="Loading product data...">
          <img
            className="product-img"
            src={backgroundImg}
            alt={profile?.productName}
            style={{
              width: "100%",
              minWidth: "300px",
              maxWidth: "1200px",
              maxHeight: "500px",
              objectFit: "contain",
            }}
          />
          <div className="product-form-container">
            <Form
              style={{ minWidth: "650px" }}
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              noValidate
            >
              <Form.Item
                label={<span style={labelStyle}>Product ID</span>}
                name="productId"
              >
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label={<span style={labelStyle}>Product Name</span>}
                name="productName"
                rules={[
                  { required: true, message: "Please input the product name!" },
                ]}
              >
                <Input placeholder="Product name" disabled={!isEditable} />
              </Form.Item>
              <Form.Item
                label={<span style={labelStyle}>Status</span>}
                name="isActive"
                valuePropName="checked"
              >
                <Switch
                  checked={profile?.isActive}
                  onChange={handleStatusChange}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={<span style={labelStyle}>Product Price ($)</span>}
                name="productPrice"
                rules={[
                  {
                    required: true,
                    message: "Please input the product price!",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter product price"
                  disabled={!isEditable}
                />
              </Form.Item>
              <Form.Item
                label={<span style={labelStyle}>Username</span>}
                name={["User", "username"]}
                rules={[{ required: true, message: "Username is required!" }]}
              >
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label={<span style={labelStyle}>Product Description</span>}
                name="productDescription"
                rules={[
                  { required: true, message: "Please input the description!" },
                ]}
              >
                <Input.TextArea
                  placeholder="Enter product description"
                  disabled={!isEditable}
                />
              </Form.Item>
              <Form.Item
                label={<span style={labelStyle}>Image URL</span>}
                name="image"
                rules={[
                  { required: true, message: "Please input the image URL!" },
                ]}
              >
                <Input placeholder="Enter image URL" disabled={!isEditable} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={toggleEdit}>
                  {isEditable ? "Cancel" : "Edit"}
                </Button>
                {isEditable && (
                  <Button
                    type="primary"
                    danger
                    htmlType="submit"
                    loading={loading}
                    style={{ marginLeft: "8px" }}
                  >
                    Save Changes
                  </Button>
                )}
                {localStorage.getItem("userType") === "Manager" && (
                  <>
                    <Button
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        marginLeft: "8px",
                      }}
                      onClick={handleApprove}
                    >
                      Approve
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "rgb(180,0,0)",
                        marginLeft: "8px",
                        color: "white",
                      }}
                      onClick={handleReject}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Form.Item>
            </Form>
          </div>
        </Spin>
      )}
    </div>
  );
};

export default ProductInfo;

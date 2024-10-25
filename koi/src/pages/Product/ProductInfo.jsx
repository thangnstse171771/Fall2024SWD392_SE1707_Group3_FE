import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button, Switch } from "antd"; // Import Switch
import { toast } from "react-toastify";
import api from "../../config/axios"; // Ensure correct path to api

const ProductInfo = () => {
  const { id } = useParams(); // Extract 'id' from URL
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isEditable, setIsEditable] = useState(false); // State to control edit mode

  // Fetch product details from the API
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/products/getProductById/${id}`, {
        headers: { accept: "application/json" },
      });
      setProfile(response.data.data);
      form.setFieldsValue(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load product data.");
      toast.error("Failed to load product data.");
      setLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Get userId from local storage
      const userId = localStorage.getItem("userId"); // Assuming userId is stored as "userId"

      const updatedProduct = {
        ...profile,
        ...values,
        userId: userId, // Add userId to the updated product
      };

      setProfile(updatedProduct);
      toast.success("Product updated successfully!");
      setLoading(false);
    } catch (error) {
      toast.error("Failed to update product.");
      setLoading(false);
    }
  };

  // Function to handle switch change
  const handleStatusChange = (checked) => {
    form.setFieldsValue({ isActive: checked });
  };

  // Function to toggle edit mode
  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  return (
    <div className="product-info">
      {error ? (
        <div>
          <h3>{error}</h3>
        </div>
      ) : loading ? (
        <p>Loading product data...</p>
      ) : (
        <>
          <img
            className="product-img"
            src={
              profile?.productImage ||
              "https://cdn11.bigcommerce.com/s-c81ee/product_images/uploaded_images/ridersuperone-1-.jpg"
            }
            alt={profile?.productName}
          />
          <div className="product-form-container">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              noValidate
            >
              {/* Non-editable Product ID */}
              <Form.Item label="Product ID" name="productId">
                <Input readOnly />
              </Form.Item>

              {/* Editable Product Name */}
              <Form.Item
                label="Product Name"
                name="productName"
                rules={[
                  { required: true, message: "Please input the product name!" },
                ]}
              >
                <Input
                  placeholder="Product name"
                  disabled={!isEditable} // Disable input when not in edit mode
                />
              </Form.Item>

              {/* Editable Status */}
              <Form.Item label="Status" name="isActive" valuePropName="checked">
                <Switch
                  checked={profile?.isActive}
                  onChange={handleStatusChange}
                  disabled={!isEditable} // Disable switch when not in edit mode
                />
              </Form.Item>

              {/* Editable Product Price */}
              <Form.Item
                label="Product Price ($)"
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
                  disabled={!isEditable} // Disable input when not in edit mode
                />
              </Form.Item>

              {/* Non-editable Username */}
              <Form.Item
                label="Username"
                name={["User", "username"]}
                rules={[{ required: true, message: "Username is required!" }]}
              >
                <Input readOnly />
              </Form.Item>

              {/* Editable Product Description */}
              <Form.Item
                label="Product Description"
                name="productDescription"
                rules={[
                  { required: true, message: "Please input the description!" },
                ]}
              >
                <Input.TextArea
                  placeholder="Enter product description"
                  disabled={!isEditable} // Disable textarea when not in edit mode
                />
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
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductInfo;

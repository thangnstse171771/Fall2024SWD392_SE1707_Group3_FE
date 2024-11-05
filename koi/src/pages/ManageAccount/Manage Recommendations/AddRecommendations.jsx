import React, { useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const { Option } = Select;

const AddRecommendations = ({ isOpen, onClose, categories, waterParameters, onAddSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await api.post("/api/productRecommends/createProductRecommend", values);

      toast.success("Recommendation added successfully");
      form.resetFields();
      onClose();
      onAddSuccess(); 
    } catch (error) {
      toast.error("Failed to add recommendation");
      console.error("Error adding recommendation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Recommendation"
      visible={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Add"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select a category">
            {categories.map((category) => (
              <Option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="waterParameterId"
          label="Pond"
          rules={[{ required: true, message: "Please select a pond" }]}
        >
          <Select placeholder="Select a pond">
            {waterParameters.map((param) => (
              <Option key={param.waterParameterId} value={param.waterParameterId}>
                {param.Pond.pondName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRecommendations;
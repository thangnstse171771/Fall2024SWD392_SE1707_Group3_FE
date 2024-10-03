import React, { useState } from "react";
import { Modal, Input, Form, Button } from "antd";

const AddKoiFishPopup = ({ open, onSubmit, handleCancel }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Add Koi Fish"
      visible={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Koi Name"
          rules={[{ required: true, message: "Please input the koi name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image URL"
          rules={[{ required: true, message: "Please input the image URL!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="details"
          label="Details"
          rules={[{ required: true, message: "Please input the details!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Koi Fish
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddKoiFishPopup;

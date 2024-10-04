import React from "react";
import { Modal, Input, Form, Button, Select } from "antd";

const { Option } = Select;

const AddKoiFishPopup = ({ open, onSubmit, handleCancel }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // Modify the values object to match the API structure
    const formattedValues = {
      koiName: values.name,
      koiImage: values.image,
      koiGender: values.gender,
      koiBreed: values.breed,
      koiOrigin: parseFloat(values.origin),
      price: parseFloat(values.price),
      currentPondId: parseInt(values.pondId),
    };

    onSubmit(formattedValues);
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
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select the gender!" }]}
        >
          <Select placeholder="Select gender">
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="breed"
          label="Breed ID"
          rules={[{ required: true, message: "Please input the breed ID!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="origin"
          label="Origin"
          rules={[{ required: true, message: "Please input the origin!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please input the price!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="pondId"
          label="Current Pond ID"
          rules={[{ required: true, message: "Please input the pond ID!" }]}
        >
          <Input type="number" />
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

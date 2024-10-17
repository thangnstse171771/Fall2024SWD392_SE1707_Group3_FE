import React, { useState } from "react";
import { Card, Button, Modal, Form, Input, Select } from "antd";
import { useLocation } from "react-router-dom"; // Import useLocation

const { Option } = Select;

const KoiInformation = ({ koi, onUpdate, ponds }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const viewOnly = location.state?.viewOnly || false; // Check if viewOnly mode

  const handleEdit = () => {
    if (!viewOnly) {
      // Only allow edit if not in viewOnly mode
      form.setFieldsValue({
        name: koi.koiName,
        image: koi.koiImage,
        gender: koi.koiGender,
        breed: koi.koiBreed,
        origin: koi.koiOrigin,
        price: koi.price,
        pondId: koi.currentPondId,
      });
      setIsEditing(true);
    }
  };

  const handleUpdateKoi = async (values) => {
    const formattedValues = {
      koiName: values.name,
      koiImage: values.image,
      koiGender: values.gender,
      koiBreed: parseInt(values.breed),
      koiOrigin: parseFloat(values.origin),
      price: parseFloat(values.price),
      currentPondId: parseInt(values.pondId),
    };

    await onUpdate(formattedValues);
    setIsEditing(false);
  };

  return (
    <>
      <Card title="Koi Information" style={{ marginBottom: 16 }}>
        <p>
          <strong>Name:</strong> {koi.koiName}
        </p>
        <p>
          <strong>Gender:</strong> {koi.koiGender}
        </p>
        <p>
          <strong>Breed ID:</strong> {koi.koiBreed}
        </p>
        <p>
          <strong>Origin:</strong> {koi.koiOrigin || "N/A"}
        </p>
        <p>
          <strong>Current Pond ID:</strong> {koi.currentPondId}
        </p>
        <p>
          <strong>Price:</strong> ${koi.price || "N/A"}
        </p>

        {/* Disable the Edit button in viewOnly mode */}
        {!viewOnly && (
          <Button type="primary" onClick={handleEdit} style={{ width: "100%" }}>
            Edit
          </Button>
        )}
      </Card>

      <Modal
        title="Edit Koi Information"
        visible={isEditing && !viewOnly} // Ensure modal doesn't open in viewOnly mode
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateKoi}>
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
            label="Current Pond"
            rules={[{ required: true, message: "Please select a pond!" }]}
          >
            <Select placeholder="Select a pond">
              {ponds.map((pond) => (
                <Option key={pond.pondId} value={pond.pondId}>
                  {pond.pondName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Koi Fish
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default KoiInformation;
